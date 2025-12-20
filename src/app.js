import { sendMessage, getIgUserInfo } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { registrar } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
    const platform = entry.changes ? "whatsapp" : "instagram";
    let senderId, text, senderName;

    try {
        if (platform === "whatsapp") {
            const change = entry.changes[0].value;
            
            // FILTRO DE SEGURIDAD: Si no es mensaje (ej: status update), ignorar
            if (!change.messages || change.messages.length === 0) return;
            
            const msg = change.messages[0];
            senderId = msg.from;
            senderName = change.contacts?.[0]?.profile?.name || "Wsp User";
            text = msg.text?.body;
        } else {
            if (entry.messaging?.[0]?.message?.is_echo) return;
            senderId = entry.messaging[0].sender.id;
            senderName = await getIgUserInfo(senderId);
            text = entry.messaging[0].message?.text;
        }

        if (!text) return;

        console.log(`📨 [${platform.toUpperCase()}] Mensaje de ${senderName}: ${text}`);
        
        // 1. Guardar mensaje usuario
        registrar(senderId, senderName, text, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        // 2. Generar respuesta
        const reply = await generarRespuestaIA(sesiones[senderId].slice(-10));
        console.log(`🤖 [IA] Responde: ${reply}`);
        
        // 3. Enviar a Meta
        await sendMessage(senderId, reply, platform);
        
        // 4. Guardar respuesta Zara
        sesiones[senderId].push({ role: "assistant", content: reply });
        registrar(senderId, "Zara", reply, "zara", platform);

    } catch (e) {
        console.error("❌ ERROR EN PROCESAR EVENTO:", e);
    }
}
