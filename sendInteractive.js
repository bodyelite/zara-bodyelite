import fetch from "node-fetch";

const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

// ------------------------------------
// ENVIAR BOTÓN INTERACTIVO SEGÚN CANAL
// ------------------------------------
export async function sendInteractive(to, data, platform) {
  try {
    // IG no soporta botones → enviar texto con link
    if (platform === "instagram") {
      const texto =
        `${data.body}\n\n` +
        `Reserva aquí: ${data.urlAgenda}`;

      const urlIG = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_TOKEN}`;
      const bodyIG = {
        recipient: { id: to },
        message: { text: texto }
      };

      await fetch(urlIG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyIG)
      });

      return;
    }

    // WHATSAPP → botón nativo
    const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: data.body },
        action: {
          buttons: [
            {
              type: "url",
              url: data.urlAgenda,
              title: data.button
            }
          ]
        }
      }
    };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${PAGE_TOKEN}` },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error("Error al enviar botón:", error);
  }
}
