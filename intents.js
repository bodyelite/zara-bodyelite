export const intents = [
  // SALUDO
  {
    tag: "saludo",
    patterns: ["hola", "buenas", "buenos días", "buenas tardes", "hey", "holi"],
    responses: ["greeting"]
  },

  // DESPEDIDA
  {
    tag: "despedida",
    patterns: ["adios", "gracias", "nos vemos", "chau"],
    responses: ["goodbye"]
  },

  // FACIALES
  {
    tag: "facial_general",
    patterns: ["facial", "cara", "rostro", "piel", "manchas", "arrugas", "acné", "papada", "antiage", "rejuvenecimiento", "lifting", "radiofrecuencia facial", "toxina", "botox"],
    responses: ["facial_treatment"]
  },

  // CORPORALES
  {
    tag: "corporal_general",
    patterns: ["abdomen", "grasa", "celulitis", "flacidez", "piernas", "glúteos", "bajar abdomen", "tonificar", "cintura", "reducir medidas"],
    responses: ["body_treatment"]
  },

  // TECNOLOGÍAS
  {
    tag: "tecnologia",
    patterns: ["hifu", "cavitación", "radiofrecuencia", "ems", "sculptor", "pink glow"],
    responses: ["tech_explained"]
  },

  // UBICACIÓN
  {
    tag: "ubicacion",
    patterns: ["donde están", "ubicación", "dirección", "cómo llegar", "en qué comuna", "donde queda"],
    responses: ["location"]
  },

  // PRECIOS Y PROMOS
  {
    tag: "precio",
    patterns: ["precio", "cuánto cuesta", "valor", "promocion", "oferta"],
    responses: ["pricing"]
  },

  // CITA / AGENDAMIENTO
  {
    tag: "agendar",
    patterns: ["quiero agendar", "agenda", "reservar", "diagnóstico", "evaluación"],
    responses: ["booking"]
  },

  // FALLBACK
  {
    tag: "fallback",
    patterns: [""],
    responses: ["fallback"]
  }
];
