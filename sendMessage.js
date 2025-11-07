import fetch from "node-fetch";

export async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        text: { body: message }
      })
    });
    const data = await res.json();
    console.log("Respuesta API:", data);
  } catch (err) {
    console.error("Error al enviar mensaje:", err);
  }
}
