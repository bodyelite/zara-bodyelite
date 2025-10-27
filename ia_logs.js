export function obtenerRespuesta(texto) {
  const t = texto.toLowerCase();

  const agendar = "📲 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  const respuestas = [
    {
      palabras: ["hola", "buenas", "hey", "zara"],
      respuesta: "🌸 ¡Hola! Soy Zara IA de Body Elite. Estoy aquí para ayudarte a descubrir tu mejor versión ✨. ¿Qué zona te gustaría mejorar hoy?"
    },
    {
      palabras: ["abdomen", "barriga", "vientre", "panza"],
      respuesta: "🔥 Para grasa localizada y flacidez usamos HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor. Resultados visibles desde la 2ª sesión. Desde $348.800 CLP.\n" + agendar
    },
    {
      palabras: ["grasa", "flacidez", "reductor", "moldear", "lipo"],
      respuesta: "💎 Contamos con planes Lipo Express o Lipo Body Elite según diagnóstico. Combinamos HIFU 12D + RF + EMS para reducir grasa y tonificar. " + agendar
    },
    {
      palabras: ["gluteo", "glúteo", "trasero", "cola", "nalgas"],
      respuesta: "🍑 PUSH UP con EMS Sculptor y Radiofrecuencia. Reafirma y levanta en solo 2 semanas. Incluye tonificación muscular sin dolor. " + agendar
    },
    {
      palabras: ["rostro", "cara", "facial", "piel", "líneas", "arrugas", "manchas"],
      respuesta: "🌺 Face Elite, Face Antiage o Face Smart según diagnóstico. Mejoran firmeza, textura y luminosidad de la piel. Incluyen LED Therapy y Radiofrecuencia facial. " + agendar
    },
    {
      palabras: ["sesiones", "cuantas", "cuánto", "cuantos"],
      respuesta: "📅 Cada plan tiene entre 6 y 12 sesiones dependiendo del diagnóstico y la tecnología usada. La primera evaluación es gratuita y te orientamos según tus objetivos. " + agendar
    },
    {
      palabras: ["precio", "vale", "valor", "cuesta", "coste"],
      respuesta: "💰 Nuestros planes van desde $348.800 CLP (Lipo Focalizada) hasta $664.000 CLP (Lipo Body Elite). Los faciales desde $120.000 CLP. Incluyen diagnóstico IA y tecnologías avanzadas. " + agendar
    },
    {
      palabras: ["duele", "dolor", "molesta", "sensación"],
      respuesta: "🤍 Todos nuestros tratamientos son indoloros. Usamos tecnologías no invasivas que generan calor controlado o contracciones musculares suaves. Relajantes y seguras. " + agendar
    },
    {
      palabras: ["donde", "dirección", "ubicación", "local"],
      respuesta: "📍 Estamos en Av. Las Perdices 2990, Local 23. Peñalolén. Horario Lun–Vie 9:30–20:00 | Sáb 9:30–13:00. Estacionamiento y atención personalizada. " + agendar
    },
    {
      palabras: ["evaluación", "agenda", "reserva", "agendar", "cita", "hora"],
      respuesta: "🩵 Perfecto. Puedes agendar directamente tu evaluación gratuita en este enlace:\n" + agendar
    }
  ];

  for (const r of respuestas) {
    if (r.palabras.some(p => t.includes(p))) return r.respuesta;
  }

  return "✨ No estoy segura, pero puedo orientarte en tu evaluación gratuita asistida con IA. Cuéntame qué zona o resultado te gustaría mejorar 💬 " + agendar;
}
