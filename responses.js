export function generarRespuesta(msg) {
  msg = msg.toLowerCase().trim();

  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("saludo")) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Cuéntame, ¿qué zona te gustaría mejorar o potenciar para orientarte con el tratamiento ideal?";
  }

  if (msg.includes("gluteo") || msg.includes("glúteo") || msg.includes("trasero") || msg.includes("push up")) {
    return "🍑 **Push Up ($376.000)** combina **EMS Sculptor + Radiofrecuencia** para levantar y tonificar glúteos sin cirugía. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("pierna") || msg.includes("muslo")) {
    return "💪 **Body Fitness ($360.000)** combina **EMS Sculptor + Cavitación** para firmeza y tonificación de piernas. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("abdomen") || msg.includes("vientre") || msg.includes("panza") || msg.includes("cintura")) {
    return "🔥 **Lipo Express ($432.000)** combina **HIFU 12D + Cavitación + Radiofrecuencia** para reducir grasa abdominal sin cirugía. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("brazos") || msg.includes("brazo") || msg.includes("flacidez")) {
    return "💫 **Body Tensor ($232.000)** con **Radiofrecuencia + EMS Sculptor** mejora firmeza y tonificación de brazos. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("rostro") || msg.includes("cara") || msg.includes("facial")) {
    return "💎 **Face Light ($128.800)** con **HIFU 12D + LED Therapy + Pink Glow** regenera e ilumina la piel. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("antiage") || msg.includes("rejuvenecimiento") || msg.includes("arrugas")) {
    return "🌟 **Face Elite ($358.400)** combina **HIFU + Pink Glow + Radiofrecuencia** para firmeza y rejuvenecimiento facial. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("botox") || msg.includes("toxina")) {
    return "💉 En Body Elite trabajamos con **protocolos sin cirugía** que logran resultados naturales sin toxina botulínica. Cuéntame qué zona te gustaría tratar y te oriento con la mejor alternativa.";
  }

  if (msg.includes("plan") || msg.includes("tratamiento") || msg.includes("tienen") || msg.includes("opciones")) {
    return "📋 En Body Elite tenemos planes corporales y faciales según tus objetivos: reafirmar, reducir, tonificar o rejuvenecer. Cuéntame tu zona de interés y te recomiendo el plan ideal.";
  }

  if (msg.includes("precio") || msg.includes("valor") || msg.includes("cuesta")) {
    return "💰 Nuestros precios van desde **$60.000 a $664.000** según el plan y la zona. Puedo orientarte según tu objetivo, ¿quieres que te recomiende uno?";
  }

  if (msg.includes("sesion") || msg.includes("cuantas")) {
    return "📆 La cantidad de sesiones depende del objetivo. En promedio son entre **6 y 10 sesiones** para ver resultados visibles. Puedo recomendarte el plan exacto según tu caso.";
  }

  if (msg.includes("agenda") || msg.includes("reserva") || msg.includes("hora")) {
    return "📅 Puedes agendar directamente aquí: 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return "💠 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados reales. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
}
