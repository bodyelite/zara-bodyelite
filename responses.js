export function getResponse(msg) {
  if (!msg) return "";

  const text = msg.toLowerCase();

  // === SALUDO INICIAL ===
  if (text.includes("hola") || text.includes("buenas") || text.includes("zara")) {
    return "✨ Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. Nuestro sistema combina diagnóstico corporal y facial con inteligencia artificial para personalizar tu tratamiento. Cuéntame si deseas mejorar rostro, abdomen, glúteos o papada, y te mostraré cómo lograrlo 💫";
  }

  // === TRATAMIENTOS ===
  if (text.includes("botox") || text.includes("toxina")) {
    return "💉 La Toxina Botulínica ayuda a relajar los músculos responsables de las líneas de expresión. Se aplica con precisión para mantener un resultado natural y expresivo. Agenda acá tu evaluación gratuita con asistencia de IA y descubre si este tratamiento es ideal para ti. Nuestra evaluación y seguimiento se realizan con inteligencia artificial para personalizar tu plan.";
  }

  if (text.includes("hifu")) {
    return "🔷 El HIFU 12D es una tecnología de ultrasonido focalizado que tensa y reafirma la piel sin cirugía. En Body Elite lo combinamos con IA para ajustar la potencia y zonas según tu evaluación. Agenda acá tu evaluación gratuita con asistencia de IA.";
  }

  if (text.includes("pink glow") || text.includes("pinkglow")) {
    return "🌸 Pink Glow es un tratamiento bioestimulante que revitaliza, hidrata y mejora manchas gracias a ácido hialurónico, vitaminas y aminoácidos. Ideal para piel apagada o con pigmentación irregular. Agenda acá tu evaluación gratuita con asistencia de IA y conoce cómo nuestra IA adapta la dosis según tu piel.";
  }

  if (text.includes("exosoma") || text.includes("exosomas")) {
    return "🧬 Los Exosomas estimulan la regeneración celular, mejorando textura, firmeza y luminosidad. En Body Elite los usamos en protocolos avanzados faciales y capilares con seguimiento IA. Agenda acá tu evaluación gratuita con asistencia de IA.";
  }

  if (text.includes("lipo") || text.includes("body") || text.includes("fitness")) {
    return "🔥 Planes corporales disponibles:\n• Lipo Body Elite $664.000 (12 sesiones + IA + FitDays)\n• Lipo Reductiva 12D $480.000 (10 sesiones)\n• Body Fitness $360.000 (8 sesiones)\n• Push Up $376.000 (6 sesiones)\nCada plan incluye evaluación y seguimiento IA semanal. Agenda acá tu evaluación gratuita con asistencia de IA.";
  }

  if (text.includes("agendar") || text.includes("agenda") || text.includes("reserva")) {
    return "📅 Podemos coordinar tu evaluación gratuita con IA, sin compromiso. Durante la visita analizamos rostro y cuerpo con inteligencia artificial para definir tu plan ideal. Agenda acá tu evaluación gratuita con asistencia de IA.";
  }

  if (text.includes("donde estan") || text.includes("ubicacion") || text.includes("direccion")) {
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén. Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00. Agenda acá tu evaluación gratuita con asistencia de IA para comenzar tu experiencia Body Elite 💎";
  }

  // === MENSAJE POR DEFECTO ===
  return "💫 Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos o papada). Estoy aquí para orientarte con cariño y precisión, y ayudarte a elegir el plan que realmente haga la diferencia. Agenda acá tu evaluación gratuita con asistencia de IA.";
}
