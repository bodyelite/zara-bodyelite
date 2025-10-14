export const intents = [
  {
    tag: "saludo",
    patterns: ["hola", "buenas", "consulta", "información", "quisiera saber", "necesito ayuda"],
    responses: ["greeting"]
  },
  {
    tag: "agendamiento",
    patterns: ["quiero agendar", "agendar cita", "evaluación", "reserva", "hora disponible", "quiero diagnóstico"],
    responses: ["booking"]
  },
  {
    tag: "tratamientos_corporales",
    patterns: ["lipo", "abdomen", "cintura", "celulitis", "flacidez corporal", "muslos", "glúteos", "brazos", "piernas", "reductivo"],
    responses: ["body_treatments"]
  },
  {
    tag: "tratamientos_faciales",
    patterns: ["facial", "cara", "rostro", "arrugas", "papada", "manchas", "acné", "lifting", "antiage", "radiofrecuencia facial"],
    responses: ["face_treatments"]
  },
  {
    tag: "sintomas",
    patterns: ["flacidez", "grasa localizada", "papada", "celulitis", "abdomen bajo", "firmeza", "retención de líquidos"],
    responses: ["symptoms"]
  },
  {
    tag: "precios_promociones",
    patterns: ["cuánto cuesta", "valor", "precio", "promociones", "oferta", "depilación gratis", "planes"],
    responses: ["pricing"]
  },
  {
    tag: "tecnologias",
    patterns: ["hifu", "sculptor", "radiofrecuencia", "pink glow", "toxina", "cavitacion", "tecnologia", "rf tripolar"],
    responses: ["technologies"]
  },
  {
    tag: "ubicacion",
    patterns: ["donde estan", "direccion", "como llegar", "horarios", "peñalolen", "mapa", "telefono"],
    responses: ["location"]
  },
  {
    tag: "seguimiento",
    patterns: ["gracias", "me atendí", "post tratamiento", "quiero repetir", "control", "seguimiento", "segunda sesión"],
    responses: ["followup"]
  },
  {
    tag: "default",
    patterns: [],
    responses: ["fallback"]
  }
];
