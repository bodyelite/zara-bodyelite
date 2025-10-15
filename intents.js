export const intents = [
  {
    tag: "greeting",
    patterns: [
      "hola",
      "buenas",
      "qué tal",
      "buen día",
      "buenas tardes",
      "buenas noches",
      "hola zara",
      "hola body elite"
    ],
    responses: ["greeting"]
  },

  {
    tag: "facial_treatment",
    patterns: [
      "facial",
      "cara",
      "piel",
      "arrugas",
      "antiage",
      "anti edad",
      "flacidez facial",
      "limpieza facial",
      "pink glow",
      "radiofrecuencia facial",
      "hifu facial",
      "tratamiento facial",
      "manchas",
      "acné",
      "botox",
      "toxina",
      "toxina botulínica",
      "patas de gallo",
      "frente",
      "líneas de expresión",
      "relleno facial",
      "antiarrugas",
      "lifting",
      "rejuvenecimiento"
    ],
    responses: ["facial_treatment"]
  },

  {
    tag: "corporal_treatment",
    patterns: [
      "cuerpo",
      "abdomen",
      "piernas",
      "glúteos",
      "bajar abdomen",
      "reductivo",
      "lipo",
      "cavitacion",
      "radiofrecuencia corporal",
      "sculptor",
      "hifu corporal",
      "tonificar",
      "celulitis",
      "bajar grasa",
      "moldear cuerpo",
      "tonificar piernas"
    ],
    responses: ["corporal_treatment"]
  },

  {
    tag: "technologies",
    patterns: [
      "hifu",
      "cavitacion",
      "radiofrecuencia",
      "sculptor",
      "pink glow",
      "tecnologia",
      "equipos",
      "maquinas",
      "fitdays",
      "diagnóstico inteligente"
    ],
    responses: ["technologies"]
  },

  {
    tag: "booking",
    patterns: [
      "agendar",
      "agenda",
      "evaluacion",
      "reserva",
      "quiero agendar",
      "diagnostico",
      "cita",
      "evaluación gratuita"
    ],
    responses: ["booking"]
  },

  {
    tag: "location",
    patterns: [
      "direccion",
      "ubicacion",
      "donde estan",
      "como llegar",
      "peñalolen",
      "local",
      "horario",
      "donde queda",
      "av las perdices"
    ],
    responses: ["location"]
  },

  {
    tag: "promo",
    patterns: [
      "promo",
      "promocion",
      "oferta",
      "descuento",
      "gratis",
      "beneficio",
      "regalo",
      "depilacion gratis",
      "promociones"
    ],
    responses: ["promo"]
  },

  {
    tag: "farewell",
    patterns: [
      "gracias",
      "chau",
      "adios",
      "nos vemos",
      "hasta luego",
      "ok gracias",
      "perfecto gracias"
    ],
    responses: ["farewell"]
  },

  {
    tag: "fallback",
    patterns: [],
    responses: ["fallback"]
  }
];
