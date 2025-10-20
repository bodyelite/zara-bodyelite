import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, text) {
  try {
    const url = "https://graph.facebook.com/v18.0/" + PHONE_NUMBER_ID + "/messages";
    const headers = {
      Authorization: "Bearer " + PAGE_ACCESS_TOKEN,
      "Content-Type": "application/json"
    };
    const body = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { preview_url: false, body: text }
    };
    const response = await axios.post(url, body, { headers });
    console.log("Mensaje enviado correctamente:", response.data);
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error.message);
  }
}

export { sendMessage };
