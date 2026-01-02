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
    // If undefined, initialize as ON (true), so toggling makes it OFF (false)
    // If false, toggle to true
    // If true, toggle to false
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone];
    guardar(); 
    return botStatus[phone];
}

export async function procesarReserva(phone, name) {
    // === RESERVO MATCH LOGIC ===
    // 1. Strip non-digits
    phone = phone.replace(/\D/g, ''); 
    
    // 2. Normalize to 569... format
    if (phone.length === 9 && (phone.startsWith('9') || phone.startsWith('8'))) {
        // Case: 912345678 -> 56912345678
        phone = "56" + phone;
    } else if (phone.length === 8) {
        // Case: 12345678 -> 56912345678
        phone = "569" + phone;
    } else if (phone.length === 11 && phone.startsWith('569')) {
        // Case: 56912345678 -> Keep as is
    }
    
    console.log("📞 TELEFONO RESERVA FINAL:", phone);

    // 3. Find or Create Session
    if (!sesiones[phone]) {
        sesiones[phone] = { name: name || "Paciente Web", history: [], phone: phone };
    } else {
        // Update name if it was just a placeholder
        if(sesiones[phone].name === "Cliente" && name) sesiones[phone].name = name;
    }
    
    // 4. Update Status
    sesiones[phone].tag = "AGENDADO";
    sesiones[phone].lastInteraction = Date.now();
    sesiones[phone].history.push({ 
        role: "assistant", 
        content: "📅 [SISTEMA] Cita confirmada vía Web.", 
        timestamp: Date.now(), 
        source: 'manual' 
    });
    
    // 5. Turn OFF bot for this user so humans can take over
    botStatus[phone] = false; 
    guardar();

    // 6. Alert Staff
    const aviso = `🚨 *CITA AGENDADA* 🚨\nCliente: ${sesiones[phone].name}\nTel: +${phone}`;
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
    
    if (!sesiones[p]) sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" };
    let contenido = msg.text?.body || "";
    if (msg.type === 'image') contenido = `[FOTO] ${msg.image.caption || ''}`;

    // === COMANDO RESET ===
    if (contenido.trim().toLowerCase() === '/reset') {
        sesiones[p].history = [];
        sesiones[p].tag = "NUEVO";
        botStatus[p] = true; 
        guardar();
        await enviarMensaje(p, "🤖 *Zara Reiniciada.*\nSoy Zara, tu asistente virtual. ¿En qué puedo ayudarte hoy?");
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
