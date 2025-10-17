export function generarRespuesta(tipo, texto) {
  texto = texto.toLowerCase();

  if (tipo === "saludo")
    return "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, o ayudarte a agendar tu diagnóstico gratuito. ¿Qué zona te gustaría mejorar?";

  if (tipo === "sensacion")
    return "Entiendo perfectamente 💬. En Body Elite tratamos esos casos con Cavitación, Radiofrecuencia y HIFU 12D. Reducen grasa, mejoran firmeza y textura. Nuestro diagnóstico IA identifica el plan ideal para ti. ¿Quieres agendar tu evaluación gratuita?";

  if (tipo === "tratamiento") {
    if (texto.includes("push")) return "El tratamiento Push Up tonifica y eleva glúteos con EMS Sculptor y Radiofrecuencia. Mejora forma y firmeza sin cirugía. ¿Deseas tu evaluación gratuita?";
    if (texto.includes("lipo")) return "Las Lipos sin cirugía combinan Cavitación, HIFU 12D y Radiofrecuencia para reducir grasa localizada y definir contorno corporal sin dolor. ¿Quieres tu diagnóstico gratuito con IA?";
    if (texto.includes("face") || texto.includes("facial")) return "Nuestros tratamientos faciales combinan limpieza, Radiofrecuencia y LED Therapy para una piel más firme, luminosa y uniforme. ¿Deseas una evaluación facial gratuita?";
    if (texto.includes("pink")) return "Pink Glow utiliza péptidos y antioxidantes para regenerar la piel y mejorar textura e hidratación. Ideal para piel apagada o con signos de fatiga. ¿Quieres agendar tu sesión de evaluación?";
    if (texto.includes("botox") || texto.includes("toxina")) return "La Toxina Botulínica suaviza líneas de expresión y mantiene resultados naturales. Se aplica en zonas como frente, entrecejo y patas de gallo. ¿Quieres confirmar si es adecuada para ti?";
  }

  if (tipo === "ubicacion")
    return "📍 Estamos en Av. Las Perdices 2990, Local 23, Peñalolén. Horario: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00. ¿Te ayudo a agendar tu evaluación gratuita?";

  if (tipo === "confirmacion")
    return "Perfecto 😊. Te puedo agendar una evaluación gratuita con IA para definir tu plan personalizado. ¿Prefieres mañana o pasado mañana?";

  if (tipo === "cierre")
    return "Encantada 💙. Recuerda que tu diagnóstico gratuito te permite definir el tratamiento ideal para ti. Puedes agendar aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito asistido por IA 💆‍♀️. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
