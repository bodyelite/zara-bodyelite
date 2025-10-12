export async function getResponse(msg) {
  msg = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // saludo
  if (/(hola|buenas|hey|ola|buenos dias|buenas tardes|buenas noches)/.test(msg))
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Uso inteligencia artificial para analizar tus objetivos y recomendarte el plan ideal. ¿Qué zona te gustaría trabajar: rostro, guatita, glúteos o papada?";

  // ubicación
  if (/(donde|ubicacion|direccion|peñalolen|local|sede)/.test(msg))
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕒 Horarios: Lun–Vie 9:30–20:00 | Sáb 9:30–13:00.";

  // HIFU / tecnología
  if (/(hifu|ultrasonido|12d|focalizado)/.test(msg))
    return "💠 El HIFU 12D es una tecnología de ultrasonido focalizado que tensa y reafirma piel y tejido profundo sin cirugía. Estimula colágeno y define contorno. En Body Elite lo combinamos con IA para ajustar potencia y zonas según tu evaluación.";

  // glúteos
  if (/(gluteo|gluteos|cola|trasero|pompa|potito)/.test(msg))
    return "🍑 Nuestro plan Push Up combina ProSculpt EMS + Radiofrecuencia Focalizada para tonificar y elevar glúteos.\n⚙️ Resultados visibles desde la 2ª sesión.\n📊 Incluye evaluación y seguimiento con IA para personalizar cada ajuste.";

  // abdomen / guatita
  if (/(guata|abdomen|panz|barriga|estomago|vientre|cintura)/.test(msg))
    return "🔥 Para la guatita o abdomen recomendamos Lipo Reductiva 12D o Body Fitness.\n📉 Ayudan a reducir grasa y reafirmar el área con ajustes automáticos de potencia por IA.";

  // papada / rostro
  if (/(papada|cara|rostro|menton|perfil|contorno)/.test(msg))
    return "💎 Para rostro o papada recomendamos Face Smart o Face Elite con HIFU, RF y diagnóstico facial IA.\n✨ La IA analiza piel y zonas flácidas para definir el protocolo perfecto sin cirugía.";

  // agendamiento
  if (/(agenda|agendar|reserva|cita|hora|evaluacion)/.test(msg))
    return "📅 Puedes agendar tu evaluación gratuita con IA aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // precios
  if (/(precio|vale|cuanto|costo|valor)/.test(msg))
    return "💰 Planes destacados:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000\n• PinkGlow $128.800";

  // IA / evaluación
  if (/(inteligencia|evaluacion|diagnostico|seguimiento|mediciones|progreso|fitdays)/.test(msg))
    return "🤖 Nuestra IA analiza tus mediciones corporales (peso, grasa, músculo y edad corporal) para ajustar sesiones y tecnologías según tus resultados.\nCada semana mide avances y personaliza el tratamiento.";

  // cierre genérico
  return "💬 Cuéntame qué zona quieres mejorar (rostro, guatita, glúteos o papada) y te diré cómo nuestro sistema IA puede ayudarte a lograrlo.";
}
