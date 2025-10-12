export async function getResponse(msg, prev) {
  msg = msg.toLowerCase();
  const topic = detectTopic(msg, prev.lastTopic, prev.lastValidTopic);
  const intent = detectIntent(msg);
  const reply = generateReply(intent, topic);
  return { reply, topic, intent };
}

// --- detección robusta de tema ---
function detectTopic(msg, last, lastValid) {
  if (/glute|potito|cola|pompa/.test(msg)) return "gluteos";
  if (/abdomen|guatita|panza|barriga|estómago/.test(msg)) return "abdomen";
  if (/papada|menton|doble\s*menton/.test(msg)) return "papada";
  if (/facial|cara|rostro|arruga/.test(msg)) return "face";
  if (/pinkglow|pink glow/.test(msg)) return "pinkglow";
  if (/exosoma/.test(msg)) return "exosomas";
  if (/lipol/.test(msg)) return "lipolitico";
  if (/radiofrecuencia/.test(msg)) return "radiofrecuencia";
  if (/hifu/.test(msg)) return "hifu";
  if (/ems|sculpt/.test(msg)) return "ems";

  // Fallback: usar último válido si pregunta genérica
  if (/eso|esa|este|esta|en que consiste|qué es|cuánto vale|precio|valor|duele/.test(msg))
    return lastValid || last;

  return last;
}

// --- detección de intención ---
function detectIntent(msg) {
  if (/hola|buenas|cómo estás|como estas/.test(msg)) return "saludo";
  if (/qué es|en que consiste/.test(msg)) return "explicacion";
  if (/cuánto|vale|precio|valor/.test(msg)) return "precio";
  if (/duele|dolor/.test(msg)) return "dolor";
  if (/resultad/.test(msg)) return "resultados";
  if (/evaluacion|diagnostic|agenda|cita|reserva/.test(msg)) return "evaluacion";
  return "general";
}

// --- base de datos de planes ---
const data = {
  gluteos: {
    name: "Push Up Body Elite",
    desc: "🍑 Tonifica y eleva glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Resultados visibles desde la 2ª sesión.",
    price: "$376 000 CLP (6 sesiones)",
  },
  abdomen: {
    name: "Lipo Reductiva 12D / Body Fitness",
    desc: "🔥 Reduce grasa y reafirma la guatita con HIFU 12D + Cavitación + RF + EMS según diagnóstico IA.",
    price: "$480 000 CLP (8–10 sesiones)",
  },
  papada: {
    name: "HIFU Focal / Lipolítico Facial",
    desc: "👱‍♀️ Reafirma contorno y reduce papada sin cirugía. Ideal para perfilar mentón con IA de precisión.",
    price: "$158 000 CLP plan focal",
  },
  face: {
    name: "Face Elite",
    desc: "✨ Rejuvenece rostro combinando HIFU + Radiofrecuencia + Toxina Cosmética. Efecto lifting visible desde la 1ª sesión.",
    price: "$358 400 CLP (6 sesiones)",
  },
  pinkglow: {
    name: "PinkGlow",
    desc: "🌸 Aporta luminosidad e hidratación profunda. Puede combinarse con Face Elite para potenciar resultados según IA.",
    price: "$128 800 CLP (6 sesiones)",
  },
  exosomas: {
    name: "Exosomas Dermapen",
    desc: "🧬 Regeneran la piel a nivel celular y estimulan colágeno. Aplicados con Dermapen para rejuvenecimiento visible.",
    price: "$198 000 CLP por sesión",
  },
  lipolitico: {
    name: "Lipolíticos",
    desc: "🔥 Disuelven grasa localizada en guatita, brazos o papada. Se potencian con Cavitación o HIFU según IA.",
    price: "Incluidos en planes reductivos desde $348 800 CLP",
  },
};

// --- generador de respuesta ---
function generateReply(intent, topic) {
  const plan = topic ? data[topic] : null;

  if (intent === "saludo")
    return "💫 ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. Estoy aquí para ayudarte a conocer tu mejor versión con evaluaciones y seguimiento inteligente. ¿Qué zona quieres trabajar o mejorar?";

  if (!plan)
    return "✨ Cuéntame si quieres mejorar rostro, glúteos, guatita o papada y te orientaré con el plan ideal basado en nuestro sistema IA.";

  switch (intent) {
    case "explicacion":
      return `${plan.desc}\n🤖 Nuestra IA ajusta parámetros según tu zona para resultados más rápidos y seguros.`;
    case "precio":
      return `💰 El plan ${plan.name} tiene un valor de ${plan.price}. Incluye seguimiento personalizado con inteligencia artificial.`;
    case "dolor":
      return "🙂 No duele. Los tratamientos son cómodos y no invasivos; la IA ajusta la intensidad a tu tolerancia.";
    case "resultados":
      return "📸 La IA compara tus mediciones tras cada sesión y muestra el progreso real. Cambios visibles desde las primeras visitas.";
    case "evaluacion":
      return "🧠 Agenda tu evaluación gratuita con IA:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nAnalizamos tu composición corporal y definimos el plan ideal en minutos.";
    default:
      return `${plan.desc}\n${plan.price}\n📊 Incluye evaluación y seguimiento con IA para ajustar cada sesión a tus necesidades.`;
  }
}
