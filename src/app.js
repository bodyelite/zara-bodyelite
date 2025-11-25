import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; 

function extraerTelefono(texto) {
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName;
  let isEcho = false; // Variable para detectar si soy yo mismo

  // 1. EXTRACTOR DE DATOS SEGÚN PLATAFORMA
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario";
    // WhatsApp no suele enviar ecos por este webhook, pero por seguridad:
    if (msg.id && !text) return; 
  } else {
    // INSTAGRAM
    const msg = entry.messaging?.[0];
    if (!msg) return;
    
    // 🚨 DETECTOR DE ECO (AQUÍ ESTÁ LA SOLUCIÓN)
    if (msg.message?.is_echo) {
      console.log("🔇 Ignorando mensaje propio (Eco de Instagram)");
      return;
    }

    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario IG";
  }

  if (!text) return;
  const mensajeLower = text.toLowerCase().trim();

  // --- LOGS ---
  console.log(`📩 De ${senderName} (${senderId}): ${text}`);

  // --- COMANDOS DE CONTROL ---
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

  // --- LÓGICA AUTOMÁTICA ---
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
