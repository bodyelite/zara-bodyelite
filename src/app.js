import fs from "fs";
import fetch from "node-fetch";
import { sendMessage, getWhatsAppMediaUrl, getInstagramUserProfile, sendButton } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const metricas = {
    agendados: [],
    llamadas: [],
    intencion_link: [],
    leads_wsp: new Set(),
    leads_ig: new Set(),
    mensajes_totales: 0
};
const sesiones = {}; 
const usuariosPausados = {};
const ultimasRespuestas = {}; 
const estadosClientes = {};

const MONITOR_URL = "https://zara-monitor-2-1.onrender.com/webhook";
const AGENDA_URL = NEGOCIO.agenda_link;

async function reportarMonitor(senderId, senderName, mensaje, tipo) {
    try {
        await fetch(MONITOR_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha: new Date().toLocaleString("es-CL"), senderId, senderName, mensaje, tipo })
        });
    } catch (e) { console.error("Error al reportar al Monitor externo:", e); }
}

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

function esHorarioPrudente() {
    const now = new Date();
    const horaChile = now.getHours(); 
    return horaChile >= 9 && horaChile < 20.5; 
}

const TIEMPO_DORMIDO = 2 * 60 * 60 * 1000; 
const INTERVALO_CHECK = 10 * 60 * 1000;

setInterval(() => {
    if (!esHorarioPrudente()) return;
    const ahora = Date.now();
    Object.keys(ultimasRespuestas).forEach(async (senderId) => {
        const ultimoMsj = ultimasRespuestas[senderId];
        const estado = estadosClientes[senderId] || 'activo';
        if ((ahora - ultimoMsj) > TIEMPO_DORMIDO && estado !== 'agendado' && estado !== 'nudged' && !usuariosPausados[senderId]) {
            await sendMessage(senderId, "¿Aún no te decides? 🤔 El **Diagnóstico con IA** es un regalo de Body Elite 🎁. ¿Te agendo?", "whatsapp"); 
            estadosClientes[senderId] = 'nudged'; 
            reportarMonitor(senderId, "Sistema", "Cliente nudged (dormido)", "sistema").catch(() => {});
        }
    });
}, INTERVALO_CHECK);

function obtenerCrossSell(historialTexto) {
    const lower = (historialTexto || "").toLowerCase();
    if (lower.includes("cara") || lower.includes("rostro") || lower.includes("arrugas")) return "Dato Extra: ¡Tus tratamientos **Reductivos tienen un 20% OFF**! 🎁";
    if (lower.includes("cuerpo") || lower.includes("grasa") || lower.includes("lipo")) return "Dato Extra: ¡Tus tratamientos **Faciales Antiage tienen un 20% OFF**! ✨";
    return "Dato Extra: ¡Tienes un **20% OFF** en tratamientos complementarios! ✨";
}

// LÓGICA DE REPORTES CON RANGO DE TIEMPO
function getRangeStart(rango) {
    const now = new Date();
    let start;

    const setStartOfDay = (date) => {
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    };

    if (rango === 'AYER') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        start = setStartOfDay(yesterday);
    } else if (rango === 'SEMANA') { 
        start = now.getTime() - (7 * 24 * 60 * 60 * 1000); // 7 días móviles
    } else if (rango === 'MES') { 
        const monthStart = new Date(now);
        monthStart.setDate(1);
        start = setStartOfDay(monthStart);
    } else { // GLOBAL
        return 0;
    }
    
    return start;
}

function filtrarMetricaPorRango(metrica, rango) {
    const inicioRango = getRangeStart(rango);
    if (inicioRango === 0) return metrica.length;
    
    let finRango = Date.now() + 1000;
    if (rango === 'AYER') {
        finRango = new Date().setHours(0, 0, 0, 0);
    } 

    return metrica.filter(ts => ts >= inicioRango && ts < finRango).length;
}

function generarReporteTexto(rango = 'SEMANA') {
    
    const totalLeads = metricas.leads_wsp.size + metricas.leads_ig.size; 
    
    const llamadas = filtrarMetricaPorRango(metricas.llamadas, rango);
    const intencion_link = filtrarMetricaPorRango(metricas.intencion_link, rango);
    const agendados = filtrarMetricaPorRango(metricas.agendados, rango);
    
    const conversiones = llamadas + intencion_link + agendados;
    const tasa = totalLeads > 0 ? ((conversiones / totalLeads) * 100).toFixed(1) : "0.0";
    
    let tituloRango = 'TOTAL';
    if (rango === 'SEMANA') tituloRango = 'ÚLTIMOS 7 DÍAS';
    else if (rango === 'MES') tituloRango = 'MES EN CURSO';
    else if (rango === 'AYER') tituloRango = 'AYER';

    return `📊 *REPORTE ZARA - ${tituloRango}* 📊\n\n` +
           `👥 Leads Únicos (Total): ${totalLeads}\n` +
           `🎯 Conversiones (${tituloRango}): ${conversiones}\n` +
           `   📞 Llamadas: ${llamadas}\n` +
           `   🔗 Pidieron Link: ${intencion_link}\n` +
           `   ✅ Agendas Reservo: ${agendados}\n` +
           `📈 Tasa Global: ${tasa}%`;
}

export async function procesarReserva(data = {}) {
    metricas.agendados.push(Date.now()); 
    console.log("🔥🔥🔥 WEBHOOK RESERVO EJECUTÁNDOSE (ZARA 11) 🔥🔥🔥");
    
    const clientName = data.clientName || "Web (Nombre no capturado)";
    const date = data.date || "Fecha no capturada";
    const time = data.time || "";
    const treatment = data.treatment || "Evaluación (Servicio no capturado)";
    const contactPhone = data.contactPhone || "N/A (Fono no capturado)";

    const alerta = `🎉 *NUEVA RESERVA CONFIRMADA* 🎉\n\n👤 Cliente: ${clientName}\n📞 Fono: ${contactPhone}\n🗓️ Fecha: ${date} a las ${time}\n✨ Tratamiento: ${treatment}\n🚀 Origen: Zara Bot`;
    for (const n of NEGOCIO.staff_alertas) { 
        try { await sendMessage(n, alerta, "whatsapp"); } catch(e) { console.error(e); }
    }
    reportarMonitor(contactPhone || "No Fono", clientName, "RESERVA CONFIRMADA", "sistema").catch(() => {});
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName = "Cliente", messageId;

  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; metricas.leads_wsp.add(senderId);
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || senderName;
      messageId = msg.id;
      
      if (msg.type === "text") {
          text = msg.text.body;
      } else if (msg.type === "audio") { 
          const audioUrl = await getWhatsAppMediaUrl(msg.audio.id);
          const audioPath = await downloadFile(audioUrl, `${msg.id}.ogg`);
          text = await transcribirAudio(audioPath);
          reportarMonitor(senderId, senderName, `🎤 (VOZ WSP): ${text}`, "usuario").catch(() => {});
      } else {
          return; 
      }
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; metricas.leads_ig.add(senderId);
      
      let cachedSession = sesiones[senderId];
      if (!cachedSession || !cachedSession.nombre) {
        const igName = await getInstagramUserProfile(senderId);
        senderName = igName || senderName;
        sesiones[senderId] = { nombre: senderName, historial: [] };
      } else {
        senderName = cachedSession.nombre;
      }

      if (msg.message?.text) {
          text = msg.message.text;
      } else if (msg.message?.attachments?.[0]?.type === 'audio') {
           text = "(Mensaje de voz: Por favor, escribe un mensaje de texto. No proceso audio de Instagram aún)";
      } else {
          return;
      }
  }
  
  metricas.mensajes_totales++;
  reportarMonitor(senderId, senderName, text, "usuario").catch(() => {});

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return;
  ultimasRespuestas[senderId] = now;
  estadosClientes[senderId] = 'activo';

  if (!text) return;
  const lower = text.toLowerCase().trim();

  // -------------------------------------------------------------
  // COMANDOS DE CONTROL Y REPORTES
  // -------------------------------------------------------------
  if (lower.startsWith("zara reporte ayer")) { 
      await sendMessage(senderId, generarReporteTexto("AYER"), platform); return; 
  }
  if (lower.startsWith("zara reporte semana") || lower === "zara reporte") { // FIX: zara reporte -> SEMANA
      await sendMessage(senderId, generarReporteTexto("SEMANA"), platform); return; 
  }
  if (lower.startsWith("zara reporte mes")) { 
      await sendMessage(senderId, generarReporteTexto("MES"), platform); return; 
  }
  if (lower.startsWith("zara reporte global")) {
      await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform); return; 
  }
  
  if (lower.includes("zara on")) { 
      usuariosPausados[senderId] = false; 
      await sendMessage(senderId, "✅ Zara reactivada. ¡Volvamos a vender! 🚀", platform);
      return; 
  }
  if (lower.includes("zara off")) { 
      usuariosPausados[senderId] = true; 
      await sendMessage(senderId, "🛑 Zara pausada. Solo responderé a comandos explícitos.", platform);
      return; 
  }
  
  if (usuariosPausados[senderId]) return;

  // -------------------------------------------------------------
  // LÓGICA CONVERSACIONAL
  // -------------------------------------------------------------
  if (!sesiones[senderId].historial) sesiones[senderId].historial = [];
  if (lower.includes("link") || lower.includes("agenda")) { 
      metricas.intencion_link.push(Date.now());
      estadosClientes[senderId] = 'agendado'; 
  }

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas.push(Date.now());
    estadosClientes[senderId] = 'agendado';
    const alerta = `🚨 *SOLICITUD DE LLAMADA* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    
    const confirm = `¡Perfecto ${senderName}! 💙 Ya avisé a las chicas. Te llamarán en unos minutos.`;
    const historialTotal = sesiones[senderId].historial.map(m => m.content).join(" ");
    await sendMessage(senderId, `${confirm}\n\n${obtenerCrossSell(historialTotal)}`, platform);
    reportarMonitor(senderId, senderName, "LEAD CAPTURADO", "sistema").catch(() => {});
    return;
  }

  sesiones[senderId].historial.push({ role: "user", content: `[Cliente: ${senderName}] ` + text });
  if (sesiones[senderId].historial.length > 10) sesiones[senderId].historial = sesiones[senderId].historial.slice(-10);

  // FIX LÓGICA VENTA: Inyectamos la instrucción de vender la Evaluación con IA
  const prompt_instruccion_evaluacion = (sesiones[senderId].historial.length < 5)
      ? "🚨 RECUERDA: NO VENDER LA SESIÓN DIRECTA NI EL PRECIO COMPLETO. ENFATIZA SIEMPRE QUE EL SIGUIENTE PASO ES LA 'EVALUACIÓN CON IA (GRATIS Y VITAL)' antes de ofrecer el link."
      : "";

  const historialConInstruccion = [...sesiones[senderId].historial];
  historialConInstruccion.push({ role: "system", content: prompt_instruccion_evaluacion });

  const respuestaIA = await generarRespuestaIA(historialConInstruccion);
  
  if (respuestaIA.includes("ZARA_REPORTE_SOLICITADO")) {
      await sendMessage(senderId, generarReporteTexto("SEMANA"), platform);
  } else {
      // FIX LINK Y BOTÓN: Detectamos link y enviamos botón de Evaluación con IA
      if (respuestaIA.includes(AGENDA_URL) || respuestaIA.includes("AGENDAR_EVALUACION_LINK")) {
          const textoLimpio = respuestaIA.replace(AGENDA_URL, "").replace("AGENDAR_EVALUACION_LINK", "").trim();
          await sendButton(
              senderId, 
              textoLimpio || `¡Perfecto ${senderName}! El diagnóstico es gratis. Agenda aquí:`, 
              "📅 Agendar Evaluación con IA", 
              AGENDA_URL, 
              platform
          );
      } else {
          await sendMessage(senderId, respuestaIA, platform);
      }
      
      if (respuestaIA.includes("AGENDA_AQUI_LINK")) {
           setTimeout(async () => {
               const historialTotal = sesiones[senderId].historial.map(m => m.content).join(" ");
               await sendMessage(senderId, obtenerCrossSell(historialTotal), platform);
           }, 3000); 
      }
  }
  sesiones[senderId].historial.push({ role: "assistant", content: respuestaIA });
  reportarMonitor(senderId, "Zara Bot", respuestaIA, "zara").catch(() => {});
}
