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
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone];
    guardar(); return botStatus[phone];
}

export async function procesarReserva(phone, name, date) {
    console.log("⚙️ PROCESANDO RESERVA:", phone, name, date);
    
    phone = phone.replace(/\D/g, ''); 
    if (phone.length === 8) phone = "569" + phone;
    if (phone.length === 9 && phone.startsWith('9')) phone = "56" + phone;

    if (!sesiones[phone]) {
        sesiones[phone] = { name: name || "Paciente Web", history: [], phone: phone };
    }
    
    if (date) sesiones[phone].cita = date;

    sesiones[phone].tag = "AGENDADO";
    sesiones[phone].lastInteraction = Date.now();
    sesiones[phone].history.push({ 
        role: "assistant", 
        content: `📅 [SISTEMA] Cita Agendada vía Web.${date ? ' Fecha: '+date : ''}`, 
        timestamp: Date.now(), 
        source: 'manual' 
    });
    
    botStatus[phone] = false; 
    guardar();

    const nombreFinal = sesiones[phone].name;
    const aviso = `🚨 *NUEVA CITA AGENDADA* 🚨\n\n👤 Cliente: ${nombreFinal}\n📅 Fecha: ${date || 'No detectada'}\n📱 Tel: +${phone}\n✅ Origen: Web Reservo`;
    console.log("📨 Enviando alerta a staff...");
    
    for (const s of STAFF) {
        await enviarMensaje(s, aviso).catch(e => console.error("Error enviando alerta:", e));
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
    if (!evento || !evento.changes || !evento.changes[0]) return;
    const val = evento.changes[0].value; const msg = val?.messages?.[0]; if (!msg) return;
    const p = msg.from; const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    if (!sesiones[p]) {
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" };
        const avisoNuevo = `📢 *NUEVO LEAD* ✨\n👤 ${nombre}\n📱 +${p}`;
        for (const s of STAFF) await enviarMensaje(s, avisoNuevo);
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
