import fetch from "node-fetch";
const TOKEN = process.env.ZARA_TOKEN;

export async function sendMessage(to, body) {
  try {
    await fetch("https://graph.facebook.com/v19.0/311816848671292/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body }
      })
    });
    console.log(`📤 Mensaje enviado a ${to}: ${body.slice(0, 50)}...`);
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err);
  }
}
