export const intents = [
  {
    tag: "greeting",
    patterns: ["hola", "buenas", "qué tal", "hay alguien", "saludos"],
    responses: ["greeting"]
  },
  {
    tag: "facial_treatment",
    patterns: [
      "facial", "rostro", "cara", "arrugas", "flacidez facial", "antiage", "acné",
      "pink glow", "radiofrecuencia", "hifu", "limpieza facial", "face elite",
      "face smart", "face light", "toxina", "botox", "relleno", "vitaminas"
    ],
    responses: ["facial_treatment"]
  },
  {
    tag: "corporal_treatment",
    patterns: [
      "corporal", "abdomen", "piernas", "glúteos", "lipo", "cavitación",
      "sculptor", "flacidez", "celulitis", "reducir", "bajar grasa", "tonificar",
      "reafirmar", "body", "lipo body elite", "body fitness", "push up"
    ],
    responses: ["corporal_treatment"]
  },
  {
    tag: "knowledge",
    patterns: [
      "botox", "pink glow", "hifu", "cavitación", "sculptor", "radiofrecuencia",
      "exosomas", "limpieza", "acné", "flacidez", "lipo", "ubicación"
    ],
    responses: ["knowledge"]
  },
  {
    tag: "promo",
    patterns: ["promoción", "descuento", "oferta", "gratis", "evaluación gratuita"],
    responses: ["promo"]
  },
  {
    tag: "booking",
    patterns: ["agendar", "reservar", "diagnóstico", "evaluación", "cita", "hora", "quiero agendar"],
    responses: ["booking"]
  },
  {
    tag: "location",
    patterns: ["ubicación", "direccion", "donde estan", "como llegar", "mapa", "horarios"],
    responses: ["location"]
  },
  {
    tag: "fallback",
    patterns: [""],
    responses: ["fallback"]
  }
];
