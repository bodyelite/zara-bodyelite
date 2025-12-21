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
            // WSP: Texto + Link limpio abajo
            const finalBody = hasLink ? `${text}\n\n👇 Reserva aquí:\n${NEGOCIO.agenda_link}` : text;
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", to: to, type: "text", text: { body: finalBody }
            }, { headers });
        
        } else if (platform === 'instagram') {
            // 1. Texto (Contexto)
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: text }
            }, { headers });

            // 2. Tarjeta con Botón (ESTA ES LA PARTE QUE FALTABA)
            if (hasLink) {
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [{
                                    title: "Agenda tu Hora 📅",
                                    subtitle: "Evaluación Gratis",
                                    // Imagen segura de Unsplash
                                    image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
                                    buttons: [{
                                        type: "web_url",
                                        url: NEGOCIO.agenda_link,
                                        title: "Reservar Aquí"
                                    }]
                                }]
                            }
                        }
                    }
                }, { headers });
            }
        }
    } catch (e) {
        // Fallback
        if (platform === 'instagram' && hasLink) {
             await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: `🔗 Link: ${NEGOCIO.agenda_link}` }
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
