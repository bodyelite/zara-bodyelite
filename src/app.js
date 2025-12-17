import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje } from "./utils/memory.js";

const sesiones = {};

export async function procesarEvento(entry) {
  const change = entry.changes[0];
  const value = change.value;
  
  let origen = value.messages ? "wsp" : (value.messaging ? "ig" : null);
  if (!origen) return;

  const message = value.messages ? value.messages[0] : value.messaging[0].message;
  const contact = value.contacts ? value.contacts[0] : value.messaging[0].sender;
  const userId = contact.wa_id || contact.id;
  const userName = contact.profile?.name || "Cliente";

  let msgUser = message.type === "text" ? message.text.body : "[Multimedia]";
  registrarMensaje(userId, userName, msgUser, "usuario", origen);

  if (message.type === "text") {
    if (!sesiones[userId]) sesiones[userId] = [];
    sesiones[userId].push({ role: "user", content: msgUser });

    let reply = await generarRespuestaIA(sesiones[userId]);
    sesiones[userId].push({ role: "assistant", content: reply });
    
    await sendMessage(userId, reply, origen === "ig" ? "instagram" : "whatsapp");
    registrarMensaje(userId, userName, reply, "zara", origen);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva");
}
