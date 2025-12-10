import fs from "fs";
import fetch from "node-fetch";
import { sendMessage, sendButton, getWhatsAppMediaUrl, getInstagramUserProfile } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const metricas = { leads_wsp: new Set(), leads_ig: new Set(), mensajes_totales: 0, llamadas: 0, intencion_link: 0, agendados: 0 };
const sesiones = {}; 
const usuariosPausados = {}; 
const ultimasRespuestas = {}; 
const MONITOR_URL = "https://zara-monitor-2-1.onrender.com/webhook";
const AGENDA_URL = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

async function reportarMonitor(senderId, senderName, mensaje, tipo) {
    try {
        await fetch(MONITOR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha: new Date().toLocaleString("es-CL"), senderId, senderName, mensaje, tipo })
        });
    } catch (e) {}
}

function generarReporteTexto() {
    return `📊 *REPORTE ZARA* 📊\n\n👥 Leads WSP: ${metricas.leads_wsp.size}\n📸 Leads IG: ${metricas.leads_ig.size}\n💬 Total Msjes: ${metricas.mensajes_totales}\n📞 Pidieron Llamada: ${metricas.llamadas}\n🔗 Pidieron Link: ${metricas.intencion_link}\n✅ Agendas Web: ${metricas.agendados}`;
}

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

export async function procesarReserva(data) {
    metricas.agendados++; 
    const { clientName, date, time, treatment, contactPhone } = data; 
    const nombre = clientName || data.nombre || "Web";
    const trata = treatment || data.tratamiento || "Cita";
    
    await reportarMonitor("RESERVA", nombre, `Reserva: ${trata}`, "sistema");
    
    const alerta = `🎉 *NUEVA RESERVA CONFIRMADA* 🎉\n\n👤 ${nombre}\n📞 ${contactPhone || data.telefono}\n✨ ${trata}\n🗓️ ${date} ${time || ""}\n🚀 Origen: Zara/Web`;
    for (const n of NEGOCIO.staff_alertas) { 
        try { await sendMessage(n, alerta, "whatsapp"); } catch(e) {}
    }
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId;
  metricas.mensajes_totales++;

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; metricas.leads_wsp.add(senderId);
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente"; messageId = msg.id;
      if (msg.type === "text") text = msg.text.body;
      else if (msg.type === "audio" || msg.type === "voice") text = "AUDIO_RECIBIDO";
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; metricas.leads_ig.add(senderId);
      const igName = await getInstagramUserProfile(senderId);
      senderName = igName || "Amiga";
      if (msg.message?.text) text = msg.message.text;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return;
  ultimasRespuestas[senderId] = now;

  if (!text) return;

  await reportarMonitor(senderId, senderName, text, "usuario");

  const lower = text.toLowerCase().trim();
  
  if (lower === "zara reporte") {
      await sendMessage(senderId, generarReporteTexto(), platform);
      return;
  }
  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];
  if (lower.includes("link") || lower.includes("agenda")) metricas.intencion_link++;

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas++;
    const alerta = `🚨 *LEAD PIDIÓ LLAMADA* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    await reportarMonitor(senderId, senderName, "LEAD CAPTURADO", "sistema");
    await sendMessage(senderId, "¡Perfecto! 💙 Ya avisé a las chicas. Te llamarán en unos minutos.", platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: `[Cliente: ${senderName}] ` + text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  await reportarMonitor(senderId, "Zara Bot", respuestaIA, "zara");
  
  if (respuestaIA.includes("agendamiento.reservo.cl")) {
      if (platform === "instagram") {
          const textoLimpio = respuestaIA.replace(/https:\/\/agendamiento\.reservo\.cl\S+/g, "").trim();
          await sendButton(senderId, textoLimpio || "Aquí tienes tu link:", "📅 Agendar Cita", AGENDA_URL, "instagram");
      } else {
          await sendMessage(senderId, respuestaIA, "whatsapp");
      }
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
