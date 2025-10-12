export async function getResponse(msg) {
  msg = msg.toLowerCase();

  if (/hola|buenas/.test(msg))
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame si quieres mejorar rostro, glúteos, guatita o papada y te orientaré con el plan ideal según nuestro sistema inteligente.";

  if (/glute|glúteo/.test(msg))
    return "🍑 Tonifica y eleva glúteos con ProSculpt EMS + Radiofrecuencia Focalizada. Resultados visibles desde la 2ª sesión.\n💡 Nuestra IA ajusta parámetros según tu zona para resultados más rápidos y seguros.";

  if (/guata|abdomen|barriga|panz/.test(msg))
    return "🔥 Para la guatita o abdomen recomendamos Lipo Reductiva 12D o Body Fitness. Reducen grasa y reafirman el área.\n📊 Incluye evaluación y seguimiento con IA para ajustar cada sesión a tus medidas.";

  if (/papada/.test(msg))
    return "💎 Para papada o contorno facial te recomiendo Face Smart o Face Elite, ambos con HIFU y radiofrecuencia.\n💬 Incluye diagnóstico facial IA sin costo para ver resultados previos.";

  if (/agend|hora|cita/.test(msg))
    return "📅 Puedes agendar tu evaluación sin costo en Peñalolén aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  if (/precio|vale|cuánto/.test(msg))
    return "💰 Planes destacados:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Body Fitness $360.000\n• Push Up $376.000\n• PinkGlow $128.800";

  return "🤔 No logré entenderte bien. Cuéntame si quieres trabajar papada, guatita, potito o rostro, y te recomendaré el plan ideal ✨";
}
