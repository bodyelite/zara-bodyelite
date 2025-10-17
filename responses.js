import fetch from "node-fetch";

const LINK_REAL_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const AVISOS = ["56976992187", "56930582147", "56998765432"];

// ---------------- FUNCIONES BASE ----------------
async function enviarAvisoInterno(mensaje) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    };

    for (const tel of AVISOS) {
      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: tel,
          type: "text",
          text: { body: mensaje },
        }),
      });
      const data = await resp.json();
      console.log("📨 Aviso interno enviado:", data);
    }
  } catch (err) {
    console.error("❌ Error al enviar aviso interno:", err);
  }
}

// ---------------- RESPUESTAS INTELIGENTES ----------------
export function generarRespuesta(texto) {
  const msg = texto.toLowerCase().trim();

  // SALUDOS
  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("zara")) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué zona te gustaría potenciar o mejorar para orientarte con el tratamiento ideal?";
  }

  // CORPORALES
  if (msg.includes("abdomen") || msg.includes("cintura") || msg.includes("flacidez") || msg.includes("grasa") || msg.includes("rollito")) {
    return `💡 Entiendo. En Body Elite tratamos abdomen y cintura con **Cavitación**, **HIFU 12D** y **Radiofrecuencia**, tecnologías que reducen grasa localizada y mejoran la firmeza.  
Planes sugeridos:  
• **Lipo Express $432.000** – reducción rápida  
• **Lipo Body Elite $664.000** – definición avanzada  
¿Te gustaría agendar una evaluación gratuita asistida por IA? 👉 https://zara-bodyelite1.onrender.com/agenda`;
  }

  // FACIALES
  if (msg.includes("cara") || msg.includes("piel") || msg.includes("arruga") || msg.includes("flacidez facial") || msg.includes("poros") || msg.includes("seca")) {
    return `✨ Entiendo, cuando la piel luce cansada o seca, usamos **HIFU 12D**, **LED Therapy** y **Pink Glow** para regenerar e hidratar profundamente.  
Planes:  
• **Face Light $128.800** – hidratación y brillo  
• **Face Elite $358.400** – lifting sin bisturí  
• **Full Face $584.000** – rejuvenecimiento total  
¿Quieres agendar tu diagnóstico facial IA sin costo? 👉 https://zara-bodyelite1.onrender.com/agenda`;
  }

  // GLÚTEOS
  if (msg.includes("gluteo") || msg.includes("glúteo") || msg.includes("trasero") || msg.includes("push up"))) {
    return "🍑 **Push Up ($376.000)** combina **EMS Sculptor + Radiofrecuencia** para levantar y tonificar glúteos sin cirugía. Resultados visibles desde la primera sesión. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // PIERNAS Y MUSLOS
  if (msg.includes("pierna") || msg.includes("muslo"))) {
    return "🏃‍♀️ Para piernas y muslos usamos **Cavitación**, **RF corporal** y **HIFU 12D**. Mejora celulitis, firmeza y contorno. Recomendamos **Lipo Express o Body Tensor ($232.000)**. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // CONSULTAS SOBRE PLANES
  if (msg.includes("plan") || msg.includes("tratamiento") || msg.includes("tienen") || msg.includes("opciones"))) {
    return "💎 Ofrecemos planes personalizados: Lipo Express, Lipo Body Elite, Push Up, Face Elite y Full Face. Todos incluyen diagnóstico gratuito IA. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // DUDAS SOBRE PRECIO
  if (msg.includes("precio") || msg.includes("vale") || msg.includes("cuesta"))) {
    return "💰 Los valores dependen del plan y zona tratada: desde $128.800 (faciales) a $664.000 (corporales). Incluyen diagnóstico IA gratuito. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // SESIONES
  if (msg.includes("sesion") || msg.includes("cuantas"))) {
    return "📆 Recomendamos entre **6 y 10 sesiones**, dependiendo del tipo de piel y objetivo. La evaluación IA define el protocolo ideal. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // BOTOX / ALTERNATIVAS
  if (msg.includes("botox") || msg.includes("toxina"))) {
    return "💉 En Body Elite no aplicamos toxina botulínica. Usamos alternativas sin inyección como **HIFU 12D** y **Radiofrecuencia facial** con resultados visibles desde la primera sesión. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // EMOCIONALES
  if (msg.includes("fea") || msg.includes("me siento") || msg.includes("mal") || msg.includes("insegura"))) {
    return "💖 Te entiendo. Muchas personas buscan recuperar confianza y bienestar. En Body Elite usamos tecnología no invasiva para lograr resultados visibles y naturales. ¿Te gustaría una evaluación asistida por IA sin costo? 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // EXPLICACIONES
  if (msg.includes("en que consiste") || msg.includes("como funciona"))) {
    return "🔬 Todos nuestros tratamientos son no invasivos, sin dolor ni tiempo de recuperación. Usamos **ultrasonido focalizado (HIFU 12D)**, **cavitación** y **radiofrecuencia** para activar colágeno y remodelar la figura. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // fallback
  return "💎 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados reales. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
}

// ---------------- TRACKING CLICK EN AGENDA ----------------
export async function registrarClickAgenda(req, res) {
  try {
    await enviarAvisoInterno("🔗 Un usuario presionó el enlace de agendamiento desde WhatsApp.");
    console.log("✅ Aviso interno enviado (clic en agenda)");
    res.redirect(LINK_REAL_RESERVO);
  } catch (err) {
    console.error("❌ Error en click de agenda:", err);
    res.redirect(LINK_REAL_RESERVO);
  }
}

// ---------------- WEBHOOK DE RESERVA ----------------
export async function manejarWebhookReservo(req, res) {
  try {
    const datos = req.body || {};
    const msg = `📅 Nueva reserva registrada:\n👤 ${datos.nombre || "Sin nombre"}\n📞 ${datos.telefono || "Sin teléfono"}\n📆 ${datos.fecha || "Sin fecha"} ${datos.hora || ""}\n💆‍♀️ ${datos.tratamiento || "Sin dato"}`;
    await enviarAvisoInterno(msg);
    console.log("✅ Aviso interno enviado (reserva confirmada)");
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook de reserva:", err);
    res.sendStatus(500);
  }
}

export { enviarAvisoInterno };
