import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
const STAFF_NUMBERS = ["56983300262", "56955145504", "56937648536"];

let sesiones = {}; 
let botStatus = {}; 

try {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    sesiones = data.sesiones || {};
    botStatus = data.botStatus || {};
} catch (e) {}

function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

// FUNCIÓN DE ALERTA AUTOMÁTICA AL STAFF
async function enviarAlertaStaff(u, tipo) {
    const alerta = `🚨 *ZARA ALERTA DE CIERRE*\n\nEl cliente *${u.name}* (${u.phone}) acaba de pasar a estado *HOT*.\n\n👉 *ACCIÓN*: ${tipo}\n\nRevisar monitor para gestión inmediata. 🌸`;
    for (const number of STAFF_NUMBERS) {
        try {
            await enviarMensaje(number, alerta);
        } catch (err) {
            console.error(`Error enviando alerta a ${number}:`, err);
        }
    }
}

export function calcularEtiqueta(u) {
    const historial = u.history || [];
    if (historial.length === 0) return "NUEVO";
    
    const ahora = Date.now();
    const tiempoPasado = (ahora - (u.lastInteraction || ahora)) / (1000 * 60 * 60);
    
    const mensajesUser = historial.filter(m => m.role === 'user');
    const textoUser = mensajesUser.map(m => m.content.toLowerCase()).join(" ");
    const interaccionesUser = mensajesUser.length;
    const ultimoMsg = historial[historial.length - 1];

    // LÓGICA HOT + DISPARADOR DE ALERTA AL STAFF
    const pideLlamada = ["llamen", "llamada", "llame", "telefono", "celular"].some(p => textoUser.includes(p));
    const pideLink = ["link", "agendar", "cita", "agenda"].some(p => textoUser.includes(p));

    if (pideLlamada || pideLink) {
        if (u.tag !== "HOT") {
            enviarAlertaStaff(u, pideLlamada ? "SOLICITÓ LLAMADA 📞" : "SOLICITÓ LINK DE AGENDA 🔗");
        }
        return "HOT";
    }
    
    if (tiempoPasado >= 24 && ultimoMsg.role === 'assistant') return "ELIMINADO";
    if (interaccionesUser >= 2) return "INTERESADO";
    if (interaccionesUser === 1 && ultimoMsg.content.includes("[AUTO]")) return "FRIO";
    
    return "NUEVO";
}

export async function ejecutarEstrategia(etiqueta) {
    for (const phone of Object.keys(sesiones).filter(p => sesiones[p].tag === etiqueta)) {
        const u = sesiones[phone];
        let prompt = `Eres Zara de Body Elite. El cliente ${u.name} es ${etiqueta}. Pregunta si pudo agendar o si lo llamaron.`;
        const resp = await pensar([{ role: "user", content: prompt }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now() });
        u.tag = calcularEtiqueta(u);
        guardar();
    }
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (p) => {
        const u = sesiones[p];
        if (!u.lastInteraction || u.followUpSent || ["ELIMINADO", "INTERESADO", "HOT"].includes(u.tag)) return;
        if ((now - u.lastInteraction) / (1000 * 60 * 60) >= 2) {
            const txt = `Hola ${u.name.split(" ")[0]}... 🌸 ¿Pudiste revisar lo que hablamos?`;
            await enviarMensaje(p, txt);
            u.followUpSent = true;
            u.history.push({ role: "assistant", content: "[AUTO] Seguimiento", timestamp: now });
            u.tag = calcularEtiqueta(u);
            guardar();
        }
    });
}, 60000);

export function getSesiones() { return sesiones; }
export function toggleBot(p) { botStatus[p] = !botStatus[p]; guardar(); return botStatus[p]; }
export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].tag = calcularEtiqueta(sesiones[p]);
    guardar(); await enviarMensaje(p, t);
}

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value;
    const msg = val?.messages?.[0];
    if (!msg || msg.type !== 'text') return;
    const p = msg.from;
    const nombreContacto = val.contacts?.[0]?.profile?.name || "Cliente";

    if (!sesiones[p]) {
        sesiones[p] = { name: nombreContacto, history: [], phone: p, followUpSent: false };
    }
    
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].history.push({ role: "user", content: msg.text.body, timestamp: Date.now() });
    
    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
    }
    
    sesiones[p].tag = calcularEtiqueta(sesiones[p]);
    guardar();
    
    if (botStatus[p] !== false) {
        await enviarMensaje(p, sesiones[p].history.slice(-1)[0].content);
    }
}
