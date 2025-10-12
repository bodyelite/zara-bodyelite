export async function getResponse(msg) {
  msg = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita tildes

  // saludos
  if (/(hola|buenas|buenos dias|buenas tardes|buenas noches)/.test(msg))
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame si quieres mejorar rostro, glúteos, guatita o papada y te orientaré con el plan ideal según nuestro sistema inteligente.";

  // ubicación o dirección
  if (/(donde estan|ubicacion|direccion|peñalolen|local)/.test(msg))
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén. \n🕒 Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00.";

  // glúteos
  if (/(gluteo|gluteos|glute|trasero|cola|pompa|potito)/.test(msg))
    return "🍑 Tonifica y eleva glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Resultados visibles desde la 2ª sesión.\n💡 Nuestra IA ajusta parámetros según tu zona para resultados más rápidos y seguros.";

  // abdomen / guatita
  if (/(guata|abdomen|panz|barriga|estomago|cintura|vientre)/.test(msg))
    return "🔥 Para la guatita o abdomen recomendamos Lipo Reductiva 12D o Body Fitness. Ayudan a reducir grasa y reafirmar el área.\n📊 Incluye evaluación y seguimiento con IA para personalizar cada sesión.";

  // papada / rostro
  if (/(papada|cara|rostro|menton|perfil)/.test(msg))
    return "💎 Para papada o contorno facial te recomiendo Face Smart o Face Elite, ambos con HIFU y radiofrecuencia.\n💬 Incluye diagnóstico facial con IA sin costo para ver resultados previos.";

  // agendamiento
  if (/(agenda|agendar|reserva|cita|hora)/.test(msg))
    return "📅 Puedes agendar tu evaluación gratuita con IA aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // precios
  if (/(precio|vale|cuanto|costo|valen)/.test(msg))
    return "💰 Planes destacados:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000\n• PinkGlow $128.800";

  // default
  return "🤔 No logré entenderte bien. Cuéntame si quieres trabajar papada, guatita, potito o rostro, y te recomendaré el plan ideal ✨";
}
