import fs from 'fs';
import path from 'path';
import { enviarMensaje, obtenerUrlMedia } from './whatsapp.js';
import { pensar, transcribirAudio, diagnosticar } from './brain.js';
import { NEGOCIO } from './config/business.js';

// --- GESTIÓN DE ESTADO (PERSISTENCIA) ---
const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
let sesiones = {}; 
let botStatus = {}; 

// Asegurar que existe carpeta data
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Cargar memoria
try { 
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); 
    sesiones = data.sesiones || {}; 
    botStatus = data.botStatus || {}; 
} catch (e) {}

function guardar() { 
    fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); 
}

// --- EXPORTACIONES PARA EL MONITOR (SERVER.JS) ---
export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }

async function notificarStaff(texto) {
    if (!NEGOCIO.staff_alertas) return;
    for (const adminPhone of NEGOCIO.staff_alertas) { 
        await enviarMensaje(adminPhone, texto).catch(e => console.error("Error alerta:", e)); 
    }
}

// --- FUNCIONES CRM QUE FALTABAN (EL ERROR SE ARREGLA AQUÍ) ---
export async function diagnosticarTodo() {
    console.log("🩺 [CRM] Actualizando diagnósticos...");
    const keys = Object.keys(sesiones);
    for (const p of keys) {
        if (sesiones[p].history.length > 0) {
            const diag = await diagnosticar(sesiones[p].history);
            sesiones[p].diagnostico = diag;
        }
    }
    guardar();
    return true;
}

export function updateTagManual(phone, newTag) { 
export function agregarNota(phone, texto) { if (sesiones[phone]) { if (!sesiones[phone].notes) sesiones[phone].notes = []; sesiones[phone].notes.unshift({ date: Date.now(), text: texto }); return true; } return false; }    if (sesiones[phone]) { sesiones[phone].tag = newTag; guardar(); return true; } 
    return false; 
}

export function toggleBot(phone) { 
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone]; 
    guardar(); 
    return botStatus[phone]; 
}

export async function procesarReserva(phone, name, date) {
    phone = phone.replace(/\D/g, ''); 
    if (!sesiones[phone]) sesiones[phone] = { name: name || "Paciente Web", history: [], phone: phone };
    sesiones[phone].tag = "AGENDADO"; 
    botStatus[phone] = false; 
    guardar();
    await notificarStaff(`🚨 *NUEVA CITA AGENDADA* 🚨\n👤 ${name}\n📅 ${date || 'Ver Reservo'}\n📱 +${phone}`);
    return true;
}

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    botStatus[p] = false; 
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: 'manual' });
    guardar(); 
    await enviarMensaje(p, t);
}

export async function ejecutarEstrategia(tag) {
    for (const p of Object.keys(sesiones).filter(k => sesiones[k].tag === tag)) {
        const u = sesiones[p];
        const resp = await pensar([{ role: "user", content: `Re-engancha a ${u.name}` }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now(), source: 'bot' });
        guardar(); await enviarMensaje(p, resp);
    }
}

// --- LÓGICA PRINCIPAL DEL BOT ---
export async function procesarEvento(evento) {
    // Validación de estructura de mensaje de WhatsApp
    const val = evento.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg) return;

    const p = msg.from; 
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    // Inicializar sesión
    if (!sesiones[p]) { 
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" }; 
        await notificarStaff(`📢 *NUEVO LEAD* ✨\n👤 ${nombre}\n📱 +${p}`); 
    }
    
    // Procesar contenido (Texto/Audio)
    let contenido = "";
    if (msg.type === "text") contenido = msg.text.body;
    else if (msg.type === "audio" || msg.type === "voice") {
        const url = await obtenerUrlMedia(msg.audio ? msg.audio.id : msg.voice.id);
        contenido = url ? `[AUDIO TRANSCRITO]: "${await transcribirAudio(url) || '...'}"` : "[AUDIO - ERROR]";
    }
    if (!contenido) contenido = "[CONTENIDO DESCONOCIDO]";

    // Comando Reset
    if (contenido.trim().toLowerCase().includes('/reset')) { 
        if (sesiones[p]) delete sesiones[p]; 
        botStatus[p] = true; 
        guardar(); 
        await enviarMensaje(p, "🔄 Conversación reiniciada. ¡Hola de nuevo! 🌸"); 
        return; 
    }

    // Guardar mensaje usuario
    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();

    // Si el bot está encendido (true o undefined)
    if (botStatus[p] !== false) {
        // ZARA PIENSA (Aquí usa el brain.js con el Flujo Maestro)
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        
        // --- DETECCIÓN INTELIGENTE DE ALERTAS (CORREGIDO) ---
        const respLower = resp.toLowerCase();
        
        // 1. Link Reservo -> HOT
        if (resp.includes('reservo.cl')) { 
            sesiones[p].tag = "HOT"; 
            await notificarStaff(`🔥 *LEAD CALIENTE* (Link Enviado)\n👤 ${nombre}\n📱 +${p}`); 
        }
        // 2. Llamada -> INTERESADO (Detecta variaciones)
        else if (
            respLower.includes('llamaremos') || 
            respLower.includes('llamando') || 
            respLower.includes('coordinar') || 
            respLower.includes('especialista')
        ) { 
            sesiones[p].tag = "INTERESADO"; 
            await notificarStaff(`📞 *SOLICITUD DE LLAMADA*\n👤 ${nombre}\n📱 +${p}\n\n⚠️ *Llamar ahora*`); 
        }
        
        await enviarMensaje(p, resp);
    }
    guardar();
}
