import { sendMessage, getIgUserInfo, notifyStaff } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";
import { registrar } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
    const platform = entry.changes ? "whatsapp" : "instagram";
    let senderId, text, senderName, campaignContext = "";

    try {
        // --- 1. EXTRACCIÓN DE DATOS Y CAMPAÑAS ---
        if (platform === "whatsapp") {
            const change = entry.changes[0].value;
            if (!change.messages || change.messages.length === 0) return;
            const msg = change.messages[0];
            
            senderId = msg.from;
            senderName = change.contacts?.[0]?.profile?.name || "Amiga";
            text = msg.text?.body;
            
            // Detección básica de referencia (si viene en el mensaje)
            if (change.messages[0].referral) {
                campaignContext = `Viene de anuncio: ${change.messages[0].referral.headline || "Promo Redes"}`;
            }

        } else {
            // INSTAGRAM
            if (entry.messaging?.[0]?.message?.is_echo) return;
            const msgObj = entry.messaging[0];
            senderId = msgObj.sender.id;
            senderName = await getIgUserInfo(senderId);
            text = msgObj.message?.text;
            
            // Detección Campaña IG (referral en postback o mensaje)
            if (msgObj.postback?.referral || msgObj.referral) {
                const ref = msgObj.postback?.referral || msgObj.referral;
                campaignContext = `VIENE DE CAMPAÑA IG (Ad ID: ${ref.ad_id || 'N/A'}). Interesada en el anuncio que vio.`;
                console.log("🔥 CAMPAÑA DETECTADA:", campaignContext);
            }
        }

        if (!text) return;

        // --- 2. REGISTRO EN MEMORIA Y CONTEXTO ---
        // Si hay campaña nueva, la agregamos al historial visual del usuario
        const textoRegistro = campaignContext ? `[CAMPAÑA] ${text}` : text;
        registrar(senderId, senderName, textoRegistro, "usuario", platform);

        if (!sesiones[senderId]) sesiones[senderId] = [];
        sesiones[senderId].push({ role: "user", content: text });

        // --- 3. CEREBRO IA ---
        // Pasamos historial + Nombre real + Contexto de campaña si existe
        const rawReply = await generarRespuestaIA(sesiones[senderId].slice(-10), senderName, campaignContext);
        
        // --- 4. PROCESAMIENTO DE ETIQUETAS (HOT/ALERT) ---
        // Zara nos devuelve etiquetas ocultas {HOT}, {ALERT} que definimos en personalidad.js
        let cleanReply = rawReply;
        let esUrgente = false;

        if (rawReply.includes("{HOT}") || rawReply.includes("{ALERT}") || rawReply.toLowerCase().includes("agendar")) {
            esUrgente = true;
            // Limpiamos las etiquetas para el usuario final
            cleanReply = rawReply.replace("{HOT}", "").replace("{ALERT}", "").replace("{WARM}", "").replace("{COLD}", "").trim();
            
            // 🚨 DISPARAR ALERTA AL STAFF
            notifyStaff(senderName, text, platform);
        }

        // --- 5. RESPUESTA ---
        console.log(`🤖 Zara a ${senderName}: ${cleanReply}`);
        await sendMessage(senderId, cleanReply, platform);
        
        sesiones[senderId].push({ role: "assistant", content: cleanReply }); // Guardamos lo limpio
        registrar(senderId, "Zara", cleanReply, "zara", platform);

    } catch (e) {
        console.error("❌ Error App:", e);
    }
}
