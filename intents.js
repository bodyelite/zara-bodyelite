export function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase()
  const grupos = {
    saludo: ["hola", "buenas", "qué tal", "hey"],
    botox: ["botox", "toxina", "arrugas", "expresión"],
    hifu: ["hifu", "ultrasonido", "lifting sin cirugía"],
    grasa: ["grasa", "abdomen", "cintura", "celulitis", "reductivo", "piernas"],
    facial: ["facial", "cara", "piel", "luminosidad", "antiage", "líneas"],
    flacidez: ["flacidez", "firmeza", "tono muscular"],
    agenda: ["agendar", "cita", "hora", "reserva", "evaluación"]
  }
  for (const [intencion, palabras] of Object.entries(grupos)) {
    if (palabras.some(p => msg.includes(p))) return intencion
  }
  return "general"
}
