import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { transcribirAudio } from "./services/openai.js";
import { pensar } from "./brain.js"; 
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "./config/business.js";
import { transmitir } from "./utils/stream.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RENDER_DISK_PATH = "/opt/render/project/src/data/historial.json";
const LOCAL_PATH = path.join(__dirname, "data", "historial.json");
const DB_FILE = fs.existsSync("/opt/render/project/src/data") ? RENDER_DISK_PATH : LOCAL_PATH;
const DB_DIR = path.dirname(DB_FILE);
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let sesionesLocal = {};
try {
    if (fs.existsSync(DB_FILE)) sesionesLocal = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    else fs.writeFileSync(DB_FILE, JSON.stringify({}));
} catch (e) { sesionesLocal = {}; }

export const getSesiones = () => sesionesLocal;

function guardar() {
    try { fs.writeFileSync(DB_FILE, JSON.stringify(sesionesLocal, null, 2)); } catch (e) {}
}

const getFechaHora = () => new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export const metricas = { leads_wsp: new Set(), leads_ig: new Set() };
export const ultimasRespuestas = {}; 
export const estadosClientes = {}; 
export const usuariosPlataforma = {}; 

function getPhone(txt) {
  if (!txt) return null;
  const m = txt.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{8,9}\b/); 
  return m ? m[0].replace(/\D/g, '') : null;
}

setInterval(async () => {
    const now = Date.now();
    for (const [id, last] of Object.entries(ultimasRespuestas)) {
        if ((now - last > 7200000) && estadosClientes[id] === 'activo') { 
            try {
                let nom = "Hola";
                if (sesionesLocal[id] && sesionesLocal[id].length > 0) {
                    const m = sesionesLocal[id][0].content.match(/\[Cliente: (.*?)\]/);
                    if (m) nom = m[1];
                }
                
                const msj = `${nom}, me quedé pensando si había resuelto todas tus dudas... 🤔 ¿Prefieres que te llamemos?`;
                const ts = getFechaHora();

                await sendMessage(id, msj, usuariosPlataforma[id] || "whatsapp");
                estadosClientes[id] = 'recontactado';
                
                sesionesLocal[id].push({ role: "assistant", content: msj, timestamp: ts });
                guardar();
                
                transmitir({ 
                    tipo: "REACTIVACION", 
                    nombre: nom, 
                    telefono: id, 
                    timestamp: ts,
                    texto: msj 
                });
            } catch (e) {}
        }
    }
}, 60000);

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let id, text = "", name, audioId = null;

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      id = msg.from; 
      name = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
      if (msg.type === "text") text = msg.text.body;
      if (msg.type === "audio") audioId = msg.audio.id;
  } else return; 

  if (!sesionesLocal[id]) sesionesLocal[id] = [];
  
  const ts = getFechaHora();

  transmitir({ 
      tipo: "MENSAJE", 
      nombre: name, 
      telefono: id, 
      mensaje: text || "Audio", 
      timestamp: ts
  });

  const now = Date.now();
  if ((now - (ultimasRespuestas[id] || 0)) < 2000) return; 
  ultimasRespuestas[id] = now;
  usuariosPlataforma[id] = platform; 
  if (estadosClientes[id] !== 'agendado') estadosClientes[id] = 'activo';

  if (audioId) {
      const url = await getWhatsAppMediaUrl(audioId);
      if (url) {
          const path = await downloadFile(url, `audio_${id}.ogg`);
          text = await transcribirAudio(path); 
          fs.unlinkSync(path);
          transmitir({ tipo: "TRANSCRIPCION", texto: text, telefono: id });
      }
  }

  if (!text) return;
  const low = text.toLowerCase().trim();
  if (low.includes("link") || low.includes("agenda")) estadosClientes[id] = 'agendado';

  const ph = getPhone(text);
  if (ph) {
    estadosClientes[id] = 'agendado';
    const alerta = `🚨 NUEVO LEAD: ${name} - ${ph}`;
    for (const n of NEGOCIO.staff_alertas) { try { await sendMessage(n, alerta); } catch(e) {} }
    
    const msjFinal = "¡Anotado! 📝 Ya le pasé tu contacto a mis compañeras. Te llamarán muy pronto. ¡Gracias por confiar en Body Elite! ✨";
    await sendMessage(id, msjFinal, platform);
    
    const tsFinal = getFechaHora();
    sesionesLocal[id].push({ role: "assistant", content: msjFinal, timestamp: tsFinal });
    guardar();
    
    transmitir({ 
        tipo: "RESPUESTA_ZARA", 
        nombre: "Zara", 
        telefono: id,
        texto: msjFinal,
        timestamp: tsFinal
    });
    return;
  }

  sesionesLocal[id].push({ role: "user", content: `[Cliente: ${name}] ` + text, timestamp: ts });
  guardar(); 

  if (sesionesLocal[id].length > 16) sesionesLocal[id] = sesionesLocal[id].slice(-16);

  const respuesta = await pensar(sesionesLocal[id], name);
  const tsResp = getFechaHora();
  
  await sendMessage(id, respuesta, platform);
  
  transmitir({ 
      tipo: "RESPUESTA_ZARA", 
      nombre: "Zara", 
      telefono: id, 
      texto: respuesta,
      timestamp: tsResp
  });
  
  sesionesLocal[id].push({ role: "assistant", content: respuesta, timestamp: tsResp });
  guardar();
}

export async function procesarReserva(d) {
    if (d.status !== "CONFIRMADO") return;
    transmitir({ tipo: "RESERVA", nombre: d.clientName });
}
