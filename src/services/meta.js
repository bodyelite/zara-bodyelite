import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { NEGOCIO } from '../config/negocio.js';

dotenv.config();

const metricas = { leads: new Set(), intencion: 0, llamadas: 0 };
const usuariosPausados = new Set();

// --- FUNCIÓN DE ENVÍO BLINDADA ---
export async function sendMessage(to, text, platform) {
    try {
        let url, data;
        const token = process.env.PAGE_ACCESS_TOKEN; // Variable corregida para Render

        if (platform === 'whatsapp') {
            url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
            data = { messaging_product: 'whatsapp', to: to, text: { body: text } };
        } else if (platform === 'instagram') {
            url = `https://graph.facebook.com/v18.0/me/messages`;
            data = { recipient: { id: to }, message: { text: text } };
        }

        if (url) await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });

    } catch (error) {
        console.error(`[Error Envío ${platform}]`, error.response?.data?.error?.message || error.message);
    }
}

// --- DETECTOR DE TELÉFONOS (Regex Chileno) ---
function extraerTelefono(texto) {
    const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{8}\b/);
    return match ? match[0].replace(/\D/g, '') : null;
}

// --- LOGICA PRINCIPAL ---
export async function procesarMensaje(senderId, text, name, platform) {
    try {
        const lower = text.toLowerCase();
        metricas.leads.add(senderId);

        // 1. COMANDOS ADMIN
        if (lower === 'zara reporte') {
            const msg = `📊 *REPORTE ZARA*\n👥 Leads: ${metricas.leads.size}\n🎯 Intención: ${metricas.intencion}\n📞 Llamadas: ${metricas.llamadas}`;
            await sendMessage(senderId, msg, platform);
            return;
        }
        if (lower === 'zara off') { usuariosPausados.add(senderId); await sendMessage(senderId, "🛑 Pausada.", platform); return; }
        if (lower === 'zara on') { usuariosPausados.delete(senderId); await sendMessage(senderId, "✅ Activa.", platform); return; }
        if (usuariosPausados.has(senderId)) return;

        // 2. DETECCIÓN DE TELÉFONO (CRÍTICO: AVISO A STAFF)
        const telefono = extraerTelefono(text);
        if (telefono) {
            metricas.llamadas++;
            console.log(`[ALERTA] Teléfono capturado: ${telefono}`);
            
            // Avisar al cliente
            await sendMessage(senderId, "¡Perfecto! 📝 Ya pasé tu número a las chicas. Te llamarán en breve para coordinar. ✨", platform);
            
            // ALERTA AL STAFF (Bucle a todos los números configurados)
            const alertaStaff = `🚨 *NUEVO LEAD CAPTURADO* 🚨\n\n👤 Nombre: ${name}\n📞 Teléfono: ${telefono}\n📱 Canal: ${platform}`;
            for (const adminNum of NEGOCIO.staff_alertas) {
                // Forzamos envío por WhatsApp al dueño, aunque el lead venga de IG
                await sendMessage(adminNum, alertaStaff, 'whatsapp'); 
            }
            return; // Cortamos aquí para que la IA no responda encima
        }

        // 3. IA CON MENTALIDAD DE VENTA
        if (lower.includes('precio') || lower.includes('agenda')) metricas.intencion++;
        
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `[Cliente ${name}]: ${text}` }
        ];
        
        const reply = await generarRespuestaIA(messages);
        await sendMessage(senderId, reply, platform);

    } catch (e) {
        console.error('Error Zara:', e);
    }
}
