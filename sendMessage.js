import fetch from "node-fetch";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

// Envia mensajes internos a los números administradores
export async function sendMessage(to, texto) {
  try {
    const url = "https://graph.facebook.com/v17.0/" + PHONE_ID + "/messages";

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: texto }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + WHATSAPP_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("ERROR en sendMessage:", e);
  }
}
