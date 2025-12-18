import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, body, platform = "whatsapp") {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN || process.env.CLOUD_API_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID;
    
    let url = "";
    let data = {};

    if (platform === "whatsapp") {
        url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
        data = { 
            messaging_product: "whatsapp", 
            to: to, 
            type: "text", 
            text: { body: body } 
        };
    } else {
        url = `https://graph.facebook.com/v19.0/me/messages`;
        data = { 
            recipient: { id: to }, 
            message: { text: body } 
        };
    }

    await axios.post(url, data, {
      headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
      }
    });
    
    console.log(`✅ ENVIADO a ${to} (${platform})`);
    
  } catch (error) {
    console.error("❌ ERROR META:", error.response ? JSON.stringify(error.response.data) : error.message);
  }
}
