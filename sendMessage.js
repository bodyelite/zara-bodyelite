import fetch from "node-fetch";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

// =======================================
// ENVIA MENSAJE INTERNO (LLAMADAS)
// =======================================
export async function sendMessage(to, texto) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: String(texto) }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("ERROR en sendMessage:", e);
  }
}