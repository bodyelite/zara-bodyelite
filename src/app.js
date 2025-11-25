import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { NEGOCIO } from "../config/knowledge_base.js";

// Función para detectar números de teléfono en el texto
function extraerTelefono(texto) {
  // Busca secuencias de 8 o 9 dígitos (ej: 937648536 o 569...)
  const match = texto.match(/\b(\+?56)?(\s?9)\s?\d{4}\s?\d{4}\b/); 
  return match ? match[0] : null;
}

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text, senderName;

  // 1. Extraer datos según plataforma
  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    const contact = entry.changes[0].value.contacts?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
    senderName = contact?.profile?.name || "Usuario WhatsApp";
  } else {
    const msg = entry.messaging?.[0];
    if (!msg) return;
    senderId = msg.sender.id;
    text = msg.message?.text;
    senderName = "Usuario Instagram";
  }

  if (!text) return;
  console.log(`📩 De ${senderName} (${senderId}): ${text}`);

  // 2. LÓGICA DE CAPTURA DE LEAD (¿El cliente envió su número?)
  const posibleTelefono = extraerTelefono(text);

  if (posibleTelefono) {
    console.log("🚨 ¡LEAD DETECTADO! Número:", posibleTelefono);
    
    // A) Avisar al Staff (Recorre la lista de números del jefe)
    const mensajeParaStaff = `🚨 *NUEVO LEAD (PIDE LLAMADO)* 🚨\n\n👤 Nombre: ${senderName}\n📞 Teléfono dado: ${posibleTelefono}\n💬 Último mensaje: "${text}"\n📲 Canal: ${platform}`;
    
    for (const numeroStaff of NEGOCIO.staff_alertas) {
      await sendMessage(numeroStaff, mensajeParaStaff, "whatsapp");
    }

    // B) Responder al cliente confirmando
    await sendMessage(senderId, "¡Perfecto! 💙 Ya le envié tu contacto a nuestras especialistas. Te llamaremos lo antes posible para resolver tus dudas.", platform);
    return; // Cortamos aquí para que la IA no responda encima
  }

  // 3. Si no es un teléfono, responde la IA normal
  const respuestaIA = await generarRespuestaIA(text);
  await sendMessage(senderId, respuestaIA, platform);
}
