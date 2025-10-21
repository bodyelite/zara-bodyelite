export function procesarMensaje(texto, anterior, nombre) {
  texto = texto.toLowerCase().trim();

  if (texto.includes("hola")) {
    return "Hola 🌸, soy Zara, asistente IA de Body Elite. Estoy aquí para orientarte y ayudarte en tu evaluación estética ✨ ¿Qué zona de tu cuerpo te gustaría trabajar?";
  }

  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("celulitis") || texto.includes("cintura") || texto.includes("muslos") || texto.includes("piernas")) {
    return "🔥 Los tratamientos corporales de Body Elite combinan HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor para reducir grasa y reafirmar la piel. 💰 Desde $348.800 CLP según diagnóstico y zona tratada. Agenda tu evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.includes("facial") || texto.includes("cara") || texto.includes("rostro") || texto.includes("limpieza") || texto.includes("acné") || texto.includes("piel")) {
    return "🌸 Los tratamientos faciales de Body Elite mejoran textura, firmeza y luminosidad. Usamos HIFU 12D, Radiofrecuencia, LED Therapy, Pink Glow y Exosomas. 💰 Desde $120.000 CLP según diagnóstico y tipo de piel. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.includes("botox") || texto.includes("relleno") || texto.includes("toxina")) {
    return "💉 En Body Elite aplicamos Toxina Botulínica y rellenos dérmicos con profesionales certificadas. Los valores se confirman tras diagnóstico facial gratuito asistido con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return "";
}
