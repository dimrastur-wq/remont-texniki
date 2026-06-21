const TELEGRAM_BOT_TOKEN = '8512046964:AAGkC6o4xll0mODCFGXHwrLte1vHG3FV_D0';
const TELEGRAM_CHAT_ID = '968151715';

// Отправляет заказ из корзины в Telegram-чат менеджера
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, city, comment, cart, isMaster, orderText } = req.body || {};

  if (!name || !phone || !city) {
    return res.status(400).json({ error: 'Обязательные поля: name, phone, city' });
  }
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  const text = orderText || buildFallbackText({ name, phone, city, comment, cart, isMaster });

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
      const err = await tgRes.text();
      console.error('Telegram error:', err);
      return res.status(500).json({ error: 'Telegram send failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('send-order error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function buildFallbackText({ name, phone, city, comment, cart, isMaster }) {
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
  const lines = cart.map(i => {
    const price = isMaster ? i.master : i.retail;
    return `• ${i.name} ×${i.qty} = ${fmt(price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + (isMaster ? i.master : i.retail) * i.qty, 0);
  return [
    '🛒 ЗАКАЗ ЗАПЧАСТЕЙ: master-tehniki74.store',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Город: ${city}`,
    `Тип: ${isMaster ? 'Мастер (−15%)' : 'Розничный покупатель'}`,
    '',
    'Состав:',
    ...lines,
    '',
    `ИТОГО: ${fmt(total)}`,
    comment ? `\nКомментарий: ${comment}` : '',
  ].filter(l => l !== undefined).join('\n');
}
