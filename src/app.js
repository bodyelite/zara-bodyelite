import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon'; 
import { enviarMensaje, obtenerUrlMedia } from './whatsapp.js';
import { pensar, transcribirAudio, diagnosticar } from './brain.js';
import { obtenerCitasHoy } from './google_calendar.js'; 
import { NEGOCIO } from './config/business.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
let sesiones = {}; let botStatus = {}; let recordatoriosEnviadosHoy = false;

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

try { 
    if (fs.existsSync(FILE)) {
        const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); 
        sesiones = data.sesiones || {}; 
        botStatus = data.botStatus || {}; 
    }
} catch (e) { console.log("Error DB:", e); }

function guardar() { 
    try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } catch(e){} 
}

export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }
export function toggleBot(phone) { botStatus[phone] = !botStatus[phone]; guardar(); return botStatus[phone]; }
export function updateTagManual(phone, newTag) { if (sesiones[phone]) { sesiones[phone].tag = newTag; guardar(); return true; } return false; }
export function agregarNota(phone, texto) { if (sesiones[phone]) { if (!sesiones[phone].notes) sesiones[phone].notes = []; sesiones[phone].notes.unshift({ date: Date.now(), text: texto }); guardar(); return true; } return false; }

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: 'manual' });
    sesiones[p].lastInteraction = Date.now();
    guardar();
    await enviarMensaje(p, t);
}

export async function procesarEvento(evento) {
    // RUTA CORRECTA PARA META WEBHOOK
    const entry = evento.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    if (!value?.messages) return;

    const message = value.messages[0];
    const p = message.from;
    const nombre = value.contacts?.[0]?.profile?.name || "Cliente";

    if (!sesiones[p]) { sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() }; }

    let contenido = "";
    if (message.type === "text") {
        contenido = message.text.body;
    } else if (message.type === "audio") {
        const url = await obtenerUrlMedia(message.audio.id);
        contenido = `[AUDIO]: ${await transcribirAudio(url)}`;
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

setInterval(async () => {
    const now = DateTime.now().setZone('America/Santiago');
    if (now.hour === 9 && now.minute === 0 && !recordatoriosEnviadosHoy) {
        const citas = await obtenerCitasHoy();
        for (const c of citas) {
            await enviarMensaje(c.telefono, `Hola ${c.nombre.split(' ')[0]}! Recordatorio de cita hoy a las ${c.hora}. ✨`);
        }
        recordatoriosEnviadosHoy = true;
    }
    if (now.hour === 10) recordatoriosEnviadosHoy = false;
}, 60000);
