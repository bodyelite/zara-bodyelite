import stringSimilarity from "string-similarity";

export const responses = {
  saludo: () =>
    "👋 ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. ¿Quieres conocer tratamientos, precios o agendar tu diagnóstico gratuito?",

  lipo: () =>
    "💎 Lipo Body Elite combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Moldea abdomen, cintura y muslos con resultados visibles desde la 2ª sesión.",

  pushup: (texto = "", contexto = {}) => {
    if (/precio|vale|cuánto/.test(texto)) {
      return "💰 El Push Up Body Elite cuesta $376.000 CLP el plan completo (EMS + Radiofrecuencia Focalizada).";
    }
    return "🍑 Push Up Body Elite levanta y tonifica glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Resultados visibles desde la 2ª sesión. ¿Quieres saber su valor o agendar tu evaluación gratuita?";
  },

  fitness: () =>
    "🏋️ Body Fitness Pro mejora tono y definición muscular con EMS y ondas electromagnéticas focalizadas. Ideal para piernas, brazos y abdomen.",

  face: () =>
    "✨ Face Elite combina HIFU focal, Radiofrecuencia y toxina cosmética para rejuvenecer rostro sin cirugía. Efecto lifting visible desde la primera sesión.",

  evaluacion: () =>
    "📅 Puedes agendar tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  hifu: () =>
    "💠 HIFU 12D estimula colágeno y reduce grasa localizada. Ideal para rostro, cuello o abdomen. Tratamiento indoloro y sin bisturí.",

  fallback: () =>
    "🤔 No logré entenderte bien. ¿Buscas información sobre tratamientos, precios o agendar tu evaluación gratuita?",
};

// ==== INTENCIÓN BÁSICA ====
export function interpretarIntencion(text) {
  const frases = text.toLowerCase();
  const patrones = {
    saludo: ["hola", "buenas", "qué tal", "ola"],
    lipo: ["bajar grasa", "abdomen", "cintura", "lipo"],
    pushup: ["glúteo", "gluteos", "glúteos", "levantar", "tonificar"],
    fitness: ["músculo", "ejercicio", "tonificar cuerpo", "fitness"],
    face: ["cara", "rostro", "facial", "antiage"],
    evaluacion: ["agendar", "evaluación", "cita", "reservo"],
    hifu: ["hifu", "colágeno", "piel", "flacidez"],
  };

  let coincidencias = [];
  for (const [intencion, lista] of Object.entries(patrones)) {
    lista.forEach((palabra) => {
      const score = stringSimilarity.compareTwoStrings(frases, palabra);
      coincidencias.push({ intencion, score });
    });
  }

  const mejor = coincidencias.sort((a, b) => b.score - a.score)[0];
  return mejor && mejor.score > 0.35 ? mejor.intencion : "fallback";
}

export function integrarPatrones(patronesExternos) {
  Object.assign(responses, patronesExternos);
}
