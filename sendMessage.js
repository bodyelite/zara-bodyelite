import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, message) {
  try {
    const url = "https://graph.facebook.com/v18.0/" + PHONE_NUMBER_ID + "/messages";
    const headers = {
      "Authorization": "Bearer " + PAGE_ACCESS_TOKEN,
      "Content-Type": "application/json"
    };
    const body = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { preview_url: false, body: message }
    };
    const r = await axios.post(url, body, { headers });
    console.log("Mensaje enviado:", r.data);
  } catch (e) {
    console.error("Error al enviar mensaje:", e.response?.data || e.message);
  }
}

export { sendMessage };
