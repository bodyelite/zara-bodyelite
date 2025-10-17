import fetch from "node-fetch";

// ------------------------------------------------------------
// SISTEMA AVANZADO DE COMPRENSIÓN EMOCIONAL + FLUJO CONVERSACIONAL
// ------------------------------------------------------------
const categorias = {
  saludo: ["hola", "buenas", "buenos dias", "buenas tardes", "consulta", "quisiera saber", "pregunta"],
  abdomen: ["abdomen", "barriga", "rollitos", "cintura", "grasa", "vientre", "panza"],
  gluteos: ["gluteos", "glúteos", "trasero", "cola", "pompis", "push up", "levantar"],
  piernas: ["piernas", "muslos", "celulitis", "flacidez", "retencion", "retención", "drenaje"],
  brazos: ["brazos", "flacidez brazos", "tonificar"],
  rostro: ["rostro", "cara", "piel", "arrugas", "papada", "líneas", "ojeras", "seca", "manchas", "flacidez facial"],
  emociones: ["me siento", "no me gusta", "me veo", "me noto", "insegura", "fea", "cansada", "vieja", "triste"],
  agendar: ["agendar", "evaluacion", "evaluación", "agenda", "reserva", "diagnostico", "diagnóstico", "quiero", "si"]
};

function limpiarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function detectarCategoria(texto) {
  texto = limpiarTexto(texto);
  for (const [cat, lista] of Object.entries(categorias)) {
    if (lista.some(p => texto.includes(limpiarTexto(p)))) return cat;
  }
  return "general";
}

// ------------------------------------------------------------
// RESPUESTAS EMPÁTICAS Y FLUIDAS CON ENFOQUE CLÍNICO
// ------------------------------------------------------------
function generarRespuesta(texto, historial = []) {
  const cat = detectarCategoria(texto);
  const saludoPrevio = historial.some(m => /hola|buenas/i.test(m));

  // Evitar repetir saludo
  if (cat === "saludo" && !saludoPrevio) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué parte de tu cuerpo o rostro te gustaría potenciar o mejorar?";
  }

  switch (cat) {
    case "abdomen":
      return "💡 Entiendo, el abdomen es una de las zonas más consultadas. En Body Elite tratamos esa área con Cavitación, Radiofrecuencia y HIFU 12D. Reducen grasa localizada, mejoran textura y firmeza. Si quieres, puedo dejarte el acceso directo para agendar tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "gluteos":
      return "🍑 Perfecto, trabajamos glúteos con EMS Sculptor y Radiofrecuencia, que tonifican, levantan y mejoran la forma. ¿Te gustaría reservar una evaluación gratuita con IA para revisar tu caso? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "piernas":
      return "💫 Tratamos celulitis y flacidez en piernas con Cavitación y HIFU 12D. Favorecen drenaje, textura y firmeza. Si deseas, puedo ayudarte a agendar tu diagnóstico corporal gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "brazos":
      return "💪 La flacidez en brazos se mejora con Radiofrecuencia y HIFU 12D, estimulando colágeno y tensando la piel. ¿Te gustaría que te deje el link para agendar tu evaluación sin costo? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "rostro":
      return "✨ Entiendo, cuando notamos la piel seca, arrugas o flacidez facial, es buen momento para regenerar. Usamos HIFU 12D, LED Therapy y Pink Glow para rejuvenecer y reafirmar sin cirugía. Puedes reservar tu diagnóstico facial gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "emociones":
      return "💬 Te entiendo completamente. A veces no sentirnos bien con nuestro cuerpo afecta cómo nos vemos. En Body Elite abordamos esto con tecnología segura y personalizada. ¿Te gustaría conocer qué tratamiento podría ayudarte?";

    case "agendar":
      return "Perfecto 🩵. Puedes agendar tu diagnóstico gratuito asistido por IA con nuestro sistema oficial 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    default:
      return "💎 En Body Elite contamos con protocolos clínicos personalizados con HIFU 12D, Cavitación, EMS Sculptor y Radiofrecuencia. Cuéntame más sobre lo que quieres mejorar para orientarte con el plan adecuado.";
  }
}

// ------------------------------------------------------------
// AVISOS INTERNOS AUTOMÁTICOS
// ------------------------------------------------------------

// 1️⃣ Aviso cuando el usuario PRESIONA el link de reserva
export async function notificarClickReserva(numeroUsuario, nombre = "Cliente") {
  try {
    const msg = `🔔 ${nombre} ha presionado el enlace de reserva de Body Elite.`;
    const destinos = ["+56976992187", "+56976578774", "+56977007819"];

    for (const num of destinos) {
      await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: num,
          type: "text",
          text: { body: msg }
        })
      });
    }
    console.log("✅ Aviso interno: clic en enlace de reserva");
  } catch (err) {
    console.error("❌ Error al notificar clic de reserva:", err);
  }
}

// 2️⃣ Aviso cuando Reservo registra una reserva
export async function manejarReserva(req, res) {
  try {
    const { nombre, telefono, fecha, hora, tratamiento } = req.body;
    const msg = `📢 Nueva cita registrada:\n👤 ${nombre}\n📞 ${telefono}\n🗓 ${fecha} ${hora}\n💆 ${tratamiento}`;
    const destinos = ["+56976992187", "+56976578774", "+56977007819"];

    for (const num of destinos) {
      await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: num,
          type: "text",
          text: { body: msg }
        })
      });
    }

    console.log("✅ Avisos internos: nueva cita registrada");
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en aviso de nueva cita:", err);
    return res.sendStatus(500);
  }
}

// ------------------------------------------------------------
// EXPORTACIÓN PRINCIPAL
// ------------------------------------------------------------
export function obtenerRespuesta(texto, historial = []) {
  return generarRespuesta(texto, historial);
}
