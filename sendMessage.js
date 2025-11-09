import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const IG_USER_ID = process.env.IG_USER_ID; // nuevo

export async function sendMessage(recipientId, message, channel = "whatsapp") {
  try {
    let url, payload, headers;

    if (channel === "whatsapp") {
      url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
      payload = {
        messaging_product: "whatsapp",
        to: recipientId,
        type: "text",
        text: { body: message }
      };
      headers = {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      };
    }

    else if (channel === "instagram") {
      if (!IG_USER_ID) throw new Error("IG_USER_ID no definido en .env");
      url = `https://graph.facebook.com/v17.0/${IG_USER_ID}/messages`;
      payload = {
        messaging_product: "instagram",
        recipient: { id: recipientId },
        message: { text: message }
      };
      headers = {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      };
    }

    else if (channel === "messenger") {
      url = "https://graph.facebook.com/v17.0/me/messages";
      payload = {
        messaging_type: "RESPONSE",
        recipient: { id: recipientId },
        message: { text: message }
      };
      headers = {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      };
    }

    else {
      throw new Error(`Canal no soportado: ${channel}`);
    }

    const res = await axios.post(url, payload, { headers });
    console.log(`✅ Mensaje enviado por ${channel.toUpperCase()} → ${recipientId}`, res.data);
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error.response?.data || error.message);
  }
}
