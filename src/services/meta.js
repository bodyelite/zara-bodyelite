import axios from 'axios';
import dotenv from 'dotenv';
import { generarRespuestaIA } from './openai.js';
import { SYSTEM_PROMPT } from '../config/personalidad.js';
import { PRODUCTOS } from '../config/productos.js';
import { NEGOCIO } from '../config/negocio.js';

dotenv.config();

const metricas = { leads: new Set(), intencion: 0, llamadas: 0 };
const usuariosPausados = new Set();
// Memoria simple para recordar la campaña del usuario durante la sesión
const campañasActivas = {}; 

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

// Aceptamos el parámetro 'campana'
export async function procesarMensaje(senderId, text, name, platform, campana = null) {
    try {
        const lower = text.toLowerCase();
        metricas.leads.add(senderId);

        // Si llega una campaña nueva, la guardamos en memoria para este usuario
        if (campana) {
            campañasActivas[senderId] = campana;
            console.log(`[Zara] Guardando contexto de campaña para ${senderId}: ${campana}`);
        }

        // Recuperamos la campaña si existe en memoria
        const campañaUsuario = campañasActivas[senderId] || null;

        // --- COMANDOS ADMIN ---
        if (lower === 'zara reporte') {
            const msg = `📊 *REPORTE ZARA*\n👥 Leads: ${metricas.leads.size}\n🎯 Intención: ${metricas.intencion}\n📞 Fonos: ${metricas.llamadas}`;
            await sendMessage(senderId, msg, platform);
            return;
        }
        if (lower === 'zara off') { usuariosPausados.add(senderId); await sendMessage(senderId, "🛑 Pausada.", platform); return; }
        if (lower === 'zara on') { usuariosPausados.delete(senderId); await sendMessage(senderId, "✅ Activa.", platform); return; }
        if (usuariosPausados.has(senderId)) return;

        // --- DETECCIÓN DE TELÉFONO ---
        const telefono = extraerTelefono(text);
        if (telefono) {
            metricas.llamadas++;
            await sendMessage(senderId, "¡Perfecto! 📝 Guardé tu número. Una especialista te contactará en breve. ✨", platform);
            
            const origenLead = campañaUsuario ? `Campaña ADS: ${campañaUsuario}` : `Orgánico (${platform})`;
            const alerta = `🚨 *LEAD CAPTURADO* 🚨\n👤 ${name}\n📞 ${telefono}\n📢 Origen: ${origenLead}\n💬 Dijo: "${text}"`;
            
            for (const staff of NEGOCIO.staff_alertas) { await sendMessage(staff, alerta, 'whatsapp'); }
            return;
        }

        if (lower.includes('precio') || lower.includes('agenda')) metricas.intencion++;

        // --- CONTEXTO INTELIGENTE CON CAMPAÑA ---
        let contextoAdicional = "";
        if (campañaUsuario) {
            // Instrucción secreta para Zara: Priorizar la venta de lo que vio en el anuncio
            contextoAdicional = `\n[IMPORTANTE: ESTE CLIENTE VIENE DE UN ANUNCIO SOBRE: "${campañaUsuario}". ENFÓCATE EN VENDER ESO PRIMERO.]`;
        }

        const fullContext = `
        ${SYSTEM_PROMPT}
        ${contextoAdicional}

        [DATOS DEL NEGOCIO]
        Ubicación: ${NEGOCIO.direccion}
        Horario: ${NEGOCIO.horario}
        Agenda Web: ${NEGOCIO.agenda_link}

        [CATÁLOGO]
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
