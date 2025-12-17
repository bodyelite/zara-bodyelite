import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, body, platform = "whatsapp") {
  try {
    // 1. Limpieza de Token (Trim quita espacios ocultos que rompen el parseo)
    const rawToken = process.env.CLOUD_API_ACCESS_TOKEN;
    const token = rawToken ? rawToken.trim() : null;

    if (!token) {
        console.error("❌ ERROR CRÍTICO: No se detecta el Token de Meta en las variables.");
        return;
    }

    const isIG = platform === "instagram";
    const version = "v19.0"; // Usamos una versión estable probada
    const url = `https://graph.facebook.com/${version}/${process.env.WA_PHONE_NUMBER_ID}/messages`;
    
    const data = {
      messaging_product: isIG ? "instagram" : "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: body }
    };

    await axios.post(url, data, {
      headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
      }
    });
    
    console.log(`✅ MENSAJE ENVIADO a ${to} (${platform})`);
    
  } catch (error) {
    console.error("❌ META API ERROR (Detalles):");
    if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Msg:", JSON.stringify(error.response.data));
    } else {
        console.error(error.message);
    }
  }
}
