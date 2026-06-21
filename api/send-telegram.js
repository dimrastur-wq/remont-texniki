const TELEGRAM_BOT_TOKEN = '8512046964:AAGkC6o4xll0mODCFGXHwrLte1vHG3FV_D0';
const TELEGRAM_CHAT_ID = '968151715';

const MIN_FILL_MS = 1800;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;

const _rl = new Map();

function getClientIp(req) {
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return Array.isArray(cf) ? cf[0] : cf;
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd) return (Array.isArray(xfwd) ? xfwd[0] : xfwd).split(',')[0].trim();
  const xreal = req.headers['x-real-ip'];
  if (xreal) return Array.isArray(xreal) ? xreal[0] : xreal;
  return req.socket?.remoteAddress ?? '127.0.0.1';
}

function checkRateLimit(ip, form) {
  const key = `${form}:${ip}`;
  const now = Date.now();
  const entry = _rl.get(key);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    _rl.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetInMs: RATE_LIMIT_WINDOW_MS - (now - entry.windowStart) };
  }
  entry.count++;
  return { allowed: true };
}

function validatePhone(raw) {
  if (!raw) return { ok: false, error: 'Введите номер телефона' };
  const digits = raw.replace(/\D/g, '');
  if (!digits) return { ok: false, error: 'Введите номер телефона' };
  let normalized = digits;
  if (normalized.startsWith('8') && normalized.length === 11) normalized = '7' + normalized.slice(1);
  if (normalized.length === 10 && !normalized.startsWith('7')) normalized = '7' + normalized;
  if (normalized.length !== 11) return { ok: false, error: 'Номер телефона должен содержать 11 цифр' };
  if (!normalized.startsWith('7')) return { ok: false, error: 'Введите российский номер (+7...)' };
  return { ok: true, normalized: '+' + normalized };
}

function sanitize(input, maxLen = 1000) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[c] ?? c))
    .slice(0, maxLen)
    .trim();
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // Honeypot — silent pass to not reveal check
  if (body.website && body.website.trim() !== '') {
    return res.status(200).json({ success: true });
  }

  // Anti-timing
  const loadedAt = parseInt(body.form_loaded_at, 10);
  if (!isNaN(loadedAt) && Date.now() - loadedAt < MIN_FILL_MS) {
    return res.status(200).json({ success: true });
  }

  // Rate limit
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, 'contact');
  if (!rl.allowed) {
    const secs = Math.ceil((rl.resetInMs || RATE_LIMIT_WINDOW_MS) / 1000);
    return res.status(429).json({ error: `Слишком много запросов. Повторите через ${secs} сек.` });
  }

  const name = sanitize(body.name || '');
  const city = sanitize(body.city || '');
  const problem = sanitize(body.problem || '', 2000);
  const text = sanitize(body.text || '', 2000);
  const type = body.type === 'review' ? 'review' : 'contact';

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Введите имя (не менее 2 символов)' });
  }
  if (!city) {
    return res.status(400).json({ error: 'Укажите город' });
  }

  let phoneNormalized = '';
  if (body.phone) {
    const pv = validatePhone(body.phone);
    if (!pv.ok) return res.status(400).json({ error: pv.error });
    phoneNormalized = pv.normalized;
  }

  let message;
  if (type === 'review') {
    message =
      'Новый отзыв с сайта!\n' +
      'Источник: MASTER-TEHNIKI74.STORE\n\n' +
      'Имя: ' + name + '\n' +
      'Город: ' + city + '\n' +
      'Текст отзыва: ' + (text || '—') + '\n\n' +
      'Проверьте и добавьте в код.';
  } else {
    message =
      'НОВАЯ ЗАЯВКА: master-tehniki74.store\n' +
      'Имя: ' + name + '\n' +
      'Телефон: ' + (phoneNormalized || '—') + '\n' +
      'Город: ' + city + '\n' +
      'Проблема: ' + (problem || '—');
  }

  try {
    const tgRes = await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      }
    );

    if (!tgRes.ok) {
      console.error('Telegram API error:', await tgRes.text());
      return res.status(500).json({ error: 'Telegram send failed' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
