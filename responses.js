export function generarRespuesta(tipo, texto) {
  texto = texto.toLowerCase();
  const link = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  if (tipo === "saludo")
    return `👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, resolver tus dudas o ayudarte a agendar tu diagnóstico gratuito asistido por IA 💫. ¿Qué zona te gustaría mejorar?`;

  if (tipo === "sensacion")
    return `💬 Entiendo perfectamente. En Body Elite tratamos esas zonas con Cavitación, Radiofrecuencia y HIFU 12D, que reducen grasa localizada y mejoran firmeza y textura. Nuestro diagnóstico IA define tu plan ideal.  
📅 Agenda aquí tu evaluación gratuita 👉 ${link}`;

  if (tipo === "tratamiento") {
    if (texto.includes("push"))
      return `🍑 El tratamiento Push Up tonifica y eleva glúteos con EMS Sculptor y Radiofrecuencia, logrando firmeza sin cirugía.  
📅 Agenda tu diagnóstico gratuito 👉 ${link}`;
    if (texto.includes("lipo"))
      return `✨ Las Lipos sin cirugía combinan Cavitación, HIFU 12D y Radiofrecuencia para reducir grasa localizada y definir tu contorno corporal.  
📅 Agenda aquí tu evaluación gratuita 👉 ${link}`;
    if (texto.includes("face") || texto.includes("facial"))
      return `🌸 Nuestros tratamientos faciales combinan limpieza, Radiofrecuencia y LED Therapy para lograr una piel más firme, luminosa y uniforme.  
📅 Agenda tu diagnóstico facial gratuito 👉 ${link}`;
    if (texto.includes("pink"))
      return `🌷 Pink Glow utiliza péptidos y antioxidantes para regenerar e hidratar la piel. Ideal para piel cansada o con signos de fatiga.  
📅 Agenda tu evaluación gratuita 👉 ${link}`;
    if (texto.includes("botox") || texto.includes("toxina"))
      return `💉 La Toxina Botulínica suaviza líneas de expresión y mantiene resultados naturales en frente, entrecejo y patas de gallo.  
📅 Agenda aquí tu evaluación gratuita 👉 ${link}`;
  }

  if (tipo === "ubicacion")
    return `📍 Nos encuentras en Av. Las Perdices 2990, Local 23, Peñalolén.  
🕓 Horarios: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00.  
📅 Agenda aquí tu diagnóstico 👉 ${link}`;

  if (tipo === "confirmacion")
    return `Perfecto 😊. Te reservo una evaluación gratuita con IA para definir tu plan personalizado.  
📅 Agenda directa 👉 ${link}`;

  if (tipo === "cierre")
    return `Encantada 💙. Recuerda que tu diagnóstico gratuito te permite definir el tratamiento ideal para ti.  
📅 Agenda aquí 👉 ${link}`;

  return `Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito asistido por IA 💆‍♀️.  
📅 Agenda aquí 👉 ${link}`;
}
