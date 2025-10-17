import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text.replace(/\s+/g, " ").trim() }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("📤 Enviado a WhatsApp:", JSON.stringify(data));
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error.message);
  }
}
