import fetch from "node-fetch";

const TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;

// --- Enviar mensaje de bienvenida a nuevo seguidor IG ---
export async function enviarBienvenidaIG(userId) {
  const mensaje = "🌸 Hola, soy Zara IA de Body Elite. Gracias por seguirnos 💫 Te invito a conocer nuestros tratamientos y agendar tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  try {
    await fetch(`https://graph.facebook.com/v18.0/${IG_BUSINESS_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "instagram",
        recipient: { id: userId },
        message: { text: mensaje }
      })
    });
    console.log("👋 Bienvenida enviada a nuevo seguidor IG:", userId);
  } catch (err) {
    console.error("Error enviando bienvenida IG:", err);
  }
}
