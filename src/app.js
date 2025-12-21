import { sendMessage, getIgUserInfo, notifyStaff } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { registrar } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
    const platform = entry.changes ? "whatsapp" : "instagram";
    let senderId, text, senderName, campaignContext = "";

    try {
        // --- 1. EXTRACCIÓN ---
        if (platform === "whatsapp") {
            const change = entry.changes[0].value;
            if (!change.messages || change.messages.length === 0) return;
            const msg = change.messages[0];
            senderId = msg.from;
            senderName = change.contacts?.[0]?.profile?.name || "Amiga";
            text = msg.text?.body;
            if (change.messages[0].referral) campaignContext = `Ads: ${change.messages[0].referral.headline}`;
        } else {
            if (entry.messaging?.[0]?.message?.is_echo) return;
            const msgObj = entry.messaging[0];
            senderId = msgObj.sender.id;
            senderName = await getIgUserInfo(senderId);
            text = msgObj.message?.text;
            if (msgObj.postback?.referral || msgObj.referral) {
                const ref = msgObj.postback?.referral || msgObj.referral;
                campaignContext = `Ads IG (ID: ${ref.ad_id || 'N/A'})`;
            }
        }

        if (!text) return;

        const textoRegistro = campaignContext ? `[CAMPAÑA] ${text}` : text;
        registrar(senderId, senderName, textoRegistro, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        // --- 2. CEREBRO ---
        const rawReply = await generarRespuestaIA(sesiones[senderId].slice(-10), senderName, campaignContext);
        
        // --- 3. LÓGICA DE ALERTA CORREGIDA (SOLO CALL O ALERT) ---
        let cleanReply = rawReply;
        
        // Limpiamos TODAS las etiquetas para el usuario
        cleanReply = rawReply
            .replace("{HOT}", "")
            .replace("{WARM}", "")
            .replace("{COLD}", "")
            .replace("{CALL}", "")
            .replace("{ALERT}", "")
            .trim();

        // Solo disparamos notificación si es URGENTE REAL
        if (rawReply.includes("{CALL}") || rawReply.includes("{ALERT}")) {
            console.log("🚨 ALERTA DISPARADA: El usuario pidió llamada o tiene problema.");
            notifyStaff(senderName, text, platform);
        }

        // --- 4. RESPUESTA ---
        await sendMessage(senderId, cleanReply, platform);
        
        sesiones[senderId].push({ role: "assistant", content: cleanReply });
        registrar(senderId, "Zara", cleanReply, "zara", platform);

    } catch (e) { console.error("❌ Error App:", e); }
}
