import fetch from "node-fetch";

// ------------------- COMPRENSIÓN SEMÁNTICA Y RESPUESTAS -------------------
const sinonimos = {
  abdomen: ["guatita", "barriga", "vientre", "panza", "rollitos", "abdomen"],
  gluteos: ["trasero", "colita", "pompis", "glúteos", "push up", "levantar trasero"],
  piernas: ["piernas", "muslos", "flacidez piernas", "celulitis"],
  brazos: ["brazos", "flacidez brazos"],
  rostro: ["cara", "piel", "rostro", "arrugas", "papada", "líneas", "flacidez facial", "me veo cansada"],
  grasa: ["grasa", "reducir grasa", "localizada", "rollos", "grasa corporal"],
  general: ["hola", "consulta", "tratamientos", "precio", "agendar", "agenda"]
};

// Limpia texto
function limpiar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// Detecta intención
function detectarIntencion(texto) {
  texto = limpiar(texto);
  for (const [intencion, lista] of Object.entries(sinonimos)) {
    if (lista.some(palabra => texto.includes(limpiar(palabra)))) return intencion;
  }
  return "general";
}

// Genera respuesta
function generarRespuesta(texto) {
  const intencion = detectarIntencion(texto);

  switch (intencion) {
    case "abdomen":
      return "💡 Entiendo perfectamente. En Body Elite tratamos abdomen con Cavitación, Radiofrecuencia y HIFU 12D, tecnologías que reducen grasa y mejoran firmeza. Nuestro diagnóstico IA te ayuda a definir el plan ideal. ¿Quieres agendar tu evaluación gratuita? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "gluteos":
      return "🍑 El tratamiento Push Up combina EMS Sculptor y Radiofrecuencia para levantar y reafirmar glúteos sin cirugía. Logramos un efecto tonificado y natural. ¿Deseas agendar tu diagnóstico gratuito asistido por IA? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "piernas":
      return "💫 Tratamos la celulitis y flacidez en piernas con Cavitación, Radiofrecuencia y HIFU 12D. Mejoramos textura, drenaje y firmeza. ¿Quieres que te recomiende el plan más adecuado según tu diagnóstico IA? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "brazos":
      return "💪 La flacidez de brazos se trabaja con HIFU 12D y Radiofrecuencia, estimulando colágeno y tensando la piel. El diagnóstico gratuito IA define la mejor combinación para ti. ¿Agendamos tu evaluación? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "rostro":
      return "✨ En tratamientos faciales usamos HIFU 12D, LED Therapy y Pink Glow para reafirmar, regenerar y rejuvenecer la piel. Si notas arrugas o flacidez, te recomendamos un diagnóstico facial IA sin costo. ¿Quieres agendarlo ahora? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    case "grasa":
      return "🔥 Para grasa localizada aplicamos Cavitación, Radiofrecuencia y HIFU 12D, sin cirugía ni dolor. Nuestro diagnóstico corporal IA identifica el plan más efectivo. ¿Agendamos tu evaluación gratuita? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    default:
      return "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, resolver tus dudas o ayudarte a agendar tu diagnóstico gratuito asistido por IA. ¿Qué zona te gustaría mejorar? 🩵 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }
}

// ------------------- WEBHOOK DE RESERVAS -------------------
export async function manejarReserva(req, res) {
  try {
    const { nombre, telefono, fecha, hora, tratamiento } = req.body;
    const mensaje = `📢 Nueva cita registrada en Reservo:\n👤 ${nombre}\n📞 ${telefono}\n🗓 ${fecha} a las ${hora}\n💆 ${tratamiento}`;
    const destinatarios = ["+56976992187", "+56976578774", "+56977007819"];

    for (const numero of destinatarios) {
      await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          type: "text",
          text: { body: mensaje }
        })
      });
    }

    console.log("✅ Avisos internos enviados");
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error al manejar la reserva:", err);
    return res.sendStatus(500);
  }
}

// ------------------- EXPORTACIÓN PRINCIPAL -------------------
export function obtenerRespuesta(mensaje) {
  return generarRespuesta(mensaje);
}
