export function procesarMensaje(texto, anterior, nombre) {
  texto = texto.toLowerCase().trim();

  // --- SALUDO Y CONTEXTO GENERAL ---
  if (texto.includes("hola") || texto.includes("buenas") || texto.includes("qué tal") || texto.includes("zara")) {
    return "Hola 🌸, soy Zara, asistente IA de Body Elite. Estoy aquí para acompañarte en tu evaluación estética ✨ ¿Qué zona te gustaría mejorar o trabajar hoy?";
  }

  // --- UBICACIÓN Y HORARIOS ---
  if (texto.includes("ubicación") || texto.includes("dónde") || texto.includes("dirección") || texto.includes("donde están") || texto.includes("ubicados")) {
    return "📍 Estamos en *Av. Las Perdices 2990, Local 23, Peñalolén.* 🕓 Horarios: Lunes a Viernes 09:30–20:00 y Sábado 09:30–13:00. Puedes agendar fácilmente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- DISPONIBILIDAD / RESERVAS ---
  if (texto.includes("agenda") || texto.includes("reservar") || texto.includes("disponible") || texto.includes("horas") || texto.includes("cita")) {
    return "🗓️ Sí, tenemos agenda disponible esta semana. Puedes reservar tu evaluación gratuita asistida con IA desde el siguiente enlace 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- PLANES CORPORALES ---
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("celulitis") || texto.includes("cintura") || texto.includes("piernas") || texto.includes("glúteos") || texto.includes("flacidez") || texto.includes("brazos") || texto.includes("trasero") || texto.includes("muslos")) {
    return "🔥 En Body Elite tratamos grasa localizada, celulitis y flacidez combinando *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor.* Nuestros planes comienzan *desde $348.800 CLP* según diagnóstico y zona tratada. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- PLANES FACIALES ---
  if (texto.includes("facial") || texto.includes("cara") || texto.includes("rostro") || texto.includes("acné") || texto.includes("limpieza") || texto.includes("manchas") || texto.includes("poros") || texto.includes("rejuvenecimiento") || texto.includes("piel")) {
    return "🌸 Los tratamientos faciales Body Elite mejoran textura, firmeza y luminosidad con *HIFU 12D, Radiofrecuencia, LED Therapy, Pink Glow y Exosomas.* Planes desde *$120.000 CLP* según diagnóstico y tipo de piel. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- BOTOX / INYECTABLES ---
  if (texto.includes("botox") || texto.includes("relleno") || texto.includes("toxina") || texto.includes("hialurónico") || texto.includes("labios")) {
    return "💉 Sí, aplicamos *Toxina Botulínica y Ácido Hialurónico* con profesionales certificadas. Tratamientos seguros, sin dolor y con resultados naturales. Los valores se confirman en diagnóstico gratuito. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- PINK GLOW / REGENERACIÓN ---
  if (texto.includes("pink") || texto.includes("glow") || texto.includes("luminosidad") || texto.includes("vitaminas") || texto.includes("piel radiante")) {
    return "✨ *Pink Glow* aporta péptidos y antioxidantes que regeneran la piel y mejoran su luminosidad. Ideal tras una limpieza facial o como refuerzo anti-edad. Desde $120.000 CLP. Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- EXOSOMAS ---
  if (texto.includes("exosomas") || texto.includes("celular") || texto.includes("regeneración") || texto.includes("antiage") || texto.includes("colágeno")) {
    return "🧬 Los tratamientos con *exosomas* estimulan la regeneración celular profunda y mejoran elasticidad y tono de la piel. Se aplican en rostro, cuello o cuero cabelludo. Agenda tu diagnóstico gratuito con IA aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- CIERRE GENERAL ---
  if (texto.includes("gracias") || texto.includes("ok") || texto.includes("perfecto") || texto.includes("genial")) {
    return "💫 Encantada de ayudarte. Recuerda que tu evaluación es *gratuita y personalizada con IA.* Puedes agendar en el link cuando gustes. Nos vemos pronto 💖";
  }

  // --- RESPUESTA GENERAL FALLBACK ---
  return "No logré entenderte bien, pero nuestras profesionales podrán orientarte en una evaluación gratuita asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
