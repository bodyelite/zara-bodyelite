import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
const STAFF = ["56983300262", "56955145504", "56937648536"]; 
let sesiones = {}; let botStatus = {}; 

// Cargar memoria al inicio
try { const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); sesiones = data.sesiones || {}; botStatus = data.botStatus || {}; } catch (e) {}
function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

// Getters para el Monitor
export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }

// Cambios manuales desde Monitor
export function updateTagManual(phone, newTag) {
    if (sesiones[phone]) { sesiones[phone].tag = newTag; guardar(); return true; }
    return false;
}

export function toggleBot(phone) {
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone];
    guardar(); return botStatus[phone];
}

// === LÓGICA CRÍTICA DE RESERVA ===
export async function procesarReserva(phoneRaw, name) {
    console.log("📨 RESERVA RECIBIDA:", phoneRaw, name);
    
    // 1. Limpieza Total
    let phone = phoneRaw.replace(/\D/g, ''); 

    // 2. Matemáticas de Match (Transformar a formato WhatsApp 569...)
    if (phone.length === 8) phone = "569" + phone;        // Ej: 37648536 -> 56937648536
    else if (phone.length === 9) phone = "56" + phone;    // Ej: 937648536 -> 56937648536
    
    console.log("📞 TELEFONO NORMALIZADO:", phone);

    // 3. Buscar Match
    let tipoCliente = "ANTIGUO";
    if (!sesiones[phone]) {
        sesiones[phone] = { name: name || "Paciente Web", history: [], phone: phone };
        tipoCliente = "NUEVO WEB";
    } else {
        if(name) sesiones[phone].name = name; // Actualizar nombre real
    }
    
    // 4. Actualizar Estado
    sesiones[phone].tag = "AGENDADO";
    sesiones[phone].lastInteraction = Date.now();
    sesiones[phone].history.push({ 
        role: "assistant", 
        content: `📅 [SISTEMA] Cita confirmada (${name}). Bot pausado.`, 
        timestamp: Date.now(), 
        source: 'manual' 
    });
    
    // 5. Apagar Bot (Para que no moleste)
    botStatus[phone] = false; 
    guardar();

    // 6. ¡GRITAR AL STAFF! (Esto faltaba)
    const aviso = `🚨 *CITA AGENDADA* (${tipoCliente})\n👤 ${sesiones[phone].name}\n📱 +${phone}\n📅 Origen: Web Reservo`;
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

// === LÓGICA DE WHATSAPP ===
export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; const msg = val?.messages?.[0]; if (!msg) return;
    const p = msg.from; const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    
    // 1. Detección de Cliente Nuevo
    if (!sesiones[p]) {
        sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" };
        
        // ¡GRITAR AL STAFF! (Esto faltaba)
        const avisoNuevo = `📢 *NUEVO LEAD WHATSAPP*\n👤 ${nombre}\n📱 +${p}`;
        for (const s of STAFF) await enviarMensaje(s, avisoNuevo);
        
        guardar();
    }
    
    let contenido = msg.text?.body || "";
    if (msg.type === 'image') contenido = `[FOTO] ${msg.image.caption || ''}`;

    // Comando Reset
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

    // Cerebro
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
