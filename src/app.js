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
        const data = JSON.parse(raw);
        
        if (Array.isArray(data)) {
             data.forEach(d => {
                 const id = d.phone || d.id;
                 if(id) sesiones[id] = { name: d.name || "Cliente", history: d.history || [], tag: "ANTIGUO" };
             });
        } else {
            sesiones = data.sesiones || data || {};
            botStatus = data.botStatus || {};
        }
        Object.keys(sesiones).forEach(k => {
            if (!sesiones[k].lastInteraction) sesiones[k].lastInteraction = Date.now();
            if (sesiones[k].followUpSent === undefined) sesiones[k].followUpSent = false;
        });
        console.log(`✅ DISCO CARGADO: ${Object.keys(sesiones).length} Chats recuperados.`);
    }
} catch (e) { console.error("Error Carga:", e); }

function guardar() {
    try { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); } 
    catch (e) { console.error("Error Guardado"); }
}

async function notificarStaff(cliente, nombre, motivo) {
    const texto = `🚨 *ALERTA ZARA* 🚨\nCliente: ${nombre}\nTel: ${cliente}\nEstado: ${motivo}\nLink: https://wa.me/${cliente}`;
    for (const staff of NEGOCIO.staff_alertas) {
        await enviarMensaje(staff, texto);
    }
}

function calcularEtiqueta(historial, intencion) {
    if (!historial || historial.length === 0) return "NUEVO";
    if (intencion === "HOT") return "CALIENTE";
    if (historial.length > 0 && historial[historial.length-1].role === 'assistant') return "FRIO";
    if (historial.length > 2) return "TIBIO";
    return "TIBIO";
}

setInterval(() => {
    const now = Date.now();
    const currentHour = new Date().getHours(); 
    Object.keys(sesiones).forEach(async (phone) => {
        const u = sesiones[phone];
        if (!u.lastInteraction) return;
        
        const diffHours = (now - u.lastInteraction) / (1000 * 60 * 60);
        
        if (diffHours >= 2 && diffHours < 2.1 && !u.followUpSent) {
             if (currentHour < 24) { 
                 await enviarMensaje(phone, `Hola ${u.name.split(" ")[0]}... 🤔 Me quedé pensando si resolví todas tus dudas o te gustaría que te llame una especialista.`);
                 u.followUpSent = true;
                 u.history.push({ role: "assistant", content: "[AUTO] Seguimiento enviado", timestamp: now });
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

export async function procesarEvento(evento) {
    if (!evento) return;
    const value = evento.changes?.[0]?.value;
    const mensaje = value?.messages?.[0];
    if (!mensaje || mensaje.type !== 'text') return;

    const telefono = mensaje.from;
    const nombre = value.contacts?.[0]?.profile?.name || "Cliente";
    const texto = mensaje.text.body;

    if (texto.trim().toLowerCase() === '/reset') {
        delete sesiones[telefono];
        guardar();
        await enviarMensaje(telefono, "✅ Memoria reiniciada. Salúdame de nuevo.");
        return;
    }

    if (!sesiones[telefono]) {
        sesiones[telefono] = { name: nombre, history: [], tag: "NUEVO", followUpSent: false };
        await notificarStaff(telefono, nombre, "NUEVO INTERESADO 🔥");
    }
    
    if (nombre !== "Cliente") sesiones[telefono].name = nombre;
    if (!sesiones[telefono].history) sesiones[telefono].history = [];

    sesiones[telefono].followUpSent = false;
    sesiones[telefono].lastInteraction = Date.now();

    sesiones[telefono].history.push({ role: "user", content: texto, timestamp: Date.now() });
    
    sesiones[telefono].tag = calcularEtiqueta(sesiones[telefono].history, sesiones[telefono].tag === "CALIENTE" ? "HOT" : null);
    guardar();

    if (botStatus[telefono] !== false) {
        const historial = sesiones[telefono].history.map(m => ({ role: m.role, content: m.content }));
        let respuesta = await pensar(historial, sesiones[telefono].name);
        let intencion = null;

        if (respuesta.includes("||HOT||")) {
            respuesta = respuesta.replace("||HOT||", "").trim();
            intencion = "HOT";
            await notificarStaff(telefono, sesiones[telefono].name, "PIDIÓ CIERRE/AGENDA 🚀");
        }
        
        sesiones[telefono].history.push({ role: "assistant", content: respuesta, timestamp: Date.now() });
        sesiones[telefono].tag = calcularEtiqueta(sesiones[telefono].history, intencion);
        sesiones[telefono].lastInteraction = Date.now();
        guardar();
        await enviarMensaje(telefono, respuesta);
    }
}

export async function enviarMensajeManual(phone, text) {
    if (!sesiones[phone]) sesiones[phone] = { name: "Cliente", history: [], tag: "MANUAL" };
    if (!sesiones[phone].history) sesiones[phone].history = [];
    sesiones[phone].history.push({ role: "assistant", content: text, timestamp: Date.now() });
    guardar();
    await enviarMensaje(phone, text);
    return true;
}
