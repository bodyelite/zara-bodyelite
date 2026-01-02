import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
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
    // Lógica simple de interruptor
    if (botStatus[phone] === undefined) botStatus[phone] = false; // Si no existe, lo apagamos
    else botStatus[phone] = !botStatus[phone]; // Si existe, invertimos
    
    guardar(); 
    return botStatus[phone];
}

export async function procesarReserva(phone, name) {
    phone = phone.replace(/\D/g, ''); 
    
    // Normalización Chilena
    if (phone.length === 8) phone = "569" + phone;
    if (phone.length === 9 && phone.startsWith('9')) phone = "56" + phone;
    
    console.log("📞 RESERVA PROCESADA:", phone);

    if (sesiones[phone]) {
        sesiones[phone].tag = "AGENDADO";
        sesiones[phone].lastInteraction = Date.now();
        sesiones[phone].history.push({ role: "assistant", content: "📅 [SISTEMA] Cita confirmada. Bot pausado.", timestamp: Date.now(), source: 'manual' });
        botStatus[phone] = false; 
    } else {
        sesiones[phone] = { name: name || "Paciente Web", history: [], phone: phone, tag: "AGENDADO" };
        sesiones[phone].lastInteraction = Date.now();
    }
    guardar();

    const aviso = `🚨 *CITA AGENDADA* 📅\nCliente: ${sesiones[phone].name}\nTel: +${phone}`;
    for (const s of STAFF) await enviarMensaje(s, aviso);
    
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
    
    // === FIX 1: ALERTA DE NUEVO CLIENTE ===
    if (!sesiones[p]) {
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" };
        
        // Enviamos aviso al staff INMEDIATAMENTE
        const avisoNuevo = `📢 *NUEVO LEAD* ⚡\n${nombre}\n+${p}`;
        for (const s of STAFF) await enviarMensaje(s, avisoNuevo);
        
        guardar();
    }
    
    let contenido = msg.text?.body || "";
    if (msg.type === 'image') contenido = `[FOTO] ${msg.image.caption || ''}`;

    if (contenido.trim().toLowerCase() === '/reset') {
        sesiones[p].history = [];
        sesiones[p].tag = "NUEVO";
        botStatus[p] = true; 
        guardar();
        await enviarMensaje(p, "🤖 *Zara Reiniciada.*");
        return;
    }

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
