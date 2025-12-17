import fetch from "node-fetch";

export async function sendMessage(to, text, platform, imageUrl = null) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    let url = "";
    let body = {};

    if (platform === "whatsapp") {
        const phoneId = process.env.PHONE_NUMBER_ID;
        url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
        if (imageUrl) {
            body = { messaging_product: "whatsapp", to: to, type: "image", image: { link: imageUrl } };
        } else {
            body = { messaging_product: "whatsapp", to: to, type: "text", text: { body: text, preview_url: false } };
        }
    } else {
        url = `https://graph.facebook.com/v19.0/me/messages`;
        if (imageUrl) {
            body = { recipient: { id: to }, message: { attachment: { type: "image", payload: { url: imageUrl, is_reusable: true } } } };
        } else {
            body = { recipient: { id: to }, message: { text: text } };
        }
    }
    await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
  } catch (error) { console.error(error); }
}

export async function sendButton(to, text, btnTitle, url, platform) {
    if (platform === "instagram") {
        await sendMessage(to, `${text}\n\n👇 ${btnTitle}: ${url}`, "instagram");
    } else {
        await sendMessage(to, `${text}\n\n🔗 ${url}`, "whatsapp");
    }
}

export async function getWhatsAppMediaUrl(mediaId) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const r = await fetch(`https://graph.facebook.com/v19.0/${mediaId}`, { headers: { "Authorization": `Bearer ${token}` } });
        if(!r.ok) return null;
        const d = await r.json();
        return d.url; 
    } catch(e) { return null; }
}

export async function getInstagramUserProfile(userId) { return "Usuario IG"; }
