import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
  try {
    let platform = null;
    let senderId = null;
    let senderName = "Cliente";
    let text = null;

    // --- DETECCIÓN WHATSAPP ---
    if (entry.changes && entry.changes[0]?.value?.messages) {
        platform = "whatsapp";
        const value = entry.changes[0].value;
        const msg = value.messages[0];
        
        // Anti-Bucle WSP (por si acaso)
        if (msg.from === process.env.PHONE_NUMBER_ID) return;

        senderId = msg.from;
        senderName = value.contacts?.[0]?.profile?.name || "Cliente";
        text = msg.type === "text" ? msg.text.body : "[Multimedia]";
    }
    // --- DETECCIÓN INSTAGRAM ---
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];

        // 🛑 ESCUDO ANTI-ECO (CRÍTICO PARA INSTAGRAM)
        if (msg.message?.is_echo || msg.delivery || msg.read || !msg.message) {
            return; 
        }

        senderId = msg.sender.id;
        senderName = "Usuario IG"; // IG no da el nombre en el webhook simple
        text = msg.message.text || "[Multimedia]";
    }

    if (!platform || !text || !senderId) return;

    console.log(`📩 IN (${platform}): ${text} [De: ${senderName}]`);
    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    if (!sesiones[senderId]) sesiones[senderId] = [];
    
    // Inyectamos el nombre en el mensaje para que la IA sepa a quién le habla
    // Esto obliga a Zara a usar el nombre si está disponible
    const mensajeContextualizado = `[Nombre del Cliente: ${senderName}] ${text}`;
    
    sesiones[senderId].push({ role: "user", content: mensajeContextualizado });

    const reply = await generarRespuestaIA(sesiones[senderId]);
    
    sesiones[senderId].push({ role: "assistant", content: reply });
    
    await sendMessage(senderId, reply, platform);
    
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("ERROR APP:", e.message);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva:", data);
}
