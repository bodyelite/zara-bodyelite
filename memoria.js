export function procesarMensaje(texto, anterior, nombre) {
  texto = texto.toLowerCase().trim();

  // --- Saludo inicial ---
  if (texto.includes("hola") || texto.includes("buenas") || texto.includes("qué tal")) {
    return "Hola 🌸, soy Zara, asistente IA de Body Elite. Estoy aquí para orientarte y ayudarte en tu evaluación estética ✨ ¿Qué zona de tu cuerpo te gustaría trabajar?";
  }

  // --- Planes corporales ---
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("celulitis") || texto.includes("cintura") || texto.includes("piernas") || texto.includes("glúteos") || texto.includes("flacidez") || texto.includes("brazos") || texto.includes("trasero")) {
    return "🔥 Los tratamientos corporales de Body Elite combinan HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para reducir grasa y tonificar. 💰 Desde $348.800 CLP según diagnóstico y zona tratada. Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Planes faciales ---
  if (texto.includes("facial") || texto.includes("cara") || texto.includes("rostro") || texto.includes("acné") || texto.includes("limpieza") || texto.includes("manchas") || texto.includes("rejuvenecimiento") || texto.includes("piel")) {
    return "🌸 Nuestros tratamientos faciales mejoran textura, firmeza y luminosidad. Incluyen Limpieza Facial Full, Face Smart, Face Antiage y Face Elite con tecnología HIFU 12D, Radiofrecuencia, LED Therapy, Pink Glow y Exosomas. 💰 Desde $120.000 CLP según diagnóstico y tipo de piel. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Botox / inyectables ---
  if (texto.includes("botox") || texto.includes("relleno") || texto.includes("toxina") || texto.includes("hialurónico")) {
    return "💉 En Body Elite aplicamos Toxina Botulínica y ácido hialurónico con especialistas certificadas. Tratamientos seguros, sin dolor y con resultados naturales. Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Pink Glow / regeneración ---
  if (texto.includes("pink") || texto.includes("glow") || texto.includes("luminosidad") || texto.includes("piel radiante")) {
    return "🌸 Pink Glow aporta péptidos y antioxidantes que regeneran la piel y mejoran su luminosidad. Ideal tras limpieza facial o como refuerzo anti-edad. 💰 Desde $120.000 CLP. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Exosomas ---
  if (texto.includes("exosomas") || texto.includes("celular") || texto.includes("regeneración") || texto.includes("antiage")) {
    return "🧬 Los tratamientos con exosomas estimulan la regeneración celular profunda y mejoran elasticidad y tono de la piel. Se aplican en rostro, cuello o cuero cabelludo. Agenda tu diagnóstico gratuito asistido con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- Fallback ---
  return "";
}
