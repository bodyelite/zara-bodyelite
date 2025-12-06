import fs from "fs";
import { sendMessage, getWhatsAppMediaUrl, getInstagramUserProfile } from "./services/meta.js";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { downloadFile } from "./utils/download.js";
import { NEGOCIO } from "../config/knowledge_base.js";

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

function obtenerCrossSell(historialTexto) {
    const lower = (historialTexto || "").toLowerCase();
    if (lower.includes("cara") || lower.includes("rostro")) return "Dato Extra: ¡Tus tratamientos **Reductivos tienen un 20% OFF**! 🎁";
    if (lower.includes("cuerpo") || lower.includes("grasa")) return "Dato Extra: ¡Tus tratamientos **Faciales Antiage tienen un 20% OFF**! ✨";
    return "Dato Extra: ¡Tienes un **20% OFF** en tratamientos complementarios! ✨";
}

function generarReporteTexto(periodo) {
    const leadsWsp = metricas.leads_wsp.size;
    const leadsIg = metricas.leads_ig.size;
    const totalLeads = leadsWsp + leadsIg;
    const conversiones = metricas.llamadas + metricas.intencion_link + metricas.agendados;
    const tasa = totalLeads > 0 ? ((conversiones / totalLeads) * 100).toFixed(1) : "0.0";
    return `📊 *REPORTE ZARA* 📊\n👥 Leads Únicos: ${totalLeads}\n   WSP: ${leadsWsp} | IG: ${leadsIg}\n🎯 Conversiones: ${conversiones}\n   📞 Llamadas: ${metricas.llamadas}\n   🔗 Link: ${metricas.intencion_link}\n✅ Agendas Reservo: ${metricas.agendados}\n📈 Tasa: ${tasa}%`;
}

// --- PROCESAR RESERVA (COMPATIBLE CON SCRIPT RESERVO) ---
export async function procesarReserva(data) {
    // Solo procesamos si el status es CONFIRMADO (ignoramos intenciones vacías)
    if (data.status !== "CONFIRMADO" && !data.clientName) return;

    metricas.agendados++; 
    console.log("🚨 WEBHOOK RESERVO RECIBIDO:", JSON.stringify(data));
    
    const clientName = data.clientName || "Cliente Web";
    const date = data.date || "Fecha pendiente";
    const time = data.time || "Hora pendiente";
    const treatment = data.treatment || "Reserva Online";
    // Si Reservo no manda teléfono, ponemos aviso
    const contactPhone = data.contactPhone && data.contactPhone !== "N/A" ? data.contactPhone : "📲 (Ver en Reservo)";

    const alerta = `🎉 *NUEVA RESERVA WEB* 🎉\n\n👤 ${clientName}\n🗓️ ${date} a las ${time}\n✨ ${treatment}\n📞 ${contactPhone}\n🚀 Origen: Zara Bot`;
    
    for (const n of NEGOCIO.staff_alertas) { 
        try {
            await sendMessage(n, alerta, "whatsapp");
            console.log("✅ Alerta enviada a:", n);
        } catch(e) {
            console.error("❌ Falló alerta a:", n, e);
        }
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
  estadosClientes[senderId] = 'activo';

  if (!text) return;
  const lower = text.toLowerCase().trim();

  if (lower.startsWith("zara reporte")) { 
      await sendMessage(senderId, generarReporteTexto("GLOBAL"), platform); return; 
  }
  if (lower === "retomar") { usuariosPausados[senderId] = false; return; }
  if (lower.includes("silencio")) { usuariosPausados[senderId] = true; return; }
  if (usuariosPausados[senderId]) return;

  if (!sesiones[senderId]) sesiones[senderId] = [];
  if (lower.includes("link") || lower.includes("agenda")) { metricas.intencion_link++; estadosClientes[senderId] = 'agendado'; }

  const telefonoCapturado = extraerTelefono(text);
  if (telefonoCapturado) {
    metricas.llamadas++;
    estadosClientes[senderId] = 'agendado';
    const alerta = `🚨 *SOLICITUD DE LLAMADA* 🚨\n👤 ${senderName}\n📞 ${telefonoCapturado}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
    
    const confirm = "¡Perfecto! 💙 Ya avisé a las chicas. Te llamarán en unos minutos.";
    const historialTotal = sesiones[senderId].map(m => m.content).join(" ");
    await sendMessage(senderId, `${confirm}\n\n${obtenerCrossSell(historialTotal)}`, platform);
    return;
  }

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
