import { generarRespuestaIA, transcribirAudio } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje } from "./utils/memory.js"; // Conexión IMPORTANTE

const sesiones = {};

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
    
    // 1. Registrar Mensaje del Usuario en el Monitor
    let mensajeUsuario = "";
    if (message.type === "text") {
      mensajeUsuario = message.text.body;
    } else {
      mensajeUsuario = `[Adjunto: ${message.type}]`;
    }
    registrarMensaje(userId, userName, mensajeUsuario, "usuario", origen);

    // 2. Gestión de IA
    if (!sesiones[userId]) sesiones[userId] = { historial: [], nombre: userName };
    sesiones[userId].historial.push({ role: "user", content: mensajeUsuario });
    if (sesiones[userId].historial.length > 20) sesiones[userId].historial = sesiones[userId].historial.slice(-20);

    let respuestaZara = await generarRespuestaIA(sesiones[userId].historial);
    
    if (respuestaZara.toLowerCase().includes("link") && respuestaZara.toLowerCase().includes("agenda")) {
        respuestaZara += `\n\n${NEGOCIO.agenda_link}`;
    }

    sesiones[userId].historial.push({ role: "assistant", content: respuestaZara });

    // 3. Enviar y Registrar Respuesta en el Monitor
    await sendMessage(userId, respuestaZara, plataforma);
    registrarMensaje(userId, userName, respuestaZara, "zara", origen);
  }
}

export async function procesarReserva(data) {
    console.log("Reserva recibida");
}
