// === RESPUESTAS INTELIGENTES CON CONTEXTO (v4.6) ===

export async function getResponse(msg, prev = {}) {
  if (!msg) return { reply: respuestas.fallback(), intent: "fallback" };
  msg = msg.toLowerCase();

  // Detectar intención principal
  let intent = detectarIntent(msg, prev.lastIntent);

  // Obtener respuesta según intención
  const reply = respuestas[intent]
    ? respuestas[intent](msg, prev.lastIntent)
    : respuestas.fallback();

  return { reply, intent };
}

function detectarIntent(msg, prevIntent) {
  if (msg.includes("hola") || msg.includes("buenas")) return "saludo";
  if (msg.includes("hifu")) return "hifu";
  if (msg.includes("radiofrecuencia")) return "radiofrecuencia";
  if (msg.includes("ems") || msg.includes("sculpt")) return "ems";
  if (msg.includes("pinkglow") || msg.includes("pink glow")) return "pinkglow";
  if (msg.includes("toxina")) return "toxina";
  if (msg.includes("facial") || msg.includes("rostro") || msg.includes("arruga"))
    return "face";
  if (msg.includes("glute") || msg.includes("celulitis") || msg.includes("abdomen"))
    return "body";
  if (msg.includes("precio") || msg.includes("vale") || msg.includes("cuesta"))
    return "precios";
  if (msg.includes("sesion")) return "sesiones";
  if (msg.includes("duele")) return "duele";
  if (msg.includes("resultad")) return "resultados";
  if (msg.includes("agenda") || msg.includes("evaluacion")) return "agendar";

  // seguimiento contextual
  if (["precios", "resultados", "duele", "sesiones"].some(k => msg.includes(k)))
    return prevIntent || "fallback";

  // seguimiento si pregunta general "y el valor", "y duele", etc.
  if (
    msg.startsWith("y ") ||
    msg.startsWith("cuanto") ||
    msg.startsWith("que hace") ||
    msg.startsWith("como funciona")
  ) {
    if (prevIntent && respuestas[prevIntent]) return prevIntent;
  }

  return "fallback";
}

// === BLOQUE DE RESPUESTAS ===
const respuestas = {
  saludo: () =>
    "👋 ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. ¿Te gustaría conocer tratamientos, precios o agendar tu diagnóstico gratuito?",

  hifu: () =>
    "💎 El HIFU 12D estimula colágeno y reduce grasa localizada. Ideal para rostro, cuello o abdomen. Resultados visibles desde la primera sesión.",

  radiofrecuencia: () =>
    "🌡️ La Radiofrecuencia mejora firmeza y textura al calentar las capas profundas de la piel y activar colágeno natural.",

  ems: () =>
    "⚡ EMS (ProSculpt) provoca contracciones musculares profundas equivalentes a 20 000 abdominales o sentadillas por sesión. Ideal para tonificar.",

  pinkglow: () =>
    "🌸 PinkGlow ilumina, hidrata y mejora el tono de la piel. Se puede usar solo o combinado con Face Elite para potenciar resultados. Valor $128.800 CLP el plan facial completo (6 sesiones).",

  toxina: () =>
    "💉 La toxina cosmética se usa en protocolos faciales para suavizar líneas finas y dar un efecto lifting sin alterar la expresión natural.",

  face: () =>
    "✨ Face Elite combina HIFU focal, Radiofrecuencia y toxina cosmética para rejuvenecer rostro sin cirugía. Piel más firme y efecto lifting visible desde la primera sesión.",

  body: () =>
    "🍑 Push Up Body Elite trabaja glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Tonifica y eleva sin bisturí. Resultados desde la 2ª sesión.",

  precios: (_, prevIntent) => {
    if (prevIntent === "pinkglow")
      return "🌸 El plan PinkGlow completo cuesta $128.800 CLP (6 sesiones).";
    if (prevIntent === "face")
      return "💰 Face Elite tiene un valor de $358.400 CLP e incluye HIFU, Radiofrecuencia y toxina cosmética.";
    if (prevIntent === "body")
      return "🍑 Push Up Body Elite cuesta $376.000 CLP (EMS + Radiofrecuencia Focalizada).";
    return "💰 Planes más solicitados:\n\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000";
  },

  sesiones: (_, prevIntent) => {
    if (prevIntent === "pinkglow") return "🗓️ PinkGlow incluye 6 sesiones para mejorar luminosidad y textura de piel.";
    return "📅 Los planes incluyen 6 a 10 sesiones según diagnóstico. La evaluación gratuita define cantidad y tecnología recomendada.";
  },

  duele: () =>
    "🙂 No duele. Son tratamientos no invasivos y muy cómodos; puedes retomar tus actividades inmediatamente.",

  resultados: (_, prevIntent) => {
    if (prevIntent === "pinkglow")
      return "📸 PinkGlow mejora luminosidad, hidratación y textura de la piel desde la primera sesión.";
    if (prevIntent === "face")
      return "📸 Face Elite produce piel más firme, contorno definido y reducción de arrugas finas desde la primera sesión.";
    if (prevIntent === "body")
      return "📸 Push Up Body Elite entrega mayor tono y elevación glútea visible en 2 a 3 sesiones.";
    return "📸 Los resultados dependen del plan seleccionado, pero todos ofrecen mejoras visibles desde las primeras sesiones.";
  },

  agendar: () =>
    "📅 Puedes agendar tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  fallback: () =>
    "🤔 No logré entenderte bien. ¿Buscas información sobre tratamientos, precios o deseas agendar tu evaluación gratuita?",
};
