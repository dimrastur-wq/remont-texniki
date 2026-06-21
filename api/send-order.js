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

// Отправляет заказ из корзины в Telegram-чат менеджера
module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};

  // Honeypot
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
  const rl = checkRateLimit(ip, 'order');
  if (!rl.allowed) {
    const secs = Math.ceil((rl.resetInMs || RATE_LIMIT_WINDOW_MS) / 1000);
    return res.status(429).json({ error: `Слишком много запросов. Повторите через ${secs} сек.` });
  }

  const name = sanitize(body.name || '');
  const city = sanitize(body.city || '');
  const comment = sanitize(body.comment || '', 2000);
  const isMaster = body.isMaster === true || body.isMaster === 'true';

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Введите имя (не менее 2 символов)' });
  }
  if (!city) {
    return res.status(400).json({ error: 'Укажите город' });
  }

  const pv = validatePhone(body.phone);
  if (!pv.ok) return res.status(400).json({ error: pv.error });

  if (!Array.isArray(body.cart) || body.cart.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  // Validate cart items to prevent injection
  const cart = body.cart.map(i => ({
    name: sanitize(String(i.name || ''), 200),
    qty: Math.max(1, Math.min(999, parseInt(i.qty, 10) || 1)),
    retail: Math.max(0, parseFloat(i.retail) || 0),
    master: Math.max(0, parseFloat(i.master) || 0),
  })).filter(i => i.name);

  const text = buildFallbackText({ name, phone: pv.normalized, city, comment, cart, isMaster });

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
      }
    );

    if (!tgRes.ok) {
      console.error('Telegram error:', await tgRes.text());
      return res.status(500).json({ error: 'Telegram send failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('send-order error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function buildFallbackText({ name, phone, city, comment, cart, isMaster }) {
  const fmt = n => n.toLocaleString('ru-RU') + ' \u20bd';
  const lines = cart.map(i => {
    const price = isMaster ? i.master : i.retail;
    return `\u2022 ${i.name} \xd7${i.qty} = ${fmt(price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + (isMaster ? i.master : i.retail) * i.qty, 0);
  return [
    '\ud83d\uded2 \u0417\u0410\u041a\u0410\u0417 \u0417\u0410\u041f\u0427\u0410\u0421\u0422\u0415\u0419: master-tehniki74.store',
    `\u0418\u043c\u044f: ${name}`,
    `\u0422\u0435\u043b\u0435\u0444\u043e\u043d: ${phone}`,
    `\u0413\u043e\u0440\u043e\u0434: ${city}`,
    `\u0422\u0438\u043f: ${isMaster ? '\u041c\u0430\u0441\u0442\u0435\u0440 (\u221215%)' : '\u0420\u043e\u0437\u043d\u0438\u0447\u043d\u044b\u0439 \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u044c'}`,
    '',
    '\u0421\u043e\u0441\u0442\u0430\u0432:',
    ...lines,
    '',
    `\u0418\u0422\u041e\u0413\u041e: ${fmt(total)}`,
    comment ? `\n\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439: ${comment}` : '',
  ].filter(l => l !== undefined).join('\n');
}
