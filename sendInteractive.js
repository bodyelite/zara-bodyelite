// sendInteractive.js
// Versión compatible con Motor V6 y Meta v19.0
import fetch from "node-fetch";

/*
  Firma correcta:
  sendInteractive(to, contenido, urlAgenda, platform)

  contenido = {
    header: "texto opcional",
    body: "texto del mensaje",
    button: "Título del botón"
  }
*/

export async function sendInteractive(to, contenido, urlAgenda, platform) {
  try {
    const url =
      platform === "instagram"
        ? "https://graph.facebook.com/v19.0/me/messages"
        : `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

    // Construcción segura del botón para Meta
    const body = {
      messaging_product: platform === "instagram" ? "instagram" : "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: contenido.body || "Reserva tu evaluación gratuita 🤍"
        },
        action: {
          buttons: [
            {
              type: "cta_url",
              url: urlAgenda,
              title: contenido.button || "Agendar ahora"
            }
          ]
        }
      }
    };

    // Opcional: header (solo si se envía)
    if (contenido.header) {
      body.interactive.header = {
        type: "text",
        text: contenido.header
      };
    }

    console.log("DEBUG (BUTTON OUT):", JSON.stringify(body, null, 2));

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
    console.error("ERROR SEND INTERACTIVE:", e);
  }
}
