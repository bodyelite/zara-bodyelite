import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/**
 * Envía mensajes unificados por el mismo canal (WhatsApp endpoint),
 * tanto si el mensaje viene desde WhatsApp o Instagram.
 * Así se evita la validación "instagram_manage_messages".
 */
export async function sendMessage(to, text, platform = "whatsapp") {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    };

    console.log(`📤 Enviando ${platform.toUpperCase()} →`, JSON.stringify(body, null, 2));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.error) console.error("❌ Error de Meta:", JSON.stringify(data.error, null, 2));
    else console.log("✅ Respuesta Meta:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error general en sendMessage:", err);
  }
}
