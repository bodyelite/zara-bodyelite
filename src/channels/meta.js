import axios from 'axios';
import dotenv from 'dotenv';
import { NEGOCIO } from '../config/business.js';
dotenv.config();

export async function enviarMensaje(to, text, platform, hasLink = false) {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;

    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
        if (platform === 'whatsapp') {
            // WSP: Texto Limpio + Link abajo
            const finalBody = hasLink ? `${text}\n\n🔗 ${NEGOCIO.agenda_link}` : text;
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", to: to, type: "text", text: { body: finalBody }
            }, { headers });
        
        } else if (platform === 'instagram') {
            if (hasLink) {
                // IG: Generic Template (Tarjeta con Botón)
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [{
                                    title: "Agenda tu Evaluación 📅",
                                    subtitle: "Es gratis y con Asistencia IA",
                                    buttons: [{
                                        type: "web_url",
                                        url: NEGOCIO.agenda_link,
                                        title: "Reservar Ahora"
                                    }]
                                }]
                            }
                        }
                    }
                }, { headers });
                // Enviamos el texto antes de la tarjeta para mantener contexto
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to }, message: { text: text }
                }, { headers });
            } else {
                // IG: Texto normal
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to }, message: { text: text }
                }, { headers });
            }
        }
    } catch (e) {
        console.error("Meta Error:", e.message);
        // Fallback de seguridad
        if(platform === 'instagram' && hasLink) {
             await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: `${text}\n\n🔗 ${NEGOCIO.agenda_link}` }
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
    console.log(`🔔 STAFF ALERT: Cliente ${nombre} (${canal}) quiere llamada. Info: ${mensaje}`);
}
