import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';

const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
const STAFF = ["56983300262", "56955145504", "56937648536"];
let sesiones = {}; let botStatus = {}; 

try { const data = JSON.parse(fs.readFileSync(FILE, 'utf8')); sesiones = data.sesiones || {}; botStatus = data.botStatus || {}; } catch (e) {}
function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }

export function calcularEtiqueta(u) {
    const hist = u.history || []; if (hist.length === 0) return "NUEVO";
    const ahora = Date.now(); const tiempo = (ahora - (u.lastInteraction || ahora)) / (1000 * 60 * 60);
    const msgsU = hist.filter(m => m.role === 'user');
    const textoU = msgsU.map(m => m.content.toLowerCase()).join(" ");
    const ultimo = hist[hist.length - 1];

    if (["llamen", "llamada", "link", "agendar"].some(p => textoU.includes(p))) return "HOT";
    // Jennifer FIX: Si se le envió seguimiento y pasaron 24h -> APAGADO
    if (tiempo >= 24 && ultimo.content.includes("[AUTO]")) return "APAGADO";
    if (tiempo >= 48) return "APAGADO";
    if (msgsU.length >= 2) return "INTERESADO";
    if (msgsU.length === 1 && ultimo.content.includes("[AUTO]")) return "FRIO";
    return "NUEVO";
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

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (p) => {
        const u = sesiones[p]; if (!u.lastInteraction || u.followUpSent || ["APAGADO", "INTERESADO", "HOT"].includes(u.tag)) return;
        if ((now - u.lastInteraction) / (1000 * 60 * 60) >= 2) {
            const txt = `Hola ${u.name.split(" ")[0]}... 🌸 ¿Pudiste revisar lo que hablamos?`;
            await enviarMensaje(p, txt); u.followUpSent = true;
            u.history.push({ role: "assistant", content: "[AUTO] Seguimiento", timestamp: now });
            u.tag = calcularEtiqueta(u); guardar();
        }
    });
}, 60000);

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now(); sesiones[p].tag = calcularEtiqueta(sesiones[p]);
    guardar(); await enviarMensaje(p, t);
}

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; const msg = val?.messages?.[0]; if (!msg || msg.type !== 'text') return;
    const p = msg.from; if (!sesiones[p]) sesiones[p] = { name: val.contacts?.[0]?.profile?.name || "Cliente", history: [], phone: p };
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].history.push({ role: "user", content: msg.text.body, timestamp: Date.now() });
    const resp = await pensar(sesiones[p].history, sesiones[p].name);
    sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
    sesiones[p].tag = calcularEtiqueta(sesiones[p]); guardar(); await enviarMensaje(p, resp);
}
