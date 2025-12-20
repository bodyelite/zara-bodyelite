import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';

dotenv.config();

export async function sendMessage(to, text, platform) {
    try {
        let url, data;
        const token = process.env.PAGE_ACCESS_TOKEN; // <--- CORREGIDO SEGÚN TU RENDER

        if (platform === 'whatsapp') {
            url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
            data = { messaging_product: 'whatsapp', to: to, text: { body: text } };
        } else if (platform === 'instagram') {
            url = `https://graph.facebook.com/v18.0/me/messages`;
            data = { recipient: { id: to }, message: { text: text } };
        }

        if (url) {
            await axios.post(url, data, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            console.log(`[${platform}] Respuesta enviada a ${to}`);
        }
    } catch (error) {
        console.error(`[Meta Error - ${platform}]`, error.response?.data?.error?.message || error.message);
    }
}

export async function procesarMensaje(senderId, text, name, platform) {
    try {
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `[${platform} - ${name}]: ${text}` }
        ];
        
        const reply = await generarRespuestaIA(messages);
        await sendMessage(senderId, reply, platform);
        
    } catch (e) {
        console.error('Error lógica Zara:', e);
    }
}
