// --- RESPUESTAS INTELIGENTES BODY ELITE (v4.5) ---

export async function getResponse(msg) {
  if (!msg) return respuestas.fallback();

  msg = msg.toLowerCase();

  // === INTENCIÓN FACIAL ===
  if (msg.includes("arruga") || msg.includes("cara") || msg.includes("rostro") || msg.includes("facial"))
    return respuestas.face();

  // === INTENCIÓN CORPORAL ===
  if (msg.includes("glute") || msg.includes("celulitis") || msg.includes("abdomen") || msg.includes("pierna"))
    return respuestas.body();

  // === TECNOLOGÍAS ===
  if (msg.includes("hifu")) return respuestas.hifu();
  if (msg.includes("radiofrecuencia")) return respuestas.radiofrecuencia();
  if (msg.includes("ems") || msg.includes("sculpt") || msg.includes("prosculpt")) return respuestas.ems();
  if (msg.includes("pinkglow") || msg.includes("pink glow")) return respuestas.pinkglow();
  if (msg.includes("toxina") || msg.includes("botox")) return respuestas.toxina();

  // === CONSULTAS COMUNES ===
  if (msg.includes("vale") || msg.includes("precio") || msg.includes("cuesta")) return respuestas.precios();
  if (msg.includes("sesion") || msg.includes("cuantas")) return respuestas.sesiones();
  if (msg.includes("duele") || msg.includes("dolor")) return respuestas.duele();
  if (msg.includes("resultad")) return respuestas.resultados();
  if (msg.includes("agenda") || msg.includes("evaluacion") || msg.includes("reserva"))
    return respuestas.agendar();
  if (msg.includes("hola") || msg.includes("buenas")) return respuestas.saludo();

  // === SIN COINCIDENCIA ===
  return respuestas.fallback();
}

const respuestas = {
  saludo: () =>
    "👋 ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. ¿Te gustaría conocer tratamientos, precios o agendar tu diagnóstico gratuito?",

  face: () =>
    "✨ Face Elite combina HIFU focal, Radiofrecuencia y toxina cosmética para rejuvenecer rostro sin cirugía. Logra piel más firme y efecto lifting visible desde la primera sesión.",

  body: () =>
    "🍑 Push Up Body Elite trabaja glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Tonifica, eleva y redefine sin bisturí. Resultados desde la 2ª sesión.",

  hifu: () =>
    "💎 El HIFU 12D estimula colágeno y reduce grasa localizada. Ideal para rostro, cuello o abdomen.",

  radiofrecuencia: () =>
    "🌡️ La radiofrecuencia calienta las capas profundas de la piel, estimulando colágeno y mejorando firmeza y textura.",

  ems: () =>
    "⚡ EMS (ProSculpt) genera contracciones musculares profundas equivalentes a 20.000 abdominales o sentadillas por sesión. Ideal para tonificar y definir.",

  pinkglow: () =>
    "🌸 PinkGlow es un tratamiento facial que aporta luminosidad, hidratación y mejora el tono de la piel. Se puede combinar con Face Elite para potenciar resultados.",

  toxina: () =>
    "💉 En algunos protocolos faciales se usa toxina cosmética (no invasiva) para relajar líneas finas y mejorar el efecto lifting sin alterar la expresión natural.",

  sesiones: () =>
    "📅 Los planes incluyen entre 6 y 10 sesiones según el diagnóstico. La evaluación gratuita define la cantidad exacta y el tipo de tecnología recomendada.",

  precios: () =>
    "💰 Planes más solicitados:\n\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000\n\n¿Quieres que te recomiende el ideal según tus objetivos?",

  resultados: () =>
    "📸 Los resultados del Face Elite incluyen piel más firme, reducción de arrugas finas y contorno definido. En tratamientos corporales, tonificación visible desde la 2ª sesión.",

  duele: () =>
    "🙂 No duele. Es un tratamiento cómodo, no invasivo y puedes retomar tus actividades inmediatamente después de la sesión.",

  agendar: () =>
    "📅 Puedes agendar tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  fallback: () =>
    "🤔 No logré entenderte bien. ¿Buscas información sobre tratamientos, precios o deseas agendar tu evaluación gratuita?",
};
