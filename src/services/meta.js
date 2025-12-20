import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';

dotenv.config();

export async function sendMessage(to, text, platform) {
    try {
        let url, data;
        
        if (platform === 'whatsapp') {
            url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
            data = { messaging_product: 'whatsapp', to: to, text: { body: text } };
        } else if (platform === 'instagram') {
            // Nota: Para IG se usa 'me/messages' o el ID de la página, requiere token de página conectado a IG
            url = `https://graph.facebook.com/v18.0/me/messages`;
            data = { recipient: { id: to }, message: { text: text } };
        }

        if (url) {
            await axios.post(url, data, { 
                headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } 
            });
            console.log(`[${platform}] Respuesta enviada a ${to}`);
        }
    } catch (error) {
        // Si IG falla por permisos, solo lo registramos, no botamos la app
        console.error(`[Meta Error - ${platform}] No se pudo enviar mensaje:`, error.response?.data?.error?.message || error.message);
    }
}

export async function procesarMensaje(senderId, text, name, platform) {
    try {
        // Zara piensa y responde siempre
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `[${platform} - ${name}]: ${text}` }
        ];
        
        const reply = await generarRespuestaIA(messages);
        
        // Intentamos enviar la respuesta (si falla IG, quedará en logs)
        await sendMessage(senderId, reply, platform);
        
    } catch (e) {
        console.error('Error lógica Zara:', e);
    }
}
