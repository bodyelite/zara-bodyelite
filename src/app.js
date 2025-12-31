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

async function notificarStaff(cliente, nombre, motivo) {
    const texto = `🚨 *ALERTA ZARA* 🚨\nCliente: ${nombre}\nTel: ${cliente}\nMotivo: ${motivo}\nLink: https://wa.me/${cliente}`;
    for (const staff of NEGOCIO.staff_alertas) { await enviarMensaje(staff, texto); }
}

function calcularEtiqueta(historial) {
    if (!historial || historial.length === 0) return "NUEVO";
    
    const textoCompleto = historial.map(m => m.content.toLowerCase()).join(" ");
    const interaccionesUsuario = historial.filter(m => m.role === 'user').length;
    const ultimoMensaje = historial[historial.length - 1];

    // 1. CALIENTE: Pidió llamar o link (Prioridad máxima)
    const palabrasCalientes = ["llamen", "llamada", "link", "agendar", "cita", "telefono", "celular", "autoagendamiento"];
    if (palabrasCalientes.some(p => textoCompleto.includes(p))) return "CALIENTE";
    
    // 2. FRIO: Si el último mensaje es el seguimiento automático de 2 horas
    if (ultimoMensaje.content.includes("[AUTO] Seguimiento")) return "FRIO";
    
    // 3. INTERESADO: Si el usuario ha interactuado más de 2 veces
    if (interaccionesUsuario > 2) return "INTERESADO";
    
    // 4. NUEVO: Por defecto al inicio o si Zara habló y el usuario aún no responde más de 2 veces
    return "NUEVO";
}

setInterval(() => {
    const now = Date.now();
    Object.keys(sesiones).forEach(async (phone) => {
        const u = sesiones[phone];
        if (!u.lastInteraction || u.followUpSent) return;
        const diffHours = (now - u.lastInteraction) / (1000 * 60 * 60);
        if (diffHours >= 2 && diffHours < 2.1) {
             await enviarMensaje(phone, `Hola ${u.name.split(" ")[0]}... 🤔 Me quedé pensando si te gustaría que te llame una especialista para resolver dudas.`);
             u.followUpSent = true;
             u.history.push({ role: "assistant", content: "[AUTO] Seguimiento", timestamp: now });
             u.tag = calcularEtiqueta(u.history);
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
    sesiones[phone].tag = calcularEtiqueta(sesiones[phone].history);
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
        await notificarStaff(telefono, nombre, "NUEVO LEAD 🔥");
    }
    
    sesiones[telefono].name = nombre;
    sesiones[telefono].lastInteraction = Date.now();
    sesiones[telefono].history.push({ role: "user", content: texto, timestamp: Date.now() });
    
    if (texto.toLowerCase().match(/llame|llamada|celular|telefono|contacten/)) {
        await notificarStaff(telefono, nombre, "PIDIÓ LLAMADA 📞");
    }

    if (botStatus[telefono] !== false) {
        const respuesta = await pensar(sesiones[telefono].history, sesiones[telefono].name);
        sesiones[telefono].history.push({ role: "assistant", content: respuesta, timestamp: Date.now() });
        sesiones[telefono].tag = calcularEtiqueta(sesiones[telefono].history);
        guardar();
        await enviarMensaje(telefono, respuesta);
    } else {
        sesiones[telefono].tag = calcularEtiqueta(sesiones[telefono].history);
        guardar();
    }
}
