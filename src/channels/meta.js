import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function enviarMensaje(to, text, platform) {
    const token = platform === 'whatsapp' ? process.env.WHATSAPP_TOKEN : process.env.PAGE_ACCESS_TOKEN;
    
    if (!token) return console.error(`NO TOKEN FOR ${platform}`);

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
        } else if (platform === 'instagram') {
            await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
                recipient: { id: to }, 
                message: { text: text }
            }, { headers });
        }
    } catch (e) {
        console.error(`ERROR ${platform}:`, e.response ? JSON.stringify(e.response.data) : e.message);
    }
}

export async function notificarStaff(cliente, motivo, origen) {
    console.log(`ALERTA: ${cliente} - ${motivo}`);
}

export async function obtenerNombreIG(igId) {
    try {
        const r = await axios.get(`https://graph.facebook.com/v21.0/${igId}?fields=name,username&access_token=${process.env.PAGE_ACCESS_TOKEN}`);
        return r.data.name || r.data.username || "Usuario IG";
    } catch { return "Usuario IG"; }
}
