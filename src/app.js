import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage, getIgUserInfo } from "./services/meta.js";
import { registrarMensaje } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
  try {
    let platform = null;
    let senderId = null;
    let senderName = "Cliente";
    let text = null;

    // WHATSAPP
    if (entry.changes && entry.changes[0]?.value?.messages) {
        platform = "whatsapp";
        const msg = entry.changes[0].value.messages[0];
        if (msg.from === process.env.PHONE_NUMBER_ID) return; // Anti-Bucle WSP
        senderId = msg.from;
        senderName = entry.changes[0].value.contacts?.[0]?.profile?.name || "Cliente";
        text = msg.type === "text" ? msg.text.body : "[Multimedia]";
    }
    // INSTAGRAM
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];

        // 🛑 FILTRO CRÍTICO ANTI-ECO IG 🛑
        // Si el mensaje lo envió la página (is_echo) o es de entrega/lectura, IGNORAR.
        if (msg.message?.is_echo || msg.delivery || msg.read || !msg.message) return;

        senderId = msg.sender.id;
        // Obtenemos el nombre real
        senderName = await getIgUserInfo(senderId);
        text = msg.message.text || "[Multimedia]";
    }

    if (!platform || !text || !senderId) return;

    // Log para terminal
    console.log(`📩 IN (${platform}): ${text} [De: ${senderName}]`);
    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    if (!sesiones[senderId]) sesiones[senderId] = [];
    
    // Inyectamos el nombre al contexto de la IA
    sesiones[senderId].push({ role: "user", content: `[Soy: ${senderName}] ${text}` });

    const reply = await generarRespuestaIA(sesiones[senderId]);
    sesiones[senderId].push({ role: "assistant", content: reply });
    
    await sendMessage(senderId, reply, platform);
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("APP ERROR:", e.message);
  }
}
