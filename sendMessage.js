import fetch from "node-fetch";

// sendMessage(to, text, platform)
export async function sendMessage(to, text, platform) {
  try {

    // Validar número
    if (!to || typeof to !== "string") {
      console.error("Número inválido:", to);
      return;
    }

    // WhatsApp requiere formato +569...
    const numero = to.startsWith("+") ? to : `+${to}`;

    // Validar texto
    if (!text || typeof text !== "string") {
      console.error("Texto inválido enviado a sendMessage:", text);
      return;
    }

    // Selección correcta de endpoint según plataforma
    const url =
      platform === "instagram"
        ? "https://graph.facebook.com/v19.0/me/messages"
        : `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload =
      platform === "instagram"
        ? {
            messaging_type: "RESPONSE",
            recipient: { id: to },
            message: { text: text }
          }
        : {
            messaging_product: "whatsapp",
            to: numero,
            type: "text",
            text: { body: text }
          };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${platform === "instagram"
          ? process.env.PAGE_ACCESS_TOKEN
          : process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Respuesta API:", JSON.stringify(data, null, 2));

  } catch (err) {
    console.error("Error al enviar mensaje:", err);
  }
}
