import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';

dotenv.config();

const metricas = { leads: new Set(), intencion: 0, llamadas: 0 };
const usuariosPausados = new Set();
// Cache simple para no gastar peticiones a la API de Meta repetidamente
const userCache = {};

// --- MÓDULO QUERUBÍN: RECONOCIMIENTO DE USUARIOS ---
export async function getInstagramUser(senderId) {
    if (userCache[senderId]) return userCache[senderId]; // Retornar de memoria si ya lo conocemos

    try {
        const token = process.env.PAGE_ACCESS_TOKEN;
        const url = `https://graph.facebook.com/v18.0/${senderId}?fields=name,profile_pic&access_token=${token}`;
        const response = await axios.get(url);
        
        const nombre = response.data.name || "Amig@ de Instagram";
        userCache[senderId] = nombre; // Guardar en memoria
        console.log(`[Querubín] Identificado IG: ${nombre}`);
        return nombre;
    } catch (error) {
        console.error("[Querubín Error] No se pudo obtener nombre IG:", error.message);
        return "Usuario Instagram";
    }
}

// --- FUNCIÓN DE ENVÍO ---
export async function sendMessage(to, text, platform) {
    try {
        let url, data;
        const token = process.env.PAGE_ACCESS_TOKEN; 

        if (platform === 'whatsapp') {
            url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
            data = { messaging_product: 'whatsapp', to: to, text: { body: text } };
        } else if (platform === 'instagram') {
            url = `https://graph.facebook.com/v18.0/me/messages`;
            data = { recipient: { id: to }, message: { text: text } };
        }

        if (url) await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
        console.error(`[Error Meta ${platform}]`, error.response?.data?.error?.message || error.message);
    }
}

function extraerTelefono(texto) {
    const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{8}\b/);
    return match ? match[0].replace(/\D/g, '') : null;
}

export async function procesarMensaje(senderId, text, name, platform, campana = null) {
    try {
        const lower = text.toLowerCase();
        metricas.leads.add(senderId);

        // Comandos Admin
        if (lower === 'zara reporte') {
            const msg = `📊 *REPORTE ZARA*\n👥 Leads: ${metricas.leads.size}\n🎯 Intención: ${metricas.intencion}\n📞 Fonos: ${metricas.llamadas}`;
            await sendMessage(senderId, msg, platform);
            return;
        }
        if (lower === 'zara off') { usuariosPausados.add(senderId); await sendMessage(senderId, "🛑 Pausada.", platform); return; }
        if (lower === 'zara on') { usuariosPausados.delete(senderId); await sendMessage(senderId, "✅ Activa.", platform); return; }
        if (usuariosPausados.has(senderId)) return;

        // Detección Teléfono
        const telefono = extraerTelefono(text);
        if (telefono) {
            metricas.llamadas++;
            await sendMessage(senderId, "¡Genial! 📝 Tengo tu contacto. Te llamaremos a la brevedad. ✨", platform);
            
            const origen = campana ? `Campaña ADS: ${campana}` : platform;
            const alerta = `🚨 *LEAD CAPTURADO* 🚨\n👤 ${name}\n📞 ${telefono}\n📢 Origen: ${origen}\n💬 Dijo: "${text}"`;
            
            for (const staff of NEGOCIO.staff_alertas) { await sendMessage(staff, alerta, 'whatsapp'); }
            return;
        }

        if (lower.includes('precio') || lower.includes('agenda')) metricas.intencion++;

        // Contexto Campaña Ads
        let contextoAds = "";
        if (campana) contextoAds = `\n[NOTA: CLIENTE INTERESADO EN CAMPAÑA: "${campana}". PRIORIZA VENDER ESO.]`;

        const fullContext = `
        ${SYSTEM_PROMPT}
        ${contextoAds}

        [NEGOCIO]
        ${NEGOCIO.nombre} | ${NEGOCIO.direccion} | ${NEGOCIO.horario}
        Agenda: ${NEGOCIO.agenda_link}

        [CATÁLOGO]
        ${PRODUCTOS}
        `;

        const messages = [
            { role: "system", content: fullContext },
            { role: "user", content: `[Cliente: ${name}]: ${text}` }
        ];
        
        const reply = await generarRespuestaIA(messages);
        await sendMessage(senderId, reply, platform);

    } catch (e) {
        console.error('Error Zara:', e);
    }
}
