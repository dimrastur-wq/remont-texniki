import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CampaignRequest {
  subject: string;
  body: string;
  city_filter?: string;
  category_filter?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { subject, body, city_filter, category_filter }: CampaignRequest = await req.json();

    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: "subject and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create campaign record
    const campaignRes = await fetch(`${supabaseUrl}/rest/v1/b2b_campaigns`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        subject,
        body,
        city_filter: city_filter || "",
        category_filter: category_filter || "",
        status: "sending",
      }),
    });

    const campaigns = await campaignRes.json();
    const campaign = campaigns[0];

    // Fetch matching contacts
    let contactsUrl = `${supabaseUrl}/rest/v1/b2b_contacts?select=id,email,company_name,city,contact_person&status=eq.active`;
    if (city_filter) {
      contactsUrl += `&city=eq.${encodeURIComponent(city_filter)}`;
    }
    if (category_filter) {
      contactsUrl += `&category=eq.${encodeURIComponent(category_filter)}`;
    }

    const contactsRes = await fetch(contactsUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    const contacts = await contactsRes.json();

    if (contacts.length === 0) {
      await fetch(`${supabaseUrl}/rest/v1/b2b_campaigns?id=eq.${campaign.id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "draft" }),
      });

      return new Response(
        JSON.stringify({ success: false, error: "No matching contacts found", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create campaign_sends records
    const sends = contacts.map((c: any) => ({
      campaign_id: campaign.id,
      contact_id: c.id,
      status: "pending",
    }));

    await fetch(`${supabaseUrl}/rest/v1/b2b_campaign_sends`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(sends),
    });

    // Send notifications via Telegram
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    let sentCount = 0;
    let bouncedCount = 0;

    if (telegramBotToken && telegramChatId) {
      const summaryText = `📧 Рассылка запущена!\n\nТема: ${subject}\nГород: ${city_filter || "Все"}\nКатегория: ${category_filter || "Все"}\nПолучателей: ${contacts.length}\n\nСписок получателей:\n${contacts.slice(0, 20).map((c: any) => `— ${c.company_name} (${c.email}, ${c.city})`).join("\n")}${contacts.length > 20 ? `\n... и ещё ${contacts.length - 20}` : ""}`;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: summaryText,
        }),
      });
    }

    // Process each contact
    for (const contact of contacts) {
      try {
        const personalizedBody = body.replace(
          /Уважаемые коллеги!/g,
          contact.contact_person
            ? `Уважаемый(ая) ${contact.contact_person}!`
            : `Уважаемые коллеги!`
        );

        // In production: send actual email via Resend/SendGrid/Mailgun
        // For now: notify via Telegram
        if (telegramBotToken && telegramChatId) {
          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `📤 Отправлено:\nКому: ${contact.company_name} <${contact.email}>\nТема: ${subject}\nГород: ${contact.city}`,
            }),
          });
        }

        sentCount++;
      } catch {
        bouncedCount++;
      }
    }

    // Update campaign stats
    await fetch(`${supabaseUrl}/rest/v1/b2b_campaigns?id=eq.${campaign.id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "sent",
        total_sent: sentCount,
        total_bounced: bouncedCount,
        sent_at: new Date().toISOString(),
      }),
    });

    // Update campaign_sends status
    await fetch(`${supabaseUrl}/rest/v1/b2b_campaign_sends?campaign_id=eq.${campaign.id}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "sent", sent_at: new Date().toISOString() }),
    });

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, bounced: bouncedCount, campaign_id: campaign.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
