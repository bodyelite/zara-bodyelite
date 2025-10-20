import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.PAGE_ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

export async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
    const data = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message }
    };
    const response = await axios.post(url, data, { headers });
    console.log("Mensaje enviado:", response.data);
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error.message);
  }
}
