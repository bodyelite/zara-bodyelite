import fetch from "node-fetch";

const LINK_AGENDA = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const AVISOS = ["56976992187", "56930582147", "56998765432"]; // avisos internos Body Elite

// ---------------------- NÚCLEO DE RESPUESTA INTELIGENTE ----------------------
export function generarRespuesta(texto) {
  const msg = texto.toLowerCase();

  // SALUDO INICIAL
  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("zara")) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué zona te gustaría potenciar o mejorar para orientarte con el tratamiento ideal?";
  }

  // ZONAS CORPORALES
  if (msg.includes("abdomen") || msg.includes("grasa") || msg.includes("rollito") || msg.includes("cintura")) {
    return `💡 Entiendo, el abdomen y cintura son de las zonas más tratadas. En Body Elite usamos Cavitación, Radiofrecuencia y HIFU 12D para reducir grasa localizada y reafirmar la piel. 
Los planes más recomendados son **Lipo Express ($432.000)** y **Lipo Body Elite ($664.000)** según el nivel de grasa y firmeza. 
¿Te gustaría agendar tu evaluación gratuita asistida por IA? 👉 ${LINK_AGENDA}`;
  }

  // ROSTRO Y PIEL
  if (msg.includes("cara") || msg.includes("rostro") || msg.includes("piel") || msg.includes("arruga") || msg.includes("flacidez") || msg.includes("manchas")) {
    return `✨ Entiendo, muchas personas notan arrugas o piel seca y desean revitalizar su rostro. En Body Elite combinamos **HIFU 12D, LED Therapy y Pink Glow**, tecnologías que regeneran, hidratan y reafirman la piel sin cirugía. 
Planes recomendados: **Face Light ($128.800)**, **Face Elite ($358.400)** y **Full Face ($584.000)**. 
¿Quieres que te deje el enlace para agendar tu diagnóstico facial sin costo? 👉 ${LINK_AGENDA}`;
  }

  // GLÚTEO Y TONIFICACIÓN
  if (msg.includes("gluteo") || msg.includes("trasero") || msg.includes("push up")) {
    return `🍑 El plan **Push Up ($376.000)** es ideal si buscas levantar y tonificar glúteos sin cirugía. Combinamos **EMS Sculptor y Radiofrecuencia** para estimular contracciones musculares profundas y firmeza visible. 
¿Te gustaría agendar tu diagnóstico corporal asistido por IA? 👉 ${LINK_AGENDA}`;
  }

  // LISTADO DE TRATAMIENTOS
  if (msg.includes("tratamiento") || msg.includes("tienen") || msg.includes("opciones")) {
    return `💎 En Body Elite tenemos protocolos clínicos con aparatología avanzada:
- **Lipo Express ($432.000)**: reducción rápida y definición corporal.  
- **Lipo Body Elite ($664.000)**: remodelado profundo con HIFU 12D y EMS.  
- **Push Up ($376.000)**: levantamiento de glúteos sin cirugía.  
- **Face Elite ($358.400)**: firmeza facial y rejuvenecimiento.  
Todos incluyen diagnóstico IA gratuito. ¿Quieres agendar el tuyo? 👉 ${LINK_AGENDA}`;
  }

  // DOLOR
  if (msg.includes("duele") || msg.includes("dolor")) {
    return "💆‍♀️ Nuestros tratamientos son **no invasivos y sin dolor**. Sentirás solo calor o leves contracciones musculares según la tecnología aplicada. Todo supervisado por profesionales clínicos.";
  }

  // PRECIOS
  if (msg.includes("precio") || msg.includes("vale") || msg.includes("cuesta")) {
    return `💰 Los valores dependen del plan y zona:
- **Lipo Express $432.000**
- **Lipo Body Elite $664.000**
- **Push Up $376.000**
- **Face Elite $358.400**
Incluyen diagnóstico IA gratuito. ¿Quieres agendar tu evaluación? 👉 ${LINK_AGENDA}`;
  }

  // EMOCIONALES
  if (msg.includes("fea") || msg.includes("insegura") || msg.includes("me siento") || msg.includes("mal con mi cuerpo")) {
    return `💖 Te entiendo. Muchas personas sienten eso cuando su piel o cuerpo cambian. En Body Elite usamos tecnología clínica que **recupera firmeza, forma y confianza**. 
Podemos acompañarte desde un diagnóstico gratuito. ¿Te gustaría agendar tu cita? 👉 ${LINK_AGENDA}`;
  }

  // SESIONES
  if (msg.includes("cuantas") || msg.includes("sesiones")) {
    return "📆 Generalmente se recomiendan entre **6 y 10 sesiones**, dependiendo de la zona y el plan. En tu diagnóstico gratuito definimos la frecuencia ideal.";
  }

  // BOTOX
  if (msg.includes("botox") || msg.includes("toxina")) {
    return "💉 Trabajamos con toxina botulínica solo en planes médicos complementarios. Si buscas alternativas sin inyección, **HIFU 12D** y **Radiofrecuencia facial** logran resultados similares sin agujas. ¿Quieres conocer más? 👉 " + LINK_AGENDA;
  }

  // fallback
  return "💎 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados reales. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
}

// ---------------------- AVISOS INTERNOS ----------------------
async function enviarAvisoInterno(mensaje) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };
    for (const tel of AVISOS) {
      await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: tel,
          type: "text",
          text: { body: mensaje },
        }),
      });
    }
  } catch (err) {
    console.error("Error enviando aviso interno:", err);
  }
}

// ---------------------- WEBHOOK DE RESERVO ----------------------
export async function manejarWebhookReservo(req, res) {
  try {
    const datos = req.body || {};
    const msg = `📅 Nueva reserva registrada:\n👤 ${datos.nombre || "Sin nombre"}\n📞 ${datos.telefono || "Sin teléfono"}\n📆 ${datos.fecha || "Sin fecha"} ${datos.hora || ""}\n💆‍♀️ ${datos.tratamiento || "Sin dato"}`;
    await enviarAvisoInterno(msg);
    console.log("✅ Aviso interno enviado a recepción");
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en manejo de reserva:", err);
    return res.sendStatus(500);
  }
}

export { enviarAvisoInterno };
