// responses.js
// Respuestas clínicas, memoria, avisos internos y aprendizaje
import fetch from "node-fetch";
import { interpretarMensaje } from "./comprension.js";
import { actualizarMemoria, obtenerContexto, registrarAprendizaje } from "./memoria.js";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMEROS_INTERNOS = ["56983300262", "56937648536", "56931720760"];

// --- Aviso interno simultáneo ---
async function avisarInternamente(token, telefono, textoAviso) {
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const texto = `${textoAviso || "🧭 Nuevo interesado en agendar evaluación."}\n📅 ${fecha}\n📱 ${telefono}`;

  const tareas = NUMEROS_INTERNOS.map(numero =>
    fetch("https://graph.facebook.com/v17.0/105596959260801/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: texto }
      })
    }).catch(err => console.error("Error enviando aviso interno:", err))
  );
  await Promise.all(tareas);
}

// --- Generar respuesta principal ---
export async function generarRespuesta(mensaje, token, telefono) {
  const contexto = obtenerContexto(telefono);
  const interpretacion = interpretarMensaje(`${contexto} ${mensaje}`);
  const respuesta = interpretacion.respuesta;

  // memoria
  actualizarMemoria(telefono, mensaje, respuesta);

  // aprendizaje automático
  registrarAprendizaje(mensaje, respuesta);

  // avisos internos
  if (interpretacion.aviso) await avisarInternamente(token, telefono, interpretacion.aviso);
  if (respuesta.includes(LINK_RESERVO))
    await avisarInternamente(token, telefono, "🧭 Nuevo interesado en agendar (link detectado)");

  return respuesta;
}
