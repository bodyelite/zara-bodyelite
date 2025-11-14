// sendInteractive.js
// Envío seguro de botones interactivos sin tocar server.js ni sendMessage.js
import fetch from "node-fetch";

export async function sendInteractive(to, platform) {
  try {
    const url =
      platform === "instagram"
        ? "https://graph.facebook.com/v19.0/me/messages"
        : `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const body = {
      messaging_product: platform === "instagram" ? "instagram" : "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Puedes reservar tu evaluación gratuita aquí 🤍"
        },
        action: {
          buttons: [
            {
              type: "cta_url",
              url: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
              title: "Agendar ahora"
            }
          ]
        }
      }
    };

    console.log("DEBUG (BUTTON): Enviando botón interactivo →", to);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("DEBUG (BUTTON RESPONSE):", data);

    return data;
  } catch (e) {
    console.error("ERROR BOTÓN:", e);
  }
}
