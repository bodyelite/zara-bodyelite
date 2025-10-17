import fetch from "node-fetch";

const LINK_REAL_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const AVISOS = ["56976992187", "56930582147", "56998765432"]; // avisos internos Body Elite

// ------------------ NÚCLEO PRINCIPAL DE RESPUESTA ------------------
export function generarRespuesta(texto) {
  const msg = texto.toLowerCase();

  // SALUDO
  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("zara")) {
    return "✨ ¡Hola! Soy Zara, asistente IA de Body Elite. Me alegra saludarte 💬. Cuéntame, ¿qué zona te gustaría potenciar o mejorar para orientarte con el tratamiento ideal?";
  }

  // CORPORALES
  if (msg.includes("abdomen") || msg.includes("grasa") || msg.includes("rollito") || msg.includes("cintura") || msg.includes("flacidez")) {
    return `💡 Entiendo, el abdomen y cintura son zonas clave. En Body Elite usamos **Cavitación**, **Radiofrecuencia** y **HIFU 12D** para reducir grasa localizada, mejorar textura y firmeza.  
Los planes recomendados son:
• **Lipo Express ($432.000)** – reducción rápida.  
• **Lipo Body Elite ($664.000)** – remodelado avanzado.  
¿Quieres que te deje el enlace para agendar tu evaluación gratuita asistida por IA? 👉 https://zara-bodyelite1.onrender.com/agenda`;
  }

  // FACIALES
  if (msg.includes("cara") || msg.includes("rostro") || msg.includes("piel") || msg.includes("arruga") || msg.includes("poros") || msg.includes("seca")) {
    return `✨ Entiendo, cuando la piel luce cansada o seca, en Body Elite combinamos **HIFU 12D**, **LED Therapy** y **Pink Glow** para regenerar, hidratar y reafirmar.  
Planes recomendados:
• **Face Light ($128.800)** – hidratación y brillo.  
• **Face Elite ($358.400)** – lifting sin bisturí.  
• **Full Face ($584.000)** – rejuvenecimiento total.  
¿Deseas agendar tu diagnóstico facial IA sin costo? 👉 https://zara-bodyelite1.onrender.com/agenda`;
  }

  // PLANES ESPECÍFICOS
  if (msg.includes("lipo express")) {
    return "⚡ **Lipo Express** combina Cavitación y Radiofrecuencia para resultados visibles desde la primera sesión. Ideal si buscas reducir centímetros rápido sin cirugía. Incluye diagnóstico corporal IA gratuito. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("lipo body elite")) {
    return "💎 **Lipo Body Elite** es nuestro plan más completo. Usa **HIFU 12D, EMS Sculptor, Cavitación y RF avanzada**. Reafirma, define y reduce grasa profunda. Resultados visibles desde la 3ª sesión. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("face light")) {
    return "🌸 **Face Light** es ideal si notas piel seca o sin brillo. Combinamos **Pink Glow + LED Therapy** para estimular colágeno y devolver luminosidad. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("face elite")) {
    return "💫 **Face Elite** combina **HIFU 12D + Radiofrecuencia Facial + LED**. Tensa la piel y mejora contornos sin bisturí. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("full face")) {
    return "👑 **Full Face** trabaja todas las capas faciales: músculo, grasa y piel. Incluye **HIFU 12D**, **Pink Glow** y **Radiofrecuencia clínica**. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("push up") || msg.includes("gluteo") || msg.includes("trasero")) {
    return "🍑 **Push Up ($376.000)** combina **EMS Sculptor + Radiofrecuencia** para levantar y tonificar glúteos sin cirugía. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("muslo") || msg.includes("pierna")) {
    return "🏃‍♀️ Para **muslos y piernas** usamos **Cavitación**, **RF corporal** y **HIFU 12D**. Mejora celulitis y firmeza. Recomendamos **Lipo Express o Body Tensor ($232.000)** según el caso. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // CONSULTAS GENERALES
  if (msg.includes("tratamiento") || msg.includes("tienen") || msg.includes("opciones")) {
    return `💎 Protocolos más destacados:
• **Lipo Express** – reducción rápida.  
• **Lipo Body Elite** – remodelado avanzado.  
• **Push Up** – glúteos firmes.  
• **Face Elite** – lifting facial.  
Todos con diagnóstico IA gratuito. 👉 https://zara-bodyelite1.onrender.com/agenda`;
  }

  if (msg.includes("precio") || msg.includes("vale") || msg.includes("cuesta")) {
    return "💰 Los valores dependen del plan y zona, desde $128.800 (facial) a $664.000 (corporal completo). Incluyen diagnóstico IA gratuito. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("sesion") || msg.includes("cuantas")) {
    return "📆 Recomendamos entre **6 y 10 sesiones** según objetivo y zona. En la evaluación IA se define el protocolo ideal. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("botox") || msg.includes("toxina")) {
    return "💉 Trabajamos con toxina botulínica solo en planes médicos. Si buscas alternativas naturales, **HIFU 12D y RF Facial** logran tensado sin inyecciones. 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  if (msg.includes("fea") || msg.includes("me siento") || msg.includes("insegura") || msg.includes("mal con")) {
    return "💖 Te entiendo. En Body Elite ayudamos a que vuelvas a sentirte segura y conforme con tu cuerpo. Usamos tecnología no invasiva para resultados reales sin dolor. ¿Quieres agendar tu evaluación? 👉 https://zara-bodyelite1.onrender.com/agenda";
  }

  // fallback
  return "💎 En Body Elite combinamos tecnología estética avanzada y protocolos clínicos con resultados reales. Cuéntame, ¿qué zona o aspecto te gustaría mejorar para orientarte mejor?";
}

// ------------------ ENVÍO DE AVISOS INTERNOS ------------------
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

// ------------------ WEBHOOK DE RESERVO (CONFIRMACIÓN) ------------------
export async function manejarWebhookReservo(req, res) {
  try {
    const datos = req.body || {};
    const msg = `📅 Nueva reserva registrada:\n👤 ${datos.nombre || "Sin nombre"}\n📞 ${datos.telefono || "Sin teléfono"}\n📆 ${datos.fecha || "Sin fecha"} ${datos.hora || ""}\n💆‍♀️ ${datos.tratamiento || "Sin dato"}`;
    await enviarAvisoInterno(msg);
    console.log("✅ Aviso interno enviado a recepción (reserva confirmada)");
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook de reserva:", err);
    return res.sendStatus(500);
  }
}

// ------------------ CLICK TRACKING DE LINK DE AGENDA ------------------
export async function registrarClickAgenda(req, res) {
  try {
    await enviarAvisoInterno("🔗 Un usuario ha presionado el enlace de agendamiento desde WhatsApp.");
    console.log("✅ Aviso interno enviado (clic en agenda)");
    res.redirect(LINK_REAL_RESERVO);
  } catch (err) {
    console.error("❌ Error en click de agenda:", err);
    res.redirect(LINK_REAL_RESERVO);
  }
}

export { enviarAvisoInterno };
