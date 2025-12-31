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
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    if (files.length > 0) {
        const target = files.includes('sesiones.json') ? 'sesiones.json' : files[0];
        const raw = fs.readFileSync(path.join(DATA_DIR, target), 'utf8');
        try {
            const data = JSON.parse(raw);
            sesiones = data.sesiones || {};
            botStatus = data.botStatus || {};
        } catch (e) { console.error("Error parseando JSON"); }
    }
} catch (e) { console.error("Error Disco:", e); }

function guardar() {
    try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } 
    catch (e) { console.error("Error Save"); }
}

async function notificarStaff(cliente, nombre, motivo) {
    const texto = `🚨 *ALERTA ZARA* 🚨\nCliente: ${nombre}\nTel: ${cliente}\nMotivo: ${motivo}\nLink: https://wa.me/${cliente}`;
    console.log(`Notificando staff: ${motivo}`);
    for (const staff of NEGOCIO.staff_alertas) {
        await enviarMensaje(staff, texto);
    }
}

setInterval(() => {
    const now = Date.now();
    const currentHour = new Date().getHours(); 
    Object.keys(sesiones).forEach(async (phone) => {
        const u = sesiones[phone];
        if (!u.lastInteraction || u.followUpSent) return;
        
        const diffHours = (now - u.lastInteraction) / (1000 * 60 * 60);
        if (diffHours >= 2 && diffHours < 2.1) {
             if (currentHour >= 9 && currentHour < 21) { 
                 await enviarMensaje(phone, `Hola ${u.name.split(" ")[0]}... 🤔 Me quedé pensando si te gustaría que te llame una especialista para resolver dudas.`);
                 u.followUpSent = true;
                 u.history.push({ role: "assistant", content: "[AUTO] Seguimiento", timestamp: now });
                 guardar();
             }
        }
    });
}, 60000);

export function getSesiones() { return sesiones; }
export function toggleBot(phone) {
    if (botStatus[phone] === undefined) botStatus[phone] = true;
    botStatus[phone] = !botStatus[phone];
    guardar();
    return botStatus[phone];
}

export async function enviarMensajeManual(phone, text) {
    if (!sesiones[phone]) sesiones[phone] = { name: "Cliente", history: [], tag: "MANUAL" };
    sesiones[phone].history.push({ role: "assistant", content: text, timestamp: Date.now() });
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
    const textoLower = texto.toLowerCase();

    if (textoLower === '/reset') {
        delete sesiones[telefono];
        guardar();
        await enviarMensaje(telefono, "✅ Reset completado.");
        return;
    }

    if (!sesiones[telefono]) {
        sesiones[telefono] = { name: nombre, history: [], tag: "NUEVO", followUpSent: false };
        await notificarStaff(telefono, nombre, "NUEVO LEAD 🔥");
    }
    
    if (nombre !== "Cliente") sesiones[telefono].name = nombre;
    sesiones[telefono].lastInteraction = Date.now();
    sesiones[telefono].history.push({ role: "user", content: texto, timestamp: Date.now() });
    
    // DETECTOR DE LLAMADAS (Actualizado para detectar "llamen")
    if (textoLower.includes("llame") || textoLower.includes("llamada") || textoLower.includes("celular") || textoLower.includes("telefono") || textoLower.includes("contacten")) {
        await notificarStaff(telefono, nombre, "PIDIÓ LLAMADA 📞");
        sesiones[telefono].tag = "CALIENTE";
    }

    guardar();

    if (botStatus[telefono] !== false) {
        const historial = sesiones[telefono].history.map(m => ({ role: m.role, content: m.content }));
        const respuesta = await pensar(historial, sesiones[telefono].name);
        
        sesiones[telefono].history.push({ role: "assistant", content: respuesta, timestamp: Date.now() });
        sesiones[telefono].lastInteraction = Date.now();
        guardar();
        await enviarMensaje(telefono, respuesta);
    }
}
