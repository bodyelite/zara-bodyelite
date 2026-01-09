import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import { enviarMensaje, obtenerUrlMedia } from './whatsapp.js';
import { pensar, transcribirAudio, diagnosticar } from './brain.js';
import { NEGOCIO } from './config/business.js';
import { FLUJO_MAESTRO } from './flow.js'; // <--- ESTO ES LO QUE FALTABA

// --- CONFIGURACIÓN STAFF ---
const STAFF_NUMBERS = ['56955145504', '56983300262', '56937648536'];

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

async function notificarStaff(texto) {
    for (const num of STAFF_NUMBERS) {
        try { await enviarMensaje(num, texto); } catch (e) { console.error(`Error alerta a ${num}`, e); }
    }
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

export function agregarNota(phone, texto, isScheduled, dateStr) {
    if (sesiones[phone]) {
        if (!sesiones[phone].notes) sesiones[phone].notes = [];
        let noteObj = { date: Date.now(), text: texto, status: 'normal' };
        if (isScheduled && dateStr) {
            noteObj.status = 'pending';
            noteObj.scheduleTime = dateStr; 
            sesiones[phone].tag = 'GESTIÓN FUTURA';
        }
        sesiones[phone].notes.unshift(noteObj);
        guardar();
        return true;
    }
    return false;
}

export async function enviarMensajeManual(p, t, source = 'manual') {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: source });
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
    await enviarMensajeManual(phone, resp, 'manual'); 
    return true;
}

// --- CRONOS ---
setInterval(async () => {
    const now = DateTime.now().setZone('America/Santiago');
    const nowStr = now.toFormat("yyyy-MM-dd'T'HH:mm");
    
    const phones = Object.keys(sesiones);
    for (const p of phones) {
        const u = sesiones[p];
        if (u.notes) {
            for (let note of u.notes) {
                if (note.status === 'pending' && note.scheduleTime && note.scheduleTime <= nowStr) {
                    console.log(`⏰ EJECUTANDO: ${note.text}`);
                    const prompt = `IMPORTANTE: Cumple esta tarea programada: "${note.text}". Lee el historial y envía el mensaje ahora.`;
                    const resp = await pensar([...u.history, { role: "system", content: prompt }], u.name);
                    await enviarMensajeManual(p, resp, 'scheduled');
                    note.status = 'executed';
                    note.executedAt = Date.now();
                    guardar();
                }
            }
        }
        if (u.tag === 'GESTIÓN FUTURA') {
            const lastExecuted = u.notes?.find(n => n.status === 'executed');
            if (lastExecuted && lastExecuted.executedAt) {
                const hoursSince = (Date.now() - lastExecuted.executedAt) / (1000 * 60 * 60);
                if (hoursSince > 24) { u.tag = 'DESCARTADO'; guardar(); }
            }
        }
    }
}, 30000);

// --- WEBHOOK ---
export async function procesarEvento(evento) {
    const val = evento.entry?.[0]?.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg) return;

    const p = msg.from; 
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    // 1. ALERTA NUEVO LEAD
    if (!sesiones[p]) { 
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO", lastInteraction: Date.now() }; 
        await notificarStaff(`🚨 NUEVO LEAD: ${nombre} (${p})`);
    }
    
    let contenido = "";
    if (msg.type === "text") contenido = msg.text.body;
    else if (msg.type === "audio") {
        const url = await obtenerUrlMedia(msg.audio.id);
        contenido = `[AUDIO]: ${await transcribirAudio(url)}`;
    }

    if (contenido.toLowerCase().includes('/reset')) { 
        sesiones[p].history = []; guardar(); await enviarMensaje(p, "🔄 Reset."); return; 
    }

    // 2. ALERTA STAFF
    const lowerContent = contenido.toLowerCase();
    if (lowerContent.includes('llámame') || lowerContent.includes('llámenme') || lowerContent.includes('llamenme') || 
       (lowerContent.includes('si') && sesiones[p].history.length > 0 && sesiones[p].history[sesiones[p].history.length-1].content.includes('llamar'))) {
        await notificarStaff(`📞 PIDEN LLAMADA: ${sesiones[p].name} (${p}) dijo: "${contenido}"`);
    }

    if (sesiones[p].tag === 'GESTIÓN FUTURA') { sesiones[p].tag = 'INTERESADO'; }

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();

    if (botStatus[p] !== false) {
        // --- INYECCIÓN DEL CEREBRO ---
        // Aquí fusionamos el GUION (Flow) + HORARIOS + RESTRICCIONES
        const sistemaOperativo = {
            role: "system",
            content: `
            ${FLUJO_MAESTRO}
            
            ⚠️ REGLAS CRÍTICAS DE EJECUCIÓN:
            1. SIGUE EL FLUJO AL PIE DE LA LETRA. Si el flujo dice "No dar precio", NO DES PRECIO.
            2. TUS RESPUESTAS SON CORTAS. Máximo 2-3 líneas.
            3. HORARIOS: Lunes, Miércoles, Viernes hasta 18:30. Martes/Jueves hasta 17:00. Sábado hasta 13:00 (ESTRICTO). Domingo CERRADO.
            4. Si te preguntan por un tratamiento, NO uses tu conocimiento general. Usa el PASO 1 del flujo.
            `
        };
        
        // Enviamos el historial, pero ponemos el SISTEMA AL FINAL para que sea la última orden que recibe
        const resp = await pensar([...sesiones[p].history, sistemaOperativo], sesiones[p].name);
        
        await enviarMensaje(p, resp);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        
        if (resp.includes('reservo.cl')) {
            sesiones[p].tag = "HOT";
            await notificarStaff(`📅 ZARA AGENDA ENVIADA A: ${sesiones[p].name} (${p})`);
        }
    }
    guardar();
}
