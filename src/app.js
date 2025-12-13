import fs from "fs";
import fetch from "node-fetch";
import { sendMessage, sendButton } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/negocio.js";

const metricas = { leads_wsp: new Set(), leads_ig: new Set(), mensajes_totales: 0, llamadas: 0, intencion_link: 0, agendados: 0 };
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
    } catch (e) {}
}

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

export async function procesarReserva(data) {
    metricas.agendados++; 
    const nombre = data.nombre || data.clientName || "Web";
    const trata = data.tratamiento || data.treatment || "Cita";
    const fono = data.telefono || data.contactPhone || "Sin fono";
    const fecha = data.fecha || data.date || "Hoy";

    await reportarMonitor("RESERVA", nombre, `Reserva: ${trata}`, "sistema");
    
    const alerta = `🎉 *NUEVA RESERVA WEB CONFIRMADA* 🎉\n\n👤 ${nombre}\n📞 ${fono}\n✨ ${trata}\n🗓️ ${fecha}\n🚀 Origen: Zara/Web`;
    for (const n of NEGOCIO.staff_alertas) { 
        try { await sendMessage(n, alerta, "whatsapp"); } catch(e) {}
    }
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName;
  metricas.mensajes_totales++;

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; metricas.leads_wsp.add(senderId);
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
      if (msg.type === "text") text = msg.text.body;
      else if (msg.type === "audio" || msg.type === "voice") text = "AUDIO_RECIBIDO";
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; metricas.leads_ig.add(senderId);
      senderName = "Amiga IG"; 
      if (msg.message?.text) text = msg.message.text;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return; 
  ultimasRespuestas[senderId] = now;

  if (!text) return;

  await reportarMonitor(senderId, senderName, text, "usuario");

  const lower = text.toLowerCase().trim();
  
  if (lower === "zara reporte") {
     const reporte = `📊 *REPORTE ZARA* 📊\n\n💬 Msjes: ${metricas.mensajes_totales}\n📞 Llamadas: ${metricas.llamadas}\n🔗 Links: ${metricas.intencion_link}`;
     await sendMessage(senderId, reporte, platform);
     return;
  }
  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas++;
    const alerta = `🚨 *LEAD PIDIÓ LLAMADA* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    await reportarMonitor(senderId, senderName, "LEAD CAPTURADO", "sistema");
    await sendMessage(senderId, "¡Listo! 💙 Ya le pasé tu número a las chicas. Te llamarán en breve.", platform);
    return;
  }

  if (!sesiones[senderId]) sesiones[senderId] = [];
  sesiones[senderId].push({ role: "user", content: `[Cliente: ${senderName}] ${text}` });
  
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  await reportarMonitor(senderId, "Zara Bot", respuestaIA, "zara");
  
  if (respuestaIA.includes("agendamiento.reservo.cl")) {
      const textoLimpio = respuestaIA.replace(/https:\/\/agendamiento\.reservo\.cl\S+/g, "").trim();
      if (platform === "instagram") {
          await sendButton(senderId, textoLimpio || "Aquí tienes tu link:", "📅 Agendar Cita", AGENDA_URL, "instagram");
      } else {
          await sendMessage(senderId, `${textoLimpio}\n\n🔗 ${AGENDA_URL}`, "whatsapp");
      }
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
