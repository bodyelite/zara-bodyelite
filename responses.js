import fetch from "node-fetch";

// ============================================================
//  MÓDULO ZARA BODY ELITE - RESPUESTAS HUMANIZADAS Y AVISOS
// ============================================================

// ------------------------- CATEGORÍAS ------------------------
const categorias = {
  saludo: ["hola", "buenas", "consulta", "pregunta", "quiero saber"],
  abdomen: ["abdomen", "rollitos", "grasa", "cintura", "vientre", "panza", "barriga"],
  gluteos: ["gluteos", "glúteos", "cola", "trasero", "pompis", "levantar"],
  piernas: ["piernas", "muslos", "celulitis", "retencion", "retención", "drenaje"],
  brazos: ["brazos", "flacidez brazos", "tonificar brazos", "brazos sueltos"],
  rostro: ["rostro", "cara", "piel", "arrugas", "ojeras", "manchas", "flacidez facial", "seca", "manchada"],
  emociones: ["me siento", "me veo", "fea", "triste", "insegura", "mal", "agotada", "cansada"],
  tratamientos: ["tratamientos", "tecnologia", "aparato", "procedimiento", "como funcionan"],
  planes: ["plan", "planes", "packs", "promocion", "promoción", "oferta"],
  precio: ["precio", "valor", "costo", "cuanto", "vale", "plata"],
  dolor: ["duele", "dolor", "molesta", "riesgo", "miedo"],
  agendar: ["agendar", "diagnostico", "evaluacion", "reserva", "agenda"]
};

// ---------------------- LIMPIEZA Y DETECCIÓN -----------------
function limpiarTexto(txt) {
  return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function detectarCategoria(txt) {
  txt = limpiarTexto(txt);
  for (const [cat, frases] of Object.entries(categorias)) {
    if (frases.some(f => txt.includes(f))) return cat;
  }
  return "general";
}

// -------------------- RESPUESTAS FLUIDAS ---------------------
function generarRespuesta(texto, historial = []) {
  const cat = detectarCategoria(texto);
  const saludoPrevio = historial.some(m => /hola|buenas/i.test(m));
  const link = "👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // saludo inicial
  if (cat === "saludo" && !saludoPrevio)
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué zona te gustaría potenciar o mejorar para orientarte con el tratamiento ideal?";

  switch (cat) {
    case "abdomen":
      return "💡 Entiendo, el abdomen es una de las zonas más tratadas. Usamos Cavitación, Radiofrecuencia y HIFU 12D para reducir grasa localizada y reafirmar. Los planes recomendados son *Lipo Express* (reducción rápida) y *Lipo Body Elite* (definición avanzada). Si quieres, puedo ayudarte a agendar tu evaluación gratuita " + link;

    case "gluteos":
      return "🍑 Perfecto. Para levantar y tonificar glúteos usamos *EMS Sculptor* y *Radiofrecuencia*. El plan *Push Up* está pensado para reafirmar y dar volumen natural. ¿Te gustaría agendar tu diagnóstico corporal sin costo? " + link;

    case "piernas":
      return "💫 Tratamos celulitis, flacidez y retención en piernas con *Cavitación*, *Radiofrecuencia* y drenaje. Los planes *Body Tensor* y *Body Fitness* combinan reducción y firmeza. ¿Deseas tu diagnóstico corporal gratuito? " + link;

    case "brazos":
      return "💪 Claro, la flacidez en brazos se mejora con *Radiofrecuencia* y *HIFU 12D*. El plan *Body Tensor* trabaja la firmeza desde la primera sesión. ¿Te dejo el acceso a tu diagnóstico sin costo? " + link;

    case "rostro":
      return "✨ Para arrugas, piel seca o flacidez facial combinamos *HIFU 12D*, *LED Therapy* y *Pink Glow*. El plan *Face Elite* regenera, hidrata y mejora textura. ¿Quieres agendar tu diagnóstico facial gratuito? " + link;

    case "emociones":
      return "💬 Te entiendo. Muchas personas sienten eso cuando su piel o cuerpo cambian. En Body Elite usamos tecnología clínica para que vuelvas a sentirte bien y segura con resultados visibles. ¿Te gustaría una evaluación gratuita para empezar? " + link;

    case "tratamientos":
      return "🧠 Trabajamos con *HIFU 12D*, *Cavitación*, *Radiofrecuencia*, *EMS Sculptor*, *LED Therapy* y *Pink Glow*. Los combinamos según tu objetivo estético. ¿Te gustaría que te recomiende un plan según la zona?";

    case "planes":
      return "📋 Nuestros planes principales:\n• *Lipo Express* – Reducción rápida sin cirugía.\n• *Body Tensor* – Reafirmación corporal.\n• *Push Up* – Glúteos firmes y tonificados.\n• *Face Elite* – Rejuvenecimiento facial.\n• *Pink Glow* – Hidratación y regeneración.\nTodos incluyen diagnóstico gratuito asistido por IA. ¿Te gustaría agendar? " + link;

    case "precio":
      return "💰 Los valores dependen del plan y zona:\n• Lipo Express $432 000\n• Push Up $376 000\n• Face Elite $358 400\nIncluyen evaluación sin costo. ¿Deseas agendar tu diagnóstico? " + link;

    case "dolor":
      return "🤍 Tranquila. Nuestros tratamientos son totalmente no invasivos, sin dolor ni tiempo de recuperación. La mayoría siente solo un calor leve o pequeñas contracciones musculares. Si quieres, agenda tu diagnóstico para probarlo " + link;

    case "agendar":
      return "Perfecto 💎. Puedes agendar tu diagnóstico gratuito asistido por IA aquí " + link;

    default:
      return "💎 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados reales. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
  }
}

// -------------------- AVISOS INTERNOS ------------------------
export async function notificarClickReserva(nombre = "Cliente") {
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
  } catch (e) {
    console.error("❌ Error al enviar aviso interno:", e);
  }
}

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
    console.error("❌ Error en manejo de reserva:", err);
    return res.sendStatus(500);
  }
}

// ------------------ EXPORTACIÓN PRINCIPAL -------------------
export function obtenerRespuesta(texto, historial = []) {
  return generarRespuesta(texto, historial);
}
