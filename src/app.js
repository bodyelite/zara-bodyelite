import fs from "fs";
import fetch from "node-fetch";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const ultimasRespuestas = {}; 
const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg";
const MONITOR_URL = "https://zara-monitor-2-1.onrender.com/webhook";

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?\s?9?\s?\d{4}\s?\d{4}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

async function reportarMonitor(senderId, senderName, mensaje, tipo) {
    try {
        await fetch(MONITOR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha: new Date().toLocaleString("es-CL"), senderId, senderName, mensaje, tipo })
        });
    } catch (e) {}
}

export async function procesarReserva(data) {
    console.log("WEBHOOK RESERVO:", data);
    const nombre = data.nombre || "Cliente Web";
    const telefono = data.telefono || "No especificado";
    const tratamiento = data.tratamiento || "Tratamiento";
    const fecha = data.fecha || "Por confirmar";
    
    await reportarMonitor("RESERVA", nombre, `Nueva reserva: ${tratamiento} (${fecha})`, "sistema");
    const alerta = `🎉 *NUEVA RESERVA WEB* 🎉\n\n👤 ${nombre}\n📞 ${telefono}\n💆‍♀️ ${tratamiento}\n🗓️ ${fecha}\n🚀 Origen: Web`;
    
    for (const n of NEGOCIO.staff_alertas) { try { await sendMessage(n, alerta, "whatsapp"); } catch(e) {} }
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName = "Cliente";

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; 
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
      if (msg.type === "text") text = msg.text.body;
      else if (msg.type === "audio" || msg.type === "voice") {
          text = "AUDIO_RECIBIDO (Transcribiendo...)"; 
      }
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; 
      senderName = "Usuario Instagram"; 
      if (msg.message?.text) text = msg.message.text;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return;
  ultimasRespuestas[senderId] = now;

  if (!text) return;

  await reportarMonitor(senderId, senderName, text, "usuario");

  const lower = text.toLowerCase().trim();
  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado && telefonoCapturado.length >= 8) {
    const alerta = `🚨 *LEAD CALIENTE* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}\n💬 Interés: "${text}"\n⚠️ *LLAMAR AHORA*`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    await reportarMonitor(senderId, senderName, "LEAD CAPTURADO", "sistema");
    const confirm = `¡Listo ${senderName}! 💙 Ya le pasé tu número a las chicas. Te llamarán en breve.`;
    await sendMessage(senderId, confirm, platform);
    return;
  }

  const contextoUsuario = `El cliente se llama ${senderName}. Mensaje: "${text}"`;
  sesiones[senderId].push({ role: "user", content: contextoUsuario });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  await reportarMonitor(senderId, "Zara Bot", respuestaIA, "zara");

  if (respuestaIA.includes("FOTO_RESULTADOS")) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      if(textoFinal) await sendMessage(senderId, textoFinal, platform);
      await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
