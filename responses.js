export const responses = {
  saludo: () =>
    "👋 ¡Hola! Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*. Puedo orientarte con tratamientos, precios o agendar una cita. ¿Qué te gustaría revisar hoy?",

  bajar_grasa: () =>
    "💎 El plan *Lipo Body Elite* combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Moldea abdomen, cintura y muslos con resultados visibles desde la segunda sesión.",

  celulitis: () =>
    "✨ Para la celulitis te recomiendo el *Body Tensor* o *Lipo Reductiva*. Ambos combinan Cavitación, Radiofrecuencia y drenaje para mejorar firmeza, textura y circulación.",

  flacidez: () =>
    "💠 La *flacidez corporal* se trata con *Body Tensor* o *Body Fitness*, que fortalecen y tonifican con EMS y Radiofrecuencia, mejorando la piel y el tono muscular.",

  push_up: () =>
    "🍑 El *Push Up Body Elite* trabaja glúteos con *ProSculpt EMS + Radiofrecuencia Focalizada*. Tonifica y eleva sin dolor ni bisturí, con resultados visibles desde la segunda sesión.",

  hifu: () =>
    "⚡️El *HIFU 12D* usa ultrasonido focalizado para tensar la piel y estimular colágeno sin cirugía. Ideal para rostro, cuello, abdomen y brazos.",

  precios: () =>
    "📋 Planes más solicitados:\n\n💎 *Lipo Body Elite* $664.000\n✨ *Face Elite* $358.400\n💪 *Body Fitness* $360.000\n🍑 *Push Up* $376.000\n\n¿Deseas que te recomiende el ideal según tus objetivos?",

  fallback: () =>
    "🤔 No estoy segura de lo que quisiste decir, pero puedo ayudarte con *tratamientos, precios, tecnologías o agendamiento*. ¿Qué te gustaría saber?",
};

// === INTELIGENCIA DE RECONOCIMIENTO ===
export function obtenerRespuesta(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // saludos
  if (/(hola|buenas|qué tal|ola)/.test(t)) return responses.saludo();

  // grasa / reducción
  if (/(grasa|abdomen|cintura|reducir|bajar peso|moldear)/.test(t))
    return responses.bajar_grasa();

  // celulitis
  if (/(celulitis|piel de naranja|poros)/.test(t)) return responses.celulitis();

  // flacidez / tonificar
  if (/(flacidez|firmeza|tonificar|fortalecer)/.test(t)) return responses.flacidez();

  // glúteos / push up
  if (/(glúteo|gluteos|push|pompa|trasero|cola)/.test(t)) return responses.push_up();

  // hifu
  if (/(hifu|ultrasonido|tensar piel|colágeno)/.test(t)) return responses.hifu();

  // precios / valor
  if (/(precio|vale|valor|cuánto|coste|costo|tarifa)/.test(t)) return responses.precios();

  return null;
}
