// === RESPUESTAS CLÍNICAS + MODO MOTIVACIONAL CÁLIDO (v4.9) ===

export async function getResponse(msg, prev = {}) {
  if (!msg) return { reply: respuestas.fallback(), intent: "fallback" };
  msg = msg.toLowerCase();

  let intent = detectarIntent(msg, prev.lastIntent);
  const reply = respuestas[intent]
    ? respuestas[intent](msg, prev.lastIntent)
    : respuestas.fallback();

  return { reply, intent };
}

function detectarIntent(msg, prevIntent) {
  if (/hola|buenas|como estas|qué tal|como te va/.test(msg)) return "saludo_emocional";
  if (/me siento|quiero mi mejor versión|verme mejor|mejorar|insegur/.test(msg)) return "motivacional";
  if (/hifu/.test(msg)) return "hifu";
  if (/radiofrecuencia/.test(msg)) return "radiofrecuencia";
  if (/ems|sculpt/.test(msg)) return "ems";
  if (/pinkglow|pink glow/.test(msg)) return "pinkglow";
  if (/exosoma/.test(msg)) return "exosomas";
  if (/lipol/.test(msg)) return "lipolitico";
  if (/dermapen/.test(msg)) return "dermapen";
  if (/toxina/.test(msg)) return "toxina";
  if (/facial|rostro|arruga|cara|cuello/.test(msg)) return "face";
  if (/glute|potito|trasero|cola|pompa/.test(msg)) return "gluteos";
  if (/guatita|panza|barriga|abdomen|estomago/.test(msg)) return "abdomen";
  if (/papada|menton/.test(msg)) return "papada";
  if (/brazo|alas/.test(msg)) return "brazos";
  if (/pierna|muslo|entrepierna/.test(msg)) return "piernas";
  if (/precio|vale|cuesta/.test(msg)) return "precios";
  if (/sesion/.test(msg)) return "sesiones";
  if (/duele|dolor/.test(msg)) return "duele";
  if (/resultad/.test(msg)) return "resultados";
  if (/agenda|evaluacion|reserva/.test(msg)) return "agendar";
  if (/contiene|incluye|que tiene/.test(msg)) return "contenido";

  if (["precios", "resultados", "duele", "sesiones"].some(k => msg.includes(k)))
    return prevIntent || "fallback";

  if (/y |cuanto|que hace|como funciona/.test(msg)) {
    if (prevIntent && respuestas[prevIntent]) return prevIntent;
  }

  return "fallback";
}

// === BLOQUE DE RESPUESTAS ===
const respuestas = {
  saludo_emocional: () =>
    "✨ ¡Hola! Estoy muy bien y feliz de acompañarte. En Body Elite creemos que cada paso que das para cuidarte te acerca a tu mejor versión. ¿Qué zona te gustaría trabajar o conocer?",

  motivacional: () =>
    "💖 Entiendo totalmente. Cuidarte no es vanidad, es bienestar. En Body Elite queremos ayudarte a que te sientas bien contigo misma. ¿Te gustaría que te recomiende un plan para potenciar tu mejor versión?",

  hifu: () =>
    "💎 HIFU 12D reafirma y tensa piel, reduce grasa en zonas como papada, abdomen o brazos. Sin cirugía y con resultados visibles desde la primera sesión.",

  radiofrecuencia: () =>
    "🌡️ La Radiofrecuencia activa el colágeno y mejora la firmeza de la piel. Ideal para rostro, abdomen, glúteos o brazos.",

  ems: () =>
    "⚡ EMS (ProSculpt) genera contracciones musculares intensas. Equivale a 20 000 abdominales o sentadillas por sesión. Perfecto para tonificar abdomen y glúteos.",

  pinkglow: () =>
    "🌸 PinkGlow ilumina e hidrata la piel. Aporta vitalidad al rostro y puede combinarse con Face Elite. Valor $128.800 CLP (6 sesiones).",

  exosomas: () =>
    "🧬 Los Exosomas regeneran la piel a nivel celular. Se aplican con Dermapen para reparar tejidos y estimular colágeno.",

  lipolitico: () =>
    "🔥 Los Lipolíticos disuelven grasa localizada. Se aplican en abdomen, papada o brazos y se combinan con HIFU o Cavitación.",

  dermapen: () =>
    "🪡 Dermapen estimula la regeneración cutánea mediante microagujas, favoreciendo la absorción de Exosomas o Ácido Hialurónico.",

  toxina: () =>
    "💉 La toxina cosmética suaviza líneas de expresión y aporta un efecto lifting natural.",

  face: () =>
    "✨ Face Elite combina HIFU, Radiofrecuencia y Toxina Cosmética. Mejora firmeza y rejuvenece el rostro sin cirugía.",

  gluteos: () =>
    "🍑 Para glúteos o 'potito', el plan Push Up Body Elite (EMS + Radiofrecuencia) tonifica y eleva desde la 2ª sesión.",

  abdomen: () =>
    "🔥 Para la guatita o abdomen, recomiendo Lipo Reductiva 12D o Body Fitness. Ayudan a reducir grasa y reafirmar el área.",

  papada: () =>
    "👱‍♀️ Para la papada, el tratamiento ideal es HIFU 12D facial o Lipolítico focalizado. Define contorno y tensa la piel.",

  brazos: () =>
    "💪 Para brazos flácidos o 'alas de murciélago', lo mejor es Body Fitness (EMS + RF). Reafirma y tonifica.",

  piernas: () =>
    "🦵 Para piernas o muslos, se recomienda Lipo Body Elite o Cavitación + RF. Mejoran tono y reducen celulitis.",

  precios: () =>
    "💰 Planes destacados:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000\n• PinkGlow $128.800",

  sesiones: () =>
    "📅 Los planes incluyen entre 6 y 10 sesiones según diagnóstico y zona tratada.",

  duele: () =>
    "🙂 No duele. Son tratamientos cómodos y no invasivos. Puedes retomar tus actividades enseguida.",

  resultados: () =>
    "📸 Los resultados se notan desde las primeras sesiones. En la evaluación gratuita te orientamos según tus objetivos.",

  contenido: () =>
    "📋 Cada plan integra tecnologías distintas:\n• Face Elite: HIFU + RF + Toxina\n• Push Up: EMS + RF\n• Lipo Reductiva: HIFU + Cavitación + RF + Lipolítico\n• PinkGlow: Vitaminas + Ácido Hialurónico.",

  agendar: () =>
    "📅 Agenda tu evaluación gratuita aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nHorarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.",

  fallback: () =>
    "🤔 No logré entenderte bien. Cuéntame si quieres trabajar papada, guatita, potito o rostro, y te recomendaré el plan ideal ✨",
};
