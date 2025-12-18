import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage, getIgUserInfo } from "./services/meta.js";
import { registrarMensaje } from "./utils/memory.js";

const sesiones = {};
const processedIds = new Set(); // 🧠 MEMORIA DE IDs PROCESADOS

export async function procesarEvento(entry) {
  try {
    let platform = null;
    let senderId = null;
    let senderName = "Cliente";
    let text = null;
    let msgId = null;

    // --- WHATSAPP ---
    if (entry.changes && entry.changes[0]?.value?.messages) {
        platform = "whatsapp";
        const msg = entry.changes[0].value.messages[0];
        
        if (msg.from === process.env.PHONE_NUMBER_ID) return; 

        msgId = msg.id; // ID ÚNICO DEL MENSAJE
        senderId = msg.from;
        senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
        text = msg.type === "text" ? msg.text.body : "[Multimedia]";
    }
    // --- INSTAGRAM ---
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];

        if (msg.message?.is_echo || msg.delivery || msg.read || !msg.message) return;

        msgId = msg.message.mid; // ID ÚNICO DEL MENSAJE IG
        senderId = msg.sender.id;
        senderName = await getIgUserInfo(senderId);
        text = msg.message.text || "[Multimedia]";
    }

    if (!platform || !text || !senderId) return;

    // 🛑 ZONA DE DEDUPLICACIÓN 🛑
    if (msgId) {
        if (processedIds.has(msgId)) {
            console.log(`🔁 DUPLICADO DETECTADO Y BLOQUEADO: ${msgId}`);
            return; // ¡AQUÍ SE DETIENE LA REPETICIÓN!
        }
        processedIds.add(msgId);
        // Limpiamos memoria si crece mucho para no saturar
        if (processedIds.size > 500) processedIds.clear();
    }

    console.log(`📩 IN (${platform}): ${text} [De: ${senderName}]`);
    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    if (!sesiones[senderId]) sesiones[senderId] = [];
    
    // Inyectamos nombre para forzar personalización
    sesiones[senderId].push({ role: "user", content: `[Soy: ${senderName}] ${text}` });

    const reply = await generarRespuestaIA(sesiones[senderId]);
    sesiones[senderId].push({ role: "assistant", content: reply });
    
    await sendMessage(senderId, reply, platform);
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("APP ERROR:", e.message);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva:", data);
}
