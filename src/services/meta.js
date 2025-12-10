import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, text, platform = "whatsapp") {
  try {
    let url, body;
    if (platform === "whatsapp") {
      url = `https://graph.facebook.com/v21.0/${process.env.PHONENUMBER_ID}/messages`;
      body = { messaging_product: "whatsapp", recipient_type: "individual", to: to, type: "text", text: { body: text } };
    } else {
      url = `https://graph.facebook.com/v21.0/me/messages`;
      body = { recipient: { id: to }, message: { text: text } };
    }
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` },
      body: JSON.stringify(body)
    });
  } catch (e) { console.error("Meta API Error:", e); }
}

export async function sendButton(to, text, btnLabel, btnUrl, platform) {
    if (platform === "whatsapp") {
        await sendMessage(to, `${text}\n\n🔗 ${btnUrl}`, "whatsapp");
    } else {
        try {
            const url = `https://graph.facebook.com/v21.0/me/messages`;
            const body = {
                recipient: { id: to },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: text,
                            buttons: [{ type: "web_url", url: btnUrl, title: btnLabel }]
                        }
                    }
                }
            };
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` },
                body: JSON.stringify(body)
            });
        } catch (e) { console.error("IG Button Error:", e); }
    }
}

export async function getWhatsAppMediaUrl(mediaId) {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
      headers: { "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` }
    });
    const data = await res.json();
    return data.url;
  } catch (e) { return null; }
}

export async function getInstagramUserProfile(senderId) {
  try {
    const url = `https://graph.facebook.com/v21.0/${senderId}?fields=name,username&access_token=${process.env.PAGE_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.name || data.username || "Amiga";
  } catch (e) { return "Amiga"; }
}
