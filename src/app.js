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

async function enviarAlertaStaff(u, tipo) {
    const alerta = `🚨 *ALERTA ZARA*\n\n*Cliente*: ${u.name}\n*Acción*: ${tipo}\n*Tel*: ${u.phone}`;
    for (const n of STAFF_NUMBERS) { try { await enviarMensaje(n, alerta); } catch (e) {} }
}

export function calcularEtiqueta(u) {
    const historial = u.history || []; 
    if (historial.length === 0) return "NUEVO";
    
    const ahora = Date.now();
    const tiempoPasado = (ahora - (u.lastInteraction || ahora)) / (1000 * 60 * 60);
    const msgsUser = historial.filter(m => m.role === 'user');
    const textoUser = msgsUser.map(m => m.content.toLowerCase()).join(" ");
    const ultimoMsg = historial[historial.length - 1];

    if (["llamen", "llamada", "link", "agendar"].some(p => textoUser.includes(p))) {
        if (u.tag !== "HOT") enviarAlertaStaff(u, "SOLICITÓ CONTACTO");
        return "HOT";
    }
    
    if (tiempoPasado >= 24 && ultimoMsg.content.includes("[AUTO]")) return "APAGADO";
    if (tiempoPasado >= 48) return "APAGADO";
    
    if (msgsUser.length >= 2) return "INTERESADO";
    if (msgsUser.length === 1 && ultimoMsg.content.includes("[AUTO]")) return "FRIO";
    
    return "NUEVO";
}

export async function ejecutarEstrategia(etiqueta) {
    for (const phone of Object.keys(sesiones).filter(p => sesiones[p].tag === etiqueta)) {
        const u = sesiones[phone];
        const resp = await pensar([{ role: "user", content: `Eres Zara. Cliente ${u.name} es ${etiqueta}. Re-engánchalo.` }], u.name);
        u.history.push({ role: "assistant", content: `🧪 [ESTRATEGIA]: ${resp}`, timestamp: Date.now() });
        u.tag = calcularEtiqueta(u); 
        u.lastInteraction = Date.now(); 
        guardar();
    }
}

// ESTA ES LA FUNCIÓN QUE FALTABA Y CAUSABA EL ERROR
export function toggleBot(p) { 
    botStatus[p] = botStatus[p] === undefined ? false : !botStatus[p]; 
    guardar(); 
    return botStatus[p]; 
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (p) => {
        const u = sesiones[p]; 
        if (!u.lastInteraction || u.followUpSent || ["APAGADO", "INTERESADO", "HOT"].includes(u.tag)) return;
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

export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now(); 
    sesiones[p].tag = calcularEtiqueta(sesiones[p]);
    guardar(); 
    await enviarMensaje(p, t);
}

export async function procesarEvento(evento) {
    const val = evento.changes?.[0]?.value; 
    const msg = val?.messages?.[0]; 
    if (!msg || msg.type !== 'text') return;
    const p = msg.from; 
    if (!sesiones[p]) sesiones[p] = { name: val.contacts?.[0]?.profile?.name || "Cliente", history: [], phone: p };
    sesiones[p].lastInteraction = Date.now();
    sesiones[p].history.push({ role: "user", content: msg.text.body, timestamp: Date.now() });
    
    if (botStatus[p] !== false) {
        const resp = await pensar(sesiones[p].history, sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: resp, timestamp: Date.now() });
        sesiones[p].tag = calcularEtiqueta(sesiones[p]); 
        guardar(); 
        await enviarMensaje(p, resp);
    } else {
        sesiones[p].tag = calcularEtiqueta(sesiones[p]);
        guardar();
    }
}
