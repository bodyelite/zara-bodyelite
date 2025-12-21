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
        // --- WHATSAPP ---
        if (platform === 'whatsapp') {
            const finalBody = hasLink ? `${text}\n\n👇 Reserva aquí:\n${NEGOCIO.agenda_link}` : text;
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", 
                to: to, 
                type: "text", 
                text: { body: finalBody }
            }, { headers });
        
        // --- INSTAGRAM ---
        } else if (platform === 'instagram') {
            
            // 1. Enviamos el texto primero (Contexto)
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, 
                message: { text: text }
            }, { headers });

            // 2. Si hay link, enviamos TARJETA CON BOTÓN (Generic Template)
            if (hasLink) {
                // Usamos una imagen de servidor estático seguro (Imgur/Unsplash directo) para que Meta no la rechace
                const imageUrl = "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                
                await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                    recipient: { id: to },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [{
                                    title: "Reserva tu Hora 📅",
                                    subtitle: "Evaluación Gratis + Asistencia IA",
                                    image_url: imageUrl,
                                    buttons: [{
                                        type: "web_url",
                                        url: NEGOCIO.agenda_link,
                                        title: "Agendar Aquí"
                                    }]
                                }]
                            }
                        }
                    }
                }, { headers });
            }
        }
    } catch (e) {
        // Fallback silencioso: Si falla el botón, enviamos el link limpio
        if (platform === 'instagram' && hasLink) {
             console.error("Error enviando botón IG, usando fallback texto:", e.message);
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
    console.log(`🚨 [STAFF ALERT] LLAMADA SOLICITADA: Cliente ${nombre} (${canal}) - ID: ${id}. Contexto: ${mensaje}`);
}
