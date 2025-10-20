import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.PAGE_ACCESS_TOKEN;
const telefono = process.env.PHONE_NUMBER_ID;

export default async function sendMessage(to, texto) {
  const url = "https://graph.facebook.com/v17.0/" + telefono + "/messages";

  try {
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: texto }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }
    );
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error.message);
  }
}
