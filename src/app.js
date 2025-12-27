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

const RENDER_DISK_PATH = "/opt/render/project/src/data";
const LOCAL_PATH = path.join(__dirname, "data");
const DB_DIR = fs.existsSync(RENDER_DISK_PATH) ? RENDER_DISK_PATH : LOCAL_PATH;

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const HISTORY_FILE = path.join(DB_DIR, "historial.json");
const STATUS_FILE = path.join(DB_DIR, "status.json");

let sesionesLocal = {};
try {
    if (fs.existsSync(HISTORY_FILE)) {
        sesionesLocal = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
    }
} catch (e) { sesionesLocal = {}; }

let botStatus = {};
try {
    if (fs.existsSync(STATUS_FILE)) {
        botStatus = JSON.parse(fs.readFileSync(STATUS_FILE, "utf8"));
    }
} catch (e) { botStatus = {}; }

export const getSesiones = () => sesionesLocal;
export const getStatus = () => botStatus;

function guardar() {
    try { fs.writeFileSync(HISTORY_FILE, JSON.stringify(sesionesLocal, null, 2)); } catch (e) {}
}

function guardarStatus() {
    try { fs.writeFileSync(STATUS_FILE, JSON.stringify(botStatus, null, 2)); } catch (e) {}
}

export function toggleBot(phone) {
    const current = botStatus[phone] !== false; 
    botStatus[phone] = !current;
    guardarStatus();
    return botStatus[phone];
}

const getFechaHora = () => new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export const metricas = { leads_wsp: new Set(), leads_ig: new Set() };
export const ultimasRespuestas = {}; 
export const estadosClientes = {}; 
export const usuariosPlataforma = {}; 

export async function enviarMensajeManual(phone, texto) {
    const ts = getFechaHora();
    try {
        await sendMessage(phone, texto, usuariosPlataforma[phone] || "whatsapp");
        if (!sesionesLocal[phone]) sesionesLocal[phone] = [];
        
        sesionesLocal[phone].push({ role: "assistant", content: texto, timestamp: ts, manual: true });
        guardar();
        
        transmitir({ 
            tipo: "RESPUESTA_ZARA", 
            nombre: "Humano", 
            telefono: phone, 
            texto: texto, 
            timestamp: ts 
        });
        return true;
    } catch (e) {
        return false;
    }
}

function getPhone(txt) {
  if (!txt) return null;
  const m = txt.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{8,9}\b/); 
  return m ? m[0].replace(/\D/g, '') : null;
}

// Función auxiliar para normalizar teléfonos (sacar el +)
function normalizarTelefono(p) {
    return p.replace(/\D/g, ''); 
}

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

  if (text && text.trim().toLowerCase() === "/reset") {
      delete sesionesLocal[id];
      delete estadosClientes[id];
      guardar();
      transmitir({ tipo: "MENSAJE", nombre: "SISTEMA", telefono: id, mensaje: "⚠️ MEMORIA BORRADA POR COMANDO /RESET", timestamp: getFechaHora() });
      await sendMessage(id, "✅ Memoria borrada. Eres un cliente nuevo. Escribe 'Hola' para probar la alerta.", platform);
      return;
  }

  if (!sesionesLocal[id]) {
      const alertaNuevo = `🔔 *NUEVO INTERESADO DETECTADO*\n👤 ${name}\n📱 Link: https://wa.me/${id}\n\nZara comenzará a atenderlo. 👀`;
      console.log(`[ALERTA] Nuevo cliente detectado: ${name}`);
      for (const staffPhone of NEGOCIO.staff_alertas) {
          try { await sendMessage(staffPhone, alertaNuevo); } catch(e) {}
      }
      sesionesLocal[id] = [];
  }

  const ts = getFechaHora();

  if (audioId) {
      try {
          const url = await getWhatsAppMediaUrl(audioId);
          if (url) {
              const localPath = await downloadFile(url, `audio_${id}_${Date.now()}.ogg`);
              const transcripcion = await transcribirAudio(localPath);
              if (transcripcion) text = transcripcion; 
              try { fs.unlinkSync(localPath); } catch(e){} 
          }
      } catch (e) { console.error("Error Audio:", e.message); }
  }

  if (!text) return; 

  const msgDisplay = audioId ? `🎤 (Audio): "${text}"` : text;

  transmitir({ tipo: "MENSAJE", nombre: name, telefono: id, mensaje: msgDisplay, timestamp: ts, linkFoto: `https://wa.me/${id}` });

  sesionesLocal[id].push({ role: "user", content: `[Cliente: ${name}] ${text}`, timestamp: ts });
  guardar();

  if (botStatus[id] === false) { ultimasRespuestas[id] = Date.now(); return; }

  const now = Date.now();
  if ((now - (ultimasRespuestas[id] || 0)) < 2000) return; 
  ultimasRespuestas[id] = now;
  usuariosPlataforma[id] = platform; 
  if (estadosClientes[id] !== 'agendado') estadosClientes[id] = 'activo';

  const low = text.toLowerCase().trim();
  if (low.includes("link") || low.includes("agenda")) estadosClientes[id] = 'agendado';

  const ph = getPhone(text);
  if (ph) {
    estadosClientes[id] = 'agendado';
    const alerta = `🚨 *LEAD CALIENTE (DEJÓ TELÉFONO)*\n👤 ${name}\n📞 ${ph}\nRevisar chat urgente!`;
    for (const n of NEGOCIO.staff_alertas) { try { await sendMessage(n, alerta); } catch(e) {} }
    
    const msjFinal = "¡Anotado! 📝 Ya le pasé tu contacto a mis compañeras. Te llamarán muy pronto. ¡Gracias por confiar en Body Elite! ✨";
    await sendMessage(id, msjFinal, platform);
    const tsFinal = getFechaHora();
    sesionesLocal[id].push({ role: "assistant", content: msjFinal, timestamp: tsFinal });
    guardar();
    transmitir({ tipo: "RESPUESTA_ZARA", nombre: "Zara", telefono: id, texto: msjFinal, timestamp: tsFinal });
    return;
  }

  if (sesionesLocal[id].length > 16) sesionesLocal[id] = sesionesLocal[id].slice(-16);

  const respuesta = await pensar(sesionesLocal[id], name);
  const tsResp = getFechaHora();
  
  await sendMessage(id, respuesta, platform);
  
  transmitir({ tipo: "RESPUESTA_ZARA", nombre: "Zara", telefono: id, texto: respuesta, timestamp: tsResp });
  
  sesionesLocal[id].push({ role: "assistant", content: respuesta, timestamp: tsResp });
  guardar();
}

export async function procesarReserva(d) {
    if (d.status !== "CONFIRMADO") return;

    const ts = getFechaHora();
    const phone = d.clientPhone ? normalizarTelefono(d.clientPhone) : null;

    // 1. Avisar al Monitor (Flash)
    transmitir({ tipo: "RESERVA", nombre: d.clientName });

    // 2. Avisar al Staff (WhatsApp)
    const alertaReserva = `💰 *NUEVA RESERVA CONFIRMADA*\n👤 ${d.clientName}\n📞 ${phone || "Sin número"}\n📅 ${d.date || "Fecha por confirmar"}\n\n¡A facturar! 🚀`;
    console.log("[ALERTA] Enviando aviso de reserva al staff...");
    for (const staffPhone of NEGOCIO.staff_alertas) {
        try { await sendMessage(staffPhone, alertaReserva); } catch(e) { console.error("Error enviando alerta staff:", e); }
    }

    // 3. INYECTAR EN EL CHAT (Persistencia)
    // Buscamos si tenemos chat con este teléfono (puede venir con 569 o sin él)
    // Intentamos match exacto o parcial
    let chatId = null;
    if (phone) {
        // Buscamos en las llaves de sesionesLocal
        const keys = Object.keys(sesionesLocal);
        chatId = keys.find(k => k.includes(phone) || phone.includes(k));
    }

    if (chatId) {
        const msgSistema = `✅ [SISTEMA] RESERVA CONFIRMADA en Reservo.cl (Fecha: ${d.date || "Hoy"})`;
        sesionesLocal[chatId].push({ 
            role: "assistant", // Lo ponemos como bot para que se vea a la derecha
            content: msgSistema, 
            timestamp: ts,
            system: true 
        });
        estadosClientes[chatId] = 'agendado'; // Marcamos como cliente cerrado
        guardar();

        // Actualizamos el Monitor visualmente agregando el mensaje al chat
        transmitir({ 
            tipo: "RESPUESTA_ZARA", 
            nombre: "SISTEMA", 
            telefono: chatId, 
            texto: msgSistema, 
            timestamp: ts 
        });
    }
}
