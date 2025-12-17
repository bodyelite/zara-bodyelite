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

    // DETECCIÓN WHATSAPP
    if (entry.changes && entry.changes[0] && entry.changes[0].value && entry.changes[0].value.messages) {
        platform = "whatsapp";
        const change = entry.changes[0].value;
        const msg = change.messages[0];
        senderId = msg.from;
        senderName = change.contacts?.[0]?.profile?.name || "Cliente WSP";
        if (msg.type === "text") text = msg.text.body;
        else text = "[Multimedia/Audio]";
    }
    // DETECCIÓN INSTAGRAM
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];
        senderId = msg.sender.id;
        senderName = "Usuario IG"; 
        if (msg.message && msg.message.text) text = msg.message.text;
        else text = "[Multimedia/Audio]";
    }

    if (!platform || !text || !senderId) return;

    console.log(`📩 MENSAJE (${platform}):`, text);

    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    if (!sesiones[senderId]) sesiones[senderId] = [];
    sesiones[senderId].push({ role: "user", content: text });

    const reply = await generarRespuestaIA(sesiones[senderId]);
    sesiones[senderId].push({ role: "assistant", content: reply });

    await sendMessage(senderId, reply, platform);
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("❌ ERROR PROCESAR EVENTO:", e);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva recibida:", data);
}
