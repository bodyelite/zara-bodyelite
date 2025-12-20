import { sendMessage, getWhatsAppMediaUrl, getInstagramUserProfile, sendButton } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import fetch from "node-fetch";

const metricas = { agendados: [], llamadas: [], intencion_link: [], leads_wsp: new Set(), leads_ig: new Set(), mensajes_totales: 0 };
const sesiones = {}; 
const usuariosPausados = {};
const ultimasRespuestas = {}; 

const MONITOR_URL = "https://zara-monitor-2-1.onrender.com/webhook";
const AGENDA_URL = NEGOCIO.agenda_link;

async function reportarMonitor(senderId, senderName, mensaje, tipo) {
    try {
        await fetch(MONITOR_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha: new Date().toLocaleString("es-CL"), senderId, senderName, mensaje, tipo })
        });
    } catch (e) { }
}

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

export async function procesarReserva(data = {}) {
    const clientName = data.clientName || "Web";
    const contactPhone = data.contactPhone || "N/A";
    const alerta = `🎉 *NUEVA RESERVA* 🎉\n👤 ${clientName}\n📞 ${contactPhone}\n✨ ${data.treatment || "Evaluación"}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName = "Cliente";

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; 
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || senderName;
      
      if (msg.type === "text") {
          text = msg.text.body;
      } else if (msg.type === "audio") { 
          const audioUrl = await getWhatsAppMediaUrl(msg.audio.id);
          if (audioUrl) {
              const audioPath = await downloadFile(audioUrl, `wsp_${msg.id}.ogg`);
              text = await transcribirAudio(audioPath);
              reportarMonitor(senderId, senderName, `🎤 (VOZ WSP): ${text}`, "usuario");
          } else { text = "(Error audio)"; }
      } else if (msg.type === "button") { text = msg.button.text; }
      else { return; }

  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id;
      
      if (!sesiones[senderId]) {
         const igName = await getInstagramUserProfile(senderId);
         senderName = igName || "IG User";
         sesiones[senderId] = { nombre: senderName, historial: [] };
      } else { senderName = sesiones[senderId].nombre; }

      if (msg.message?.text) {
          text = msg.message.text;
      } else if (msg.message?.attachments?.[0]?.type === 'audio') {
           const audioUrl = msg.message.attachments[0].payload.url;
           const audioPath = await downloadFile(audioUrl, `ig_${senderId}_${Date.now()}.ogg`);
           text = await transcribirAudio(audioPath) || "(Audio ininteligible)";
           reportarMonitor(senderId, senderName, `🎤 (VOZ IG): ${text}`, "usuario");
      } else { return; }
  }
  
  if (!text) return;
  reportarMonitor(senderId, senderName, text, "usuario");

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return;
  ultimasRespuestas[senderId] = now;

  const lower = text.toLowerCase().trim();

  if (lower.includes("zara on")) { usuariosPausados[senderId] = false; await sendMessage(senderId, "✅ Zara Reactivada", platform); return; }
  if (lower.includes("zara off")) { usuariosPausados[senderId] = true; await sendMessage(senderId, "🛑 Zara Pausada", platform); return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = { nombre: senderName, historial: [] };
  if (!sesiones[senderId].historial) sesiones[senderId].historial = [];
  
  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    const alerta = `🚨 *SOLICITUD DE LLAMADA* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    await sendMessage(senderId, `¡Listo ${senderName}! 💙 Ya avisé a las chicas. Te llamarán en breve.`, platform);
    return;
  }

  sesiones[senderId].historial.push({ role: "user", content: `[Cliente: ${senderName}] ` + text });
  if (sesiones[senderId].historial.length > 10) sesiones[senderId].historial = sesiones[senderId].historial.slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId].historial);

  if (respuestaIA.includes(AGENDA_URL) || respuestaIA.includes("link")) {
      const textoLimpio = respuestaIA.replace(AGENDA_URL, "").trim();
      await sendButton(senderId, textoLimpio, "📅 Agendar Evaluación", AGENDA_URL, platform);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }

  sesiones[senderId].historial.push({ role: "assistant", content: respuestaIA });
  reportarMonitor(senderId, "Zara Bot", respuestaIA, "zara");
}
