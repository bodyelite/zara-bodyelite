import fetch from "node-fetch";

/**
 * ENVÍA MENSAJES A WHATSAPP E INSTAGRAM
 * Formato OFICIAL, mínimo y 100% válido por Meta.
 */
export async function sendMessage(to, text, platform) {
  try {
    let url = "";
    let body = {};

    // WHATSAPP CLOUD API
    if (platform === "whatsapp") {
      url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

      body = {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      };
    }

    // INSTAGRAM DM
    if (platform === "instagram") {
      url = `https://graph.facebook.com/v19.0/me/messages`;

      body = {
        recipient: { id: to },
        message: { text }
      };
    }

    console.log("📤 Enviando mensaje:", { url, platform, body });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ ERROR META:", data);
    } else {
      console.log("✅ Mensaje enviado:", data);
    }
  } catch (error) {
    console.error("❌ Error crítico al enviar mensaje:", error);
  }
}
