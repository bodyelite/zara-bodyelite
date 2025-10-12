import fs from "fs";

// === Carga de patrones aprendidos ===
let patrones = {};
export function integrarPatrones(nuevos) {
  patrones = nuevos;
  console.log("🧩 Patrones integrados:", Object.keys(patrones));
}

// === RESPUESTAS ===
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

  // === PLANES ===
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

  // === PRECIOS ESPECÍFICOS ===
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
};

// === INTERPRETACIÓN LOCAL DINÁMICA ===
export function interpretarIntencion(text) {
  text = text.toLowerCase();

  // Priorizar patrones aprendidos
  for (const [tema, lista] of Object.entries(patrones)) {
    if (lista.some((f) => text.includes(f))) return tema;
  }

  // Reglas fijas
  if (/hola|buenas|hey/.test(text)) return "saludo";
  if (/push ?up/.test(text)) return "pushup";
  if (/lipo/.test(text)) return "lipo";
  if (/fitness/.test(text)) return "fitness";
  if (/face/.test(text)) return "face";
  if (/hifu/.test(text)) return "hifu";
  if (/celulit/.test(text)) return "celulitis";
  if (/precio|vale|cu[aá]nto/.test(text)) return "precios";
  if (/agenda|reserv|hora|cita/.test(text)) return "agenda";
  if (/evaluaci/.test(text)) return "evaluacion";

  return "fallback";
}
