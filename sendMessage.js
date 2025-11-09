import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Envío de mensajes unificado para WhatsApp e Instagram
export async function sendMessage(to, text, platform = "whatsapp") {
  try {
    let url = "";
    let body = {};

    // ===== WhatsApp =====
    if (platform === "whatsapp") {
      url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
      body = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      };
    }

    // ===== Instagram =====
    else if (platform === "instagram") {
      url = `https://graph.facebook.com/v18.0/${IG_USER_ID}/messages`;
      body = {
        recipient: { id: to },
        message: { text },
      };
    }

    // Verificación
    if (!url) throw new Error("URL de envío no definida");

    console.log(`📤 Enviando mensaje ${platform.toUpperCase()} → ${to}: ${text}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("✅ Respuesta de Meta:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("❌ Error en sendMessage:", error.message);
  }
}
