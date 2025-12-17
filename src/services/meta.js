import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendMessage(to, body, platform = "whatsapp") {
  try {
    const isIG = platform === "instagram";
    // Nota: Para IG a veces la versión de API debe ser v17.0 o superior. Usamos v21.0
    const url = \`https://graph.facebook.com/v21.0/\${process.env.WA_PHONE_NUMBER_ID}/messages\`;
    
    const data = {
      messaging_product: isIG ? "instagram" : "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: body }
    };

    // Ajuste específico para Instagram si usa un endpoint diferente en tu configuración
    // (Generalmente Cloud API usa el mismo endpoint pero cambia el payload, que ya hicimos arriba)
    
    await axios.post(url, data, {
      headers: { "Authorization": \`Bearer \${process.env.CLOUD_API_ACCESS_TOKEN}\`, "Content-Type": "application/json" }
    });
    
    console.log(`✅ Mensaje enviado a \${to} (\${platform})`);
    
  } catch (error) {
    console.error("❌ META API ERROR:");
    if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
        console.error(error.message);
    }
  }
}
