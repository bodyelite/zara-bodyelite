import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function sendMessage(to, text, platform) {
    try {
        if (platform === 'whatsapp') {
            await axios.post(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
                messaging_product: "whatsapp", to: to, text: { body: text }
            }, { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } });
        } else if (platform === 'instagram') {
            await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
                recipient: { id: to }, message: { text: text }
            }, { headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` } });
        }
    } catch (e) { console.error(`Error enviando a ${platform}`, e); }
}

export async function getIgUserInfo(igId) {
    try {
        const r = await axios.get(`https://graph.facebook.com/v21.0/${igId}?fields=name,username&access_token=${process.env.PAGE_ACCESS_TOKEN}`);
        return r.data.name || r.data.username || "Amiga";
    } catch { return "Amiga"; }
}

export async function notifyStaff(cliente, mensaje, origen) {
    console.log(`ALERTA STAFF: ${cliente} desde ${origen}`);
}
