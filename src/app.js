import fs from "fs"; // Importante para guardar los logs físicos
import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
// SE ELIMINÓ 'markAsRead' DE LA IMPORTACIÓN
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";

// Memoria volátil para el contexto de la sesión (se reinicia si el servidor cae)
const sesiones = {};

// --- FUNCIÓN AUXILIAR PARA GUARDAR LOGS FÍSICOS ---
function guardarLogFisico(origen, usuarioId, mensajeUsuario, respuestaZara) {
    try {
        const now = new Date();
        const fechaStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const horaStr = now.toLocaleTimeString('es-CL', { hour12: false });
        // El nombre del archivo depende del origen (wsp-FECHA.log o ig-FECHA.log)
        // CORREGIDO: Sin barras invertidas extra
        const logFileName = `${origen}-${fechaStr}.log`;
        
        // Formato estándar para que el monitor lo pueda leer
        // CORREGIDO: Sin barras invertidas extra
        const logEntry = `[${horaStr}] ${usuarioId} - USER: ${mensajeUsuario}\n[${horaStr}] ${usuarioId} - ZARA: ${respuestaZara}\n---\n`;

        // 'appendFileSync' crea el archivo si no existe y agrega al final
        fs.appendFileSync(logFileName, logEntry);
    } catch (e) {
        console.error(`Error crítico guardando log físico de ${origen}:`, e);
    }
}
// ---------------------------------------------------

export async function procesarEvento(entry) {
  const change = entry.changes[0];
  const value = change.value;

  // Detección de Origen (WhatsApp o Instagram)
  let origen = "desconocido";
  let plataforma = "whatsapp"; // Por defecto para sendMessage

  if (value.messages) {
    origen = "wsp"; // Es WhatsApp
    plataforma = "whatsapp";
  } else if (value.messaging) {
    origen = "ig"; // Es Instagram (generalmente viene en 'messaging')
    plataforma = "instagram"; // (Aunque la API de envío a veces usa 'whatsapp' para ambos, lo dejamos preparado)
  }

  if (value.messages || value.messaging) {
    const message = value.messages ? value.messages[0] : value.messaging[0].message;
    const contact = value.contacts ? value.contacts[0] : (value.messaging ? value.messaging[0].sender : null);
    
    if (!message || !contact) return;

    const userId = contact.wa_id || contact.id; // ID del usuario (teléfono o ID de IG)
    const userName = contact.profile?.name || "Cliente";
    
    // SE ELIMINÓ LA LLAMADA A 'markAsRead' PORQUE NO EXISTE LA FUNCIÓN
    // if (message.id) await markAsRead(message.id, plataforma);

    // Gestión de Sesión
    if (!sesiones[userId]) sesiones[userId] = { historial: [], nombre: userName, origen: origen };
    
    let mensajeUsuario = "";
    if (message.type === "text") {
      mensajeUsuario = message.text.body;
    } else if (message.type === "audio") {
      // Si es audio, lo transcribimos primero
      // (Aquí iría la lógica de descarga si la tuvieras implementada, por ahora simulamos)
      // mensajeUsuario = await transcribirAudio(rutaDelArchivo); 
      mensajeUsuario = "[AUDIO RECIBIDO - Transcripción pendiente]";
    } else {
        // CORREGIDO: Sin barras invertidas extra
        mensajeUsuario = `[Archivo adjunto: ${message.type}]`;
    }

    // Guardar mensaje del usuario en el historial
    sesiones[userId].historial.push({ role: "user", content: mensajeUsuario });
    if (sesiones[userId].historial.length > 20) sesiones[userId].historial = sesiones[userId].historial.slice(-20);

    // --- LÓGICA DE RESPUESTA IA ---
    let respuestaZara = await generarRespuestaIA(sesiones[userId].historial);
    
    // Detección de intención de agenda para añadir link
    if (respuestaZara.toLowerCase().includes("link") && respuestaZara.toLowerCase().includes("agenda")) {
        // CORREGIDO: Sin barras invertidas extra
        respuestaZara += `\n\n${NEGOCIO.agenda_link}`;
    }

    // Guardar respuesta de Zara en el historial
    sesiones[userId].historial.push({ role: "assistant", content: respuestaZara });

    // Enviar respuesta
    await sendMessage(userId, respuestaZara, plataforma);

    // --- GUARDAR LOG FÍSICO (CRUCIAL PARA EL MONITOR) ---
    guardarLogFisico(origen, userId, mensajeUsuario, respuestaZara);
    // ---------------------------------------------------
  }
}

// (La función procesarReserva no cambia, por eso no la incluyo aquí para no alargar)
export async function procesarReserva(data) {
    // ... Tu lógica de reserva actual ...
    console.log("Procesando reserva (sin cambios)...");
}
