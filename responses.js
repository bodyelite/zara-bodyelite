export async function getResponse(msg) {
  if (!msg || typeof msg !== "string") return defaultReply();

  const raw = msg.trim();
  const text = raw.toLowerCase();

  const normalized = text
    .replace(/\bguatita\b/g, "abdomen")
    .replace(/\bpanza\b/g, "abdomen")
    .replace(/\bbarriga\b/g, "abdomen")
    .replace(/\best[oó]mago\b/g, "abdomen");

  const asks_botox = /\b(botox|toxina|toxina botul[iní]ca)\b/.test(normalized);
  const asks_hifu = /\bhifu\b/.test(normalized);
  const asks_pink = /\bpink\s?glow\b|pinkglow\b/.test(normalized);
  const asks_exosoma = /\bexosoma(s)?\b/.test(normalized);
  const asks_lipolitico = /\blipol[ií]tico(s)?\b/.test(normalized);
  const asks_prices = /\b(cuanto vale|precio|valor|cuesta)\b/.test(normalized);
  const asks_results = /\b(resultad|cambio|mejora|efecto)\b/.test(normalized);
  const asks_location = /\bdonde\b|ubicaci[oó]n|direcci[oó]n/.test(normalized);
  const greets = /\b(hola|buenas|buenos dias|buenas tardes)\b/.test(normalized);
  const ask_appointment = /\bagendar|cita|evaluaci[oó]n\b/.test(normalized);

  if (greets && !ask_appointment) return softGreeting();

  if (asks_botox)
    return (
      "💉 La Toxina Botulínica ayuda a relajar los músculos responsables de las líneas de expresión. " +
      "Se aplica con precisión y entrega un resultado natural, manteniendo tu expresividad. " +
      "¿Quieres que te cuente en qué zonas se recomienda o cuándo puedes evaluarte sin costo?"
    );

  if (asks_hifu)
    return (
      "🔷 El HIFU 12D es una tecnología que reafirma la piel desde las capas más profundas sin cirugía. " +
      "Activa colágeno y redefine contornos. Ideal si buscas un cambio visible y natural. " +
      "¿Quieres que te explique cómo se combina con nuestra IA para personalizar tu plan?"
    );

  if (asks_pink)
    return (
      "🌸 Pink Glow revitaliza e ilumina la piel con ácido hialurónico, vitaminas y aminoácidos. " +
      "Es perfecto para recuperar el brillo y la uniformidad del rostro. " +
      "¿Deseas saber cómo integrarlo en tu tratamiento o su valor?"
    );

  if (asks_exosoma)
    return (
      "🧬 Los Exosomas son partículas regeneradoras que estimulan colágeno y reparación celular. " +
      "Ayudan a rejuvenecer y mejorar textura de piel desde el interior. " +
      "¿Quieres conocer cómo lo usamos en Body Elite junto a IA?"
    );

  if (asks_lipolitico)
    return (
      "🔥 Los Lipolíticos ayudan a reducir grasa localizada y mejorar el contorno corporal. " +
      "Se aplican de forma segura y personalizada en zonas como abdomen o muslos. " +
      "¿Te gustaría saber si es adecuado para ti o agendar una evaluación gratuita?"
    );

  if (asks_location)
    return (
      "📍 Estamos en *Av. Las Perdices N°2990, Local 23, Peñalolén.*\n" +
      "🕒 Horarios: Lun–Vie 9:30–20:00, Sáb 9:30–13:00.\n" +
      "Si quieres, puedo ayudarte a reservar tu evaluación sin costo 💫"
    );

  if (asks_prices)
    return (
      "💰 Planes más consultados:\n" +
      "• Lipo Body Elite $664.000 (12 sesiones + IA + FitDays)\n" +
      "• Lipo Reductiva 12D $480.000 (10 sesiones)\n" +
      "• Body Fitness $360.000 (8 sesiones)\n" +
      "• Push Up $376.000 (6 sesiones)\n\n" +
      "Incluyen diagnóstico con IA y ajuste semanal de parámetros. 💎\n" +
      "¿Quieres que te recomiende el ideal según tu zona?"
    );

  if (asks_results)
    return (
      "📊 Los resultados suelen notarse desde las primeras sesiones. " +
      "Nuestra IA compara tus mediciones y adapta los parámetros para acelerar los avances. " +
      "Cada cuerpo responde distinto, pero verás cambios reales y progresivos 💫"
    );

  if (ask_appointment)
    return (
      "📅 Podemos coordinar tu evaluación gratuita con IA, sin compromiso. " +
      "Durante la visita analizamos rostro y cuerpo para definir tu plan ideal. " +
      "¿Quieres que te ayude a reservar tu hora?"
    );

  if (/\b(rostro|abdomen|papada|gluteo|glúteo|gluteos|glúteos)\b/.test(normalized)) {
    const zone = normalized.match(/\b(rostro|abdomen|papada|gluteo|glúteo|gluteos|glúteos)\b/)[0];
    return (
      `✨ Para ${zone}, nuestro sistema IA recomienda una evaluación gratuita para definir tu combinación ideal de tecnologías. ` +
      `Así podemos personalizar tratamientos como HIFU, EMS o Lipolíticos según tus objetivos. 💫\n` +
      `¿Te gustaría que te ayude a agendarla?`
    );
  }

  return defaultReply();
}

function defaultReply() {
  return (
    "💬 Cuéntame qué zona quieres mejorar (rostro, abdomen, glúteos o papada). " +
    "Estoy aquí para orientarte con cariño y precisión, y ayudarte a elegir el plan que realmente haga la diferencia 💖"
  );
}

function softGreeting() {
  return (
    "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. " +
    "Estoy aquí para acompañarte a encontrar tu mejor versión. " +
    "Cuéntame si quieres mejorar rostro, abdomen, glúteos o papada y te mostraré cómo podemos hacerlo juntas 🤍"
  );
}
