import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';
import { guardarMensaje, obtenerChats } from '../utils/history.js';

dotenv.config();
const igCache = {};

export async function getInstagramUser(id) {
    if (igCache[id]) return igCache[id];
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const url = `https://graph.facebook.com/v18.0/${id}?fields=name&access_token=${token}`;
        const res = await axios.get(url);
        const name = res.data.name || "Instagram User";
        igCache[id] = name;
        return name;
    } catch (e) { return "Instagram User"; }
}

export async function sendMessage(to, text, platform) {
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        let url, data;
        if (platform === 'whatsapp') {
            url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
            data = { messaging_product: 'whatsapp', to: to, text: { body: text } };
        } else if (platform === 'instagram') {
            url = `https://graph.facebook.com/v18.0/me/messages`;
            data = { recipient: { id: to }, message: { text: text } };
        } 
        if (url) await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) { console.error(`[Error Meta ${platform}]`, error.message); }
}

export async function procesarMensaje(senderId, text, name, platform, campana = null) {
    console.log(`[CEREBRO] Procesando mensaje de ${name}...`);
    if (platform === 'instagram' && (name === 'Usuario IG' || !name)) name = await getInstagramUser(senderId);

    guardarMensaje(senderId, name, platform, 'user', text, campana);

    try {
        const chats = obtenerChats();
        const historialCompleto = chats[senderId] ? chats[senderId].mensajes : [];
        const historialReciente = historialCompleto.slice(-15).map(m => ({
            role: m.remite === 'zara' ? 'assistant' : 'user',
            content: m.texto
        }));

        let contextoSistema = `${SYSTEM_PROMPT}\n\n[INFO NEGOCIO]\n${JSON.stringify(NEGOCIO)}\n\n[PLANES]\n${PRODUCTOS}`;
        if (campana && campana !== 'Orgánico') contextoSistema += `\n[CAMPAÑA]: Cliente viene por "${campana}".`;

        const messages = [{ role: "system", content: contextoSistema }, ...historialReciente];
        const reply = await generarRespuestaIA(messages);
        
        if (platform !== 'web') await sendMessage(senderId, reply, platform);
        guardarMensaje(senderId, "Zara", platform, 'zara', reply, campana);
        return reply;
    } catch (e) {
        console.error('Error Zara:', e);
        return "Dame un segundo, estoy procesando tu solicitud...";
    }
}
