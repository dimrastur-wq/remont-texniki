import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "8512046964:AAGkC6o4xll0mODCFGXHwrLte1vHG3FV_D0";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "968151715";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    let message: string;

    if (type === "review") {
      message =
        "Новый отзыв с сайта!\n" +
        "Источник: MASTER-TEHNIKI74.STORE\n\n" +
        "Имя: " + name + "\n" +
        "Город: " + city + "\n" +
        "Текст отзыва: " + (text || "—") + "\n\n" +
        "Проверьте и добавьте в код.";
    } else {
      message =
        "НОВАЯ ЗАЯВКА: master-tehniki74.store\n" +
        "Имя: " + name + "\n" +
        "Телефон: " + (phone || "—") + "\n" +
        "Город: " + city + "\n" +
        "Проблема: " + (problem || "—");
    }

    const telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Telegram API error:", errorData);
      return new Response(JSON.stringify({ error: "Telegram send failed" }), {
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
