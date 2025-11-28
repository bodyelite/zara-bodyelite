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

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

function esHorarioLaboral() {
    const ahora = new Date();
    const horaChile = (ahora.getUTCHours() - 3 + 24) % 24; 
    const minutos = ahora.getUTCMinutes();
    const tiempoDecimal = horaChile + (minutos / 60);
    const dia = ahora.getDay(); 
    if (dia === 0) return false;
    return tiempoDecimal >= 9.5 && tiempoDecimal < 19; 
}

function obtenerCrossSell() {
    const tips = [
        "Oye, y por si te interesa, ¡también tenemos Depilación Láser DL900! ⚡️",
        "Dato extra: También hacemos Botox para complementar con el rostro ✨",
        "Recuerda que la evaluación incluye un escáner facial con IA de regalo 🎁"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
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
    const enHorario = esHorarioLaboral();
    const estadoLlamada = enHorario ? "✅ LLAMAR AHORA" : "🌙 FUERA DE HORARIO - LLAMAR MAÑANA";
    const alerta = `🚨 *LEAD CAPTURADO* 🚨\n⏰ ${estadoLlamada}\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
    for (const numero of NEGOCIO.staff_alertas) await sendMessage(numero, alerta, "whatsapp");
    
    let confirmacion = enHorario 
        ? "¡Perfecto! 💙 Ya le pasé tu número a las especialistas. Te llamaremos en unos minutos."
        : "¡Listo! 🌙 Ya guardé tu contacto. Como ya terminamos la jornada, te llamaremos mañana a primera hora.";

    const crossSell = obtenerCrossSell(); 
    const mensajeFinal = `${confirmacion}\n\n${crossSell}`;

    sesiones[senderId].push({ role: "assistant", content: mensajeFinal });
    await sendMessage(senderId, mensajeFinal, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  const pideFoto = mensajeLower.includes("foto") || mensajeLower.includes("resultado") || mensajeLower.includes("antes y") || mensajeLower.includes("ver cambio");
  const iaMandaFoto = respuestaIA.includes("FOTO_RESULTADOS");

  if (iaMandaFoto || pideFoto) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      await sendMessage(senderId, textoFinal, platform);
      if (FOTO_RESULTADOS_URL.startsWith("http")) await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
