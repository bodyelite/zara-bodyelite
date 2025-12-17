import fs from "fs";
import path from "path";
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";

const sesiones = {};

// --- FUNCIÓN DE GUARDADO CON DEPURACIÓN EXTREMA ---
function guardarLogFisico(origen, usuarioId, mensajeUsuario, respuestaZara) {
    const now = new Date();
    const fechaStr = now.toISOString().slice(0, 10);
    const horaStr = now.toLocaleTimeString('es-CL', { hour12: false });
    const logFileName = `${origen}-${fechaStr}.log`;
    
    // Intentamos usar una ruta relativa simple primero
    const logPath = `./${logFileName}`;

    const logEntry = `[${horaStr}] ${usuarioId} - USER: ${mensajeUsuario}\n[${horaStr}] ${usuarioId} - ZARA: ${respuestaZara}\n---\n`;
    
    console.log(`📝 [DEBUG] Intentando guardar log de ${origen} en: ${logPath}`);
    
    try {
        // Verificamos si podemos escribir en el directorio actual
        fs.accessSync('.', fs.constants.W_OK);
        
        // Intentamos escribir
        fs.appendFileSync(logPath, logEntry);
        console.log(`✅ [DEBUG] Log de ${origen} guardado EXITOSAMENTE.`);
        
    } catch (e) {
        console.error(`🔥 [ERROR CRÍTICO] No se pudo guardar el log de ${origen}.`);
        console.error(`📂 Ruta intentada: ${logPath}`);
        console.error(`❌ Detalles del error:`, e);
        // Aquí podríamos intentar una ruta alternativa como /tmp/ si fuera necesario,
        // pero primero veamos por qué falla la ruta base.
    }
}
// ---------------------------------------------------

export async function procesarEvento(entry) {
  const change = entry.changes[0];
  const value = change.value;

  let origen = "desconocido";
  let plataforma = "whatsapp";

  if (value.messages) {
    origen = "wsp";
    plataforma = "whatsapp";
  } else if (value.messaging) {
    origen = "ig";
    plataforma = "instagram";
  }

  if (value.messages || value.messaging) {
    const message = value.messages ? value.messages[0] : value.messaging[0].message;
    const contact = value.contacts ? value.contacts[0] : (value.messaging ? value.messaging[0].sender : null);
    
    if (!message || !contact) return;

    const userId = contact.wa_id || contact.id;
    const userName = contact.profile?.name || "Cliente";
    
    if (!sesiones[userId]) sesiones[userId] = { historial: [], nombre: userName, origen: origen };
    
    let mensajeUsuario = "";
    if (message.type === "text") {
      mensajeUsuario = message.text.body;
    } else if (message.type === "audio") {
      mensajeUsuario = "[AUDIO RECIBIDO - Transcripción pendiente]";
    } else {
        mensajeUsuario = `[Archivo adjunto: ${message.type}]`;
    }

    sesiones[userId].historial.push({ role: "user", content: mensajeUsuario });
    if (sesiones[userId].historial.length > 20) sesiones[userId].historial = sesiones[userId].historial.slice(-20);

    let respuestaZara = await generarRespuestaIA(sesiones[userId].historial);
    
    if (respuestaZara.toLowerCase().includes("link") && respuestaZara.toLowerCase().includes("agenda")) {
        respuestaZara += `\n\n${NEGOCIO.agenda_link}`;
    }

    sesiones[userId].historial.push({ role: "assistant", content: respuestaZara });

    await sendMessage(userId, respuestaZara, plataforma);
    
    // INTENTO DE GUARDADO CON DEPURACIÓN
    guardarLogFisico(origen, userId, mensajeUsuario, respuestaZara);
  }
}

export async function procesarReserva(data) {
    console.log("Procesando reserva...");
}
