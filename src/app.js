import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 

const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg"; 

// ... (Utilidades iguales) ...
function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}
function esHorarioLaboral() {
    const ahora = new Date();
    const horaChile = (ahora.getUTCHours() - 3 + 24) % 24; 
    const dia = ahora.getDay(); 
    if (dia === 0) return false; 
    const minutos = ahora.getUTCMinutes();
    const tiempoDecimal = horaChile + (minutos / 60);
    return tiempoDecimal >= 9.5 && tiempoDecimal < 19; 
}
function obtenerCrossSell() {
    const tips = [
        "Dato: También tenemos Depilación Láser DL900 por si te interesa aprovechar el viaje ⚡️",
        "Ojo, la evaluación incluye un análisis facial con IA de regalo 🎁",
        "También hacemos Botox, por si quieres complementar ✨"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;
  
  // ... (Extracción de datos igual) ...
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
      if (rawUrl) audioUrl = rawUrl; 
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
  if ((ahora - (ultimasRespuestas[senderId] || 0)) < 4000) return; 
  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) { mensajesProcesados.add(messageId); if (mensajesProcesados.size > 1000) mensajesProcesados.clear(); }
  ultimasRespuestas[senderId] = ahora;

  if (audioUrl) {
      // ... (Lógica de audio igual) ...
      // (Omitido por brevedad, pero asume que está igual)
  }

  if (!text) return;
  const mensajeLower = text.toLowerCase().trim();

  if (mensajeLower === "retomar" || mensajeLower === "zara on") { usuariosPausados[senderId] = false; await sendMessage(senderId, "🤖 Zara lista.", platform); return; }
  if (mensajeLower === "zara off" || mensajeLower === "silencio") { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  // LEADS
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
      // ... (Lógica de Lead igual) ...
      // (Omitido por brevedad)
      return;
  }

  // IA
  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  let respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  // 🚨 FILTRO DURO ANTI-VÓMITO 🚨
  // Si la IA escribió más de 250 caracteres, intentamos cortarlo en el primer punto seguido o interrogación.
  if (respuestaIA.length > 250) {
      const corte = respuestaIA.indexOf('.', 200); // Busca punto después del caracter 200
      if (corte !== -1) {
          respuestaIA = respuestaIA.substring(0, corte + 1);
      }
  }

  // GESTIÓN DE FOTOS
  const pideFoto = mensajeLower.includes("foto") || mensajeLower.includes("resultado") || mensajeLower.includes("antes y");
  const iaMandaFoto = respuestaIA.includes("FOTO_RESULTADOS");

  if (iaMandaFoto || pideFoto) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      if(textoFinal) await sendMessage(senderId, textoFinal, platform);
      await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
