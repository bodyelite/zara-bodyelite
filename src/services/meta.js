import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, body, platform = "whatsapp") {
  try {
    const url = `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: platform === "instagram" ? "instagram" : "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: body }
    };
    await axios.post(url, data, {
      headers: { "Authorization": `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Meta Error");
  }
}
