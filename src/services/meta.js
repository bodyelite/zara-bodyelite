import fetch from "node-fetch";
const LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

export async function sendMessage(to, text, platform, img = null) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const url = platform === "whatsapp" 
      ? `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`
      : `https://graph.facebook.com/v19.0/me/messages`;

    let body = {};
    if (img) {
        if (platform === "instagram") body = { recipient: { id: to }, message: { attachment: { type: "image", payload: { url: img, is_reusable: true } } } };
        else body = { messaging_product: "whatsapp", to, type: "image", image: { link: img, caption: "Resultados Reales ✨" } };
    } else if (text) {
        let txt = text.replace("AGENDA_AQUI_LINK", LINK).trim();
        body = platform === "whatsapp" 
            ? { messaging_product: "whatsapp", to, type: "text", text: { body: txt, preview_url: false } }
            : { recipient: { id: to }, message: { text: txt } };
    }

    await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch (e) { console.error("❌ Meta Error:", e); }
}

export async function getWhatsAppMediaUrl(id) {
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${id}`, { headers: { "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  } catch (e) { return null; }
}
