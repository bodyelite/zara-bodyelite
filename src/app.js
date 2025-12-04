import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl, getInstagramUserProfile } from "./services/meta.js"; // Importamos la nueva función
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// --- MÉTRICAS DE LEADS ÚNICOS ---
const metricas = {
    leads_wsp: new Set(),
    leads_ig: new Set(),
    mensajes_totales: 0,
    llamadas: 0,
    intencion_link: 0,
    agendados: 0
};

const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 
const FOTO_RESULTADOS_URL = "https://i.ibb.co/PZqDzSm2/Ant-y-desp-Hombre.jpg"; 

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
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
    metricas.agendados++; 
    const { clientName, date, time, treatment, contactPhone } = data;
    const alerta = `🔔 *NUEVA CITA AGENDADA* 🔔\n👤 ${clientName || "N/A"}\n📞 ${contactPhone || "N/A"}\n🗓️ ${date} - ${time}\n✨ ${treatment}\n✅ Funnel: Completado (Link)`;
    for (const n of NEGOCIO.staff_alertas) await sendMessage(n, alerta, "whatsapp");
}

function generarReporteTexto(periodo) {
    const leadsWsp = metricas.leads_wsp.size;
    const leadsIg = metricas.leads_ig.size;
    const totalLeads = leadsWsp + leadsIg;
    const conversiones = metricas.llamadas + metricas.intencion_link + metricas.agendados;
    const tasa = totalLeads > 0 ? ((conversiones / totalLeads) * 100).toFixed(1) : "0.0";

    return `📊 *REPORTE ZARA (LEADS ÚNICOS)* 📊\n📅 ${periodo}\n\n👥 *Personas:* ${totalLeads}\n   • WSP: ${leadsWsp}\n   • IG: ${leadsIg}\n   (Msjes: ${metricas.mensajes_totales})\n\n🎯 *Resultados:* ${conversiones}\n   📞 Llamadas: ${metricas.llamadas}\n   🔗 Link: ${metricas.intencion_link}\n   ✅ Agendas: ${metricas.agendados}\n\n📈 *Cierre:* ${tasa}%\n💪 ¡Vamos!`;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId, audioUrl;
  let headers = { "User-Agent": "ZaraBot/1.0" };

  metricas.mensajes_totales++;

  // --- OBTENCIÓN DE DATOS (AHORA CON NOMBRE EN IG) ---
  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      const contact = entry.changes[0].value.contacts?.[0];
      if (!msg) return;
      senderId = msg.from;
      metricas.leads_wsp.add(senderId);
      senderName = contact?.profile?.name || "Cliente"; // WSP ya lo trae
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
      metricas.leads_ig.add(senderId);
      messageId = msg.message?.mid;
      
      // 🆕 MAGIA AQUÍ: Obtenemos el nombre real de Instagram
      const igName = await getInstagramUserProfile(senderId);
      senderName = igName || "Amiga"; 
      
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

  // --- LOGICA DEL CHAT ---
  if (lower === "zara reporte" || lower === "reporte") { await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform); return; }
  if (lower === "retomar" || lower === "zara on") { usuariosPausados[senderId] = false; await sendMessage(senderId, "🤖 Zara reactivada.", platform); return; }
  if (lower.includes("zara off") || lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];

  // Inyectamos el nombre en el contexto para que Zara lo use
  // "El usuario se llama: Maria"
  const contextoNombre = `[Usuario: ${senderName}] `; 
  
  if (lower.includes("link") || lower.includes("agenda") || lower.includes("agendar")) metricas.intencion_link++;

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas++;
    const enHorario = esHorarioLaboral();
    const estado = enHorario ? "✅ LLAMAR AHORA" : "🌙 FUERA DE HORARIO";
    const alerta = `🚨 *LEAD CAPTURADO* 🚨\n⏰ ${estado}\n👤 ${senderName}\n📞 ${telefonoCapturado}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    const confirm = enHorario ? `¡Perfecto ${senderName}! 💙 Ya avisé a las chicas...` : `¡Listo ${senderName}! 🌙 Ya guardé tu contacto...`;
    const final = `${confirm}\n\n${obtenerCrossSell()}`;
    sesiones[senderId].push({ role: "assistant", content: final });
    await sendMessage(senderId, final, platform);
    return;
  }

  // Agregamos el nombre al historial solo como contexto para la IA
  sesiones[senderId].push({ role: "user", content: contextoNombre + text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  if (respuestaIA.includes("ZARA_REPORTE_SOLICITADO")) {
      await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform);
  } else if (respuestaIA.includes("FOTO_RESULTADOS") || lower.includes("foto")) {
      const txt = respuestaIA.replace("FOTO_RESULTADOS", "").trim();
      await sendMessage(senderId, txt, platform);
      if (FOTO_RESULTADOS_URL.startsWith("http")) await sendMessage(senderId, "", platform, FOTO_RESULTADOS_URL);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
  }
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
