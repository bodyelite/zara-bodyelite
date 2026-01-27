import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.PAGE_ACCESS_TOKEN;
const phoneId = process.env.PHONE_NUMBER_ID;

export async function enviarMensaje(telefono, texto) {
    try {
        if (!token || !phoneId) return { ok: false, error: "Faltan credenciales" };
        
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
        
        return { ok: true }; 

    } catch (e) { 
        console.error("Error WhatsApp:", e.message);
        return { ok: false, error: e.message }; 
    }
}
