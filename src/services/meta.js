import fetch from "node-fetch";

const LINK_AGENDA = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

export async function sendMessage(to, text, platform) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const version = "v19.0";
    let url = platform === "whatsapp" 
      ? `https://graph.facebook.com/${version}/${process.env.PHONE_NUMBER_ID}/messages`
      : `https://graph.facebook.com/${version}/me/messages`;

    let body = {};
    let textoLimpio = text;

    const incluyeAgenda = text.includes("AGENDA_AQUI_LINK") || text.includes("reservo.cl");

    if (platform === "instagram" && incluyeAgenda) {
      textoLimpio = text.replace("AGENDA_AQUI_LINK", "").replace(LINK_AGENDA, "").replace("[Agenda aquí]", "").replace("()", "").trim();
      if (textoLimpio.length < 5) textoLimpio = "¡Aquí tienes el acceso directo!";

      body = {
        recipient: { id: to },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: textoLimpio.substring(0, 640),
              buttons: [{ type: "web_url", url: LINK_AGENDA, title: "📅 Agendar Gratis Aquí" }]
            }
          }
        }
      };
    } else {
      if (textoLimpio.includes("AGENDA_AQUI_LINK")) textoLimpio = textoLimpio.replace("AGENDA_AQUI_LINK", LINK_AGENDA);
      
      body = platform === "whatsapp"
        ? { messaging_product: "whatsapp", to, type: "text", text: { body: textoLimpio, preview_url: false } }
        : { recipient: { id: to }, message: { text: textoLimpio } };
    }

    await fetch(url, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (error) { console.error("❌ Error Meta:", error); }
}

export async function getWhatsAppMediaUrl(mediaId) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v19.0/${mediaId}`;
    
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error(`Error Meta API: ${response.statusText}`);

    const data = await response.json();
    return data.url; 
  } catch (error) {
    console.error("❌ Error obteniendo URL de media:", error);
    return null;
  }
}
