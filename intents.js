export const intents = [
  {
    tag: "saludo",
    patterns: ["hola", "buenas", "qué tal", "hay alguien", "hola body elite", "buenos días", "buenas tardes"],
    responses: ["saludo"]
  },
  {
    tag: "despedida",
    patterns: ["gracias", "nos vemos", "chao", "adiós"],
    responses: ["despedida"]
  },
  {
    tag: "requerimiento_clinico",
    patterns: [
      "bajar abdomen", "reducir grasa", "piel seca", "flacidez", "arrugas", "manchas", "acné", "celulitis",
      "glúteos", "reafirmar", "tonificar", "cansancio facial", "mantener resultados", "piel sensible",
      "recuperar piel", "papada", "contorno caído", "antiage", "sin luz"
    ],
    responses: ["search_knowledge"]
  },
  {
    tag: "ubicacion",
    patterns: ["dónde están", "dirección", "ubicación", "cómo llegar", "horarios"],
    responses: ["ubicacion"]
  }
];
