// === RESPUESTAS ESTÁNDAR DE ZARA BODY ELITE ===

export const responses = {
  saludo: () =>
    "👋 ¡Hola! Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*. Puedo ayudarte con tratamientos, precios o agendar una cita. ¿Qué te gustaría revisar hoy?",

  bajar_grasa: () =>
    "💎 El plan *Lipo Body Elite* combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Moldea abdomen, cintura y muslos con resultados visibles desde la segunda sesión.",

  celulitis: () =>
    "✨ Para la *celulitis*, recomendamos *Body Tensor* o *Lipo Reductiva*. Combinan Cavitación, Radiofrecuencia y drenaje, mejorando firmeza y textura de la piel.",

  flacidez: () =>
    "💠 Para *flacidez o tonificación*, sugerimos *Body Tensor* o *Body Fitness*. Reafirman tejidos con EMS y Radiofrecuencia, logrando un efecto tensor visible.",

  push_up: () =>
    "🍑 El *Push Up Body Elite* trabaja glúteos con *ProSculpt EMS + Radiofrecuencia Focalizada*. Tonifica y eleva sin dolor ni bisturí, con resultados desde la segunda sesión.",

  hifu: () =>
    "⚡️El *HIFU 12D* utiliza ultrasonido focalizado para tensar la piel y estimular colágeno. Ideal para rostro, cuello, abdomen o brazos, sin cirugía ni tiempo de recuperación.",

  precios: () =>
    "📋 Planes más solicitados:\n\n💎 *Lipo Body Elite* $664.000\n✨ *Face Elite* $358.400\n💪 *Body Fitness* $360.000\n🍑 *Push Up* $376.000\n\n¿Deseas que te recomiende el ideal según tus objetivos?",

  agenda: () =>
    "📅 Puedes agendar tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  fallback: () =>
    "🤔 No estoy segura de lo que quisiste decir, pero puedo ayudarte con *tratamientos, precios, tecnologías o agendamiento*. ¿Sobre qué quieres saber?",
};

// === INTERPRETADOR DE INTENCIONES ===
export function interpretarIntencion(text) {
  const t = text.toLowerCase();

  if (/hola|buenas|qué tal|ola/.test(t)) return "saludo";
  if (/grasa|reducir|bajar|cintura|abdomen|moldear|panza/.test(t)) return "bajar_grasa";
  if (/celulitis|piel de naranja|poros|retención/.test(t)) return "celulitis";
  if (/flacidez|firmeza|tonificar|fortalecer|reafirmar/.test(t)) return "flacidez";
  if (/gluteo|glúteo|push|pompa|cola|trasero/.test(t)) return "push_up";
  if (/hifu|ultrasonido|colágeno|tensar/.test(t)) return "hifu";
  if (/precio|vale|valor|cuánto|coste|costo|tarifa/.test(t)) return "precios";
  if (/agenda|hora|reserva|agendar|cita|diagnóstico/.test(t)) return "agenda";
  return "fallback";
}
