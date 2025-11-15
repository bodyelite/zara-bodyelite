<<<<<<< HEAD
// sendInteractive.js – CTA_URL WhatsApp v19.0 (con display_text requerido)
=======
// sendInteractive.js – CTA_URL WhatsApp v19.0
>>>>>>> a85365faf707d88eb6c325622dae4ac61117ae30
import fetch from "node-fetch";

export async function sendInteractive(to, contenido, urlAgenda) {
  try {
    const numero = to.startsWith("+") ? to : `+${to}`;

    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "interactive",
      interactive: {
        type: "cta_url",
        header: {
          type: "text",
          text: "Diagnóstico gratuito"
        },
        body: {
          text: contenido.body || "Agenda tu diagnóstico gratuito 🤍"
        },
        action: {
          name: "cta_url",
          parameters: {
<<<<<<< HEAD
            display_text: contenido.button || "Agendar evaluación",
=======
>>>>>>> a85365faf707d88eb6c325622dae4ac61117ae30
            url: urlAgenda
          }
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
    console.log("RESPUESTA META →", JSON.stringify(data, null, 2));
<<<<<<< HEAD
    return data;

=======

    return data;
>>>>>>> a85365faf707d88eb6c325622dae4ac61117ae30
  } catch (err) {
    console.error("ERROR EN BOTÓN →", err);
  }
}
