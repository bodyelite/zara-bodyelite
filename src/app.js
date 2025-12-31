import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
let sesiones = {}; 
let botStatus = {}; 

try {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    sesiones = data.sesiones || {};
    botStatus = data.botStatus || {};
} catch (e) {}

function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

export function calcularEtiqueta(u) {
    const historial = u.history || [];
    if (historial.length === 0) return "NUEVO";
    const ahora = Date.now();
    const tiempoPasado = (ahora - (u.lastInteraction || ahora)) / (1000 * 60 * 60);
    const textoCompleto = historial.map(m => m.content.toLowerCase()).join(" ");
    const interaccionesUser = historial.filter(m => m.role === 'user').length;
    const ultimoMsg = historial[historial.length - 1];

    // REGLA DE ORO: Juan Carlos (HOT) si pide contacto
    if (["llamen", "llamada", "llame", "link", "agendar", "cita", "telefono", "celular"].some(p => textoCompleto.includes(p))) return "HOT";
    
    // ELIMINADO: 24h sin respuesta tras estrategia
    if (tiempoPasado >= 24 && ultimoMsg.role === 'assistant' && (ultimoMsg.content.includes("[ESTRATEGIA]") || ultimoMsg.content.includes("[AUTO]"))) return "ELIMINADO";
    
    // INTERESADO: Carlos (2 mensajes o más)
    if (interaccionesUser >= 2) return "INTERESADO";
    
    // FRIO: Patricia (1 mensaje + seguimiento enviado)
    if (interaccionesUser === 1 && ultimoMsg.content.includes("[AUTO] Seguimiento")) return "FRIO";
    
    return "NUEVO";
}

export async function ejecutarEstrategia(etiqueta) {
    const clientes = Object.keys(sesiones).filter(p => sesiones[p].tag === etiqueta);
    for (const phone of clientes) {
        const u = sesiones[phone];
        let prompt = `Eres Zara de Body Elite. El cliente ${u.name} está en estado ${etiqueta}. `;
        if (etiqueta === "HOT") prompt += "Ya pidió link o llamada. Genera un mensaje de preocupación preguntando si logró agendar o si ya lo contactaron mis compañeras.";
        else prompt += "Genera un re-enganche corto y natural con emojis.";
        
        const resp = await pensar([{ role: "user", content: prompt }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now() });
        u.tag = calcularEtiqueta(u);
        u.lastInteraction = Date.now();
        guardar();
    }
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (p) => {
        const u = sesiones[p];
        if (!u.lastInteraction || u.followUpSent || ["ELIMINADO", "INTERESADO", "HOT"].includes(u.tag)) return;
        if ((now - u.lastInteraction) / (1000 * 60 * 60) >= 2) {
            const txt = `Hola ${u.name.split(" ")[0]}... 🌸 ¿Pudiste revisar la información que te envié?`;
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
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [] };
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
    if (!sesiones[p]) sesiones[p] = { name: val.contacts?.[0]?.profile?.name || "Cliente", history: [], followUpSent: false };
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].history.push({ role: "user", content: msg.text.body, timestamp: Date.now() });
    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
    }
    sesiones[p].tag = calcularEtiqueta(sesiones[p]);
    guardar();
    if (botStatus[p] !== false) await enviarMensaje(p, sesiones[p].history.slice(-1)[0].content);
}
