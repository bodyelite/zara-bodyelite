// responses.js
// Usa knowledge.js y comprension.js para dar respuestas clínicas y comerciales avanzadas
import fetch from "node-fetch";
import { interpretarMensaje } from "./comprension.js";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const NUMEROS_INTERNOS = ["56983300262", "56937648536", "56931720760"];

// --- Enviar aviso interno simultáneo ---
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

// --- Generar respuesta ---
export async function generarRespuesta(mensaje, token, telefono) {
  const interpretacion = interpretarMensaje(mensaje);
  let respuesta = interpretacion.respuesta;

  // Enviar aviso interno si corresponde
  if (interpretacion.aviso) {
    await avisarInternamente(token, telefono, interpretacion.aviso);
  }

  // Si se menciona el link de agendamiento, refuerza el aviso
  if (respuesta.includes(LINK_RESERVO)) {
    await avisarInternamente(token, telefono, "🧭 Nuevo interesado en agendar evaluación (link detectado).");
  }

  return respuesta;
}
