import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "8512046964:AAGkC6o4xll0mODCFGXHwrLte1vHG3FV_D0";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "968151715";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const EMAIL_TO = "dimrastur@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sendTelegram(message: string) {
  const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });
  return res.ok;
}

async function sendEmail(subject: string, htmlBody: string) {
  if (!RESEND_API_KEY) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: "master-tehniki74.store <onboarding@resend.dev>",
      to: [EMAIL_TO],
      subject,
      html: htmlBody,
    }),
  });
  return res.ok;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { name, phone, city, problem, text, type } = body;

    if (!name || !city) {
      return new Response(JSON.stringify({ error: "Name and city are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let telegramMessage: string;
    let emailSubject: string;
    let emailHtml: string;

    if (type === "review") {
      telegramMessage =
        "Новый отзыв с сайта!\n" +
        "Источник: MASTER-TEHNIKI74.STORE\n\n" +
        "Имя: " + name + "\n" +
        "Город: " + city + "\n" +
        "Текст отзыва: " + (text || "—") + "\n\n" +
        "Проверьте и добавьте в код.";

      emailSubject = "Новый отзыв с сайта master-tehniki74.store";
      emailHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f172a;margin-bottom:16px;">Новый отзыв с сайта</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Имя</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Город</td><td style="padding:8px 0;font-weight:600;">${city}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Текст</td><td style="padding:8px 0;">${text || "—"}</td></tr>
          </table>
          <p style="margin-top:24px;color:#94a3b8;font-size:13px;">Сайт: master-tehniki74.store</p>
        </div>`;
    } else {
      telegramMessage =
        "НОВАЯ ЗАЯВКА: master-tehniki74.store\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + (phone || "—") + "\n" +
        "Город: " + city + "\n" +
        "Проблема: " + (problem || "—");

      emailSubject = "Новая заявка с сайта master-tehniki74.store";
      emailHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f172a;margin-bottom:16px;">Новая заявка на ремонт</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Имя</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Телефон</td><td style="padding:8px 0;font-weight:600;"><a href="tel:${phone}" style="color:#1d4ed8;">${phone || "—"}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Город</td><td style="padding:8px 0;font-weight:600;">${city}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Проблема</td><td style="padding:8px 0;">${problem || "—"}</td></tr>
          </table>
          <p style="margin-top:24px;color:#94a3b8;font-size:13px;">Сайт: master-tehniki74.store</p>
        </div>`;
    }

    const [telegramOk, emailOk] = await Promise.all([
      sendTelegram(telegramMessage),
      sendEmail(emailSubject, emailHtml),
    ]);

    if (!telegramOk && !emailOk) {
      return new Response(JSON.stringify({ error: "Failed to send notification" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
