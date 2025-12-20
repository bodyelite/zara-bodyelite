import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';
import { guardarMensaje } from '../utils/history.js';

dotenv.config();

// Cache simple para nombres de IG
const igCache = {};

// --- FUNCIÓN EXPORTADA (La que faltaba) ---
export async function getInstagramUser(id) {
    if (igCache[id]) return igCache[id];
    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const url = `https://graph.facebook.com/v18.0/${id}?fields=name&access_token=${token}`;
        const res = await axios.get(url);
        const name = res.data.name || "Instagram User";
        igCache[id] = name;
        return name;
    } catch (e) { 
        console.error("[Querubín] No se pudo obtener nombre IG:", e.message);
        return "Instagram User"; 
    }
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
        // Web no requiere envío API aquí

        if (url) await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error(`[Error Meta ${platform}]`, error.message);
    }
}

function extraerTelefono(texto) {
    const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{8}\b/);
    return match ? match[0].replace(/\D/g, '') : null;
}

export async function procesarMensaje(senderId, text, name, platform, campana = null) {
    console.log(`[CEREBRO] Procesando mensaje de ${name} en ${platform}`);

    // 1. Resolver nombre IG si es necesario (Usando la función exportada)
    if (platform === 'instagram' && (name === 'Usuario IG' || !name)) {
        name = await getInstagramUser(senderId);
    }

    // 2. GUARDAR MENSAJE DEL USUARIO
    try {
        guardarMensaje(senderId, name, platform, 'user', text, campana);
    } catch (err) {
        console.error("[CEREBRO ERROR] Falló al guardar mensaje usuario:", err);
    }

    try {
        const lower = text.toLowerCase();
        
        // Comandos Admin
        if (lower === 'zara reporte') { 
            // Lógica de reporte simple
            await sendMessage(senderId, "📊 Reporte: Revisa el Monitor Web (/monitor)", platform);
            return;
        }

        // Detección Teléfono
        const telefono = extraerTelefono(text);
        if (telefono) {
            const alerta = `🚨 *LEAD DETECTADO* (${platform})\n👤 ${name}\n📞 ${telefono}\n📣 Campaña: ${campana || 'Orgánico'}`;
            for (const staff of NEGOCIO.staff_alertas) await sendMessage(staff, alerta, 'whatsapp');
            
            const resp = "¡Anotado! 📝 Una especialista te contactará a este número en breve.";
            await sendMessage(senderId, resp, platform);
            guardarMensaje(senderId, "Zara", platform, 'zara', resp, campana);
            return resp;
        }

        // Prompt IA
        let contexto = `${SYSTEM_PROMPT}\n[DATOS]\n${NEGOCIO.direccion}\n${NEGOCIO.horario}\n[CATALOGO]\n${PRODUCTOS}`;
        if (campana) contexto += `\n[IMPORTANTE: Cliente viene por anuncio de "${campana}". Prioridad.]`;

        const messages = [{ role: "system", content: contexto }, { role: "user", content: `[${name}]: ${text}` }];
        
        const reply = await generarRespuestaIA(messages);
        
        // Enviar respuesta
        if (platform !== 'web') await sendMessage(senderId, reply, platform);
        
        // 3. GUARDAR RESPUESTA DE ZARA
        guardarMensaje(senderId, "Zara", platform, 'zara', reply, campana);

        return reply;

    } catch (e) {
        console.error('Error Zara Lógica:', e);
        return "Lo siento, tuve un error interno.";
    }
}
