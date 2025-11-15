// sendMessage.js – Versión final JC Premium (WhatsApp only)
import fetch from "node-fetch";

export async function sendMessage(to, text) {
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

    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "text",
      text: { body: text }
    };

    console.log("ENVIANDO TEXTO →", JSON.stringify(payload, null, 2));

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();
    console.log("RESPUESTA META →", JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    console.error("ERROR EN sendMessage →", err);
  }
}
