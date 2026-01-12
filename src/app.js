import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import { enviarMensaje, obtenerUrlMedia } from './whatsapp.js';
import { pensar, transcribirAudio } from './brain.js'; 
import { FLUJO_MAESTRO } from './flow.js';

const STAFF_NUMBERS = ['56955145504', '56983300262', '56937648536'];
const FILE = path.join(process.cwd(), 'data', 'sesiones.json');

let sesiones = {}; 
let botStatus = {}; 

if (!fs.existsSync(path.join(process.cwd(), 'data'))) fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });

try { 
    if (fs.existsSync(FILE)) {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); 
        sesiones = data.sesiones || {}; 
        botStatus = data.botStatus || {}; 
    }
} catch (e) { console.error("Error DB:", e); }

function guardar() { try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } catch (e) { console.error(e); } }

async function notificarStaff(t) { for (const n of STAFF_NUMBERS) try { await enviarMensaje(n, t); } catch(e){} }

export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }
export async function diagnosticarTodo() { return true; }

export function updateTagManual(phone, tag) { 
    if(sesiones[phone]) { sesiones[phone].tag = tag; guardar(); return true; } 
    return false; 
}

export function toggleBot(phone) { 
    botStatus[phone] = !botStatus[phone]; 
    guardar(); 
    return botStatus[phone]; 
}

export function agregarNota(phone, text, isScheduled, dateStr) {
    if (!sesiones[phone]) return false;
    if (!sesiones[phone].notes) sesiones[phone].notes = [];
    
    let note = { date: Date.now(), text, status: 'normal' };
    if (isScheduled && dateStr) {
        note.status = 'pending';
        note.scheduleTime = dateStr;
        sesiones[phone].tag = 'GESTIÓN FUTURA'; 
    }
    sesiones[phone].notes.unshift(note);
    guardar();
    return true;
}

// --- ENVÍO MANUAL AGRESIVO (CORRIGE NOMBRES) ---
export async function enviarMensajeManual(p, t, source='manual', nombreOverride=null, tagOverride=null) {
    if(!sesiones[p]) {
        sesiones[p] = { 
            name: nombreOverride || "Cliente", 
            history: [], 
            phone: p, 
            tag: tagOverride || "NUEVO", 
            lastInteraction: Date.now() 
        };
    } else {
        // SOBRESCRIBE SI VIENE DATO NUEVO
        if (tagOverride) sesiones[p].tag = tagOverride;
        if (nombreOverride && nombreOverride.trim() !== "" && nombreOverride !== "Cliente") {
            sesiones[p].name = nombreOverride;
        }
    }

    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: source });
    sesiones[p].lastInteraction = Date.now();
    guardar();
    await enviarMensaje(p, t);
}

setInterval(async () => {
    const nowStr = DateTime.now().setZone('America/Santiago').toFormat("yyyy-MM-dd'T'HH:mm");
    for (const p of Object.keys(sesiones)) {
        const u = sesiones[p];
        if (u.notes) {
            for (let note of u.notes) {
                if (note.status === 'pending' && note.scheduleTime <= nowStr) {
                    const prompt = `IMPORTANTE: Cumple esta tarea: "${note.text}". Lee el historial.`;
                    const resp = await pensar([...u.history, { role: "system", content: prompt }], u.name);
                    await enviarMensajeManual(p, resp, 'scheduled');
                    note.status = 'executed';
                    guardar();
                }
            }
        }
    }
}, 40000);

export async function procesarEvento(evento) {
    const val = evento.entry?.[0]?.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg) return;

    const p = msg.from; 
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    if (!sesiones[p]) { 
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() }; 
        await notificarStaff(`🚨 NUEVO LEAD: ${nombre}`);
    }
    
    let contenido = "";
    if (msg.type === "text") contenido = msg.text.body;
    else if (msg.type === "audio") {
        const url = await obtenerUrlMedia(msg.audio.id);
        contenido = `[AUDIO]: ${await transcribirAudio(url)}`;
    }

    if (contenido.toLowerCase().includes('/reset')) { sesiones[p].history = []; guardar(); return; }

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    
    // --- CLASIFICACIÓN INTELIGENTE ---
    if (sesiones[p].tag === 'GESTIÓN FUTURA' || sesiones[p].tag === 'RECICLAJE') { 
        sesiones[p].tag = 'INTERESADO'; 
    }
    
    const mensajesUsuario = sesiones[p].history.filter(m => m.role === 'user').length;
    if (sesiones[p].tag === 'NUEVO' && mensajesUsuario >= 2) {
        sesiones[p].tag = 'INTERESADO';
    }

    sesiones[p].lastInteraction = Date.now();
    guardar();

    if (botStatus[p] !== false) {
        const sistema = { role: "system", content: `${FLUJO_MAESTRO}\n\nREGLA: Respuestas cortas.` };
        const resp = await pensar([...sesiones[p].history, sistema], sesiones[p].name);
        await enviarMensaje(p, resp);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        
        if (resp.includes('reservo.cl')) {
            sesiones[p].tag = "HOT";
            await notificarStaff(`📅 CITA AGENDADA: ${nombre}`);
        }
        guardar();
    }
}
