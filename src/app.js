import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
  try {
    let platform = null;
    let senderId = null;
    let senderName = "Usuario";
    let text = null;

    if (entry.changes && entry.changes[0]?.value?.messages) {
        platform = "whatsapp";
        const msg = entry.changes[0].value.messages[0];
        senderId = msg.from;
        senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "WSP User";
        text = msg.type === "text" ? msg.text.body : "[Multimedia]";
    }
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];
        senderId = msg.sender.id;
        senderName = "IG User"; 
        text = msg.message?.text || "[Multimedia]";
    }

    if (!platform || !text || !senderId) return;

    console.log(`📩 IN (${platform}): ${text}`);
    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    if (!sesiones[senderId]) sesiones[senderId] = [];
    sesiones[senderId].push({ role: "user", content: text });

    const reply = await generarRespuestaIA(sesiones[senderId]);
    
    sesiones[senderId].push({ role: "assistant", content: reply });
    
    await sendMessage(senderId, reply, platform);
    
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("ERROR APP:", e);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva:", data);
}
