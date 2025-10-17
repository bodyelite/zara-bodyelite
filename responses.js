export function generarRespuesta(tipo, texto, contexto) {
  texto = texto.toLowerCase();

  // 1. Empatía y detección de sensaciones
  const sensaciones = [
    "rollitos", "grasa", "panza", "barriga", "vientre", "abdomen", "cintura",
    "papada", "flacidez", "piel suelta", "piel colgando", "muslos", "piernas",
    "brazos", "espalda", "celulitis", "cartucheras"
  ];
  if (sensaciones.some(p => texto.includes(p))) {
    return "Entiendo perfectamente 💬. En Body Elite trabajamos esas zonas con Cavitación, Radiofrecuencia y HIFU 12D, tecnologías que reducen grasa localizada, mejoran firmeza y textura. Nuestro sistema IA define el plan ideal según tu diagnóstico corporal gratuito. ¿Quieres que agende tu evaluación asistida por IA?";
  }

  // 2. Tratamientos específicos (sin precios)
  if (texto.includes("push up")) {
    return "El tratamiento Push Up estimula y eleva glúteos usando EMS Sculptor y Radiofrecuencia. Genera contracciones musculares profundas que tonifican y mejoran la forma. Se realiza en sesiones cómodas de 30 minutos. ¿Deseas una evaluación gratuita para confirmar si es el más adecuado para ti?";
  }
  if (texto.includes("lipo") || texto.includes("lipoláser")) {
    return "Los tratamientos Lipo sin cirugía combinan Cavitación, HIFU 12D y Radiofrecuencia para reducir grasa localizada y definir contorno corporal sin dolor ni reposo. ¿Quieres agendar tu diagnóstico corporal gratuito con IA?";
  }
  if (texto.includes("face") || texto.includes("facial") || texto.includes("limpieza")) {
    return "Nuestros tratamientos faciales combinan limpieza profunda, Radiofrecuencia, LED Therapy y activos regeneradores como Pink Glow. Logran una piel más luminosa, firme y saludable. ¿Deseas una evaluación facial gratuita para ver qué plan es ideal para ti?";
  }
  if (texto.includes("botox") || texto.includes("toxina")) {
    return "La Toxina Botulínica relaja los músculos responsables de las líneas de expresión. El resultado se nota desde el 3.º día y mantiene una apariencia natural. ¿Quieres que te indiquemos si es adecuado para ti?";
  }

  // 3. Confirmaciones
  if (texto === "sí" || texto === "si") {
    return "Excelente 😊. Te puedo agendar una evaluación gratuita para definir tu plan personalizado. Solo necesito confirmar tu disponibilidad horaria. ¿Prefieres mañana o pasado mañana?";
  }

  // 4. Ubicación y horario
  if (texto.includes("ubicad") || texto.includes("dirección")) {
    return "📍 Nos encuentras en Av. Las Perdices 2990, Local 23, Peñalolén. Lunes a viernes 9:30–20:00 y sábado 9:30–13:00. ¿Quieres agendar una evaluación gratuita?";
  }

  // 5. Saludo general
  if (texto.includes("hola") || texto.includes("buenas")) {
    return "👋 ¡Hola! Soy Zara, asistente virtual de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, resolver tus dudas y ayudarte a elegir el plan ideal. ¿Qué zona o tratamiento te gustaría mejorar?";
  }

  // 6. Cierre
  if (texto.includes("gracias")) {
    return "Encantada 💙. Recuerda que tu diagnóstico gratuito te ayuda a definir el tratamiento más efectivo con respaldo IA. Puedes agendarlo cuando quieras aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // 7. Fallback por defecto
  return "Puedo ayudarte con tratamientos corporales y faciales, resolver tus dudas o agendar tu diagnóstico gratuito asistido por IA 💆‍♀️. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
