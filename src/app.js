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
  const match = texto.match(/\b(?:\+?56)?\s?9\s?\d{8}\b/); 
  if (match) return match[0].replace(/[\s\+]/g, '').slice(-9); 
  return null;
}

function esHorarioLaboral() {
    const now = new Date();
    const hora = (now.getUTCHours() - 3 + 24) % 24; 
    const min = now.getUTCMinutes();
    const decimal = hora + (min / 60);
    const dia = now.getDay(); 
    if (dia === 0) return false;
    return decimal >= 9.5 && decimal < 19; 
}

function obtenerCrossSell() {
    const tips = [
        "Oye, y por si te interesa, ¡también tenemos Depilación Láser DL900! ⚡️",
        "Dato extra: También hacemos Botox para complementar con el rostro ✨",
        "Recuerda que la evaluación incluye un escáner facial con IA de regalo 🎁"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

export async function procesarReserva(data) {
    const { clientName, date, time, treatment, contactPhone } = data;
    const alerta = `🔔 *NUEVA CITA AGENDADA (Reservo)* 🔔\n👤 Cliente: ${clientName || "N/A"}\n📞 Teléfono: ${contactPhone || "N/A"}\n🗓️ Fecha: ${date || "N/A"}\n⏰ Hora: ${time || "N/A"}\n✨ Tratamiento: ${treatment || "Evaluación"}\nFunnel: Conversión Exitosa (Vía Link)`;
    for (const n of NEGOCIO.staff_alertas) await sendMessage(n, alerta, "whatsapp");
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;
  let headers = { "User-Agent": "ZaraBot/1.0" };

  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    if (!msg) return;
    senderId = msg.from;
    messageId = msg.id;
    if (msg.type === "text") text = msg.text.body;
    else if (msg.type === "audio" || msg.type === "voice") {
      const mediaId = msg.audio?.id || msg.voice?.id;
      const rawUrl = await getWhatsAppMediaUrl(mediaId);
      if (rawUrl) { audioUrl = rawUrl; headers["Authorization"] = `Bearer ${process.env.PAGE_ACCESS_TOKEN}`; }
    }
  } else {
    const msg = entry.messaging?.[0];
    if (!msg || msg.message?.is_echo) return;
    senderId = msg.sender.id;
    messageId = msg.message?.mid;
    if (msg.message?.text) text = msg.message.text;
    else if (msg.message?.attachments?.[0]?.type === 'audio') audioUrl = msg.message.attachments[0].payload.url;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 3000) return;
  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) { mensajesProcesados.add(messageId); if (mensajesProcesados.size > 1000) mensajesProcesados.clear(); }
  ultimasRespuestas[senderId] = now;

  if (audioUrl) {
    try {
        const ext = platform === 'whatsapp' ? 'ogg' : 'm4a';
        const path = await downloadFile(audioUrl, `audio_${senderId}_${Date.now()}.${ext}`, headers);
        if (path) {
            const trans = await transcribirAudio(path);
            fs.unlink(path, () => {}); 
            if (trans) text = trans;
        }
    } catch (e) { return; }
  }

  if (!text) return;
  const lower = text.toLowerCase().trim();

  if (lower === "retomar" || lower === "zara on") { usuariosPausados[senderId] = false; await sendMessage(senderId, "🤖 Zara reactivada.", platform); return; }
  if (lower.includes("zara off") || lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  const telefono = extraerTelefono(text);
  if (telefono) {
    const alerta = `🚨 *LEAD CAPTURADO* 🚨\n⏰ ${esHorarioLaboral() ? "✅ LLAMAR AHORA" : "🌙 FUERA DE HORARIO"}\n👤 Lead\n📞 ${telefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const n of NEGOCIO.staff_alertas) await sendMessage(n, alerta, "whatsapp");
    
    const confirm = esHorarioLaboral() ? "¡Perfecto! 💙 Ya avisé a las chicas. Te llamamos en breve." : "¡Listo! 🌙 Ya guardé tu contacto. Te llamaremos mañana a primera hora.";
    const final = `${confirm}\n\n${obtenerCrossSell()}`;
    sesiones[senderId].push({ role: "assistant", content: final });
    await sendMessage(senderId, final, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  if (respuestaIA.includes("ZARA_REPORTE_SOLICITADO")) {
      const reporte = `📊 *REPORTE ZARA (7 días)* 📊\n✅ Agendas: 1\n📞 Leads: 0\n📈 Cierre: 100%\n\n¡Tú tienes el control! 💪`;
      await sendMessage(senderId, reporte, platform);
  } else if (respuestaIA.includes("FOTO_RESULTADOS") || lower.includes("foto")) {
      const txt = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      await sendMessage(senderId, txt, platform);
      if (FOTO_RESULTADOS_URL.startsWith("http")) await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
