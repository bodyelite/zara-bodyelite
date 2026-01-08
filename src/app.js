import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
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

export function updateTagManual(phone, newTag) {
    if (sesiones[phone]) {
        sesiones[phone].tag = newTag;
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

// --- NUEVA LÓGICA DE NOTAS ---
export function agregarNota(phone, texto, isScheduled, dateStr) {
    if (sesiones[phone]) {
        if (!sesiones[phone].notes) sesiones[phone].notes = [];
        
        let noteObj = {
            date: Date.now(),
            text: texto,
            status: 'normal'
        };

        if (isScheduled && dateStr) {
            // Guardamos la fecha y hora exacta que viene del monitor (Formato: YYYY-MM-DDTHH:mm)
            noteObj.status = 'pending';
            noteObj.scheduleTime = dateStr; 
            
            // Mover lead a GESTIÓN FUTURA
            sesiones[phone].tag = 'GESTIÓN FUTURA';
        }

        sesiones[phone].notes.unshift(noteObj);
        guardar();
        return true;
    }
    return false;
}

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: 'manual' });
    sesiones[p].lastInteraction = Date.now();
    guardar(); 
    await enviarMensaje(p, t);
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

export async function ejecutarEstrategia(phone, tipo) {
    const u = sesiones[phone];
    if (!u) return false;
    
    let prompt = "";
    if (tipo === 'SALUDO') prompt = "Saluda casualmente para retomar la conversación.";
    if (tipo === 'OFERTA') prompt = "Ofrece un incentivo o descuento para cerrar hoy.";
    if (tipo === 'CIERRE') prompt = "Pregunta directamente si quiere agendar para asegurar su cupo.";
    
    const resp = await pensar([{ role: "user", content: `(Instrucción interna: ${prompt})` }], u.name);
    await enviarMensajeManual(phone, resp);
    return true;
}

// --- CRONOS: MOTOR DE TIEMPO EXACTO ---
setInterval(async () => {
    const now = DateTime.now().setZone('America/Santiago');
    // Formato exacto del input datetime-local (YYYY-MM-DDTHH:mm)
    const nowStr = now.toFormat("yyyy-MM-dd'T'HH:mm");
    
    const phones = Object.keys(sesiones);
    for (const p of phones) {
        const u = sesiones[p];
        
        // 1. TAREAS PROGRAMADAS EXACTAS
        if (u.notes) {
            for (let note of u.notes) {
                // Compara strings: "2026-01-08T20:30" <= "2026-01-08T20:30"
                if (note.status === 'pending' && note.scheduleTime && note.scheduleTime <= nowStr) {
                    console.log(`⏰ EJECUTANDO TAREA EXACTA PARA ${p}: ${note.text}`);
                    
                    const prompt = `IMPORTANTE: Es hora de cumplir esta tarea programada: "${note.text}". Lee el historial y envía el mensaje correspondiente ahora de forma natural y empática.`;
                    const historyConContexto = [...u.history, { role: "system", content: prompt }];
                    
                    const resp = await pensar(historyConContexto, u.name);
                    await enviarMensajeManual(p, resp);
                    
                    note.status = 'executed';
                    note.executedAt = Date.now();
                    guardar();
                }
            }
        }

        // 2. LIMPIEZA AUTOMÁTICA (GESTIÓN FUTURA -> DESCARTADO)
        if (u.tag === 'GESTIÓN FUTURA') {
            const lastExecuted = u.notes?.find(n => n.status === 'executed');
            if (lastExecuted && lastExecuted.executedAt) {
                const hoursSince = (Date.now() - lastExecuted.executedAt) / (1000 * 60 * 60);
                if (hoursSince > 24) {
                    u.tag = 'DESCARTADO';
                    guardar();
                }
            }
        }
    }
}, 30000); // Revisar cada 30 segundos para mayor precisión

export async function procesarEvento(evento) {
    const val = evento.entry?.[0]?.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg) return;

    const p = msg.from; 
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    if (!sesiones[p]) { 
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() }; 
    }
    
    let contenido = "";
    if (msg.type === "text") contenido = msg.text.body;
    else if (msg.type === "audio") {
        const url = await obtenerUrlMedia(msg.audio.id);
        contenido = `[AUDIO]: ${await transcribirAudio(url)}`;
    }

    if (contenido.toLowerCase().includes('/reset')) { 
        sesiones[p].history = []; 
        guardar(); 
        await enviarMensaje(p, "🔄 Reset."); 
        return; 
    }

    if (sesiones[p].tag === 'GESTIÓN FUTURA') {
        sesiones[p].tag = 'INTERESADO';
    }

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();

    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        await enviarMensaje(p, resp);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        
        if (resp.includes('reservo.cl')) sesiones[p].tag = "HOT";
    }
    guardar();
}
