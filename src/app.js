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

  // 1. Registrar Mensaje Usuario
  let msgUser = message.type === "text" ? message.text.body : "[Multimedia]";
  registrarMensaje(userId, userName, msgUser, "usuario", origen);

  // 2. Procesar solo texto por ahora
  if (message.type === "text") {
    if (!sesiones[userId]) sesiones[userId] = [];
    sesiones[userId].push({ role: "user", content: msgUser });

    // 3. IA Genera Respuesta
    let reply = await generarRespuestaIA(sesiones[userId]);
    
    // Inyectar link solo si es necesario (limpieza)
    if (reply.includes("agenda") && !reply.includes("http")) {
       // Opcional: Zara a veces no pone el link si sigue conversando.
       // Dejamos que ella decida o lo forzamos al final si cierra venta.
    }

    sesiones[userId].push({ role: "assistant", content: reply });

    // 4. Responder a Meta
    await sendMessage(userId, reply, origen === "ig" ? "instagram" : "whatsapp");

    // 5. Registrar Respuesta Zara
    registrarMensaje(userId, userName, reply, "zara", origen);
  }
}

export async function procesarReserva(data) {
  console.log("Reserva:", data);
}
