// responses.js
// Integración de conocimiento clínico Body Elite + contexto conversacional

import fetch from "node-fetch";
import { actualizarContexto } from "./entrenador.js";
import { normalizar } from "./comprension.js";
import { buscarTratamiento, respuestaClinica } from "./knowledge.js";

const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const STAFF_NUMBERS = ["56983300262", "56937648536", "56931720760"];

async function avisarStaff(mensaje) {
  for (const numero of STAFF_NUMBERS) {
    await fetch(`https://graph.facebook.com/v18.0/840360109156943/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: mensaje },
      }),
    });
  }
}

export default async function generarRespuesta(usuario, mensaje) {
  const ctx = actualizarContexto(usuario, mensaje);
  const intencion = ctx.ultimaIntencion;
  const normal = normalizar(mensaje);

  // --- detección de tratamientos ---
  const encontrado = buscarTratamiento(mensaje);
  if (encontrado) {
    if (mensaje.toLowerCase().includes("detalle") || mensaje.toLowerCase().includes("explica"))
      return `${respuestaClinica(encontrado, true)}\n\n📅 Agenda aquí:\n${LINK_RESERVO}`;
    else
      return `${respuestaClinica(encontrado)}\n\n📅 Agenda aquí:\n${LINK_RESERVO}`;
  }

  // --- flujo general ---
  if (intencion === "agendar")
    return {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: "Agenda tu evaluación sin costo. Toca el botón 👇" },
        action: {
          buttons: [{ type: "url", url: LINK_RESERVO, title: "Agenda Gratis" }],
        },
      },
    };

  if (intencion === "problema" || mensaje.toLowerCase().includes("boton"))
    return `Entiendo, a veces el botón no responde. Puedes ingresar directamente aquí 👇\n${LINK_RESERVO}`;

  if (intencion === "saludo")
    return "¡Hola 👋! Soy Zara, asistente IA de Body Elite. Puedo ayudarte a conocer tratamientos o agendar tu diagnóstico gratuito.";

  if (intencion === "promocion")
    return "🎯 Promoción activa: Lipo Body Elite con FitDays + depilación gratis en algunos planes. Consulta cuál aplica para ti.";

  if (intencion === "duda")
    return "Claro, puedo explicarte en detalle. ¿Sobre qué tratamiento o tecnología quieres saber más?";

  if (intencion === "interes")
    return "Perfecto 🙌. ¿Quieres que te ayude a agendar tu evaluación gratuita?";

  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe 'quiero agendar' o menciona el tratamiento que te interese.";
}
