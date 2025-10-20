const inteligencia = {
  analizarMensaje: (texto) => {
    const msg = texto.toLowerCase().trim();

    if (/(^hola|buenas|hi|hey)/.test(msg)) {
      return "👋 Hola, soy Zara IA de Body Elite. Te acompaño en tu evaluación estética gratuita 🌸\n\n¿Quieres conocer nuestros planes corporales o faciales?\n👉 Responde *1* para corporales o *2* para faciales.";
    }

    if (msg === "1") return inteligencia.resumenCorporales();
    if (msg === "2") return inteligencia.resumenFaciales();

    if (/agendar|reserva|hora|cita|agenda|reagendar|turno/.test(msg)) {
      return "✨ Puedes agendar directamente tu evaluación gratuita aquí:\n📅 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nO escríbeme qué día y hora te acomoda para coordinarlo.";
    }

    if (/grasa|abdomen|celulitis|hifu|cavitacion|radiofrecuencia|flacidez|musculo|gluteos|piel|arrugas/.test(msg)) {
      return inteligencia.buscarRespuestaClinica(msg);
    }

    if (/gracias|ok|perfecto|listo|dale/.test(msg)) {
      return "💙 Gracias por tu mensaje. Si deseas agendar tu evaluación, puedo ayudarte con el enlace directo cuando quieras.";
    }

    return "🤖 No estoy segura de tu consulta. ¿Deseas conocer los *planes corporales* o *faciales*?";
  },

  resumenCorporales: () => {
    return "💠 *Planes Corporales Body Elite*\n\n" +
      "1️⃣ Lipo Focalizada Reductiva $348.800\n" +
      "2️⃣ Lipo Express $432.000\n" +
      "3️⃣ Lipo Reductiva $480.000\n" +
      "4️⃣ Lipo Body Elite $664.000\n" +
      "5️⃣ Body Tensor $232.000\n" +
      "6️⃣ Body Fitness $360.000\n" +
      "7️⃣ Push Up $376.000\n\n" +
      "Cada plan combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor según diagnóstico clínico.\n\n¿Deseas que te ayude a *agendar tu evaluación gratuita*?";
  },

  resumenFaciales: () => {
    return "💎 *Planes Faciales Body Elite*\n\n" +
      "1️⃣ Limpieza Facial Full $120.000\n" +
      "2️⃣ RF Facial $60.000\n" +
      "3️⃣ Face Light $128.800\n" +
      "4️⃣ Face Smart $198.400\n" +
      "5️⃣ Face Inicia $270.400\n" +
      "6️⃣ Face Antiage $281.600\n" +
      "7️⃣ Face Elite $358.400\n" +
      "8️⃣ Full Face $584.000\n\n" +
      "Incluyen combinaciones de Pink Glow, LED Therapy, Radiofrecuencia y HIFU facial según tu tipo de piel.\n\n¿Deseas que te ayude a *agendar tu evaluación gratuita*?";
  },

  buscarRespuestaClinica: (msg) => {
    if (/hifu/.test(msg)) return "🔹 *HIFU 12D* trabaja con ultrasonido focalizado de alta intensidad sobre la fascia SMAS y grasa subcutánea. Ideal para abdomen, papada y lifting facial sin cirugía.";
    if (/cavitacion/.test(msg)) return "🔹 *Cavitación* rompe adipocitos por presión alternante, reduciendo grasa localizada en abdomen, muslos y flancos.";
    if (/radiofrecuencia|rf/.test(msg)) return "🔹 *Radiofrecuencia* genera calor endógeno que estimula colágeno I y III, tensando la piel y mejorando firmeza corporal y facial.";
    if (/ems|musculo|sculptor/.test(msg)) return "🔹 *EMS Sculptor* produce contracciones musculares supramáximas, ayudando a tonificar glúteos, abdomen y piernas.";
    if (/pink|glow/.test(msg)) return "🔹 *Pink Glow* aplica péptidos y antioxidantes para regenerar la piel, mejorar luminosidad y textura facial.";
    if (/led|luz/.test(msg)) return "🔹 *LED Therapy* usa luz azul antibacteriana, roja regeneradora y ámbar estimulante para mejorar procesos cutáneos.";
    if (/celulitis/.test(msg)) return "🔹 Para *celulitis*, combinamos Cavitación + Radiofrecuencia + drenaje corporal con resultados visibles desde las primeras sesiones.";
    if (/flacidez/.test(msg)) return "🔹 Para *flacidez corporal o facial*, aplicamos Radiofrecuencia y HIFU 12D para estimular colágeno y tensar tejidos.";
    if (/grasa|abdomen/.test(msg)) return "🔹 Para *grasa localizada en abdomen o cintura*, los protocolos Lipo Reductiva y Lipo Body Elite combinan HIFU, Cavitación y EMS Sculptor.";
    if (/arrugas|manchas|piel/.test(msg)) return "🔹 Para *rejuvenecimiento facial*, los planes Face Antiage o Face Elite combinan HIFU facial, Pink Glow y LED Therapy para estimular colágeno y mejorar tono de piel.";
    return "💬 Nuestros tratamientos combinan tecnología avanzada para resultados visibles y sin cirugía. ¿Deseas agendar tu evaluación gratuita?";
  }
};

module.exports = inteligencia;
