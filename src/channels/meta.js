import axios from 'axios';
import dotenv from 'dotenv';
import { NEGOCIO } from '../config/business.js';
dotenv.config();

export async function enviarMensajeMeta(to, text, platform, hasLink = false) {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;

    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
        if (platform === 'whatsapp') {
            // WSP: Link limpio
            const finalBody = hasLink ? `${text}\n\n👇 Reserva aquí:\n${NEGOCIO.agenda_link}` : text;
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", to: to, type: "text", text: { body: finalBody }
            }, { headers });
        
        } else if (platform === 'instagram') {
            // IG: Enviamos Texto primero
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: text }
            }, { headers });

            // IG: TARJETA CON BOTÓN (Generic Template)
            if (hasLink) {
                // Usamos una imagen de WIKIMEDIA (servidores ultra rápidos y públicos) para evitar rechazos de Meta
                const imagenSegura = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Crystal_Clear_app_date.png/480px-Crystal_Clear_app_date.png";
                
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [{
                                    title: "Agenda Online",
                                    subtitle: "Evaluación Gratis con IA",
                                    image_url: imagenSegura,
                                    buttons: [{
                                        type: "web_url",
                                        url: NEGOCIO.agenda_link,
                                        title: "📅 Agendar"
                                    }]
                                }]
                            }
                        }
                    }
                }, { headers });
            }
        }
    } catch (e) {
        // Si todo falla, enviamos el link cortado
        if (platform === 'instagram' && hasLink) {
             await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: `👇 Link Agenda:\n${NEGOCIO.agenda_link}` }
            }, { headers });
        }
    }
}

export async function obtenerNombreIG(igId) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const r = await axios.get(`https://graph.facebook.com/v19.0/${igId}?fields=name,username&access_token=${token}`);
        return r.data.name || r.data.username || "Usuario IG";
    } catch { return "Usuario IG"; }
}

export async function notificarStaff(id, nombre, canal, mensaje) {
    console.log(`🚨 STAFF: ${nombre} (${canal}) pide llamada: ${mensaje}`);
}
