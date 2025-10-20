import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function sendMessage(to, texto) {
  try {
    const respuesta = {
      messaging_product: "whatsapp",
      to,
      text: { body: texto }
    };

    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      respuesta,
      {
        headers: {
          Authorization: `Bearer ${process.env.ZARA_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}
