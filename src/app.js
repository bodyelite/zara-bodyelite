import { sendMessage, getIgUserInfo, notifyStaff } from "./services/meta.js";
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
            senderName = change.contacts?.[0]?.profile?.name || "Amiga";
            text = msg.text?.body;
        } else {
            if (entry.messaging?.[0]?.message?.is_echo) return;
            const msgObj = entry.messaging[0];
            senderId = msgObj.sender.id;
            senderName = await getIgUserInfo(senderId);
            text = msgObj.message?.text;
        }

        if (!text) return;

        registrar(senderId, senderName, text, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        const rawReply = await generarRespuestaIA(sesiones[senderId].slice(-10), senderName);
        
        let estado = "LEAD";
        if (rawReply.includes("{HOT}")) estado = "HOT";
        if (rawReply.includes("{CALL}")) estado = "CAPTURED";
        
        const cleanReply = rawReply.replace(/{.*?}/g, "").trim();

        if (rawReply.includes("{CALL}")) notifyStaff(senderName, text, platform);

        await sendMessage(senderId, cleanReply, platform);
        
        sesiones[senderId].push({ role: "assistant", content: cleanReply });
        registrar(senderId, "Zara", cleanReply, "zara", platform, estado);

    } catch (e) { console.error("Error App:", e); }
}
