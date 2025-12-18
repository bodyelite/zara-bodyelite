import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, body, platform = "whatsapp") {
  try {
    // Tomamos el token DIRECTO, sin trims ni ifs que puedan fallar si la env es rara
    const token = process.env.CLOUD_API_ACCESS_TOKEN; 
    const version = "v19.0";
    
    // URL Standard
    const url = `https://graph.facebook.com/${version}/${process.env.WA_PHONE_NUMBER_ID}/messages`;
    
    const data = {
      messaging_product: platform === "instagram" ? "instagram" : "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: body }
    };

    console.log(`📤 Intentando enviar a ${to} por ${platform}...`);

    await axios.post(url, data, {
      headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
      }
    });
    
    console.log(`✅ ENVIADO EXITOSO a ${to}`);
    
  } catch (error) {
    // Log de error detallado pero limpio
    console.error("❌ ERROR META:", error.response ? JSON.stringify(error.response.data) : error.message);
  }
}
