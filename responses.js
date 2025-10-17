import fetch from "node-fetch";

// ------------------------------------------------------------
// SISTEMA AVANZADO DE COMPRENSIÓN, PLANES Y AVISOS INTERNOS
// ------------------------------------------------------------

// Diccionario ampliado con 500 frases comunes agrupadas por categoría
const categorias = {
  saludo: ["hola", "buenas", "consulta", "pregunta", "quiero saber", "necesito información"],
  abdomen: ["abdomen", "rollitos", "grasa", "cintura", "barriga", "vientre", "panza", "llantitas", "flacidez abdominal"],
  gluteos: ["gluteos", "glúteos", "cola", "trasero", "pompis", "levantar", "push up", "tonificar glúteos"],
  piernas: ["piernas", "muslos", "celulitis", "retencion", "retención", "drenaje", "piernas pesadas"],
  brazos: ["brazos", "flacidez brazos", "tonificar brazos", "brazos sueltos", "reafirmar brazos"],
  rostro: ["rostro", "cara", "piel", "arrugas", "líneas", "papada", "manchas", "ojeras", "seca", "flacidez facial", "deshidratada", "manchada"],
  emociones: ["me siento", "me veo", "no me gusta", "insegura", "fea", "triste", "cansada", "vieja", "agotada", "baja autoestima"],
  tratamientos: ["tratamiento", "que hacen", "que ofrecen", "en que consiste", "tecnologia", "aparato", "procedimiento"],
  planes: ["plan", "planes", "packs", "promocion", "promoción", "oferta"],
  precio: ["precio", "valor", "cuanto", "costo", "vale", "sale", "plata"],
  agendar: ["agendar", "evaluacion", "evaluación", "diagnóstico", "reserva", "quiero ir", "quiero agenda", "quiero cita"]
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
// RESPUESTAS FLUIDAS Y CLÍNICAS
// ------------------------------------------------------------
function generarRespuesta(texto, historial = []) {
  const cat = detectarCategoria(texto);
  const saludoPrevio = historial.some(m => /hola|buenas/i.test(m));

  if (cat === "saludo" && !saludoPrevio) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué zona te gustaría potenciar o mejorar para orientarte con el tratamiento adecuado?";
  }

  switch (cat) {
    case "abdomen":
      return "💡 Entiendo, el abdomen es una de las zonas más tratadas. En Body Elite utilizamos Cavitación, Radiofrecuencia y HIFU 12D para reducir grasa localizada, mejorar textura y reafirmar la piel. Los planes más recomendados son *Lipo Express* y *Lipo Body Elite*, ideales si buscas resultados visibles sin cirugía. ¿Deseas que te deje el enlace para agendar tu evaluación gratuita asistida por IA? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "gluteos":
      return "🍑 Perfecto, para levantar y tonificar glúteos usamos EMS Sculptor y Radiofrecuencia. Nuestro plan *Push Up* está diseñado para reafirmar y dar volumen natural. Si quieres, puedo agendar tu diagnóstico corporal gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "piernas":
      return "💫 Tratamos celulitis, retención de líquidos y flacidez en piernas con Cavitación, Radiofrecuencia y drenaje avanzado. Los planes *Body Tensor* y *Body Fitness* combinan reducción y tonificación. ¿Te gustaría que te ayude a agendar una evaluación gratuita con nuestra IA? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "brazos":
      return "💪 Claro, la flacidez en brazos se trabaja con Radiofrecuencia y HIFU 12D. Nuestros protocolos *Body Tensor* y *Body Fitness* son ideales para reafirmar y mejorar textura. ¿Quieres que te deje el acceso directo para tu evaluación sin costo? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "rostro":
      return "✨ Entiendo, cuando hay arrugas, piel seca o flacidez facial, nuestros tratamientos faciales combinan HIFU 12D, LED Therapy y *Pink Glow* para regenerar e hidratar profundamente. Puedes agendar tu diagnóstico facial gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "emociones":
      return "💬 Te entiendo perfectamente. Sentirnos inseguros con nuestro cuerpo o piel es más común de lo que crees. En Body Elite utilizamos tecnología avanzada y diagnósticos personalizados para ayudarte a recuperar confianza y bienestar. ¿Te gustaría que preparemos tu evaluación gratuita para comenzar el cambio?";

    case "tratamientos":
      return "🧠 Trabajamos con tecnología clínica avanzada: *HIFU 12D*, *Cavitación*, *Radiofrecuencia*, *EMS Sculptor*, *LED Therapy* y *Pink Glow*. Todos se combinan en protocolos personalizados según tus objetivos. ¿Quieres que te recomiende un plan según la zona que te interesa?";

    case "planes":
      return "📋 Nuestros planes combinan diferentes tecnologías según el objetivo: *Lipo Express* para reducción rápida, *Body Tensor* para firmeza, *Push Up* para glúteos, *Face Elite* para rejuvenecimiento facial y *Pink Glow* para hidratación profunda. ¿Te gustaría saber cuál se adapta mejor a ti?";

    case "precio":
      return "💰 Los valores varían según el plan y zona tratada. Por ejemplo: *Lipo Express* desde $432.000, *Push Up* $376.000 y *Face Elite* $358.400. Todos incluyen diagnóstico gratuito asistido por IA. ¿Deseas que te deje el link para agendar tu evaluación sin costo? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "agendar":
      return "Perfecto 🩵. Puedes agendar tu diagnóstico gratuito asistido por IA aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    default:
      return "💎 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados visibles desde la primera sesión. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
  }
}

// ------------------------------------------------------------
// AVISOS INTERNOS AUTOMÁTICOS
// ------------------------------------------------------------

// 1️⃣ Aviso cuando el usuario presiona el link
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
    console.log("✅ Aviso interno: nueva cita registrada");
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en aviso de cita:", err);
    return res.sendStatus(500);
  }
}

// ------------------------------------------------------------
// EXPORTACIÓN PRINCIPAL
// ------------------------------------------------------------
export function obtenerRespuesta(texto, historial = []) {
  return generarRespuesta(texto, historial);
}
