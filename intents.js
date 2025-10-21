const intents = [
  {
    tag: "saludo",
    patterns: ["hola", "buen día", "buenas tardes", "buenas noches", "holis", "hey", "qué tal"],
    response: "Hola 🌸 Soy Zara IA de Body Elite. Te acompaño en tu evaluación estética gratuita ✨. ¿Te gustaría conocer los tratamientos corporales o faciales?"
  },
  {
    tag: "facial",
    patterns: ["rostro", "cara", "facial", "piel", "manchas", "acné", "arrugas", "poros", "rejuvenecimiento"],
    response: "✨ Nuestros tratamientos faciales mejoran textura, firmeza y luminosidad. Incluyen Limpieza Facial, Face Smart, Face Antiage y Face Elite. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },
  {
    tag: "corporal",
    patterns: ["grasa", "abdomen", "cintura", "espalda", "piernas", "muslos", "celulitis", "flacidez", "glúteos", "brazos", "lipo", "cuerpo", "reductor"],
    response: "🔥 Nuestro tratamiento *Lipo Body Elite* reduce grasa localizada con HIFU 12D, Cavitación y EMS Sculptor. Sin bisturí ni dolor. Resultados visibles desde la primera sesión. Reserva tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },
  {
    tag: "flacidez",
    patterns: ["flacidez", "firmeza", "piel suelta", "tonificar", "colágeno", "reafirmar"],
    response: "💪 Para flacidez o pérdida de tono recomendamos *Body Tensor* o *Body Fitness* con Radiofrecuencia + EMS Sculptor. Resultados progresivos desde la primera semana. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },
  {
    tag: "lipo",
    patterns: ["lipo", "liposucción", "sin cirugía", "bajar grasa", "moldear cuerpo", "reducir grasa"],
    response: "🔥 Nuestra *Lipo Reductiva* combina Cavitación + Radiofrecuencia + HIFU 12D. Resultados visibles sin bisturí ni postoperatorios. Reserva tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },
  {
    tag: "sesiones",
    patterns: ["sesión", "sesiones", "cuántas", "duración", "cuánto dura"],
    response: "🕒 Los planes incluyen entre 6 y 12 sesiones según el diagnóstico corporal o facial. Cada sesión dura entre 30 y 50 minutos. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  },
  {
    tag: "agendar",
    patterns: ["agendar", "reserva", "reservar", "cita", "hora", "evaluación", "agendamiento"],
    response: "📅 Puedes reservar directamente tu evaluación gratuita en el siguiente enlace 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  }
];

module.exports = { intents };
