export function generarRespuesta(tipo, texto, contexto) {
  switch (tipo) {
    case "celulitis":
      return "La celulitis se trata con Cavitación, Radiofrecuencia y HIFU 12D. Reducimos nódulos grasos, mejoramos textura y drenaje. ¿Quieres que te recomiende el plan adecuado?";
    case "flacidez":
      return "Para la flacidez usamos Radiofrecuencia, HIFU y EMS Sculptor. Logran firmeza y tonificación visibles. ¿Deseas saber cuál es ideal para ti?";
    case "botox":
      return "El Botox relaja músculos que forman líneas de expresión. Aplicación rápida, visible en 3 días, duración 4–6 meses. ¿Te gustaría agendar evaluación?";
    case "lipo":
      return "Los planes Lipo sin cirugía combinan HIFU 12D, Cavitación, RF y EMS Sculptor. Desde $348.800 (Lipo Focalizada) hasta $664.000 (Lipo Body Elite). ¿Te ayudo a elegir?";
    case "facial":
      return "Ofrecemos Limpieza Facial Full, Face Light, Face Antiage y Face Elite. Desde $120.000 a $584.000. ¿Quieres rejuvenecimiento, limpieza o antiage?";
    case "ubicacion":
      return "📍 Av. Las Perdices 2990, Local 23, Peñalolén. Agenda directa 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "horario":
      return "🕓 Lun–Vie 9:30–20:00 | Sáb 9:30–13:00 en Peñalolén.";
    case "planes":
      return "Planes destacados 💆‍♀️ Lipo Body Elite $664 mil | Push Up $376 mil | Face Elite $358 mil | Limpieza Facial Full $120 mil. ¿Te interesa facial o corporal?";
    case "saludo":
      return "👋 Hola soy Zara de Body Elite. Puedo orientarte sobre tratamientos, precios o agendar tu diagnóstico gratuito. ¿Qué zona quieres mejorar?";
    default:
      return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito 💆‍♀️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }
}
