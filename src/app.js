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

        console.log(`📨 [ENTRADA ${platform}] De: ${senderName} | Msg: ${text}`);

        // 1. INTENTAR GUARDAR EN MEMORIA
        try {
            registrar(senderId, senderName, text, "usuario", platform);
        } catch (err) {
            console.error("❌ ERROR CRÍTICO MEMORIA (USUARIO):", err);
        }

        // 2. CONTEXTO IA
        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        // 3. GENERAR RESPUESTA
        let reply;
        try {
            reply = await generarRespuestaIA(sesiones[senderId].slice(-10));
        } catch (err) {
            console.error("❌ ERROR OPENAI:", err);
            reply = "Estoy teniendo un pequeño problema técnico, dame un segundo. ⏳";
        }
        
        console.log(`🤖 [SALIDA IA] ${reply}`);

        // 4. ENVIAR A META
        await sendMessage(senderId, reply, platform);

        // 5. GUARDAR RESPUESTA IA
        sesiones[senderId].push({ role: "assistant", content: reply });
        try {
            registrar(senderId, "Zara", reply, "zara", platform);
        } catch (err) {
            console.error("❌ ERROR CRÍTICO MEMORIA (ZARA):", err);
        }

    } catch (e) {
        console.error("❌❌ ERROR GENERAL EN APP.JS:", e);
    }
}
