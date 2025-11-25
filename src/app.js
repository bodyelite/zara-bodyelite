import fs from "fs";
import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;

  // 1. EXTRAER DATOS (AHORA CON SOPORTE DE AUDIO)
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    
    senderId = msg.from;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;

    // Detectar tipo de mensaje
    if (msg.type === "text") {
      text = msg.text.body;
    } else if (msg.type === "audio" || msg.type === "voice") {
      // WhatsApp manda el ID del audio, hay que pedir la URL (complejo, dejémoslo para fase 2)
      // Por ahora nos enfocamos en Instagram que manda la URL directa
      text = "[Audio recibido - Funcionalidad en desarrollo para WhatsApp]";
    }

  } else {
    // INSTAGRAM
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return;

    senderId = msg.sender.id;
    messageId = msg.message?.mid;
    senderName = "Usuario IG";

    // Detectar si es Texto o Audio
    if (msg.message?.text) {
      text = msg.message.text;
    } else if (msg.message?.attachments && msg.message.attachments[0].type === 'audio') {
      audioUrl = msg.message.attachments[0].payload.url;
      console.log("🎤 Audio detectado en Instagram");
    }
  }

  // FILTROS
  const ahora = Date.now();
  const ultimaVez = ultimasRespuestas[senderId] || 0;
  if (ahora - ultimaVez < 5000) return; // Candado de 5 seg

  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) {
    mensajesProcesados.add(messageId);
    if (mensajesProcesados.size > 1000) mensajesProcesados.clear();
  }

  ultimasRespuestas[senderId] = ahora;

  // ---------------------------------------------------------
  // 🧠 PROCESAMIENTO DE AUDIO (LA MAGIA NUEVA)
  // ---------------------------------------------------------
  if (audioUrl) {
    try {
        const fileName = `audio_${senderId}_${Date.now()}.m4a`;
        const filePath = await downloadFile(audioUrl, fileName);
        
        if (filePath) {
            // Convertimos el audio a texto usando Whisper
            const transcripcion = await transcribirAudio(filePath);
            
            // Borramos el archivo temporal para no llenar el servidor
            fs.unlink(filePath, () => {}); 

            if (transcripcion) {
                text = transcripcion; // ¡Ahora el audio es texto!
                console.log(`🗣️ Usuario dijo (audio): "${text}"`);
            } else {
                await sendMessage(senderId, "🎧 Recibí tu audio pero hubo un ruidito y no te escuché bien. ¿Me lo escribes? 💙", platform);
                return;
            }
        }
    } catch (e) {
        console.error("Error procesando audio:", e);
    }
  }

  if (!text) return; // Si después de todo no hay texto, salimos.

  // --- FLUJO NORMAL (AHORA CON EL TEXTO YA TRANSCRITO) ---
  const mensajeLower = text.toLowerCase().trim();

  // Comandos
  if (mensajeLower === "retomar" || mensajeLower === "zara on") {
    usuariosPausados[senderId] = false;
    await sendMessage(senderId, "🤖 Zara reactivada.", platform);
    return;
  }
  if (mensajeLower === "zara off" || mensajeLower === "silencio" || usuariosPausados[senderId]) {
    if (!usuariosPausados[senderId]) {
        usuariosPausados[senderId] = true;
        console.log(`⏸️ Bot pausado para ${senderName}`);
    }
    return;
  }

  if (!sesiones[senderId]) sesiones[senderId] = [];

  // Lead
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    const alerta = `🚨 *LEAD (AUDIO/TXT)* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const numero of NEGOCIO.staff_alertas) await sendMessage(numero, alerta, "whatsapp");
    
    const confirmacion = "¡Perfecto! 💙 Ya anoté tu número. Te llamaremos enseguida. ¿Alguna otra duda mientras?";
    sesiones[senderId].push({ role: "assistant", content: confirmacion });
    await sendMessage(senderId, confirmacion, platform);
    return;
  }

  // IA
  sesiones[senderId].push({ role: "user", content: text }); // Guardamos la transcripción
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
  await sendMessage(senderId, respuestaIA, platform);
}
