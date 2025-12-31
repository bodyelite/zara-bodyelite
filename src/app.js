import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
const STAFF = ["56983300262", "56955145504", "56937648536"];
let sesiones = {}; let botStatus = {}; 

try { const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); sesiones = data.sesiones || {}; botStatus = data.botStatus || {}; } catch (e) {}
function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

async function notificarStaff(u, motivo) {
    const txt = `🚨 *ZARA ALERTA*\n\n*Cliente*: ${u.name}\n*Motivo*: ${motivo}\n*Wsp*: wa.me/${u.phone}`;
    for (const n of STAFF) { try { await enviarMensaje(n, txt); } catch (e) {} }
}

export function calcularEtiqueta(u) {
    const hist = u.history || []; if (hist.length === 0) return "NUEVO";
    const ahora = Date.now(); const tiempo = (ahora - (u.lastInteraction || ahora)) / (1000 * 60 * 60);
    const msgsU = hist.filter(m => m.role === 'user');
    const textoU = msgsU.map(m => m.content.toLowerCase()).join(" ");
    const ultimo = hist[hist.length - 1];
    if (["llamen", "llamada", "link", "agendar"].some(p => textoU.includes(p))) return "HOT";
    if (tiempo >= 24 && ultimo.content.includes("[AUTO]")) return "APAGADO";
    if (msgsU.length >= 2) return "INTERESADO";
    return "NUEVO";
}

export function updateTagManual(phone, newTag) {
    if (sesiones[phone]) {
        sesiones[phone].tag = newTag;
        guardar();
        return true;
    }
    return false;
}

export async function ejecutarEstrategia(tag) {
    for (const p of Object.keys(sesiones).filter(k => sesiones[k].tag === tag)) {
        const u = sesiones[p];
        const resp = await pensar([{ role: "user", content: `Zara, el cliente ${u.name} es ${tag}. Re-engánchalo.` }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now() });
        u.tag = calcularEtiqueta(u); u.lastInteraction = Date.now(); guardar();
    }
}

export function toggleBot(p) { botStatus[p] = !botStatus[p]; guardar(); return botStatus[p]; }
export function getSesiones() { return sesiones; }

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; const msg = val?.messages?.[0]; if (!msg || msg.type !== 'text') return;
    const p = msg.from; const txt = msg.text.body;
    const nombre = val.contacts?.[0]?.profile?.name || "Cliente";
    if (txt.toLowerCase() === '/reset') { delete sesiones[p]; guardar(); await enviarMensaje(p, "🔄 Historial de Zara reiniciado."); return; }
    if (!sesiones[p]) { sesiones[p] = { name: nombre, history: [], phone: p, tag: "NUEVO" }; notificarStaff(sesiones[p], "NUEVO CLIENTE INGRESÓ 🌸"); }
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].history.push({ role: "user", content: txt, timestamp: Date.now() });
    if (botStatus[p] !== false) {
        const promptSystem = { role: "system", content: `Habla siempre usando el nombre: ${sesiones[p].name}.` };
        const resp = await pensar([promptSystem, ...sesiones[p].history], sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
        sesiones[p].tag = calcularEtiqueta(sesiones[p]);
        guardar(); await enviarMensaje(p, resp);
    } else { sesiones[p].tag = calcularEtiqueta(sesiones[p]); guardar(); }
}

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now(); guardar(); await enviarMensaje(p, t);
}
