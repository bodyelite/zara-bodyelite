import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function enviarMensaje(to, text, platform) {
    // ADAPTACION A TUS VARIABLES ANTIGUAS
    const token = process.env.WHATSAPP_TOKEN || process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID || process.env.PHONE_NUMBER_ID; 

    if (!token) return console.error(`CRITICAL: NO TOKEN FOUND (Check PAGE_ACCESS_TOKEN in .env)`);
    if (platform === 'whatsapp' && !phoneId) return console.error(`CRITICAL: NO PHONE ID FOUND (Check PHONE_NUMBER_ID in .env)`);

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        if (platform === 'whatsapp') {
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", 
                to: to, 
                type: "text",
                text: { body: text }
            }, { headers });
            console.log(`✅ WSP SENT: ${to}`);
        } else if (platform === 'instagram') {
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, 
                message: { text: text }
            }, { headers });
            console.log(`✅ IG SENT: ${to}`);
        }
    } catch (e) {
        console.error(`❌ SEND ERROR ${platform}:`, e.response ? JSON.stringify(e.response.data) : e.message);
    }
}

export async function notificarStaff(cliente, motivo, origen) {
    console.log(`ALERTA STAFF: ${cliente} (${origen}): ${motivo}`);
}

export async function obtenerNombreIG(igId) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const r = await axios.get(`https://graph.facebook.com/v19.0/${igId}?fields=name,username&access_token=${token}`);
        return r.data.name || r.data.username || "Usuario IG";
    } catch { return "Usuario IG"; }
}
