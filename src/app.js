import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
// TUS NÚMEROS DEL STAFF PARA AVISOS
const STAFF = ["56983300262", "56955145504", "56937648536"]; 
let sesiones = {}; let botStatus = {}; 

try { const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); sesiones = data.sesiones || {}; botStatus = data.botStatus || {}; } catch (e) {}
function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }

export function updateTagManual(phone, newTag) {
    if (sesiones[phone]) { sesiones[phone].tag = newTag; guardar(); return true; }
    return false;
}

export function toggleBot(phone) {
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone];
    guardar(); return botStatus[phone];
}

// === LÓGICA DE RESERVA MEJORADA ===
export async function procesarReserva(phone, name) {
    // Normalizar teléfono (quitar + y espacios)
    phone = phone.replace(/\D/g, '');
    if (!phone.startsWith("56")) phone = "56" + phone;

    // Crear sesión si no existe
    if (!sesiones[phone]) sesiones[phone] = { name: name || "Paciente Reservo", history: [], phone: phone };
    
    // 1. CAMBIAR ESTADO
    sesiones[phone].tag = "AGENDADO";
    sesiones[phone].lastInteraction = Date.now();
    
    // 2. LOG INTERNO
    sesiones[phone].history.push({ 
        role: "assistant", 
        content: "📅 [SISTEMA] Cita confirmada en Reservo.", 
        timestamp: Date.now(), 
        source: 'manual' 
    });
    
    // 3. APAGAR BOT (Para que no interfiera si le hablan por la cita)
    botStatus[phone] = false; 
    guardar();

    // 4. AVISAR AL STAFF (Esto faltaba)
    const aviso = `🚨 *NUEVA CITA AGENDADA* 🚨\n\nCliente: ${name}\nTel: +${phone}\n\nRevisar agenda.`;
    console.log("Enviando aviso a staff...", STAFF);
    for (const s of STAFF) {
        await enviarMensaje(s, aviso);
    }

    return true;
}

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    botStatus[p] = false;
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: 'manual' });
    sesiones[p].lastInteraction = Date.now();
    guardar(); await enviarMensaje(p, t);
}

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; const msg = val?.messages?.[0]; if (!msg) return;
    const p = msg.from; const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    if (!sesiones[p]) sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" };
    
    let contenido = msg.text?.body || "";
    if (msg.type === 'image') contenido = `[FOTO] ${msg.image.caption || ''}`;

    sesiones[p].history.push({ role: "user", content: contenido, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();

    if (botStatus[p] !== false) {
        const promptSystem = { role: "system", content: `Eres Zara. Cliente: ${sesiones[p].name}.` };
        const resp = await pensar([promptSystem, ...sesiones[p].history], sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now(), source: 'bot' });
        await enviarMensaje(p, resp);
    }
    guardar();
}

export async function ejecutarEstrategia(tag) {
    for (const p of Object.keys(sesiones).filter(k => sesiones[k].tag === tag)) {
        const u = sesiones[p];
        const resp = await pensar([{ role: "user", content: `Re-engancha a ${u.name}` }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now(), source: 'bot' });
        guardar(); await enviarMensaje(p, resp);
    }
}
