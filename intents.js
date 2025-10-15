export const intents = [
  {
    tag: "greeting",
    patterns: ["hola", "buenas", "qué tal", "saludos", "hay alguien"],
    responses: ["greeting"]
  },
  {
    tag: "facial_treatment",
    patterns: [
      "facial", "rostro", "arrugas", "botox", "toxina", "antiage", "piel", "hifu", "pink glow",
      "radiofrecuencia", "face light", "face elite", "face smart", "limpieza facial", "acné", "manchas", "flacidez facial"
    ],
    responses: ["facial_treatment"]
  },
  {
    tag: "botox",
    patterns: ["botox", "toxina botulinica", "relleno", "antiarrugas", "expresion", "frente", "patas de gallo"],
    responses: ["facial_treatment"]
  },
  {
    tag: "pink_glow",
    patterns: ["pink glow", "brillo facial", "biorevitalizacion", "vitaminas faciales", "piel luminosa"],
    responses: ["facial_treatment"]
  },
  {
    tag: "corporal_treatment",
    patterns: [
      "cuerpo", "abdomen", "piernas", "gluteos", "flacidez", "lipo", "cavitacion", "sculptor", "hifu corporal",
      "bajar abdomen", "reafirmar", "celulitis", "tonificar", "bajar grasa", "moldear cuerpo"
    ],
    responses: ["corporal_treatment"]
  },
  {
    tag: "promo",
    patterns: ["promoción", "descuento", "oferta", "gratis", "evaluación gratuita", "regalo"],
    responses: ["promo"]
  },
  {
    tag: "booking",
    patterns: ["agendar", "reservar", "diagnóstico", "evaluación", "agenda", "cita", "hora", "quiero agendar"],
    responses: ["booking"]
  },
  {
    tag: "location",
    patterns: ["ubicación", "direccion", "donde estan", "como llegar", "horarios", "mapa"],
    responses: ["location"]
  },
  {
    tag: "fallback",
    patterns: [""],
    responses: ["fallback"]
  }
];
