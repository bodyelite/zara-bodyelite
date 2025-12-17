import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje } from "./utils/memory.js";

const sesionesMeta = {};

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
    const userName = contact.profile?.name || "Cliente Meta";
    
    let mensajeUsuario = message.type === "text" ? message.text.body : `[Adjunto: ${message.type}]`;
    registrarMensaje(userId, userName, mensajeUsuario, "usuario", origen);

    if (!sesionesMeta[userId]) sesionesMeta[userId] = { historial: [], nombre: userName };
    sesionesMeta[userId].historial.push({ role: "user", content: mensajeUsuario });

    let respuestaZara = await generarRespuestaIA(sesionesMeta[userId].historial);
    
    if (respuestaZara.toLowerCase().includes("link") && respuestaZara.toLowerCase().includes("agenda")) {
        respuestaZara += `\n\n${NEGOCIO.agenda_link}`;
    }

    sesionesMeta[userId].historial.push({ role: "assistant", content: respuestaZara });

    await sendMessage(userId, respuestaZara, plataforma);
    registrarMensaje(userId, userName, respuestaZara, "zara", origen);
  }
}

export async function procesarReserva(data) {
    // Implementación futura
}
