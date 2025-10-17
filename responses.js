export function generarRespuesta(tipo, texto, contexto) {
  switch (tipo) {
    case "celulitis":
      return "La celulitis se trata con Cavitación, Radiofrecuencia y HIFU 12D. Reducimos nódulos grasos, mejoramos textura y drenaje. ¿Quieres que te recomiende el plan adecuado?";
    case "flacidez":
      return "Para la flacidez usamos Radiofrecuencia, HIFU 12D y EMS Sculptor. Aumentan colágeno y tonifican la piel. ¿Deseas que te indique cuál es el ideal para ti?";
    case "botox":
      return "La Toxina Botulínica suaviza líneas de expresión desde el 3° día y dura 4–6 meses. ¿Quieres agendar una evaluación facial gratuita?";
    case "lipo":
      return "Los planes Lipo sin cirugía combinan HIFU 12D + Cavitación + RF + EMS Sculptor. Desde $348.800 (Lipo Focalizada) hasta $664.000 (Lipo Body Elite). ¿Te ayudo a elegir?";
    case "facial":
      return "Tratamientos faciales 💆 Limpieza Full $120.000 | Face Antiage $281.600 | Face Elite $358.400. ¿Buscas mejorar líneas, manchas o firmeza?";
    case "ubicacion":
      return "📍 Body Elite: Av. Las Perdices 2990, Local 23 Peñalolén. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "horario":
      return "🕓 Horario: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00.";
    case "planes":
      return "Planes destacados 💆‍♀️ Lipo Body Elite $664 mil | Push Up $376 mil | Face Elite $358 mil | Limpieza Full $120 mil. ¿Facial o corporal?";
    case "saludo":
      return "👋 Hola, soy Zara de Body Elite. Puedo orientarte sobre tratamientos, precios o agendar tu diagnóstico gratuito. ¿Qué zona quieres mejorar?";
    case "confirmacion":
      return "Perfecto 😊 Te recomiendo agendar tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9 Así definimos el plan ideal según tu evaluación corporal.";
    case "cierre":
      return "Gracias por escribir 💙 Recuerda que puedes agendar tu diagnóstico gratuito cuando quieras.";
    default:
      return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito 💆‍♀️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }
}
