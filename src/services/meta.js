import fetch from "node-fetch";
import { NEGOCIO } from "../config/knowledge_base.js"; // Importamos el link real del cerebro

export async function sendMessage(to, text, platform, img = null) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const version = "v19.0";
    let url = `https://graph.facebook.com/${version}/me/messages`;
    if (platform === "whatsapp") {
       url = `https://graph.facebook.com/${version}/${process.env.PHONE_NUMBER_ID}/messages`;
    }

    let body = {};

    // 1. SI HAY IMAGEN (RESULTADOS, ETC)
    if (img) {
        if (platform === "instagram") {
            body = { recipient: { id: to }, message: { attachment: { type: "image", payload: { url: img, is_reusable: true } } } };
        } else {
            body = { messaging_product: "whatsapp", to, type: "image", image: { link: img, caption: "Resultados Reales ✨" } };
        }
    
    // 2. SI HAY SOLICITUD DE LINK (AGENDA)
    } else if (text.includes("AGENDA_AQUI_LINK")) {
        // Limpiamos el texto para que no salga la etiqueta
        const textoSinLink = text.replace("AGENDA_AQUI_LINK", "").trim();
        const agendaUrl = NEGOCIO.agenda_link; // Usamos el link del cerebro

        if (platform === "instagram") {
            // USAMOS "GENERIC TEMPLATE" PARA IG (MÁS ROBUSTO QUE BUTTON)
            body = {
                recipient: { id: to },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: [
                                {
                                    title: "Agenda tu Evaluación 🧬",
                                    subtitle: "Reserva tu hora gratis aquí 👇",
                                    buttons: [
                                        {
                                            type: "web_url",
                                            url: agendaUrl,
                                            title: "📅 Agendar Ahora"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            };
            // Enviamos el texto introductorio primero si es necesario, 
            // pero la tarjeta ya tiene título. A veces es mejor mandar el texto antes.
            if (textoSinLink.length > 5) {
                 await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: to }, message: { text: textoSinLink } }) });
            }

        } else {
            // WHATSAPP: TEXTO + LINK CLICKEABLE CON PREVISUALIZACIÓN
            const textoConLink = `${textoSinLink}\n\n${agendaUrl}`;
            body = { messaging_product: "whatsapp", to, type: "text", text: { body: textoConLink, preview_url: true } };
        }

    // 3. MENSAJE NORMAL DE TEXTO
    } else {
        if (platform === "whatsapp") body = { messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } };
        else body = { recipient: { id: to }, message: { text: text } };
    }

    await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });

  } catch (e) { console.error("❌ Meta Error:", e); }
}

export async function getWhatsAppMediaUrl(id) {
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${id}`, { headers: { "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  } catch (e) { return null; }
}

export async function getInstagramUserProfile(userId) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v19.0/${userId}?fields=name,username&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.name || data.username || "Amiga"; 
  } catch (e) { return null; }
}
