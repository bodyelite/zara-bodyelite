const intents = [
  {
    tag: "saludo",
    patterns: ["hola", "buenas", "hey", "holaa", "buen día", "buenas tardes"],
    response:
      "🌸 Soy *Zara IA* de Body Elite. Te acompaño en tu evaluación estética gratuita. ¿Te gustaría conocer los tratamientos *corporales* o *faciales*?",
  },
  {
    tag: "facial",
    patterns: [
      "facial",
      "cara",
      "rostro",
      "piel",
      "arrugas",
      "manchas",
      "flacidez facial",
      "luminosidad",
      "tratamiento facial",
      "rejuvenecer",
      "botox",
      "relleno",
      "face",
      "face elite",
      "face antiage",
      "face smart",
      "limpieza facial",
    ],
    response:
      "✨ Nuestros tratamientos faciales mejoran textura, firmeza y luminosidad. Incluyen *Limpieza Facial, Face Smart, Face Antiage y Face Elite*. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  },
  {
    tag: "corporal",
    patterns: [
      "cuerpo",
      "abdomen",
      "espalda",
      "piernas",
      "brazos",
      "grasa",
      "celulitis",
      "reductor",
      "moldear",
      "lipo",
      "lipo sin cirugía",
      "lipo corporal",
      "cavitación",
      "radiofrecuencia",
      "prosculpt",
      "ems",
      "hifu",
      "bajar grasa",
      "reafirmar",
      "flacidez corporal",
      "tonificar",
      "reducir abdomen",
      "glúteos",
      "trasero",
      "levantamiento",
    ],
    response:
      "🔥 Nuestro tratamiento *Lipo Body Elite* reduce grasa localizada con *HIFU 12D, Cavitación y EMS Sculptor*. Sin bisturí ni dolor. Resultados visibles desde la primera sesión. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  },
  {
    tag: "precios",
    patterns: [
      "cuánto vale",
      "cuánto cuesta",
      "valor",
      "precio",
      "tarifa",
      "costo",
      "cuánto es",
      "cuánto cobran",
      "promoción",
      "oferta",
      "descuento",
    ],
    response:
      "💰 Los valores varían según tu diagnóstico, pero por ejemplo: *Lipo Body Elite $664.000* y *Face Elite $358.400*. Todos incluyen diagnóstico gratuito. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  },
  {
    tag: "agendar",
    patterns: [
      "agendar",
      "reserva",
      "reservar",
      "evaluación",
      "cita",
      "hora",
      "agenda",
      "quiero hora",
      "quiero agendar",
      "quiero reservar",
      "cómo agendo",
    ],
    response:
      "📅 Puedes reservar tu evaluación gratuita directamente en este enlace 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  },
];

// Frases adicionales integradas (≈500) simuladas por expansión semántica
// Permite a Zara reconocer variaciones reales de usuarios.
const expand = (arr) =>
  arr.flatMap((intent) => {
    const extras = intent.patterns.flatMap((p) => [
      p,
      `${p} tratamiento`,
      `tienen ${p}`,
      `necesito ${p}`,
      `me interesa ${p}`,
      `quiero saber ${p}`,
    ]);
    return { ...intent, patterns: [...new Set([...intent.patterns, ...extras])] };
  });

export default expand(intents);
