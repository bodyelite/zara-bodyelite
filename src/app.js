import fs from 'fs';
import path from 'path';
import { enviarMensaje, obtenerUrlMedia } from './whatsapp.js';
import { pensar, transcribirAudio, diagnosticar } from './brain.js';
import { NEGOCIO } from './config/business.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
let sesiones = {}; 
let botStatus = {}; 

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

try { 
    if (fs.existsSync(FILE)) {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); 
        sesiones = data.sesiones || {}; 
        botStatus = data.botStatus || {}; 
    }
} catch (e) { console.error("Error DB:", e); }

function guardar() { 
    try {
        fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); 
    } catch (e) { console.error("Error Guardar:", e); }
}

export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }

async function notificarStaff(texto) {
    if (!NEGOCIO.staff_alertas) return;
    for (const adminPhone of NEGOCIO.staff_alertas) { 
        await enviarMensaje(adminPhone, texto).catch(e => console.error("Error alerta:", e)); 
    }
}

export async function diagnosticarTodo() {
    const keys = Object.keys(sesiones);
    for (const p of keys) {
        if (sesiones[p].history && sesiones[p].history.length > 0) {
            sesiones[p].diagnostico = await diagnosticar(sesiones[p].history);
        }
    }
    guardar();
    return true;
}

export function updateTagManual(phone, newTag) {
    if (sesiones[phone]) {
        sesiones[phone].tag = newTag;
        guardar();
        return true;
    }
    return false;
}

export function agregarNota(phone, texto) {
    if (sesiones[phone]) {
        if (!sesiones[phone].notes) sesiones[phone].notes = [];
        sesiones[phone].notes.unshift({ date: Date.now(), text: texto });
        guardar();
        return true;
    }
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

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg) return;

    const p = msg.from; 
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    if (!sesiones[p]) { 
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" }; 
    }
    
    let contenido = "";
    if (msg.type === "text") contenido = msg.text.body;
    else if (msg.type === "audio" || msg.type === "voice") {
        const url = await obtenerUrlMedia(msg.audio ? msg.audio.id : msg.voice.id);
        contenido = url ? `[AUDIO]: ${await transcribirAudio(url)}` : "[AUDIO ERROR]";
    }

    if (contenido.toLowerCase().includes('/reset')) { 
        sesiones[p].history = []; 
        guardar(); 
        await enviarMensaje(p, "🔄 Reset."); 
        return; 
    }

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();

    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        await enviarMensaje(p, resp);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
        if (resp.includes('reservo.cl')) sesiones[p].tag = "HOT";
    }
    guardar();
}
