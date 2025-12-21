import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function enviarMensaje(to, text, platform) {
    const token = platform === 'whatsapp' ? process.env.WHATSAPP_TOKEN : process.env.PAGE_ACCESS_TOKEN;
    
    if (!token) {
        console.error(`CRITICAL ERROR: MISSING TOKEN FOR ${platform}`);
        return;
    }

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        if (platform === 'whatsapp') {
            await axios.post(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
                messaging_product: "whatsapp", 
                to: to, 
                text: { body: text }
            }, { headers });
            console.log(`SUCCESS: WSP SENT TO ${to}`);
        } else if (platform === 'instagram') {
            await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
                recipient: { id: to }, 
                message: { text: text }
            }, { headers });
            console.log(`SUCCESS: IG SENT TO ${to}`);
        }
    } catch (e) {
        const err = e.response ? JSON.stringify(e.response.data) : e.message;
        console.error(`FAILED SENDING ${platform}:`, err);
    }
}

export async function notificarStaff(cliente, motivo, origen) {
    console.log(`STAFF ALERT: ${cliente} (${origen}): ${motivo}`);
}

export async function obtenerNombreIG(igId) {
    try {
        const r = await axios.get(`https://graph.facebook.com/v21.0/${igId}?fields=name,username&access_token=${process.env.PAGE_ACCESS_TOKEN}`);
        return r.data.name || r.data.username || "Usuario IG";
    } catch { return "Usuario IG"; }
}
