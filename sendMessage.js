import fetch from "node-fetch";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// =======================================
// ENVIA MENSAJE INTERNO (LLAMADAS)
// =======================================
export async function sendMessage(to, texto) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: String(texto) }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("ERROR en sendMessage:", e);
  }
}
