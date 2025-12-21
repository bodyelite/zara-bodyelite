import { notificarStaff } from "../channels/meta.js";

export function procesarEtiquetas(textoIA, senderId, senderName, platform) {
    let estado = "LEAD"; 
    let limpio = textoIA;

    if (textoIA.includes("{CALL}") || /(\+?56)?9\d{8}/.test(textoIA)) {
        estado = "CAPTURED";
        console.log(`🚨 ALERTA LLAMADA: ${senderName}`);
        notificarStaff(senderName, "Dejó número o pidió llamada", platform);
    }

    if (textoIA.includes("{HOT}") || textoIA.toLowerCase().includes("agendar") || textoIA.includes("link")) {
        estado = "HOT";
    }

    limpio = limpio.replace(/{CALL}/g, "").replace(/{HOT}/g, "").replace(/{WARM}/g, "").trim();
    
    return { texto: limpio, estado };
}
