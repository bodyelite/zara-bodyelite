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
            // 1. Enviar el Texto primero
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: text }
            }, { headers });

            // 2. Si hay link, enviar TARJETA CON BOTÓN (Generic Template)
            if (hasLink) {
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
                                    // Usamos una imagen muy estable (placeholder) para asegurar que IG no la rechace
                                    image_url: "https://placehold.co/600x300/d4af37/ffffff/png?text=Body+Elite",
                                    buttons: [{
                                        type: "web_url",
                                        url: NEGOCIO.agenda_link,
                                        title: "Reservar Cita 📅"
                                    }]
                                }]
                            }
                        }
                    }
                }, { headers });
            }
        }
    } catch (e) {
        console.error("Meta Error (Fallback):", e.message);
        // Si falla la tarjeta en IG, enviamos el link en texto como último recurso
        if (platform === 'instagram' && hasLink) {
             await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, message: { text: `🔗 Link de Agenda:\n${NEGOCIO.agenda_link}` }
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
    console.log(`🚨 STAFF ALERT: ${nombre} (${canal}) pide llamada: ${mensaje}`);
}
