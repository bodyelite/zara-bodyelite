import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';

dotenv.config();

export async function sendMessage(to, text) {
    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: to,
                text: { body: text }
            },
            { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
        );
    } catch (error) {
        console.error('Meta Send Error:', error.response?.data || error.message);
    }
}

export async function procesarMensaje(senderId, text, name, systemPrompt, productos) {
    try {
        // Construcción básica de contexto para IA (Sin memoria persistente compleja por ahora para estabilidad)
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
        ];
        
        const reply = await generarRespuestaIA(messages);
        await sendMessage(senderId, reply);
    } catch (e) {
        console.error('Error procesando mensaje:', e);
    }
}
