// responses.js
// Módulo de generación de respuestas con memoria y comprensión avanzada para Zara IA

import fetch from "node-fetch";
import { actualizarContexto } from "./entrenador.js";
import { normalizar } from "./comprension.js";

const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Avisos internos
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

// Variaciones de frases para evitar tono robótico
const variaciones = {
  saludo: [
    "Hola 👋, soy Zara, asistente IA de Body Elite. ¿En qué puedo ayudarte hoy?",
    "¡Hola! Soy Zara 🤖, IA de Body Elite. Puedo orientarte en tratamientos o agendamiento.",
  ],
  agendar: [
    "📅 Puedes agendar tu evaluación gratuita presionando el botón 👇",
    "Agenda tu evaluación sin costo. Toca el botón de abajo 👇",
  ],
  confirmacion: [
    `✨ Agenda tu evaluación gratuita aquí:\n${LINK_RESERVO}\nIncluye FitDays y asesoría personalizada.`,
    `Perfecto ✅ Aquí puedes agendar directamente:\n${LINK_RESERVO}`,
  ],
};

function elegir(frases) {
  return frases[Math.floor(Math.random() * frases.length)];
}

export default async function generarRespuesta(usuario, mensaje) {
  const ctx = actualizarContexto(usuario, mensaje);
  const normal = normalizar(mensaje);
  const intencion = ctx.ultimaIntencion;

  // 1. Saludo
  if (intencion === "saludo") return elegir(variaciones.saludo);

  // 2. Agendamiento
  if (intencion === "agendar") {
    return {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: elegir(variaciones.agendar) },
        action: {
          buttons: [
            { type: "reply", reply: { id: "agendar_reservo", title: "Agenda Gratis" } },
          ],
        },
      },
    };
  }

  // 3. Botón agenda
  if (normal.includes("agendar_reservo") || normal.includes("agenda gratis")) {
    const tipo = ctx.tipoPlan ? `(${ctx.tipoPlan})` : "";
    const aviso = `🔔 Nuevo agendamiento ${tipo}\nCliente: ${usuario}\nMensaje: ${mensaje}\n${LINK_RESERVO}`;
    await avisarStaff(aviso);
    return elegir(variaciones.confirmacion);
  }

  // 4. Tratamientos
  if (intencion === "tratamientos") {
    if (ctx.tipoPlan === "facial")
      return "💆‍♀️ Los tratamientos faciales incluyen Face Light, Face Elite y Face Antiage. ¿Deseas saber cuál te conviene?";
    if (ctx.tipoPlan === "corporal")
      return "💪 Para cuerpo tenemos Lipo Body Elite, Body Fitness y Push Up. ¿Te indico cuál aplica a tus objetivos?";
    return "Ofrecemos planes faciales y corporales con tecnología avanzada. ¿Cuál te interesa?";
  }

  // 5. Promociones
  if (intencion === "promocion")
    return "🎯 Promociones activas: Lipo Body Elite con diagnóstico FitDays y depilación gratis en algunos planes. Consulta cuál aplica.";

  // 6. Desconocido
  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe 'quiero agendar' o 'promoción' para comenzar.";
}
