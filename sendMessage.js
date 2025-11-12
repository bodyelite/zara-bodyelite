import fetch from "node-fetch";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

export async function sendMessage(to, text, platform = "whatsapp") {
  try {
    let url, body;

    if (platform === "instagram") {
      url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
      body = { recipient: { id: to }, message: { text } };
    } else {
      url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
      body = { messaging_product: "whatsapp", to, type: "text", text: { body: text } };
    }

    console.log(`📤 Enviando ${platform.toUpperCase()} →`, JSON.stringify(body, null, 2));

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) console.error("❌ Error Meta:", JSON.stringify(data.error, null, 2));
    else console.log("✅ Enviado correctamente:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error general en sendMessage:", err);
  }
}
