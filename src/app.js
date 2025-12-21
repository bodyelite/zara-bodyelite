import { sendMessage, getIgUserInfo, notifyStaff } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { registrar } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
    const platform = entry.changes ? "whatsapp" : "instagram";
    let senderId, text, senderName, campaignContext = "";

    try {
        if (platform === "whatsapp") {
            const change = entry.changes[0].value;
            if (!change.messages || change.messages.length === 0) return;
            const msg = change.messages[0];
            
            senderId = msg.from;
            senderName = change.contacts?.[0]?.profile?.name || "Amiga";
            text = msg.text?.body;
            
            if (change.messages[0].referral) {
                campaignContext = `Viene de anuncio: ${change.messages[0].referral.headline || "Promo Redes"}`;
            }
        } else {
            if (entry.messaging?.[0]?.message?.is_echo) return;
            const msgObj = entry.messaging[0];
            senderId = msgObj.sender.id;
            senderName = await getIgUserInfo(senderId);
            text = msgObj.message?.text;
            
            if (msgObj.postback?.referral || msgObj.referral) {
                const ref = msgObj.postback?.referral || msgObj.referral;
                campaignContext = `VIENE DE CAMPAÑA IG (Ad ID: ${ref.ad_id || 'N/A'}).`;
                console.log("🔥 CAMPAÑA DETECTADA:", campaignContext);
            }
        }

        if (!text) return;

        const textoRegistro = campaignContext ? `[CAMPAÑA] ${text}` : text;
        registrar(senderId, senderName, textoRegistro, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        const rawReply = await generarRespuestaIA(sesiones[senderId].slice(-10), senderName, campaignContext);
        
        let cleanReply = rawReply;
        if (rawReply.includes("{HOT}") || rawReply.includes("{ALERT}") || rawReply.toLowerCase().includes("agendar")) {
            cleanReply = rawReply.replace("{HOT}", "").replace("{ALERT}", "").replace("{WARM}", "").replace("{COLD}", "").trim();
            notifyStaff(senderName, text, platform);
        }

        console.log(`🤖 Zara a ${senderName}: ${cleanReply}`);
        await sendMessage(senderId, cleanReply, platform);
        
        sesiones[senderId].push({ role: "assistant", content: cleanReply });
        registrar(senderId, "Zara", cleanReply, "zara", platform);

    } catch (e) {
        console.error("❌ Error App:", e);
    }
}
