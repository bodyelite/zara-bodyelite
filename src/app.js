import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// MEMORIA TEMPORAL (Se borra si reinicias el servidor)
const sesiones = {}; 

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

  // 1. INICIALIZAR MEMORIA SI ES NUEVO
  if (!sesiones[senderId]) {
    sesiones[senderId] = [];
  }

  // 2. DETECTAR TELÉFONO (LEAD) - Esto corta el flujo normal
  const posibleTelefono = extraerTelefono(text);
  if (posibleTelefono) {
    const alerta = `🚨 *LEAD PIDE LLAMADO* 🚨\n👤 ${senderName}\n📞 ${posibleTelefono}\n💬 Contexto: "...${sesiones[senderId].slice(-2).map(m => m.content).join(' | ')}..."`;
    
    for (const numero of NEGOCIO.staff_alertas) {
      await sendMessage(numero, alerta, "whatsapp");
    }
    await sendMessage(senderId, "¡Listo! 💙 Ya le pasé tu contacto a la especialista clínica. Te llamaremos en breve.", platform);
    return;
  }

  // 3. AGREGAR MENSAJE DEL USUARIO AL HISTORIAL
  sesiones[senderId].push({ role: "user", content: text });

  // Limitar memoria a los últimos 10 mensajes para no gastar tanto saldo
  if (sesiones[senderId].length > 10) sesiones[senderId] = sesiones[senderId].slice(-10);

  // 4. GENERAR RESPUESTA CON CONTEXTO
  const respuestaIA = await generarRespuestaIA(sesiones[senderId]);

  // 5. AGREGAR RESPUESTA DEL BOT AL HISTORIAL
  sesiones[senderId].push({ role: "assistant", content: respuestaIA });

  // 6. ENVIAR
  await sendMessage(senderId, respuestaIA, platform);
}
