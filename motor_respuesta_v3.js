import memoria from "./memoria.js";

export async function procesarMensaje(usuario, texto) {
  texto = texto.toLowerCase().trim();
  const contexto = memoria.obtenerContexto(usuario);

  // Restaurar último tema si no hay contexto activo
  if (!contexto) {
    const ultimo = memoria.obtenerUltimoTema(usuario);
    if (ultimo) memoria.guardarContexto(usuario, ultimo);
  }

  // Función para mantener seguimiento y agendamiento
  function sugerirAgendamiento() {
    return "✨ Recuerda que la evaluación es gratuita y sin compromiso. ¿Te ayudo a reservar tu hora? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Saludo inicial
  if (texto.includes("hola") || texto.includes("buenas") || texto.includes("zara")) {
    memoria.guardarContexto(usuario, "inicio");
    return "✨ Soy Zara de Body Elite. Qué gusto saludarte. Cuéntame qué zona o tratamiento te gustaría mejorar y te orientaré con total honestidad clínica.";
  }

  // === Áreas corporales ===
  if (texto.includes("grasa") || texto.includes("guata") || texto.includes("abdomen") || texto.includes("poto") || texto.includes("pierna") || texto.includes("muslo")) {
    memoria.guardarContexto(usuario, "corporal");
    return "💪 Entiendo, muchas personas buscan mejorar esa zona. Trabajamos con tecnologías como HIFU 12D, Cavitación y Radiofrecuencia para reducir grasa localizada y tensar la piel. ¿Tu objetivo es reducir, tonificar o levantar?";
  }

  if (texto.includes("reducir")) {
    memoria.guardarContexto(usuario, "reducir");
    return "🔥 Perfecto. Para reducción usamos Lipo Body Elite o Lipo Express, que combinan HIFU 12D + Cavitación + RF. Resultados visibles desde la primera sesión. Valor desde $432.000 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("tonificar") || texto.includes("definir")) {
    memoria.guardarContexto(usuario, "tonificar");
    return "💪 Excelente elección. Para tonificar utilizamos EMS Sculptor + Radiofrecuencia, generando 20.000 contracciones musculares en 30 minutos. Ideal para abdomen, glúteos o piernas. Valor desde $360.000 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("levantar") || texto.includes("gluteo") || texto.includes("trasero") || texto.includes("cola") || texto.includes("push")) {
    memoria.guardarContexto(usuario, "gluteos");
    return "🍑 Para levantar o dar forma trabajamos con el plan Push Up Glúteos (EMS Sculptor + RF + HIFU tensor). Mejora la firmeza desde la primera sesión. Valor $376.000 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("reafirmar") || texto.includes("firme") || texto.includes("post parto")) {
    memoria.guardarContexto(usuario, "reafirmar");
    return "✨ Para reafirmar la piel usamos Body Tensor o Body Fitness (HIFU 12D + RF tensor + EMS Sculptor). Ideal para tonificar tras pérdida de peso o embarazo. Valor desde $232.000 CLP.\n" + sugerirAgendamiento();
  }

  // === Faciales ===
  if (texto.includes("cara") || texto.includes("rostro") || texto.includes("facial") || texto.includes("arruga") || texto.includes("línea")) {
    memoria.guardarContexto(usuario, "facial");
    return "💆‍♀️ La zona facial responde excelente a tratamientos con HIFU 12D, Radiofrecuencia y Pink Glow, que estimulan colágeno y mejoran la firmeza sin cirugía. ¿Tu objetivo es rejuvenecer, tensar o iluminar?";
  }

  if (texto.includes("rejuvenecer") || texto.includes("rejuvenecimiento")) {
    memoria.guardarContexto(usuario, "rejuvenecer");
    return "🌸 Para rejuvenecimiento facial usamos Face Elite (HIFU 12D + Toxina + Pink Glow). Reafirma y suaviza arrugas profundas. Valor $358.400 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("tensar") || texto.includes("firmeza") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario, "tensar");
    return "💫 Para tensar usamos HIFU focalizado más Radiofrecuencia facial. Mejora la firmeza sin dolor y sin tiempo de reposo. Valor desde $281.600 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("iluminar") || texto.includes("manchas") || texto.includes("glow")) {
    memoria.guardarContexto(usuario, "iluminar");
    return "✨ Para luminosidad trabajamos con Pink Glow y LED Therapy. Aporta vitalidad, hidratación y brillo natural a la piel. Valor desde $198.400 CLP.\n" + sugerirAgendamiento();
  }

  if (texto.includes("botox") || texto.includes("toxina")) {
    memoria.guardarContexto(usuario, "botox");
    return "💉 La Toxina Botulínica Facial relaja los músculos responsables de las arrugas de expresión, dejando un aspecto natural y fresco. Valor desde $180.000 por zona. ¿Te interesa en frente, entrecejo o patas de gallo?";
  }

  // === Depilación ===
  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila") || texto.includes("bikini") || texto.includes("pierna") || texto.includes("gluteo"))) {
    memoria.guardarContexto(usuario, "depilacion");
    return "🌿 La Depilación Láser Diodo Triple Onda elimina el vello desde la raíz sin dolor. Planes desde $35.000 o $180.000 por 6 sesiones (bikini completo). ¿Quieres que te ayude a agendar tu diagnóstico gratuito?";
  }

  // === Preguntas comunes ===
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuanto")) {
    return "💰 Nuestros valores varían según el plan y la zona. Por ejemplo, faciales desde $198.400 y corporales desde $232.000 CLP. Además, la evaluación inicial es gratuita. ¿Deseas que te ayude a reservar una hora?";
  }

  if (texto.includes("funciona") || texto.includes("como es") || texto.includes("en que consiste")) {
    return "⚙️ Todos nuestros tratamientos usan tecnologías no invasivas: HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Actúan sobre grasa, piel y músculo sin dolor ni reposo. " + sugerirAgendamiento();
  }

  if (texto.includes("donde") || texto.includes("ubicacion") || texto.includes("direccion")) {
    return "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén. Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00. Puedes agendar aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.includes("caro") || texto.includes("comparar") || texto.includes("precio alto")) {
    return "🤍 Entiendo completamente, es normal comparar precios. Nuestros valores reflejan tecnología HIFU 12D original, Cavitación clínica y protocolos personalizados. Además, la evaluación es gratuita y permite adaptar el plan a tu presupuesto.\n" + sugerirAgendamiento();
  }

  if (texto.includes("agendar") || texto.includes("reserva") || texto.includes("evaluacion")) {
    return "📅 Excelente decisión. La evaluación es gratuita y sin compromiso. Puedes reservar directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // === Seguimiento natural ===
  if (contexto === "corporal" || contexto === "facial" || contexto === "depilacion" || contexto === "botox") {
    return "💬 Si me comentas tu objetivo exacto (reducir, tonificar, rejuvenecer o depilar), puedo orientarte con el plan más adecuado.\n" + sugerirAgendamiento();
  }

  // === Fallback ===
  return "💛 Disculpa, no logré entender tu mensaje, pero nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.\n" + sugerirAgendamiento();
}
