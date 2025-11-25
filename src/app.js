import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; 

function extraerTelefono(texto) {
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName, messageId;

  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;
  } else {
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return;

    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario IG";
    messageId = msg.message?.mid;
  }

  // FILTROS DE TIEMPO Y DUPLICADOS
  const ahora = Date.now();
  const ultimaVez = ultimasRespuestas[senderId] || 0;
  if (ahora - ultimaVez < 8000) return; // Candado de 8 seg

  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) {
    mensajesProcesados.add(messageId);
    if (mensajesProcesados.size > 1000) mensajesProcesados.clear();
  }

  if (!text) return;
  ultimasRespuestas[senderId] = ahora;
  const mensajeLower = text.toLowerCase().trim();
  console.log(`📩 Procesando: ${text}`);

  // --- COMANDOS DE CONTROL ---
  if (mensajeLower === "retomar" || mensajeLower === "zara on") {
    usuariosPausados[senderId] = false;
    await sendMessage(senderId, "🤖 Zara reactivada.", platform);
    return;
  }

  if (mensajeLower === "zara off" || mensajeLower === "silencio") {
    usuariosPausados[senderId] = true;
    console.log(`⏸️ Bot pausado para ${senderName}`);
    return; // No confirmamos al usuario, solo callamos
  }

  if (usuariosPausados[senderId]) return;

  // --- LÓGICA AUTOMÁTICA ---
  if (!sesiones[senderId]) sesiones[senderId] = [];

  // CAPTURA DE LEAD (PERO ZARA SIGUE VIVA)
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    // 1. Avisamos al Staff
    const alerta = `🚨 *LEAD DETECTADO* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
    for (const numero of NEGOCIO.staff_alertas) {
      await sendMessage(numero, alerta, "whatsapp");
    }
    
    // 2. Zara confirma la recepción amablemente (sin apagarse)
    const confirmacion = "¡Perfecto! 💙 Ya le pasé tu número a las especialistas. Te llamaremos muy pronto. Mientras tanto, ¿tienes alguna otra duda sobre los tratamientos?";
    
    sesiones[senderId].push({ role: "assistant", content: confirmacion });
    await sendMessage(senderId, confirmacion, platform);
    return;
  }

  // IA NORMAL
  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
  await sendMessage(senderId, respuestaIA, platform);
}
