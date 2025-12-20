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
            if (!change.messages) return;
            
            const msg = change.messages[0];
            senderId = msg.from;
            senderName = change.contacts?.[0]?.profile?.name || "Wsp User";
            text = msg.text?.body;
        } else {
            if (entry.messaging?.[0]?.message?.is_echo) return;
            senderId = entry.messaging[0].sender.id;
            // AQUI ESTABA EL ERROR: Ahora llamamos a la función con el nombre correcto
            senderName = await getIgUserInfo(senderId);
            text = entry.messaging[0].message?.text;
        }

        if (!text) return;

        registrar(senderId, senderName, text, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        const reply = await generarRespuestaIA(sesiones[senderId].slice(-10));
        
        await sendMessage(senderId, reply, platform);
        
        sesiones[senderId].push({ role: "assistant", content: reply });
        registrar(senderId, "Zara", reply, "zara", platform);

    } catch (e) {
        console.error("Error procesando evento:", e);
    }
}
