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

    // --- DETECCIÓN INTELIGENTE DE PLATAFORMA ---
    
    // CASO 1: WHATSAPP (Tiene 'changes')
    if (entry.changes && entry.changes[0] && entry.changes[0].value && entry.changes[0].value.messages) {
        platform = "whatsapp";
        const change = entry.changes[0].value;
        const msg = change.messages[0];
        
        senderId = msg.from;
        senderName = change.contacts?.[0]?.profile?.name || "Cliente WSP";
        
        if (msg.type === "text") text = msg.text.body;
        else text = "[Multimedia/Audio]";
    }
    
    // CASO 2: INSTAGRAM (Tiene 'messaging')
    else if (entry.messaging && entry.messaging[0]) {
        platform = "instagram";
        const msg = entry.messaging[0];
        
        senderId = msg.sender.id;
        senderName = "Usuario IG"; // IG no manda el nombre fácil en el webhook básico
        
        if (msg.message && msg.message.text) text = msg.message.text;
        else text = "[Multimedia/Audio]";
    }

    // Si no reconocemos nada, salimos sin romper el servidor
    if (!platform || !text || !senderId) return;

    // --- PROCESAMIENTO ---

    console.log(`📩 MENSAJE RECIBIDO (${platform}):`, text);

    registrarMensaje(senderId, senderName, text, "usuario", platform === "whatsapp" ? "wsp" : "ig");

    // Gestión de historial
    if (!sesiones[senderId]) sesiones[senderId] = [];
    sesiones[senderId].push({ role: "user", content: text });

    // Generar respuesta IA
    const reply = await generarRespuestaIA(sesiones[senderId]);

    // Guardar respuesta en historial
    sesiones[senderId].push({ role: "assistant", content: reply });

    // ENVIAR RESPUESTA
    await sendMessage(senderId, reply, platform);

    // Registrar en Monitor
    registrarMensaje(senderId, "Zara", reply, "zara", platform === "whatsapp" ? "wsp" : "ig");

  } catch (e) {
    console.error("❌ ERROR CRÍTICO EN PROCESAR EVENTO:", e);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva recibida:", data);
}
