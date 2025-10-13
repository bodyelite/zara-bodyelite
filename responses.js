// responses.js
// Respuestas contextuales y empáticas de Zara IA

import fetch from "node-fetch";
import { actualizarContexto } from "./entrenador.js";
import { normalizar } from "./comprension.js";

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

const variaciones = {
  saludo: [
    "Hola 👋, soy Zara, asistente IA de Body Elite. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenida/o! Soy Zara 🤖, tu asistente IA de Body Elite. ¿Qué te gustaría saber?",
  ],
  agendar: [
    "📅 Agenda tu evaluación sin costo. Toca el botón de abajo 👇",
    "Puedes agendar tu evaluación gratuita tocando el botón 👇",
  ],
  confirmacion: [
    `✨ Aquí puedes agendar tu evaluación:\n${LINK_RESERVO}\nIncluye FitDays y asesoría personalizada.`,
    `Perfecto ✅ Ingresa aquí para agendar:\n${LINK_RESERVO}`,
  ],
  empatia: [
    "Entiendo, a veces el botón no responde correctamente. Puedes ingresar directamente con este enlace 👇",
    "No te preocupes, te dejo el link directo para agendar sin problemas 👇",
  ],
};

function elegir(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default async function generarRespuesta(usuario, mensaje) {
  const ctx = actualizarContexto(usuario, mensaje);
  const intencion = ctx.ultimaIntencion;
  const normal = normalizar(mensaje);

  if (intencion === "saludo") return elegir(variaciones.saludo);

  if (intencion === "agendar") {
    return {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: elegir(variaciones.agendar) },
        action: {
          buttons: [
            { type: "url", url: LINK_RESERVO, title: "Agenda Gratis" }, // botón funcional
          ],
        },
      },
    };
  }

  if (intencion === "problema" || normal.includes("boton")) {
    return `${elegir(variaciones.empatia)}\n${LINK_RESERVO}`;
  }

  if (intencion === "facial")
    return "💆‍♀️ Ofrecemos tratamientos faciales como Face Light, Face Smart y Face Elite. ¿Quieres saber cuál es mejor para ti?";
  if (intencion === "corporal")
    return "💪 Para cuerpo tenemos Lipo Body Elite, Push Up y Body Fitness. ¿Deseas conocer precios o beneficios?";
  if (intencion === "promocion")
    return "🎯 Promoción activa: Lipo Body Elite con FitDays + depilación gratis en algunos planes. Consulta cuál aplica.";
  if (intencion === "precio")
    return "Nuestros precios varían según el plan. ¿Te interesa facial o corporal?";
  if (intencion === "duda")
    return "Claro, puedo explicarte con más detalle. ¿Sobre qué tratamiento te gustaría saber?";
  if (intencion === "interes")
    return "Perfecto 🙌. ¿Quieres que te ayude a agendar tu evaluación gratuita?";

  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe 'quiero agendar' o 'promoción' para comenzar.";
}
