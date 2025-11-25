import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// MEMORIA
const sesiones = {}; 
const usuariosPausados = {}; 
const mensajesProcesados = new Set(); 
const ultimasRespuestas = {}; // <--- NUEVO: Candado de tiempo por usuario

function extraerTelefono(texto) {
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName, messageId;

  // 1. EXTRAER DATOS
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario";
    messageId = msg.id;
  } else {
    // INSTAGRAM
    const msg = entry.messaging?.[0];
    if (!msg) return;
    if (msg.message?.is_echo) return; // Ignorar eco

    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario IG";
    messageId = msg.message?.mid;
  }

  // 2. FILTRO DURO: ANTI-SPAM DE TIEMPO (10 Segundos)
  const ahora = Date.now();
  const ultimaVez = ultimasRespuestas[senderId] || 0;
  
  // Si le respondimos hace menos de 8 segundos, ignoramos cualquier cosa que llegue
  if (ahora - ultimaVez < 8000) {
    console.log(`🛡️ Bloqueando doble respuesta para ${senderId} (Candado activo)`);
    return;
  }

  // 3. FILTRO DE ID (Capa extra de seguridad)
  if (messageId && mensajesProcesados.has(messageId)) return;
  if (messageId) {
    mensajesProcesados.add(messageId);
    if (mensajesProcesados.size > 1000) mensajesProcesados.clear();
  }

  if (!text) return;
  
  // ACTIVAR EL CANDADO AHORA MISMO
  ultimasRespuestas[senderId] = ahora;

  const mensajeLower = text.toLowerCase().trim();
  console.log(`📩 Procesando: ${text}`);

  // 4. COMANDOS
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

  // 5. LÓGICA AUTOMÁTICA
  if (!sesiones[senderId]) sesiones[senderId] = [];

  // CAPTURA DE LEAD
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    usuariosPausados[senderId] = true; 
    const alerta = `🚨 *LEAD DETECTADO* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
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
