import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 

// 👇 AQUÍ ESTÁ EL LINK CORRECTO (Con los espacios arreglados)
const FOTO_RESULTADOS_URL = "https://raw.githubusercontent.com/bodyelite/zara-bodyelite/main/Ant%20y%20desp%20Hombre.jpeg"; 

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;
  let downloadHeaders = { "User-Agent": "ZaraBot/1.0" };

  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;
    if (msg.type === "text") text = msg.text.body;
    else if (msg.type === "audio" || msg.type === "voice") {
      const mediaId = msg.audio?.id || msg.voice?.id;
      const rawUrl = await getWhatsAppMediaUrl(mediaId);
      if (rawUrl) { audioUrl = rawUrl; downloadHeaders["Authorization"] = `Bearer ${process.env.PAGE_ACCESS_TOKEN}`; }
    }
  } else {
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return;
    senderId = msg.sender.id;
    messageId = msg.message?.mid;
    senderName = "Usuario IG";
    if (msg.message?.text) text = msg.message.text;
    else if (msg.message?.attachments && msg.message.attachments[0].type === 'audio') audioUrl = msg.message.attachments[0].payload.url;
  }

  const ahora = Date.now();
  if ((ahora - (ultimasRespuestas[senderId] || 0)) < 5000) return;
  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) { mensajesProcesados.add(messageId); if (mensajesProcesados.size > 1000) mensajesProcesados.clear(); }
  ultimasRespuestas[senderId] = ahora;

  if (audioUrl) {
    try {
        const ext = platform === 'whatsapp' ? 'ogg' : 'm4a';
        const fileName = `audio_${senderId}_${Date.now()}.${ext}`;
        const filePath = await downloadFile(audioUrl, fileName, downloadHeaders);
        if (filePath) {
            const transcripcion = await transcribirAudio(filePath);
            fs.unlink(filePath, () => {}); 
            if (transcripcion) text = transcripcion;
            else { await sendMessage(senderId, "🎧 No escuché bien tu audio. ¿Me lo escribes? 💙", platform); return; }
        } else { return; }
    } catch (e) { return; }
  }

  if (!text) return;
  const mensajeLower = text.toLowerCase().trim();

  if (mensajeLower === "retomar" || mensajeLower === "zara on") { usuariosPausados[senderId] = false; await sendMessage(senderId, "🤖 Zara reactivada.", platform); return; }
  if (mensajeLower === "zara off" || mensajeLower === "silencio") { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    const alerta = `🚨 *LEAD DETECTADO* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const numero of NEGOCIO.staff_alertas) await sendMessage(numero, alerta, "whatsapp");
    const confirmacion = "¡Perfecto! 💙 Ya anoté tu número. Te llamaremos enseguida.";
    sesiones[senderId].push({ role: "assistant", content: confirmacion });
    await sendMessage(senderId, confirmacion, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  // LÓGICA DE ENVÍO DE FOTO
  if (respuestaIA.includes("FOTO_RESULTADOS")) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      await sendMessage(senderId, textoFinal, platform);
      // Usamos encodedURI para manejar los espacios en el nombre del archivo
      await sendMessage(senderId, "", platform, encodeURI(FOTO_RESULTADOS_URL));
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
