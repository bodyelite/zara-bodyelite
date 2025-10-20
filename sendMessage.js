import fetch from "node-fetch";

export async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };

  const body = JSON.stringify({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error al enviar mensaje:", data);
    } else {
      console.log("Mensaje enviado correctamente:", data);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}
