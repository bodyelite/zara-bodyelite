export const intents = [
  {
    tag: "saludo",
    patterns: [
      "hola", "buenas", "buenas tardes", "buen día",
      "consulta", "quisiera información", "me interesa"
    ],
    responses: ["greeting"]
  },
  {
    tag: "agendamiento",
    patterns: [
      "quiero agendar", "puedo reservar", "hora disponible",
      "agenda", "quiero cita", "quiero evaluación", "cómo reservo"
    ],
    responses: ["booking"]
  },
  {
    tag: "tratamientos",
    patterns: [
      "qué es hifu", "pink glow", "radiofrecuencia", "cavitación",
      "lipo", "sculptor", "body elite", "antiage", "facial", "corporal"
    ],
    responses: ["treatments"]
  },
  {
    tag: "precios",
    patterns: [
      "cuánto cuesta", "precio", "valor", "cuánto sale", "promociones",
      "descuento", "oferta", "planes"
    ],
    responses: ["pricing"]
  },
  {
    tag: "ubicacion",
    patterns: [
      "dónde están", "dirección", "cómo llegar", "horarios",
      "atienden sábado", "peñalolén"
    ],
    responses: ["location"]
  },
  {
    tag: "seguimiento",
    patterns: [
      "gracias", "ok", "confirmo", "perfecto", "me atendí ayer",
      "cómo sigo", "quiero repetir", "post tratamiento"
    ],
    responses: ["followup"]
  },
  {
    tag: "default",
    patterns: [],
    responses: ["fallback"]
  }
];
