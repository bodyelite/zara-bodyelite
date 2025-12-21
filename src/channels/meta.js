import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function enviarMensaje(to, text, platform) {
    const token = process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;

    if (!token) return console.error("MISSING ENV: PAGE_ACCESS_TOKEN");

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        if (platform === 'whatsapp') {
            if (!phoneId) return console.error("MISSING ENV: PHONE_NUMBER_ID");
            await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
                messaging_product: "whatsapp", 
                to: to, 
                type: "text",
                text: { body: text }
            }, { headers });
            console.log(`[WSP] SENT: ${to}`);
        } else if (platform === 'instagram') {
            await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
                recipient: { id: to }, 
                message: { text: text }
            }, { headers });
            console.log(`[IG] SENT: ${to}`);
        }
    } catch (e) {
        console.error(`ERROR ${platform}:`, e.response ? e.response.data : e.message);
    }
}

export async function obtenerNombreIG(igId) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const r = await axios.get(`https://graph.facebook.com/v19.0/${igId}?fields=name,username&access_token=${token}`);
        return r.data.name || r.data.username || "Usuario IG";
    } catch { return "Usuario IG"; }
}

export async function notificarStaff(cliente, motivo, origen) {
    console.log(`[STAFF] ${cliente}: ${motivo}`);
}
