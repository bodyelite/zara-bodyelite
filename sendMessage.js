import fetch from "node-fetch";

export async function sendMessage(to, text, platform) {
  try {
    if (!to || typeof to !== "string") {
      console.error("Número inválido:", to);
      return;
    }

    const numero = to.startsWith("+") ? to : `+${to}`;

    if (!text || typeof text !== "string") {
      console.error("Texto inválido enviado a sendMessage:", text);
      return;
    }

    const url =
      platform === "instagram"
        ? "https://graph.facebook.com/v19.0/me/messages"
        : `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload =
      platform === "instagram"
        ? {
            messaging_type: "RESPONSE",
            recipient: { id: to },
            message: { text }
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
        Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
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
