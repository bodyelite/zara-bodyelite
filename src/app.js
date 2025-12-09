import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const ultimasRespuestas = {}; 
const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg";

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(\+?56)?\s?9?\s?\d{4}\s?\d{4}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

export async function procesarReserva(data) {
    console.log("🔥🔥🔥 PROCESANDO RESERVA DESDE RESERVO 🔥🔥🔥", data);
    const nombre = data.nombre || "Cliente Web";
    const telefono = data.telefono || "No especificado";
    const tratamiento = data.tratamiento || "Tratamiento";
    const fecha = data.fecha || "Por confirmar";
    
    const alerta = `🎉 *NUEVA RESERVA WEB CONFIRMADA* 🎉\n\n👤 ${nombre}\n📞 ${telefono}\n💆‍♀️ ${tratamiento}\n🗓️ ${fecha}\n🚀 Origen: Zara Bot / Web`;
    
    for (const n of NEGOCIO.staff_alertas) { 
        try { await sendMessage(n, alerta, "whatsapp"); } 
        catch(e) { console.error(`Error enviando alerta a ${n}:`, e); }
    }
}

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
  const lower = text.toLowerCase().trim();

  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado && telefonoCapturado.length >= 8) {
    const alerta = `🚨 *CLIENTE DEJÓ SU NÚMERO* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}\n💬 Dice: "${text}"\n⚠️ *¡LLAMAR AHORA!*`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    const confirm = "¡Listo! 💙 Ya le pasé tu número a las chicas. Te llamarán en breve para coordinar.";
    await sendMessage(senderId, confirm, platform);
    return;
  }

  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  if (respuestaIA.includes("FOTO_RESULTADOS")) {
      const textoFinal = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      if(textoFinal) await sendMessage(senderId, textoFinal, platform);
      await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
