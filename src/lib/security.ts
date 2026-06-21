/**
 * security.ts — общий модуль валидации и защиты форм.
 *
 * Используется на клиенте (через import) и сервере (Astro SSR / API routes).
 */

// ── Константы ─────────────────────────────────────────────────────────────────

/** Имя honeypot-поля. Одинаковое во всех формах. */
export const HONEYPOT_FIELD = 'website';

/** Имя поля таймстампа отправки формы (anti-timing bot check). */
export const TIMESTAMP_FIELD = 'form_loaded_at';

/** Минимальное время заполнения формы человеком (мс). Боты обычно быстрее. */
export const MIN_FILL_MS = 1800;

/** Максимум запросов с одного IP за окно. */
export const RATE_LIMIT_MAX = 3;

/** Окно рейт-лимита в миллисекундах (1 минута). */
export const RATE_LIMIT_WINDOW_MS = 60_000;

// ── Валидация телефона (Россия) ────────────────────────────────────────────────

/**
 * Принимает любой ввод пользователя и проверяет, что это российский
 * номер телефона.
 *
 * Допустимые форматы: +7..., 8..., 7...
 * После нормализации должно быть ровно 11 цифр, начиная с 7.
 */
export function validatePhone(raw: string): { ok: boolean; normalized: string; error?: string } {
  const digits = raw.replace(/\D/g, '');

  if (!digits) {
    return { ok: false, normalized: '', error: 'Введите номер телефона' };
  }

  // Нормализация: 8xxx → 7xxx
  let normalized = digits;
  if (normalized.startsWith('8') && normalized.length === 11) {
    normalized = '7' + normalized.slice(1);
  }
  if (normalized.length === 10 && !normalized.startsWith('7')) {
    normalized = '7' + normalized;
  }

  if (normalized.length !== 11) {
    return { ok: false, normalized: '', error: 'Номер телефона должен содержать 11 цифр' };
  }
  if (!normalized.startsWith('7')) {
    return { ok: false, normalized: '', error: 'Введите российский номер (+7...)' };
  }
  // Недопустимые коды: 700, 701 и т.п.
  const code = normalized.slice(1, 4);
  const invalidPrefixes = ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709'];
  if (invalidPrefixes.includes(code)) {
    return { ok: false, normalized: '', error: 'Некорректный код оператора' };
  }

  return { ok: true, normalized: '+' + normalized };
}

// ── Валидация email ────────────────────────────────────────────────────────────

export function validateEmail(raw: string): { ok: boolean; error?: string } {
  const v = raw.trim().toLowerCase();
  if (!v) return { ok: false, error: 'Введите email' };

  // RFC 5322 simplified
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(v)) return { ok: false, error: 'Некорректный email' };
  if (v.includes('..')) return { ok: false, error: 'Некорректный email' };

  return { ok: true };
}

// ── Валидация имени ────────────────────────────────────────────────────────────

export function validateName(raw: string): { ok: boolean; error?: string } {
  const v = raw.trim();
  if (v.length < 2) return { ok: false, error: 'Введите имя (не менее 2 символов)' };
  if (v.length > 100) return { ok: false, error: 'Имя слишком длинное' };
  // Блокируем явный спам (URL в имени)
  if (/https?:\/\//i.test(v)) return { ok: false, error: 'Некорректное имя' };
  return { ok: true };
}

// ── Honeypot ───────────────────────────────────────────────────────────────────

/**
 * Проверяет honeypot-поле. Если поле заполнено — это бот.
 * Возвращает true если всё в порядке (honeypot пустой).
 */
export function checkHoneypot(honeyValue: string | null | undefined): boolean {
  return !honeyValue || honeyValue.trim() === '';
}

// ── Anti-timing check ─────────────────────────────────────────────────────────

/**
 * Проверяет, прошло ли достаточно времени с момента загрузки формы.
 * Слишком быстрая отправка — признак бота.
 */
export function checkFormTiming(loadedAt: string | null | undefined): boolean {
  if (!loadedAt) return true; // если поле отсутствует — пропускаем
  const ts = parseInt(loadedAt, 10);
  if (isNaN(ts)) return true;
  return Date.now() - ts >= MIN_FILL_MS;
}

// ── Rate limiting (in-process, для API-handlers) ──────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Map живёт в памяти процесса. Для multi-instance нужен Redis/Supabase.
const _rlStore = new Map<string, RateLimitEntry>();

// Периодическая очистка устаревших записей (каждые 5 минут)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of _rlStore.entries()) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        _rlStore.delete(key);
      }
    }
  }, 5 * 60_000);
}

/**
 * Проверяет и регистрирует попытку отправки формы.
 * @param ip — IP-адрес клиента.
 * @param form — идентификатор формы (чтобы лимит был отдельным для каждой).
 * @returns { allowed: boolean; remaining: number; resetInMs: number }
 */
export function checkRateLimit(ip: string, form: string): {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
} {
  const key = `${form}:${ip}`;
  const now = Date.now();
  const entry = _rlStore.get(key);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    _rlStore.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetInMs: RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const resetInMs = RATE_LIMIT_WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetInMs: RATE_LIMIT_WINDOW_MS - (now - entry.windowStart) };
}

// ── Получение IP из запроса ───────────────────────────────────────────────────

/**
 * Извлекает реальный IP из заголовков (Cloudflare, Nginx, обычный запрос).
 * Для Node.js req объектов.
 */
export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return Array.isArray(cf) ? cf[0] : cf;

  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd) {
    const ips = Array.isArray(xfwd) ? xfwd[0] : xfwd;
    return ips.split(',')[0].trim();
  }

  const xreal = req.headers['x-real-ip'];
  if (xreal) return Array.isArray(xreal) ? xreal[0] : xreal;

  return req.socket?.remoteAddress ?? '127.0.0.1';
}

// ── Санитизация строки (базовая) ──────────────────────────────────────────────

/** Убирает HTML-теги и обрезает до maxLen символов. */
export function sanitize(input: string, maxLen = 1000): string {
  return input
    .replace(/<[^>]*>/g, '')     // strip HTML tags
    .replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[c] ?? c))
    .slice(0, maxLen)
    .trim();
}

// ── Клиентский хелпер: инициализация honeypot + timestamp ────────────────────

/**
 * Вызывается на клиенте при загрузке формы.
 * Записывает timestamp в скрытое поле.
 * Honeypot-поле CSS скрывает от пользователя.
 */
export function initFormSecurity(formId: string): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  // Записываем timestamp
  const tsField = form.querySelector<HTMLInputElement>(`[name="${TIMESTAMP_FIELD}"]`);
  if (tsField) tsField.value = String(Date.now());
}

// ── Клиентская проверка перед отправкой ───────────────────────────────────────

export interface ClientCheckResult {
  ok: boolean;
  errors: string[];
}

/**
 * Единая точка клиентской валидации. Принимает объект данных формы
 * и конфигурацию полей для проверки.
 */
export function clientValidate(data: {
  honeypot?: string;
  timestamp?: string;
  name?: string;
  phone?: string;
  email?: string;
}): ClientCheckResult {
  const errors: string[] = [];

  // Honeypot
  if (!checkHoneypot(data.honeypot)) {
    // Не сообщаем об ошибке боту
    return { ok: false, errors: [] };
  }

  // Timing (anti-bot)
  if (!checkFormTiming(data.timestamp)) {
    return { ok: false, errors: [] };
  }

  // Name
  if (data.name !== undefined) {
    const r = validateName(data.name);
    if (!r.ok && r.error) errors.push(r.error);
  }

  // Phone
  if (data.phone !== undefined) {
    const r = validatePhone(data.phone);
    if (!r.ok && r.error) errors.push(r.error);
  }

  // Email
  if (data.email !== undefined) {
    const r = validateEmail(data.email);
    if (!r.ok && r.error) errors.push(r.error);
  }

  return { ok: errors.length === 0, errors };
}
