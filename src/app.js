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
    
    // FILTRAR: Solo nos importa lo que el CLIENTE escribió para las etiquetas
    const mensajesUser = historial.filter(m => m.role === 'user');
    const textoUser = mensajesUser.map(m => m.content.toLowerCase()).join(" ");
    const interaccionesUser = mensajesUser.length;
    const ultimoMsg = historial[historial.length - 1];

    // 1. HOT: Solo si el CLIENTE pidió activamente contacto (Jennifer ya no entrará aquí)
    const palabrasCierre = ["llamen", "llamada", "llame", "link", "agendar", "cita", "telefono", "celular", "contacto"];
    if (palabrasCierre.some(p => textoUser.includes(p))) return "HOT";
    
    // 2. ELIMINADO: 24h de silencio absoluto tras bot
    if (tiempoPasado >= 24 && ultimoMsg.role === 'assistant') return "ELIMINADO";
    
    // 3. INTERESADO: 2 o más respuestas reales del cliente (Caso Carlos)
    if (interaccionesUser >= 2) return "INTERESADO";
    
    // 4. FRIO: 1 respuesta y ya se le mandó el seguimiento automático
    if (interaccionesUser === 1 && ultimoMsg.content.includes("[AUTO]")) return "FRIO";
    
    return "NUEVO";
}

export async function ejecutarEstrategia(etiqueta) {
    for (const phone of Object.keys(sesiones).filter(p => sesiones[p].tag === etiqueta)) {
        const u = sesiones[phone];
        let prompt = `Eres Zara. Cliente ${u.name} es ${etiqueta}. `;
        if (etiqueta === "HOT") prompt += "Ya pidió link o llamada. Pregunta con preocupación si pudo agendar o si ya lo llamaron.";
        else prompt += "Genera un re-enganche corto y natural con emojis.";
        const resp = await pensar([{ role: "user", content: prompt }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [PRUEBA]: ${resp}`, timestamp: Date.now() });
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
