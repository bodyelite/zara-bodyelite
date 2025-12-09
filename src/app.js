import fs from "fs";
import fetch from "node-fetch"; // Asegurar fetch para el monitor
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const ultimasRespuestas = {}; 
const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg";

// URL DE TU MONITOR EN RENDER
const MONITOR_URL = "https://zara-monitor-2-1.onrender.com/webhook";

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?\s?9?\s?\d{4}\s?\d{4}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

// --- FUNCIÓN: ENVIAR DATOS AL MONITOR WEB ---
async function reportarMonitor(senderId, senderName, mensaje, tipo) {
    try {
        await fetch(MONITOR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fecha: new Date().toLocaleString("es-CL"),
                senderId: senderId,
                senderName: senderName,
                mensaje: mensaje,
                tipo: tipo // "usuario" o "zara"
            })
        });
    } catch (e) {
        // Silencioso para no botar el bot si el monitor duerme
        console.error("⚠️ Error conectando con Monitor:", e.message);
    }
}

// --- PROCESAR RESERVA (AVISO WHATSAPP) ---
export async function procesarReserva(data) {
    console.log("🔥🔥🔥 RESERVA WEB 🔥🔥🔥", data);
    const nombre = data.nombre || "Cliente Web";
    const telefono = data.telefono || "No especificado";
    const tratamiento = data.tratamiento || "Tratamiento";
    const fecha = data.fecha || "Por confirmar";
    
    // Alerta al Monitor también
    await reportarMonitor("RESERVA", nombre, `Nueva reserva: ${tratamiento} (${fecha})`, "sistema");

    const alerta = `🎉 *NUEVA RESERVA WEB CONFIRMADA* 🎉\n\n👤 ${nombre}\n📞 ${telefono}\n💆‍♀️ ${tratamiento}\n🗓️ ${fecha}\n🚀 Origen: Zara Bot / Web`;
    
    for (const n of NEGOCIO.staff_alertas) { 
        try { await sendMessage(n, alerta, "whatsapp"); } 
        catch(e) { console.error(`Error alerta staff:`, e); }
    }
}

// --- PROCESAR EVENTO (CHAT) ---
export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName;

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; 
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
      if (msg.type === "text") text = msg.text.body;
      else if (msg.type === "audio" || msg.type === "voice") {
          const mediaId = msg.audio?.id || msg.voice?.id;
          const rawUrl = await getWhatsAppMediaUrl(mediaId);
          if (rawUrl) { 
             try {
                const ext = platform === 'whatsapp' ? 'ogg' : 'm4a';
                const fileName = `audio_${senderId}_${Date.now()}.${ext}`;
                const filePath = await downloadFile(rawUrl, fileName, { "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}` });
                if (filePath) {
                    const transcripcion = await transcribirAudio(filePath);
                    fs.unlink(filePath, () => {}); 
                    if (transcripcion) text = transcripcion;
                }
             } catch (e) { console.error(e); }
          }
      }
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; 
      senderName = "Amiga en Instagram"; 
      if (msg.message?.text) text = msg.message.text;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return;
  ultimasRespuestas[senderId] = now;

  if (!text) return;

  // 1. REPORTAR AL MONITOR (LO QUE DICE EL USUARIO)
  await reportarMonitor(senderId, senderName, text, "usuario");

  const lower = text.toLowerCase().trim();

  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado && telefonoCapturado.length >= 8) {
    const alerta = `🚨 *CLIENTE DEJÓ SU NÚMERO* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}\n💬 Dice: "${text}"\n⚠️ *¡LLAMAR AHORA!*`;
    // Alerta urgente sí va al WhatsApp del staff
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    await reportarMonitor(senderId, senderName, "LEAD CAPTURADO - ENVIADA ALERTA", "sistema");
    
    const confirm = "¡Listo! 💙 Ya le pasé tu número a las chicas. Te llamarán en breve para coordinar.";
    await sendMessage(senderId, confirm, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  // 2. REPORTAR AL MONITOR (LO QUE RESPONDE ZARA)
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
