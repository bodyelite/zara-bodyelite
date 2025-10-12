export const responses = {
  saludo: () =>
    "👋 Hola, soy Zara, asistente virtual de Body Elite Estética Avanzada. Puedo ayudarte con tratamientos, precios o agendar una cita. ¿Qué deseas revisar hoy?",

  bajar_grasa: () =>
    "💎 Nuestro plan *Lipo Body Elite* combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Moldea abdomen, cintura y muslos con resultados visibles desde la segunda sesión.",

  celulitis: () =>
    "✨ Para tratar celulitis te recomiendo el *Body Tensor* o *Lipo Reductiva*, con Radiofrecuencia, Cavitación y drenaje. Mejoran firmeza y textura desde las primeras sesiones.",

  push_up: () =>
    "🍑 El *Push Up Body Elite* trabaja glúteos con *ProSculpt EMS + Radiofrecuencia Focalizada*. Tonifica y eleva sin dolor ni bisturí, con resultados visibles desde la segunda sesión.",

  hifu: () =>
    "⚡️El *HIFU 12D* utiliza ultrasonido focalizado de alta intensidad para tensar la piel y estimular colágeno sin cirugía. Ideal para rostro, cuello, abdomen y brazos.",

  precios: () =>
    "📋 Planes más solicitados:\n\n💎 Lipo Body Elite $664.000\n✨ Face Elite $358.400\n💪 Body Fitness $360.000\n🍑 Push Up $376.000\n\n¿Deseas que te recomiende el ideal según tus objetivos?",

  fallback: () =>
    "🤔 No entendí del todo, pero puedo ayudarte con *tratamientos, precios, tecnologías o agenda*. ¿Sobre qué quieres saber?",
};

export function obtenerRespuesta(text) {
  if (!text) return null;
  if (text.includes("hola") || text.includes("buenas")) return responses.saludo();
  if (text.includes("grasa") || text.includes("bajar cintura") || text.includes("reductiva"))
    return responses.bajar_grasa();
  if (text.includes("celulitis")) return responses.celulitis();
  if (text.includes("push up")) return responses.push_up();
  if (text.includes("hifu")) return responses.hifu();
  if (text.includes("precio") || text.includes("valor")) return responses.precios();
  return null;
}
