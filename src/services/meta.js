import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';

dotenv.config();

// --- MEMORIA ACTIVA (RAM) ---
const metricas = {
    leads_unicos: new Set(),
    mensajes: 0,
    intencion: 0, // Piden link o agenda
    llamadas: 0
};

const usuariosPausados = new Set(); // Lista negra temporal (Zara OFF)

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

        if (url) {
            await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
        }
    } catch (error) {
        console.error(`[Meta Error - ${platform}]`, error.response?.data?.error?.message || error.message);
    }
}

// --- GENERADOR DE REPORTES ---
function generarReporte() {
    const total = metricas.leads_unicos.size || 1; // Evitar división por cero
    const conv = metricas.intencion + metricas.llamadas;
    const tasa = ((conv / total) * 100).toFixed(1);

    return `📊 *REPORTE ZARA (En Vivo)* 📊\n\n` +
           `👥 Leads Únicos: ${metricas.leads_unicos.size}\n` +
           `💬 Mensajes Proc.: ${metricas.mensajes}\n` +
           `🎯 Oportunidades: ${conv}\n` +
           `   🔗 Piden Link: ${metricas.intencion}\n` +
           `   📞 Piden Llamada: ${metricas.llamadas}\n` +
           `📈 Tasa Conversión: ${tasa}%`;
}

// --- CEREBRO PRINCIPAL ---
export async function procesarMensaje(senderId, text, name, platform) {
    try {
        const lower = text.toLowerCase().trim();
        metricas.mensajes++;
        metricas.leads_unicos.add(senderId);

        // 1. COMANDOS DE ADMINISTRADOR (Prioridad Total)
        if (lower === 'zara reporte') {
            await sendMessage(senderId, generarReporte(), platform);
            return;
        }
        if (lower === 'zara off') {
            usuariosPausados.add(senderId);
            await sendMessage(senderId, "🛑 Zara pausada para ti. Escribe 'zara on' para reactivar.", platform);
            return;
        }
        if (lower === 'zara on') {
            usuariosPausados.delete(senderId);
            await sendMessage(senderId, "✅ Zara reactivada. ¡A vender! 🚀", platform);
            return;
        }

        // Si está pausado, ignoramos todo lo demás
        if (usuariosPausados.has(senderId)) return;

        // 2. DETECCIÓN DE INTENCIÓN (Analytics)
        if (lower.includes('agenda') || lower.includes('link') || lower.includes('precio')) {
            metricas.intencion++;
        }
        if (lower.includes('llamar') || lower.includes('telefono') || lower.includes('celular')) {
            metricas.llamadas++;
        }

        // 3. IA CONVERSACIONAL
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
