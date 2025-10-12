export async function getResponse(msg) {
  msg = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // --- SALUDO INICIAL ---
  if (/(hola|buenas|hey|ola|buenos dias|buenas tardes|buenas noches)/.test(msg))
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite Estética Avanzada. Nuestro sistema combina diagnóstico corporal y facial con inteligencia artificial para personalizar tu tratamiento. ¿Qué zona quieres mejorar: rostro, guatita, glúteos o papada?";

  // --- UBICACIÓN ---
  if (/(donde|ubicacion|direccion|peñalolen|local|sede)/.test(msg))
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Horarios: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00.\n📲 Agenda tu evaluación gratuita en https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // --- EVALUACIÓN IA ---
  if (/(evaluacion|diagnostico|fitdays|inteligencia|seguimiento|progreso)/.test(msg))
    return "🤖 Nuestra IA analiza tus mediciones corporales (peso, grasa, músculo, edad corporal) y tu rostro para definir el protocolo ideal. Ajusta cada sesión según tus avances y genera reportes automáticos.";

  // --- HIFU ---
  if (/(hifu|ultrasonido|12d|focalizado)/.test(msg))
    return "💠 El HIFU 12D es ultrasonido focalizado que tensa piel y tejido profundo sin cirugía. Estimula colágeno, reduce flacidez y define contorno. En Body Elite se combina con IA para ajustar potencia y profundidad según tu tipo de tejido.";

  // --- PINK GLOW ---
  if (/(pinkglow|pink glow|glow|iluminador|manchas|piel rosada)/.test(msg))
    return "🌸 *Pink Glow* es un tratamiento bioestimulante que ilumina y uniforma la piel. Revitaliza, hidrata y mejora manchas gracias a activos con ácido hialurónico, vitaminas B y aminoácidos. Ideal para rostro apagado o con pigmentación irregular.";

  // --- RADIOFRECUENCIA / CAVITACIÓN ---
  if (/(radiofrecuencia|rf|cavitacion|ondas|calor|celulitis|flacidez)/.test(msg))
    return "⚡ La Radiofrecuencia Focalizada y la Cavitación trabajan flacidez y celulitis. Aumentan temperatura interna para reafirmar, activar colágeno y disolver grasa localizada. Nuestros equipos ajustan la energía automáticamente mediante IA.";

  // --- EMS / PROSCULPT ---
  if (/(ems|prosculpt|electro|estimulo|musculo|tonificar)/.test(msg))
    return "💪 ProSculpt EMS es estimulación electromagnética de alta intensidad. Cada sesión equivale a +20 000 contracciones musculares. Define abdomen, glúteos y piernas sin esfuerzo físico.";

  // --- PLANES CORPORALES ---
  if (/(guata|abdomen|cintura|barriga|panz|vientre|reductor|lipo|body|fitness|push up)/.test(msg))
    return "🔥 *Planes corporales:*\n• Lipo Body Elite $664 000 (12 sesiones + IA + FitDays)\n• Lipo Reductiva 12D $480 000 (10 sesiones)\n• Body Fitness $360 000 (8 sesiones)\n• Push Up $376 000 (6 sesiones glúteos)\nCada plan incluye evaluación, seguimiento IA y ajuste semanal de parámetros.";

  // --- PLANES FACIALES ---
  if (/(cara|rostro|papada|menton|piel|face|facial|contorno)/.test(msg))
    return "💎 *Planes faciales:*\n• Face Elite $358 400 (HIFU + Pink Glow + RF)\n• Face Smart $198 400\n• Face Light $128 800\n• Face Antiage $281 600\nTodos incluyen diagnóstico IA para medir elasticidad, tono y poros.";

  // --- LIMPIEZA / TRATAMIENTOS PIEL ---
  if (/(limpieza|piel|espinillas|poros|acne)/.test(msg))
    return "🫧 La Limpieza Facial Full ($120 000, 6 sesiones) remueve impurezas, equilibra grasa y hidrata la piel. Se combina con Radiofrecuencia + serum Pink Glow para mejorar textura y luminosidad.";

  // --- DIFERENCIADOR DE BODY ELITE ---
  if (/(diferencia|por que|porque|mejor|distinto)/.test(msg))
    return "🏆 Body Elite integra tecnología HIFU 12D, Cavitación, RF y EMS con diagnóstico IA. No trabajamos protocolos estándar: cada plan se ajusta a tus mediciones y resultados reales. Garantizamos un proceso seguro y personalizado.";

  // --- PRECIOS GENERALES ---
  if (/(precio|vale|costo|cuanto|valor)/.test(msg))
    return "💰 Planes destacados:\n• Lipo Body Elite $664 000\n• Face Elite $358 400\n• Body Fitness $360 000\n• Push Up $376 000\n• PinkGlow $128 800\nIncluyen evaluación y seguimiento IA.";

  // --- AGENDAMIENTO ---
  if (/(agenda|agendar|reserva|cita|hora|evaluacion|agendamiento)/.test(msg))
    return "📅 Puedes agendar tu evaluación gratuita con IA aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // --- PROMOCIONES ---
  if (/(promo|oferta|descuento|gratis|beneficio)/.test(msg))
    return "🎁 Promoción actual: al tomar un plan corporal recibes una sesión de depilación láser gratis. Consulta vigencia al agendar tu evaluación IA.";

  // --- REDIRECCIÓN HUMANA ---
  if (/(humano|asesora|persona|llamar|contacto|wsp|numero)/.test(msg))
    return "📲 Puedes hablar directamente con una especialista en +56 9 8330 0262 si quieres acelerar tu reserva o cotización.";

  // --- RESPUESTA GENERAL ---
  return "💬 Cuéntame qué zona quieres mejorar (rostro, guatita, glúteos o papada) y te diré cómo nuestro sistema IA puede ayudarte a lograrlo.";
}
