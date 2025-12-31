import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';
import { NEGOCIO } from './config/business.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'sesiones.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

let sesiones = {}; 
let botStatus = {}; 

try {
    const raw = fs.readFileSync(FILE, 'utf8');
    const data = JSON.parse(raw);
    sesiones = data.sesiones || {};
    botStatus = data.botStatus || {};
} catch (e) {}

function guardar() {
    try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } catch (e) {}
}

export function calcularEtiqueta(historial, lastInteraction) {
    if (!historial || historial.length === 0) return "NUEVO";
    
    const ahora = Date.now();
    const tiempoPasado = (ahora - lastInteraction) / (1000 * 60 * 60);
    const textoCompleto = historial.map(m => m.content.toLowerCase()).join(" ");
    const interaccionesUsuario = historial.filter(m => m.role === 'user').length;
    const ultimoMensaje = historial[historial.length - 1];

    // 1. ELIMINADO: 24h sin respuesta tras estrategia o seguimiento automático
    if (tiempoPasado >= 24 && ultimoMensaje.role === 'assistant' && 
       (ultimoMensaje.content.includes("[ESTRATEGIA]") || ultimoMensaje.content.includes("[AUTO]"))) {
        return "ELIMINADO";
    }

    // 2. HOT: Intención explícita de cierre o contacto
    const palabrasCalientes = ["llamen", "llamada", "link", "agendar", "cita", "telefono", "celular", "autoagendamiento"];
    if (palabrasCalientes.some(p => textoCompleto.includes(p))) return "HOT";
    
    // 3. INTERESADO: 2 o más interacciones del usuario (Caso Carlos corregido)
    if (interaccionesUsuario >= 2) return "INTERESADO";

    // 4. FRIO: Solo 1 interacción y ya se le envió seguimiento automático por falta de respuesta
    if (interaccionesUsuario === 1 && ultimoMensaje.content.includes("[AUTO] Seguimiento")) return "FRIO";
    
    // 5. NUEVO: Solo 1 interacción y aún estamos en el tiempo de espera inicial
    return "NUEVO";
}

export async function ejecutarEstrategia(etiqueta) {
    const clientes = Object.keys(sesiones).filter(p => sesiones[p].tag === etiqueta);
    for (const phone of clientes) {
        const u = sesiones[phone];
        const lastUserMsg = u.history.filter(m => m.role === 'user').pop()?.content || '';
        const lastZaraMsg = u.history.filter(m => m.role === 'assistant').pop()?.content || '';
        
        const promptEstrategia = `Eres Zara de Body Elite. Analiza la charla con ${u.name}. Él dijo: "${lastUserMsg}". Tú respondiste: "${lastZaraMsg}". Genera un mensaje corto para re-enganchar (Estado: ${etiqueta}).`;
        const respuesta = await pensar([{ role: "user", content: promptEstrategia }], u.name);
        
        u.history.push({ role: "assistant", content: `🧪 [PRUEBA ESTRATEGIA]: ${respuesta}`, timestamp: Date.now() });
        u.tag = calcularEtiqueta(u.history, u.lastInteraction);
        guardar();
    }
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (phone) => {
        const u = sesiones[phone];
        if (!u.lastInteraction || u.followUpSent || u.tag === "ELIMINADO" || u.tag === "INTERESADO") return;
        const diffHours = (now - u.lastInteraction) / (1000 * 60 * 60);
        if (diffHours >= 2 && diffHours < 2.1) {
             const nombre = u.name.split(" ")[0];
             await enviarMensaje(phone, `Hola ${nombre}... 🌸 ¿Pudiste revisar lo que hablamos?`);
             u.followUpSent = true;
             u.history.push({ role: "assistant", content: "[AUTO] Seguimiento", timestamp: now });
             u.tag = calcularEtiqueta(u.history, now);
             guardar();
        }
    });
}, 60000);

export function getSesiones() { return sesiones; }
export function toggleBot(phone) {
    botStatus[phone] = botStatus[phone] === undefined ? false : !botStatus[phone];
    guardar();
    return botStatus[phone];
}

export async function enviarMensajeManual(phone, text) {
    if (!sesiones[phone]) sesiones[phone] = { name: "Cliente", history: [], tag: "MANUAL" };
    sesiones[phone].history.push({ role: "assistant", content: text, timestamp: Date.now() });
    sesiones[phone].lastInteraction = Date.now();
    sesiones[phone].tag = calcularEtiqueta(sesiones[phone].history, sesiones[phone].lastInteraction);
    guardar();
    await enviarMensaje(phone, text);
    return true;
}

export async function procesarEvento(evento) {
    if (!evento) return;
    const value = evento.changes?.[0]?.value;
    const mensaje = value?.messages?.[0];
    if (!mensaje || mensaje.type !== 'text') return;
    const telefono = mensaje.from;
    const nombre = value.contacts?.[0]?.profile?.name || "Cliente";
    const texto = mensaje.text.body;

    if (!sesiones[telefono]) {
        sesiones[telefono] = { name: nombre, history: [], tag: "NUEVO", followUpSent: false };
    }
    
    sesiones[telefono].lastInteraction = Date.now();
    sesiones[telefono].history.push({ role: "user", content: texto, timestamp: Date.now() });
    
    if (botStatus[telefono] !== false) {
        const respuesta = await pensar(sesiones[telefono].history, sesiones[telefono].name);
        sesiones[telefono].history.push({ role: "assistant", content: respuesta, timestamp: Date.now() });
    }
    
    sesiones[telefono].tag = calcularEtiqueta(sesiones[telefono].history, sesiones[telefono].lastInteraction);
    guardar();
    
    if (botStatus[telefono] !== false) {
        await enviarMensaje(telefono, sesiones[telefono].history[sesiones[telefono].history.length - 1].content);
    }
}
