import fs from "fs";

const frases = JSON.parse(fs.readFileSync("49ecadaa-1b01-4e86-868a-9dd6642249c6.json", "utf8"));

const inteligencia = {
  analizarMensaje: (texto) => {
    const msg = texto.toLowerCase().trim();

    // --- Coincidencia directa con archivo de frases ---
    const match = frases.find(f => msg.includes(f));
    if (match) return inteligencia.buscarRespuestaClinica(match);

    // --- Saludos ---
    if (/(^hola|buenas|hi|hey)/.test(msg)) {
      return "👋 Hola, soy Zara IA de Body Elite. Te acompaño en tu evaluación estética gratuita 🌸\n\n¿Quieres conocer nuestros planes corporales o faciales?\n👉 Responde *1* para corporales o *2* para faciales.";
    }

    // --- Elección de categoría ---
    if (msg === "1") return inteligencia.resumenCorporales();
    if (msg === "2") return inteligencia.resumenFaciales();

    // --- Agenda ---
    if (/agendar|reserva|hora|cita|agenda|reagendar|turno/.test(msg)) {
      return "✨ Puedes agendar directamente tu evaluación gratuita aquí:\n📅 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nO escríbeme qué día y hora te acomoda para coordinarlo.";
    }

    // --- Fallback ---
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
    if (/abdomen|grasa|panza|vientre/.test(msg))
      return "🔹 *Lipo Body Elite* o *Lipo Reductiva* combinan HIFU 12D, Cavitación y EMS Sculptor para reducir grasa y definir cintura.";
    if (/flacidez|brazos|piernas|reafirmar/.test(msg))
      return "🔹 *Body Tensor* o *Body Fitness* aplican Radiofrecuencia y EMS Sculptor para firmeza y tonificación muscular.";
    if (/gluteos|push|levantar/.test(msg))
      return "🔹 *Push Up* trabaja con EMS Sculptor para levantar y tonificar glúteos.";
    if (/papada|rostro|cara|facial|piel|arrugas/.test(msg))
      return "🔹 *Face Elite* y *Face Antiage* usan HIFU facial, Pink Glow y LED Therapy para rejuvenecer rostro y definir contorno.";
    if (/limpieza|poros|acne|antiacne/.test(msg))
      return "🔹 *Limpieza Facial Full* elimina impurezas, regula sebo y revitaliza tu piel.";
    return "💬 Nuestros tratamientos combinan tecnología avanzada para resultados visibles y sin cirugía. ¿Deseas agendar tu evaluación gratuita?";
  }
};

export default inteligencia;
