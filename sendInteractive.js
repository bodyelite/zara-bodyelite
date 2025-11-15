// sendInteractive.js – Versión final JC Premium (WhatsApp only)
import fetch from "node-fetch";

export async function sendInteractive(to, contenido, urlAgenda) {
  try {
    const numero = to.startsWith("+") ? to : `+${to}`;

    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: contenido.body || "Agenda tu diagnóstico gratuito 🤍"
        },
        action: {
          buttons: [
            {
              type: "cta_url",
              url: urlAgenda,
              title: contenido.button || "Agendar evaluación"
            }
          ]
        }
      }
    };

    console.log("BOTÓN ENVIADO →", JSON.stringify(payload, null, 2));

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
    console.log("RESPUESTA META →", data);

    return data;
  } catch (err) {
    console.error("ERROR EN BOTÓN →", err);
  }
}
