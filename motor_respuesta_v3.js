import memoria from "./memoria.js";

export async function procesarMensaje(usuario, texto) {
  texto = texto.toLowerCase().trim();
  let contexto = memoria.obtenerContexto(usuario);

  if (!contexto) {
    const ultimo = memoria.obtenerUltimoTema(usuario);
    if (ultimo) memoria.guardarContexto(usuario, ultimo);
  }

  const afirmativos = ["si", "sí", "claro", "perfecto", "dale", "quiero", "me interesa", "obvio", "por supuesto"];
  const agendar = () =>
    "✨ Recuerda que la evaluación es gratuita y sin compromiso. ¿Te ayudo a coordinar tu hora? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // --- detección cruzada ---
  if (texto.match(/grasa|guata|abdomen|gluteo|poto|cola|pierna|muslo|reducir|tonificar|levantar/)) {
    memoria.guardarContexto(usuario, "corporal");
    contexto = "corporal";
  } else if (texto.match(/cara|facial|rostro|arruga|línea|rejuvenecer|tensar|iluminar|botox|toxina/)) {
    memoria.guardarContexto(usuario, "facial");
    contexto = "facial";
  } else if (texto.match(/depil|pelos|bikini|axila/)) {
    memoria.guardarContexto(usuario, "depilacion");
    contexto = "depilacion";
  }

  // --- saludo ---
  if (texto.includes("hola") || texto.includes("buenas") || texto.includes("zara")) {
    memoria.guardarContexto(usuario, "inicio");
    return "✨ Soy Zara de Body Elite. Qué gusto saludarte. Cuéntame qué zona o tratamiento te gustaría mejorar y te orientaré con total honestidad clínica.";
  }

  // --- afirmaciones ---
  if (afirmativos.some(p => texto.includes(p))) {
    const tema = memoria.obtenerContexto(usuario);
    if (tema === "facial") return "💆‍♀️ Me alegra. Puedo ayudarte a coordinar tu diagnóstico facial gratuito y ajustar el plan a tu piel. " + agendar();
    if (tema === "corporal") return "💪 Perfecto, puedo ayudarte a reservar tu evaluación corporal sin costo. " + agendar();
    if (tema === "depilacion") return "🌿 Genial, la depilación láser es muy efectiva. ¿Te ayudo a reservar tu cita gratuita? " + agendar();
    return "✨ Excelente. La evaluación es gratuita y te orientamos según tu presupuesto. " + agendar();
  }

  // --- corporales ---
  if (texto.match(/grasa|guata|abdomen|poto|pierna|muslo/)) {
    memoria.guardarContexto(usuario, "corporal");
    return "💪 Entiendo, muchas personas buscan mejorar esa zona. Trabajamos con HIFU 12D, Cavitación y Radiofrecuencia para reducir grasa y tensar piel. ¿Tu objetivo es reducir, tonificar o levantar?";
  }

  if (texto.match(/reducir/)) {
    memoria.guardarContexto(usuario, "corporal");
    return "🔥 Para reducción usamos Lipo Body Elite o Lipo Express (HIFU 12D + Cavitación + RF). Resultados desde la primera sesión. Valor desde $432 000 CLP.\n" + agendar();
  }

  if (texto.match(/tonificar|definir/)) {
    memoria.guardarContexto(usuario, "corporal");
    return "💪 Para tonificar usamos EMS Sculptor + Radiofrecuencia, logrando 20 000 contracciones en 30 min. Ideal para abdomen, glúteos o piernas. Valor $360 000 CLP.\n" + agendar();
  }

  if (texto.match(/levantar|gluteo|trasero|cola|push|poto/)) {
    memoria.guardarContexto(usuario, "corporal");
    return "🍑 Para levantar y dar forma trabajamos con Push Up Glúteos (EMS Sculptor + RF + HIFU tensor). Firmeza desde la primera sesión. Valor $376 000 CLP.\n" + agendar();
  }

  if (texto.match(/reafirmar|firme|post parto/)) {
    memoria.guardarContexto(usuario, "corporal");
    return "✨ Para reafirmar usamos Body Tensor o Body Fitness (HIFU 12D + RF tensor + EMS Sculptor). Ideal tras bajada de peso o embarazo. Valor $232 000 CLP.\n" + agendar();
  }

  // --- faciales ---
  if (texto.match(/cara|rostro|facial|arruga|línea/)) {
    memoria.guardarContexto(usuario, "facial");
    return "💆‍♀️ La zona facial responde excelente a HIFU 12D, Radiofrecuencia y Pink Glow, que estimulan colágeno y mejoran firmeza sin cirugía. ¿Tu objetivo es rejuvenecer, tensar o iluminar?";
  }

  if (texto.match(/rejuvenecer|rejuvenecimiento|más joven/)) {
    memoria.guardarContexto(usuario, "facial");
    return "🌸 Para rejuvenecimiento facial usamos Face Elite (HIFU 12D + Toxina + Pink Glow). Reafirma y suaviza arrugas profundas. Valor $358 400 CLP.\n" + agendar();
  }

  if (texto.match(/tensar|firmeza|flacidez/)) {
    memoria.guardarContexto(usuario, "facial");
    return "💫 Para tensar usamos HIFU focalizado + Radiofrecuencia facial. Mejora la firmeza sin dolor ni reposo. Valor $281 600 CLP.\n" + agendar();
  }

  if (texto.match(/iluminar|manchas|glow/)) {
    memoria.guardarContexto(usuario, "facial");
    return "✨ Para luminosidad trabajamos con Pink Glow y LED Therapy. Aporta vitalidad e hidratación. Valor $198 400 CLP.\n" + agendar();
  }

  if (texto.match(/botox|toxina/)) {
    memoria.guardarContexto(usuario, "facial");
    return "💉 La Toxina Botulínica Facial relaja los músculos responsables de las arrugas de expresión, dejando un aspecto natural y fresco. Valor desde $180 000 por zona. ¿Te interesa en frente, entrecejo o patas de gallo?";
  }

  // --- depilación ---
  if (texto.match(/depil|pelos|axila|bikini/)) {
    memoria.guardarContexto(usuario, "depilacion");
    return "🌿 La Depilación Láser Diodo Triple Onda elimina el vello desde la raíz sin dolor. Planes desde $35 000 o $180 000 por 6 sesiones (bikini completo). ¿Quieres que te ayude a agendar tu diagnóstico gratuito?";
  }

  // --- coherencia de seguimiento ---
  if (contexto === "facial" && texto.match(/caro|precio|vale/)) {
    return "🤍 Entiendo, los planes faciales usan HIFU 12D original y Pink Glow europeo, tecnologías de última generación con seguimiento profesional. Además, la evaluación es gratuita y podemos ajustar el plan a tu presupuesto.\n" + agendar();
  }

  if (contexto === "corporal" && texto.match(/caro|precio|vale/)) {
    return "💪 Entiendo, los planes corporales usan equipos HIFU 12D y EMS Sculptor clínicos. La evaluación es gratuita y podemos ver alternativas más acotadas o por zona específica.\n" + agendar();
  }

  // --- preguntas comunes ---
  if (texto.match(/funciona|como es|en que consiste/)) {
    return "⚙️ Todos nuestros tratamientos usan tecnología no invasiva (HIFU 12D, Cavitación, Radiofrecuencia, EMS Sculptor). Actúan sobre grasa, piel y músculo sin dolor ni reposo. " + agendar();
  }

  if (texto.match(/donde|ubicacion|direcci/)) {
    return "📍 Estamos en Av. Las Perdices Nº 2990, Local 23, Peñalolén. Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00. Puedes agendar aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.match(/agendar|reserva|evaluacion/)) {
    return "📅 Excelente decisión. La evaluación es gratuita y sin compromiso. Reserva aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- fallback ---
  return "💛 Disculpa, no logré entender tu mensaje. Pero puedo ayudarte a encontrar el tratamiento más adecuado para ti. " + agendar();
}
