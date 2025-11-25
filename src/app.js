import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

const sesiones = {}; 
const usuariosPausados = {}; // Memoria de quién está pausado (hablando con humano)

function extraerTelefono(texto) {
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName;

  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario";
  } else {
    const msg = entry.messaging?.[0];
    if (!msg) return;
    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario IG";
  }

  if (!text) return;
  const mensajeLower = text.toLowerCase().trim();

  // --- COMANDOS DE CONTROL (PARA HUMANOS) ---
  
  // 1. Reactivar Bot
  if (mensajeLower === "retomar" || mensajeLower === "zara on") {
    usuariosPausados[senderId] = false;
    await sendMessage(senderId, "🤖 Zara reactivada. Estoy lista para ayudar de nuevo.", platform);
    return;
  }

  // 2. Pausar Bot Manualmente
  if (mensajeLower === "zara off" || mensajeLower === "silencio") {
    usuariosPausados[senderId] = true;
    // No confirmamos con mensaje para no ensuciar el chat del humano
    console.log(`⏸️ Bot pausado manualmente para ${senderName}`);
    return;
  }

  // 3. SI ESTÁ PAUSADO, IGNORAR TODO
  if (usuariosPausados[senderId]) {
    console.log(`🤐 Ignorando mensaje de ${senderName} (Modo Humano Activo)`);
    return;
  }

  // --- LÓGICA AUTOMÁTICA ---

  if (!sesiones[senderId]) sesiones[senderId] = [];

  // 4. DETECTAR TELÉFONO (LEAD) -> AUTO PAUSA
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    usuariosPausados[senderId] = true; // <--- AQUÍ SE PAUSA AUTOMÁTICAMENTE
    
    const alerta = `🚨 *LEAD CAPTURADO* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."\n\n⚠️ *Zara se ha pausado para este usuario.*`;
    
    for (const numero of NEGOCIO.staff_alertas) {
      await sendMessage(numero, alerta, "whatsapp");
    }
    
    await sendMessage(senderId, "¡Listo! 💙 Ya le pasé tu contacto a la especialista. Te llamaremos en breve.", platform);
    return;
  }

  // 5. IA NORMAL
  sesiones[senderId].push({ role: "user", content: text });
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });
  await sendMessage(senderId, respuestaIA, platform);
}
