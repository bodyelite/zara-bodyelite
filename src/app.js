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

// RECUPERADOR AUTOMÁTICO (EL "VISTO")
setInterval(async () => {
    const now = DateTime.now().setZone('America/Santiago');
    const hora = now.hour;
    
    // Solo opera de 9:00 a 19:00
    if (hora < 9 || hora >= 19) return;

    const keys = Object.keys(sesiones);
    for (const p of keys) {
        const u = sesiones[p];
        if (!u.history || u.history.length === 0) continue;

        const lastMsg = u.history[u.history.length - 1];
        const timeDiff = Date.now() - u.lastInteraction;
        const horasPasadas = timeDiff / (1000 * 60 * 60);

        if (lastMsg.role === 'assistant' && horasPasadas > 2 && horasPasadas < 24) {
            if (u.tag === 'INTERESADO' && !u.recoverySent) {
                const msg = `Hola ${u.name.split(' ')[0]}! 👋 Quedé atenta por si te surgió alguna duda. ¿Te gustaría que te llame brevemente?`;
                await enviarMensajeManual(p, msg);
                u.recoverySent = true;
                guardar();
            }
        }
    }
}, 600000); 

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
    if (msg.type === "text") {
        contenido = msg.text.body;
    } else if (msg.type === "audio") {
        const url = await obtenerUrlMedia(msg.audio.id);
        contenido = `[AUDIO]: ${await transcribirAudio(url)}`;
    }

    if (contenido.toLowerCase().includes('/reset')) { 
        sesiones[p].history = []; 
        guardar(); 
        await enviarMensaje(p, "🔄 Reset."); 
        return; 
    }

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].recoverySent = false; 

    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        await enviarMensaje(p, resp);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        
        if (resp.includes('reservo.cl')) sesiones[p].tag = "HOT";
    }
    guardar();
}
