import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
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
  // Headers por defecto para descarga
  let downloadHeaders = { 
    "User-Agent": "Mozilla/5.0 (compatible; ZaraBot/1.0)",
  };

  // 1. EXTRAER DATOS
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    
    senderId = msg.from;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;

    // DETECCIÓN DE AUDIO WHATSAPP
    if (msg.type === "text") {
      text = msg.text.body;
    } else if (msg.type === "audio" || msg.type === "voice") {
      const mediaId = msg.audio?.id || msg.voice?.id;
      console.log("🎤 Audio WhatsApp detectado ID:", mediaId);
      
      // Obtenemos la URL base
      const rawUrl = await getWhatsAppMediaUrl(mediaId);
      if (rawUrl) {
          // 🔥 FIX: Pegamos el token en la URL para que no se pierda en la redirección
          audioUrl = `${rawUrl}`;
          downloadHeaders["Authorization"] = `Bearer ${process.env.PAGE_ACCESS_TOKEN}`;
      }
    }

  } else {
    // INSTAGRAM
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return;

    senderId = msg.sender.id;
    messageId = msg.message?.mid;
    senderName = "Usuario IG";

    if (msg.message?.text) {
      text = msg.message.text;
    } else if (msg.message?.attachments && msg.message.attachments[0].type === 'audio') {
      audioUrl = msg.message.attachments[0].payload.url;
      console.log("🎤 Audio Instagram detectado");
    }
  }

  // FILTROS DE SEGURIDAD
  const ahora = Date.now();
  const ultimaVez = ultimasRespuestas[senderId] || 0;
  if (ahora - ultimaVez < 5000) return;

  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) {
    mensajesProcesados.add(messageId);
    if (mensajesProcesados.size > 1000) mensajesProcesados.clear();
  }

  ultimasRespuestas[senderId] = ahora;

  // ---------------------------------------------------------
  // 🧠 PROCESAMIENTO DE AUDIO
  // ---------------------------------------------------------
  if (audioUrl) {
    try {
        const ext = platform === 'whatsapp' ? 'ogg' : 'm4a';
        const fileName = `audio_${senderId}_${Date.now()}.${ext}`;
        
        // Descarga robusta
        const filePath = await downloadFile(audioUrl, fileName, downloadHeaders);
        
        if (filePath) {
            const transcripcion = await transcribirAudio(filePath);
            fs.unlink(filePath, () => {}); 

            if (transcripcion) {
                text = transcripcion;
                console.log(`🗣️ Transcripción (${platform}): "${text}"`);
            } else {
                await sendMessage(senderId, "🎧 Hubo un problema escuchando tu audio. ¿Me lo escribes? 💙", platform);
                return;
            }
        } else {
             console.error("❌ No se pudo descargar el archivo de audio");
             return;
        }
    } catch (e) {
        console.error("Error crítico procesando audio:", e);
        return;
    }
  }

  if (!text) return;

  // --- FLUJO NORMAL ---
  const mensajeLower = text.toLowerCase().trim();

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

  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    const alerta = `🚨 *LEAD DETECTADO (${platform.toUpperCase()})* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const numero of NEGOCIO.staff_alertas) await sendMessage(numero, alerta, "whatsapp");
    
    const confirmacion = "¡Perfecto! 💙 Ya anoté tu número. Te llamaremos enseguida. ¿Alguna otra duda mientras?";
    sesiones[senderId].push({ role: "assistant", content: confirmacion });
    await sendMessage(senderId, confirmacion, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
  await sendMessage(senderId, respuestaIA, platform);
}
