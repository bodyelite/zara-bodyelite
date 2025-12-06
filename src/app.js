import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl, getInstagramUserProfile } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// PERSISTENCIA SIMPLE EN MEMORIA
const metricas = { leads_wsp: new Set(), leads_ig: new Set(), mensajes_totales: 0, llamadas: 0, intencion_link: 0, agendados: 0 };
const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 
const estadosClientes = {};

function extraerTelefono(texto) {
  if (!texto) return null;
  const match = texto.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/); 
  if (match) return match[0].replace(/\D/g, ''); 
  return null;
}

function esHorarioPrudente() {
    const now = new Date();
    const horaChile = (now.getUTCHours() - 3 + 24) % 24; 
    return horaChile >= 9 && horaChile < 20.5; 
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

const TIEMPO_DORMIDO = 2 * 60 * 60 * 1000; 
const INTERVALO_CHECK = 10 * 60 * 1000;

setInterval(() => {
    if (!esHorarioPrudente()) return;
    Object.keys(ultimasRespuestas).forEach(async (senderId) => {
        const ultimoMsj = ultimasRespuestas[senderId];
        const estado = estadosClientes[senderId] || 'activo';
        if ((Date.now() - ultimoMsj) > TIEMPO_DORMIDO && estado !== 'agendado' && estado !== 'nudged' && !usuariosPausados[senderId]) {
            await sendMessage(senderId, "¿Aún no te decides? 🤔 El **Diagnóstico con IA** es un regalo de Body Elite 🎁. ¿Te agendo?", "whatsapp"); 
            estadosClientes[senderId] = 'nudged'; 
        }
    });
}, INTERVALO_CHECK);

function obtenerCrossSell(historialTexto) {
    const lower = (historialTexto || "").toLowerCase();
    if (lower.includes("cara") || lower.includes("rostro") || lower.includes("arruga")) return "Dato Extra: ¡Tus tratamientos **Reductivos tienen un 20% OFF**! 🎁";
    if (lower.includes("cuerpo") || lower.includes("grasa") || lower.includes("lipo")) return "Dato Extra: ¡Tus tratamientos **Faciales Antiage tienen un 20% OFF**! ✨";
    return "Dato Extra: ¡Tienes un **20% OFF** en tratamientos complementarios! ✨";
}

function generarReporteTexto(periodo) {
    const leadsWsp = metricas.leads_wsp.size;
    const leadsIg = metricas.leads_ig.size;
    const totalLeads = leadsWsp + leadsIg;
    const conversiones = metricas.llamadas + metricas.intencion_link + metricas.agendados;
    const tasa = totalLeads > 0 ? ((conversiones / totalLeads) * 100).toFixed(1) : "0.0";
    return `📊 *REPORTE ZARA* 📊\n👥 Leads Únicos: ${totalLeads}\n   WSP: ${leadsWsp} | IG: ${leadsIg}\n🎯 Conversiones: ${conversiones}\n   📞 Llamadas: ${metricas.llamadas}\n   🔗 Pidieron Link: ${metricas.intencion_link}\n✅ Agendas Reservo: ${metricas.agendados}\n📈 Tasa: ${tasa}%`;
}

// --- FUNCIÓN CRÍTICA: PROCESAR RESERVA ---
export async function procesarReserva(data) {
    // 1. Aumentamos el contador SIEMPRE que se llame a esta función
    metricas.agendados++; 
    
    console.log("🔥🔥🔥 WEBHOOK RESERVO EJECUTÁNDOSE 🔥🔥🔥");
    console.log("DATA RECIBIDA:", JSON.stringify(data));

    const clientName = data.clientName || data.name || "Cliente Web";
    const date = data.date || "Fecha por confirmar";
    const time = data.time || "Hora por confirmar";
    const treatment = data.treatment || data.service || "Evaluación";
    const contactPhone = data.contactPhone || data.phone || "N/A";

    const alerta = `🎉 *NUEVA RESERVA CONFIRMADA* 🎉\n\n👤 Cliente: ${clientName}\n📞 Fono: ${contactPhone}\n🗓️ Fecha: ${date} a las ${time}\n✨ Tratamiento: ${treatment}\n🚀 Origen: Zara Bot`;

    // 2. Enviar Alerta a Staff
    for (const n of NEGOCIO.staff_alertas) { 
        try {
            await sendMessage(n, alerta, "whatsapp");
            console.log(`✅ Alerta enviada a ${n}`);
        } catch(e) {
            console.error(`❌ Falló envío a ${n}:`, e);
        }
    }
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text = "", senderName, messageId;
  metricas.mensajes_totales++;

  // Extracción básica de datos (simplificada para legibilidad)
  if (platform === "whatsapp") {
      const msg = entry.changes[0].value.messages?.[0];
      if (!msg) return;
      senderId = msg.from; metricas.leads_wsp.add(senderId);
      senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente"; messageId = msg.id;
      if (msg.type === "text") text = msg.text.body;
  } else { 
      const msg = entry.messaging?.[0];
      if (!msg || msg.message?.is_echo) return;
      senderId = msg.sender.id; metricas.leads_ig.add(senderId);
      const igName = await getInstagramUserProfile(senderId);
      senderName = igName || "Amiga";
      if (msg.message?.text) text = msg.message.text;
  }

  const now = Date.now();
  if ((now - (ultimasRespuestas[senderId] || 0)) < 2000) return; // Anti-spam 2s
  ultimasRespuestas[senderId] = now;
  estadosClientes[senderId] = 'activo';

  if (!text) return;
  const lower = text.toLowerCase().trim();

  // COMANDOS INTERNOS
  if (lower.startsWith("zara reporte") || lower === "reporte") { 
      await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform); return; 
  }
  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];
  if (lower.includes("link") || lower.includes("agenda")) { metricas.intencion_link++; estadosClientes[senderId] = 'agendado'; }

  // DETECTAR TELÉFONO
  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas++;
    estadosClientes[senderId] = 'agendado';
    const enHorario = esHorarioLaboral();
    const estado = enHorario ? "✅ LLAMAR AHORA" : "🌙 FUERA DE HORARIO";
    const alerta = `🚨 *SOLICITUD DE LLAMADA* 🚨\n⏰ ${estado}\n👤 ${senderName}\n📞 ${telefonoCapturado}`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    
    const confirm = enHorario ? "¡Perfecto! 💙 Ya avisé a las chicas." : "¡Listo! 🌙 Te llamaremos mañana.";
    const historialTotal = sesiones[senderId].map(m => m.content).join(" ");
    await sendMessage(senderId, `${confirm}\n\n${obtenerCrossSell(historialTotal)}`, platform);
    return;
  }

  // IA
  sesiones[senderId].push({ role: "user", content: `[Cliente: ${senderName}] ` + text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  
  if (respuestaIA.includes("ZARA_REPORTE_SOLICITADO")) {
      await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform);
  } else {
      await sendMessage(senderId, respuestaIA, platform);
      if (respuestaIA.includes("AGENDA_AQUI_LINK")) {
           setTimeout(async () => {
               const historialTotal = sesiones[senderId].map(m => m.content).join(" ");
               await sendMessage(senderId, obtenerCrossSell(historialTotal), platform);
           }, 3000); 
      }
  }
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
}
