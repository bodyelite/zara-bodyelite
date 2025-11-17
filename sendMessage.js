import fetch from "node-fetch";

const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

// ------------------------------------
// ENVIAR MENSAJE (Texto)
// ------------------------------------
export async function sendMessage(to, text, platform) {
  try {
    let url = "";
    let body = {};

    if (platform === "whatsapp") {
      // WhatsApp Business API
      url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;
      body = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      };
    } else {
      // Instagram / Messenger
      url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_TOKEN}`;
      body = {
        recipient: { id: to },
        message: { text }
      };
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${PAGE_TOKEN}` },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}
