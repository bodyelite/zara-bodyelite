import fs from "fs";
import path from "path"; // Importamos path para rutas absolutas
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";

const sesiones = {};

// --- FUNCIÓN MEJORADA PARA GUARDAR LOGS ---
function guardarLogFisico(origen, usuarioId, mensajeUsuario, respuestaZara) {
    try {
        const now = new Date();
        const fechaStr = now.toISOString().slice(0, 10);
        const horaStr = now.toLocaleTimeString('es-CL', { hour12: false });
        const logFileName = `${origen}-${fechaStr}.log`;
        
        // Usamos ruta absoluta para asegurar dónde se guarda
        const logPath = path.join(process.cwd(), logFileName);

        const logEntry = `[${horaStr}] ${usuarioId} - USER: ${mensajeUsuario}\n[${horaStr}] ${usuarioId} - ZARA: ${respuestaZara}\n---\n`;
        
        // Intentamos guardar y avisamos en consola
        console.log(`Intentando guardar log en: ${logPath}`);
        fs.appendFileSync(logPath, logEntry);
        console.log("Log guardado exitosamente.");

    } catch (e) {
        // Si falla, este error aparecerá en los logs de Render
        console.error(`🔥 ERROR CRÍTICO AL GUARDAR LOG FÍSICO DE ${origen}:`, e);
    }
}

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
    
    // Guardamos el log
    guardarLogFisico(origen, userId, mensajeUsuario, respuestaZara);
  }
}

export async function procesarReserva(data) {
    console.log("Procesando reserva...");
}
