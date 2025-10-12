// === RESPUESTAS CON CONTEXTO Y CONOCIMIENTO CLÍNICO v4.7 ===

export async function getResponse(msg, prev = {}) {
  if (!msg) return { reply: respuestas.fallback(), intent: "fallback" };
  msg = msg.toLowerCase();

  let intent = detectarIntent(msg, prev.lastIntent);
  const reply = respuestas[intent]
    ? respuestas[intent](msg, prev.lastIntent)
    : respuestas.fallback();

  return { reply, intent };
}

// === DETECCIÓN DE INTENCIÓN ===
function detectarIntent(msg, prevIntent) {
  if (msg.includes("hola") || msg.includes("buenas")) return "saludo";
  if (msg.includes("hifu")) return "hifu";
  if (msg.includes("radiofrecuencia")) return "radiofrecuencia";
  if (msg.includes("ems") || msg.includes("sculpt")) return "ems";
  if (msg.includes("pinkglow") || msg.includes("pink glow")) return "pinkglow";
  if (msg.includes("exosoma")) return "exosomas";
  if (msg.includes("lipol")) return "lipolitico";
  if (msg.includes("dermapen")) return "dermapen";
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
  if (msg.includes("contiene") || msg.includes("incluye") || msg.includes("que tiene"))
    return "contenido";

  if (["precios", "resultados", "duele", "sesiones"].some(k => msg.includes(k)))
    return prevIntent || "fallback";

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

// === RESPUESTAS ===
const respuestas = {
  saludo: () =>
    "👋 ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. ¿Quieres conocer tratamientos, precios o agendar tu diagnóstico gratuito?",

  hifu: () =>
    "💎 El HIFU 12D estimula colágeno y reduce grasa localizada. Ideal para rostro, cuello o abdomen. Reafirma sin bisturí y con resultados desde la primera sesión.",

  radiofrecuencia: () =>
    "🌡️ La Radiofrecuencia activa colágeno y elastina, mejorando firmeza y textura. Se usa tanto en rostro como cuerpo.",

  ems: () =>
    "⚡ EMS (ProSculpt) genera contracciones musculares profundas equivalentes a miles de abdominales o sentadillas por sesión. Define y tonifica sin esfuerzo.",

  pinkglow: () =>
    "🌸 PinkGlow ilumina, hidrata y mejora el tono de la piel. Se puede usar solo o junto a Face Elite. Valor: $128.800 CLP (6 sesiones).",

  exosomas: () =>
    "🧬 Los Exosomas son nanopartículas regeneradoras que reparan tejidos y estimulan colágeno. En Body Elite se aplican con Dermapen para bioestimulación avanzada y rejuvenecimiento visible.",

  lipolitico: () =>
    "🔥 Los Lipolíticos son principios activos que disuelven grasa localizada. Se aplican en zonas específicas (abdomen, brazos, muslos) para potenciar tratamientos reductivos como Cavitación o HIFU.",

  dermapen: () =>
    "🪡 Dermapen es una terapia de microagujas que estimula la regeneración de la piel. Facilita la absorción de activos como Exosomas o Ácido Hialurónico.",

  toxina: () =>
    "💉 La toxina cosmética relaja los músculos responsables de líneas de expresión, logrando una piel más lisa sin modificar la expresión natural.",

  face: () =>
    "✨ Face Elite combina HIFU focal, Radiofrecuencia y Toxina Cosmética. Mejora firmeza, textura y rejuvenece el rostro sin cirugía. Resultados visibles desde la primera sesión.",

  body: () =>
    "🍑 Push Up Body Elite trabaja glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Eleva, tonifica y redefine sin bisturí. Resultados desde la 2ª sesión.",

  precios: (_, prevIntent) => {
    if (prevIntent === "pinkglow")
      return "🌸 PinkGlow cuesta $128.800 CLP (6 sesiones).";
    if (prevIntent === "face")
      return "💰 Face Elite $358.400 CLP (HIFU + RF + Toxina Cosmética).";
    if (prevIntent === "body")
      return "🍑 Push Up Body Elite $376.000 CLP (EMS + Radiofrecuencia).";
    if (prevIntent === "exosomas")
      return "🧬 Tratamiento con Exosomas desde $180.000 CLP por sesión (según zona y profundidad).";
    if (prevIntent === "lipolitico")
      return "🔥 Sesión de Lipolítico desde $90.000 CLP, se recomienda plan de 6 a 8 sesiones.";
    return "💰 Planes más solicitados:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000";
  },

  sesiones: (_, prevIntent) => {
    if (prevIntent === "pinkglow") return "🗓️ PinkGlow incluye 6 sesiones. Se puede combinar con Face Elite.";
    if (prevIntent === "exosomas") return "🧬 Exosomas: 3 a 5 sesiones según diagnóstico y edad de la piel.";
    return "📅 Los planes incluyen entre 6 y 10 sesiones. La cantidad exacta se define en tu evaluación gratuita.";
  },

  duele: () =>
    "🙂 No duele. Todos los tratamientos son no invasivos y muy cómodos. Puedes retomar tus actividades inmediatamente.",

  resultados: (_, prevIntent) => {
    if (prevIntent === "pinkglow")
      return "📸 PinkGlow deja la piel más luminosa, hidratada y pareja desde la primera sesión.";
    if (prevIntent === "exosomas")
      return "📸 Los Exosomas regeneran la piel desde las capas profundas, mejorando firmeza, tono y textura.";
    if (prevIntent === "body")
      return "📸 Push Up Body Elite eleva glúteos y define contorno corporal desde la 2ª sesión.";
    return "📸 Los resultados dependen del plan, pero todos muestran cambios visibles desde las primeras sesiones.";
  },

  contenido: (_, prevIntent) => {
    if (prevIntent === "face")
      return "💆‍♀️ Face Elite incluye: HIFU Focal + Radiofrecuencia + Toxina Cosmética. Opcional: PinkGlow o Exosomas para potenciar resultados.";
    if (prevIntent === "body")
      return "🍑 Push Up Body Elite combina: EMS ProSculpt + Radiofrecuencia + Terapia Lipolítica localizada.";
    if (prevIntent === "pinkglow")
      return "🌸 PinkGlow contiene cóctel de vitaminas, ácido hialurónico y péptidos que revitalizan la piel.";
    return "📋 Cada plan combina diferentes tecnologías (HIFU, RF, EMS, Lipolíticos, Exosomas). La composición exacta se define en la evaluación.";
  },

  agendar: () =>
    "📅 Agenda tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  fallback: () =>
    "🤔 No logré entenderte bien. ¿Buscas información sobre tratamientos, precios o deseas agendar tu evaluación gratuita?",
};
