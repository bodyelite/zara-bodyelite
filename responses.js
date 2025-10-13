export function getResponse(text) {
  const lower = text.toLowerCase();

  // --- SALUDOS ---
  if (["hola", "buenas", "holaa", "hey"].some(w => lower.includes(w)))
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión. Cuéntame qué zona quieres mejorar: rostro, abdomen, glúteos o papada 💎";

  // --- UBICACIÓN ---
  if (lower.includes("dónde") || lower.includes("direccion"))
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén. Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00.";

  // --- BOTOX / TOXINA ---
  if (lower.includes("botox") || lower.includes("toxina"))
    return "💉 La Toxina Botulínica ayuda a relajar los músculos responsables de las líneas de expresión. Se aplica con precisión y entrega un resultado natural, manteniendo tu expresividad. ¿Quieres que te cuente en qué zonas se recomienda o cuándo podrías evaluarte sin costo?";

  // --- PINK GLOW ---
  if (lower.includes("pink") || lower.includes("glow"))
    return "🌸 Pink Glow es un tratamiento bioestimulante que ilumina y uniforma la piel. Revitaliza, hidrata y mejora manchas gracias a ácido hialurónico, vitaminas y aminoácidos. Ideal para piel apagada o con pigmentación irregular.";

  // --- HIFU ---
  if (lower.includes("hifu"))
    return "💠 El HIFU 12D es ultrasonido focalizado que tensa y reafirma piel y tejido profundo sin cirugía. Estimula colágeno y define contorno. En Body Elite lo combinamos con IA para ajustar potencia y zonas según tu evaluación.";

  // --- AGENDA / RESERVA ---
  if (["agenda", "reservar", "agendar", "hora"].some(w => lower.includes(w)))
    return "🗓️ Podemos coordinar tu evaluación gratuita con IA, sin compromiso. Durante la visita analizamos rostro y cuerpo para definir tu plan ideal. Nuestra inteligencia artificial también acompaña el seguimiento de tus tratamientos. Agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // --- PLANES CORPORAL / FACIAL ---
  if (lower.includes("plan") || lower.includes("precio"))
    return "🔥 Planes corporales: Lipo Body Elite $664.000 (12 sesiones + IA + FitDays), Lipo Reductiva $480.000 (10 sesiones), Body Fitness $360.000 (8 sesiones), Push Up $376.000 (6 sesiones). Todos incluyen evaluación y seguimiento IA.";

  // --- DESPEDIDA ---
  if (["gracias", "ok", "perfecto"].some(w => lower.includes(w)))
    return "💖 Gracias a ti. Recuerda que cada sesión en Body Elite se adapta con asistencia de IA para potenciar tus resultados. ¿Quieres que te ayude a reservar tu evaluación sin costo?";

  // --- RESPUESTA GENÉRICA ---
  return "💬 Cuéntame qué zona quieres mejorar (rostro, abdomen, glúteos o papada). Estoy aquí para orientarte con precisión y ayudarte a elegir el plan ideal 💕";
}
