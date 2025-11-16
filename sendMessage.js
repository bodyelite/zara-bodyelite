// ============================================================
// sendMessage.js – Envío de texto WhatsApp + Instagram v19.0
// ============================================================

import fetch from "node-fetch";

/*
  Uso:
  sendMessage(to, text, platform)

  platform = "whatsapp" | "instagram"
*/

export async function sendMessage(to, text, platform) {
  try {
    if (!to || !text) {
      console.error("sendMessage: parámetros inválidos", { to, text });
      return null;
    }

    const numero = to.startsWith("+") ? to : `+${to}`;

    let url = "";
    let payload = {};

    // ============================================================
    // WHATSAPP
    // ============================================================
    if (platform === "whatsapp") {
      url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

      payload = {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: text }
      };
    }

    // ============================================================
    // INSTAGRAM DM
    // ============================================================
    else if (platform === "instagram") {
      url = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

      payload = {
        recipient: { id: to },
        message: { text }
      };
    }

    console.log("ENVIANDO MENSAJE →", JSON.stringify(payload, null, 2));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("RESPUESTA META →", JSON.stringify(data, null, 2));

    return data;

  } catch (err) {
    console.error("ERROR EN sendMessage →", err);
    return null;
  }
}
