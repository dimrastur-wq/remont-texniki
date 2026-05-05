const TELEGRAM_BOT_TOKEN = '8512046964:AAGkC6o4xll0mODCFGXHwrLte1vHG3FV_D0';
const TELEGRAM_CHAT_ID = '968151715';

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, city, problem, text, type } = req.body || {};

  if (!name || !city) {
    return res.status(400).json({ error: 'Name and city are required' });
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
      'Телефон: ' + (phone || '—') + '\n' +
      'Город: ' + city + '\n' +
      'Проблема: ' + (problem || '—');
  }

  try {
    const telegramUrl = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Telegram API error:', errorData);
      return res.status(500).json({ error: 'Telegram send failed' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
