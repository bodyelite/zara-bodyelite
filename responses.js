import fs from "fs";
import stringSimilarity from "string-similarity";

let patrones = {};

export function integrarPatrones(nuevos) {
  patrones = nuevos;
  console.log("🧩 Patrones integrados:", Object.keys(patrones));
}

export const responses = {
  fallback: () =>
    "🤔 No logré entenderte bien. ¿Buscas información sobre tratamientos, precios o agendar tu evaluación gratuita?",

  saludo: () =>
    "👋 ¡Hola! Soy *Zara*, asistente IA de *Body Elite Estética Avanzada*. ¿Quieres conocer tratamientos, precios o agendar tu diagnóstico gratuito?",

  precios: () =>
    "📋 Planes más solicitados:\n💎 Lipo Body Elite $664.000\n🍑 Push Up $376.000\n💪 Body Fitness $360.000\n✨ Face Elite $358.400\n\n¿Te gustaría que te recomiende el ideal según tu objetivo?",

  agenda: () =>
    "📅 Agenda tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n🕓 Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  evaluacion: () =>
    "🧬 La evaluación incluye diagnóstico corporal con FitDays, análisis de grasa y músculo y asesoría profesional. Sin costo ni compromiso.",

  pushup: () =>
    "🍑 *Push Up Body Elite* levanta y tonifica glúteos con *ProSculpt EMS + Radiofrecuencia Focalizada*. Resultados visibles desde la 2ª sesión. ¿Quieres saber su valor o agendar tu cita?",

  lipo: () =>
    "💎 *Lipo Body Elite* combina HIFU 12D + Cavitación + RF para reducir grasa y moldear cintura y abdomen sin cirugía.",

  fitness: () =>
    "💪 *Body Fitness Pro* tonifica con EMS Sculptor + RF. Equivale a 20.000 contracciones musculares por sesión.",

  face: () =>
    "✨ *Face Elite* combina HIFU facial + RF + Pink Glow para lifting y rejuvenecimiento sin bisturí.",

  hifu: () =>
    "🔬 *HIFU 12D* estimula colágeno y reduce grasa localizada. Ideal para rostro, cuello o abdomen.",

  celulitis: () =>
    "💫 Tratamiento anticelulitis con *Lipo Reductiva 12D* + *Body Fitness Pro*. Reafirma, mejora textura y circulación.",

  precioEspecifico: (topic) => {
    const mapa = {
      pushup:
        "💰 El *Push Up Body Elite* cuesta *$376.000 CLP* el plan completo.",
      lipo: "💰 La *Lipo Body Elite* cuesta *$664.000 CLP* e incluye HIFU 12D + Cavitación + RF.",
      fitness: "💰 El *Body Fitness Pro* cuesta *$360.000 CLP*.",
      face: "💰 *Face Elite* cuesta *$358.400 CLP*.",
      hifu: "💰 Sesión de *HIFU 12D* desde *$120.000 CLP*.",
      celulitis:
        "💰 El tratamiento anticelulitis cuesta *$480.000 CLP* e incluye RF y drenaje.",
    };
    return mapa[topic] || "📋 Los valores dependen del tratamiento que elijas.";
  },

  descripcion: (topic) => {
    const mapa = {
      pushup:
        "🍑 *Push Up Body Elite* tonifica glúteos con EMS + RF, levantando y reafirmando sin bisturí.",
      lipo:
        "💎 *Lipo Body Elite* combina HIFU 12D, Cavitación y RF para eliminar grasa localizada.",
      fitness:
        "💪 *Body Fitness Pro* activa músculos con contracciones EMS profundas, mejorando tono y firmeza.",
      face:
        "✨ *Face Elite* integra HIFU + RF + Pink Glow para lifting facial sin cirugía.",
      hifu:
        "🔬 *HIFU 12D* aplica ultrasonido focalizado para estimular colágeno y reducir grasa.",
      celulitis:
        "💫 *Tratamiento anticelulitis* combina Lipo Reductiva y Body Fitness para mejorar textura y firmeza.",
    };
    return (
      mapa[topic] ||
      "🧠 Es un tratamiento estético no invasivo con tecnología avanzada."
    );
  },

  sensacion: () =>
    "😊 No duele. Son tratamientos no invasivos, sin agujas ni bisturí. Puedes retomar tus actividades de inmediato después de cada sesión.",
};

// === INTENCIÓN SEMÁNTICA ===
export function interpretarIntencion(text) {
  text = text.toLowerCase().trim();

  const ejemplos = {
    saludo: ["hola", "buenas", "hey", "qué tal"],
    pushup: [
      "push up",
      "levantar glúteos",
      "subir gluteos",
      "aumentar cola",
      "gluteos firmes",
    ],
    lipo: ["lipo", "reducción de grasa", "cintura", "abdomen", "bajar grasa"],
    fitness: [
      "fitness",
      "tonificar cuerpo",
      "fortalecer",
      "aumentar músculo",
    ],
    face: ["cara", "face", "facial", "arrugas", "lifting", "rejuvenecer"],
    hifu: ["hifu", "ultrasonido", "colágeno", "piel firme"],
    celulitis: ["celulitis", "piel de naranja", "piernas", "reafirmar piel"],
    precios: ["precio", "vale", "cuánto", "valor", "cuesta"],
    agenda: ["agenda", "reservar", "hora", "cita", "agendar"],
    evaluacion: ["evaluación", "diagnóstico", "fitdays", "gratis"],
    sensacion: ["duele", "dolor", "molesta", "seguro", "riesgo"],
  };

  // Coincidencia exacta
  for (const [int, frases] of Object.entries(ejemplos)) {
    if (frases.some((p) => text.includes(p))) return int;
  }

  // Coincidencia semántica (similaridad)
  const todas = Object.entries(ejemplos).flatMap(([int, frases]) =>
    frases.map((f) => ({ int, frase: f }))
  );

  const mejor = stringSimilarity.findBestMatch(
    text,
    todas.map((t) => t.frase)
  );
  const idx = mejor.bestMatchIndex;
  const intencion = todas[idx]?.int;

  if (mejor.bestMatch.rating > 0.45) return intencion || "fallback";
  return "fallback";
}
