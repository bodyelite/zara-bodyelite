export function generarRespuesta(mensaje) {
  mensaje = mensaje.toLowerCase();

  if (mensaje.includes("botox")) {
    return "💉 El Botox relaja los músculos sin alterar tus gestos naturales. Ideal para suavizar líneas de expresión en frente, entrecejo y contorno de ojos.";
  }

  if (mensaje.includes("full face")) {
    return "🌸 El plan Full Face trabaja rostro, cuello y escote con IA para calibrar energía según tu tipo de piel, combinando HIFU 12D, radiofrecuencia y cóctel regenerador.";
  }

  if (mensaje.includes("pink glow")) {
    return "✨ Pink Glow combina péptidos y ácido hialurónico para dar luminosidad y mejorar la textura de la piel. Es parte de los planes Face Elite y Antiage.";
  }

  if (mensaje.includes("planes") || mensaje.includes("tratamientos")) {
    return "En Body Elite contamos con planes corporales y faciales. Algunos destacados:\n\n- Lipo Body Elite $664.000\n- Lipo Express $432.000\n- Face Elite $358.400\n- Face Antiage $281.600\n\n¿Quieres que te ayude a elegir según tu objetivo?";
  }

  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🧴 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
