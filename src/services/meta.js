import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';

dotenv.config();

const metricas = { leads: new Set(), intencion: 0, llamadas: 0 };
const usuariosPausados = new Set();

// Función de envío base
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

export async function procesarMensaje(senderId, text, name, platform) {
    try {
        const lower = text.toLowerCase();
        metricas.leads.add(senderId);

        // --- COMANDOS ADMIN ---
        if (lower === 'zara reporte') {
            const msg = `📊 *REPORTE ZARA*\n👥 Leads: ${metricas.leads.size}\n🎯 Intención: ${metricas.intencion}\n📞 Fonos Capturados: ${metricas.llamadas}`;
            await sendMessage(senderId, msg, platform);
            return;
        }
        if (lower === 'zara off') { usuariosPausados.add(senderId); await sendMessage(senderId, "🛑 Pausada.", platform); return; }
        if (lower === 'zara on') { usuariosPausados.delete(senderId); await sendMessage(senderId, "✅ Activa.", platform); return; }
        if (usuariosPausados.has(senderId)) return;

        // --- DETECCIÓN DE TELÉFONO (CRÍTICO) ---
        const telefono = extraerTelefono(text);
        if (telefono) {
            metricas.llamadas++;
            // 1. Confirmar al cliente
            await sendMessage(senderId, "¡Perfecto! 📝 Guardé tu número. Una especialista te contactará en breve para asesorarte. ✨", platform);
            
            // 2. ALERTAS A TODO EL STAFF (Bucle)
            const alerta = `🚨 *LEAD CAPTURADO (${platform})* 🚨\n👤 ${name}\n📞 ${telefono}\n💬 Dijo: "${text}"`;
            
            console.log(`[ALERTA] Enviando aviso a ${NEGOCIO.staff_alertas.length} números.`);
            
            for (const staffNumber of NEGOCIO.staff_alertas) {
                // Siempre usamos 'whatsapp' para asegurar que la alerta llegue al celular del staff
                await sendMessage(staffNumber, alerta, 'whatsapp'); 
            }
            return;
        }

        if (lower.includes('precio') || lower.includes('agenda')) metricas.intencion++;

        // --- INYECCIÓN DE CONOCIMIENTO AL PROMPT ---
        const fullContext = `
        ${SYSTEM_PROMPT}

        [UBICACIÓN Y HORARIOS]
        Dirección: ${NEGOCIO.direccion}
        Horario: ${NEGOCIO.horario}
        Agenda: ${NEGOCIO.agenda_link}

        [CATÁLOGO COMPLETO DE SERVICIOS]
        ${PRODUCTOS}
        `;

        const messages = [
            { role: "system", content: fullContext },
            { role: "user", content: `[Cliente ${name}]: ${text}` }
        ];
        
        const reply = await generarRespuestaIA(messages);
        await sendMessage(senderId, reply, platform);

    } catch (e) {
        console.error('Error Zara:', e);
    }
}
