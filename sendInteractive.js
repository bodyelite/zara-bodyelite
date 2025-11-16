// ============================================================
// sendInteractive.js – Botón CTA WhatsApp (v19.0)
// Compatible con server.js y motor v3
// ============================================================

import fetch from "node-fetch";

/*
  Uso esperado desde server.js:

    await sendInteractive(to, respuesta, platform);

  Donde "respuesta" contiene:
    - body: texto cuerpo del botón
    - button: texto del botón
    - urlAgenda: URL completa
*/

export async function sendInteractive(to, contenido, platform) {
  try {
    const numero = to.startsWith("+") ? to : `+${to}`;

    // ============================================================
    // INSTAGRAM NO ADMITE BOTONES → fallback a TEXTO
    // ============================================================
    if (platform === "instagram") {
      console.log("IG no permite botones interactivos → enviando texto fallback");

      const fallback = `Aquí tienes tu acceso directo para agendar:\n${contenido.urlAgenda}`;
      const payloadIG = {
        recipient: { id: to },
        message: { text: fallback }
      };

      const urlIG = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

      console.log("ENVIANDO Fallback IG →", JSON.stringify(payloadIG, null, 2));

      const resIG = await fetch(urlIG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadIG)
      });

      const dataIG = await resIG.json();
      console.log("RESPUESTA IG →", JSON.stringify(dataIG, null, 2));
      return dataIG;
    }

    // ============================================================
    // WHATSAPP CTA_URL BUTTON (FORMATO OFICIAL)
    // ============================================================
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
            display_text: contenido.button || "Agendar evaluación",
            url: contenido.urlAgenda
          }
        }
      }
    };

    console.log("ENVIANDO BOTÓN →", JSON.stringify(payload, null, 2));

    const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("RESPUESTA WHATSAPP →", JSON.stringify(data, null, 2));

    return data;

  } catch (err) {
    console.error("ERROR EN sendInteractive →", err);
    return null;
  }
}
