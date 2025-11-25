import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// MEMORIAS VOLÁTILES
const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); // <--- NUEVO: Lista de mensajes ya respondidos

function extraerTelefono(texto) {
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName, messageId;

  // 1. EXTRACTOR DE DATOS Y ID ÚNICO
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id; // ID único de WhatsApp
  } else {
    // INSTAGRAM
    const msg = entry.messaging?.[0];
    if (!msg) return;
    
    // Ignorar Ecos
    if (msg.message?.is_echo) return;

    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario IG";
    messageId = msg.message?.mid; // ID único de Instagram
  }

  // 2. FILTRO DE DUPLICADOS (LA SOLUCIÓN CLAVE) 🛑
  if (messageId && mensajesProcesados.has(messageId)) {
    console.log(`🚫 Mensaje duplicado detectado (${messageId}). Ignorando.`);
    return;
  }
  // Si es nuevo, lo guardamos en la lista
  if (messageId) {
    mensajesProcesados.add(messageId);
    // Limpieza de memoria simple: si la lista es gigante, la vaciamos
    if (mensajesProcesados.size > 1000) mensajesProcesados.clear();
  }

  if (!text) return;
  const mensajeLower = text.toLowerCase().trim();

  console.log(`📩 Procesando: ${text}`);

  // 3. COMANDOS DE CONTROL
  if (mensajeLower === "retomar" || mensajeLower === "zara on") {
    usuariosPausados[senderId] = false;
    await sendMessage(senderId, "🤖 Zara reactivada.", platform);
    return;
  }

  if (mensajeLower === "zara off" || mensajeLower === "silencio") {
    usuariosPausados[senderId] = true;
    console.log(`⏸️ Bot pausado para ${senderName}`);
    return;
  }

  if (usuariosPausados[senderId]) return;

  // 4. LÓGICA AUTOMÁTICA
  if (!sesiones[senderId]) sesiones[senderId] = [];

  // CAPTURA DE LEAD
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    usuariosPausados[senderId] = true; 
    const alerta = `🚨 *LEAD INSTAGRAM/WSP* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
    for (const numero of NEGOCIO.staff_alertas) {
      await sendMessage(numero, alerta, "whatsapp");
    }
    await sendMessage(senderId, "¡Listo! 💙 Ya le pasé tu contacto a la especialista. Te llamaremos en breve.", platform);
    return;
  }

  // IA
  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
  await sendMessage(senderId, respuestaIA, platform);
}
