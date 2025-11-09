import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

export async function sendMessage(recipientId, message, channel = "whatsapp") {
  try {
    let url, payload;

    // WhatsApp
    if (channel === "whatsapp") {
      url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
      payload = {
        messaging_product: "whatsapp",
        to: recipientId,
        type: "text",
        text: { body: message },
      };
    }

    // Instagram
    else if (channel === "instagram") {
      url = `https://graph.facebook.com/v17.0/${recipientId}/messages`;
      payload = {
        recipient: { id: recipientId },
        message: { text: message },
      };
    }

    const headers = {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    await axios.post(url, payload, { headers });
    console.log(`✅ Mensaje enviado por ${channel.toUpperCase()} → ${recipientId}`);
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error.response?.data || error.message);
  }
}
