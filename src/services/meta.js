import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';

dotenv.config();

const metricas = { leads: new Set(), intencion: 0, llamadas: 0 };
const usuariosPausados = new Set();

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
        console.error(`[Error Meta ${platform}]`, error.message);
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
            const msg = `📊 *REPORTE ZARA*\n👥 Leads: ${metricas.leads.size}\n🎯 Intención: ${metricas.intencion}\n📞 Fono Capturado: ${metricas.llamadas}`;
            await sendMessage(senderId, msg, platform);
            return;
        }
        if (lower === 'zara off') { usuariosPausados.add(senderId); await sendMessage(senderId, "🛑 Pausada.", platform); return; }
        if (lower === 'zara on') { usuariosPausados.delete(senderId); await sendMessage(senderId, "✅ Activa.", platform); return; }
        if (usuariosPausados.has(senderId)) return;

        // --- DETECCIÓN DE TELÉFONO (Aviso a Staff) ---
        const telefono = extraerTelefono(text);
        if (telefono) {
            metricas.llamadas++;
            await sendMessage(senderId, "¡Perfecto! 📝 Guardé tu número. Una especialista te contactará en breve para asesorarte. ✨", platform);
            
            // ALERTA A TU WSP PERSONAL
            const alerta = `🚨 *LEAD CAPTURADO (${platform})* 🚨\n👤 ${name}\n📞 ${telefono}\n💬 Dijo: "${text}"`;
            for (const staff of NEGOCIO.staff_alertas) {
                // Enviamos siempre por WSP al dueño para asegurar lectura
                await sendMessage(staff, alerta, 'whatsapp'); 
            }
            return;
        }

        if (lower.includes('precio') || lower.includes('agenda')) metricas.intencion++;

        // --- CONSTRUCCIÓN DEL PROMPT CON CONOCIMIENTO ---
        // Aquí fusionamos la Personalidad + Datos del Negocio + Catálogo de Productos
        const fullContext = `
        ${SYSTEM_PROMPT}

        [DATOS DEL NEGOCIO]
        Ubicación: ${NEGOCIO.direccion}
        Horario: ${NEGOCIO.horario}
        Agenda Web: ${NEGOCIO.agenda_link}

        [CATÁLOGO DE SERVICIOS Y PRECIOS OFICIALES]
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
