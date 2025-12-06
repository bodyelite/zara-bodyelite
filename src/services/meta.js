import fetch from "node-fetch";
// Importamos volviendo a la raíz (../../) para evitar errores de ruta
import { NEGOCIO } from "../../config/knowledge_base.js"; 

export async function sendMessage(to, text, platform, img = null) {
  try {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const version = "v19.0";
    let url = `https://graph.facebook.com/${version}/me/messages`;
    if (platform === "whatsapp") {
       url = `https://graph.facebook.com/${version}/${process.env.PHONE_NUMBER_ID}/messages`;
    }

    let body = {};

    // CASO 1: IMAGEN
    if (img) {
        if (platform === "instagram") {
            body = { recipient: { id: to }, message: { attachment: { type: "image", payload: { url: img, is_reusable: true } } } };
        } else {
            body = { messaging_product: "whatsapp", to, type: "image", image: { link: img, caption: "Resultados Reales ✨" } };
        }
    
    // CASO 2: SOLICITUD DE LINK (BOTÓN)
    } else if (text.includes("AGENDA_AQUI_LINK")) {
        const textoSinLink = text.replace("AGENDA_AQUI_LINK", "").trim();
        const agendaUrl = NEGOCIO.agenda_link;

        if (platform === "instagram") {
            // INSTAGRAM: USAMOS TARJETA GENÉRICA (BOTÓN REAL)
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
                                    subtitle: "Reserva gratis aquí 👇",
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
            
            // Si hay texto antes del botón, lo mandamos primero
            if (textoSinLink.length > 2) {
                 await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ recipient: { id: to }, message: { text: textoSinLink } }) });
            }

        } else {
            // WHATSAPP: LINK LIMPIO Y CLICKEABLE
            const textoConLink = `${textoSinLink}\n\n${agendaUrl}`;
            body = { messaging_product: "whatsapp", to, type: "text", text: { body: textoConLink, preview_url: true } };
        }

    // CASO 3: TEXTO NORMAL
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
