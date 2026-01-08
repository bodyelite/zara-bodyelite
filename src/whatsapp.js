import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.PAGE_ACCESS_TOKEN;
const phoneId = process.env.PHONE_NUMBER_ID;

export async function enviarMensaje(telefono, texto) {
    try {
        if (!token || !phoneId) return false;
        await axios.post(
            `https://graph.facebook.com/v21.0/${phoneId}/messages`,
            {
                messaging_product: "whatsapp",
                to: telefono,
                type: "text",
                text: { body: texto }
            },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        return true;
    } catch (e) { return false; }
}

export async function obtenerUrlMedia(mediaId) {
    try {
        const response = await axios.get(
            `https://graph.facebook.com/v21.0/${mediaId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.url;
    } catch (e) {
        console.error("Error obteniendo URL media:", e.message);
        return null;
    }
}
