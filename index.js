// ========================================================
// 🤖 ZARA IA BODY ELITE - Versión Final Estable
// ========================================================

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// ========================================================
// 🔐 CONFIGURACIÓN
// ========================================================

const TOKEN = "EAAUydX2y57wBPoPahaD8YwZBP92Cos5Qp1AmMV2yym8ZAbjE1BmjpBkvidN5VVaUSBKsSPTjR5Khmxh24HAZBHAGEVzRLQTt8lRyhTWlZCDjQHeaNuyIq1T33tZB6EUJrnsZCcOzQEZB7zxUZCcEdIrXG9pnZAPwpfIyWy6HKLMZAKZAscFZB5GswRZAUMoUJIgZDZD";
const PHONE_NUMBER_ID = "84036109156943"; // ← este es el ID del NÚMERO DE WHATSAPP
const VERIFY_TOKEN = "zara_bodyelite_verify";

// ========================================================
// 🧠 RESPUESTAS DE ZARA IA BODY ELITE
// ========================================================

function generarRespuesta(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("hola") || texto.includes("buenas")) {
    return "👋 ¡Hola! Soy Zara, asistente virtual de *Body Elite Estética Avanzada* 💙\n\n¿Quieres conocer nuestros tratamientos *corporales* o *faciales*?";
  }

  if (texto.includes("lipo") || texto.includes("grasa") || texto.includes("cintura")) {
    return "🔥 Nuestro tratamiento *Lipo Body Elite* combina *HIFU 12D + Cavitación/Radiofrecuencia + EMS Sculptor*, reduciendo grasa localizada y tonificando el contorno desde la 3ª sesión.\n\n💰 *Planes corporales:*\n- Lipo Body Elite: $664.000 (10 sesiones)\n- Lipo Reductiva: $480.000\n- Lipo Express: $432.000\n\n✨ Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.includes("face") || texto.includes("facial") || texto.includes("cara") || texto.includes("antiage")) {
    return "💆‍♀️ En *Body Elite* contamos con protocolos faciales de alta tecnología:\n\n• Face Elite $358.400\n• Face Smart $198.400\n• Face Light $128.800\n• Face Antiage $281.600\n\nTodos incluyen diagnóstico facial con analizador digital. ✨ Agenda tu hora 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (texto.includes("sculptor") || texto.includes("ems")) {
    return "💪 El *EMS Sculptor* contrae tus músculos hasta 20.000 veces en 30 minutos. Equivale a más de 4 horas de entrenamiento intenso, ayudando a definir abdomen, glúteos o brazos sin dolor ni esfuerzo. 💥";
  }

  if (texto.includes("hifu") || texto.includes("radiofrecuencia") || texto.includes("cavitación")) {
    return "⚡ Nuestros tratamientos *HIFU 12D, Cavitación y Radiofrecuencia* remodelan el contorno corporal y estimulan colágeno sin cirugía. Perfectos para combinar en protocolos como *Lipo Body Elite* o *Body Fitness* ✨";
  }

  if (texto.includes("antiacné") || texto.includes("acné")) {
    return "🌿 *BE Antiacné Pro + Radiofrecuencia* ayuda a disminuir inflamación, controlar grasa y regenerar piel con tecnología LED azul y microcorriente RF.\n💰 Plan: $329.000 (6 sesiones)";
  }

  if (texto.includes("gracias")) {
    return "💙 ¡Gracias a ti! Recuerda que en *Body Elite* te ayudamos a alcanzar tus objetivos sin bisturí y con tecnología estética avanzada ✨";
  }

  if (texto.includes("agenda") || texto.includes("reservar") || texto.includes("diagnóstico")) {
    return "📅 ¡Perfecto! Puedes agendar tu diagnóstico gratuito directamente aquí 👇\n\n🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\nSolo selecciona el servicio y el horario que más te acomode 💬";
  }

  return "✨ Soy *Zara IA*, asistente de *Body Elite Estética Avanzada* 💙\nPuedo ayudarte con información sobre tratamientos *faciales*, *corporales*, *diagnóstico gratuito* o *promociones actuales*. ¿Qué deseas conocer hoy?";
}

// ========================================================
// 🌐 WEBHOOKS
// ========================================================

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const changes = body.entry?.[0]?.changes?.[0]?.value?.messages;
    if (changes && changes[0]) {
      const message = changes[0];
      const from = message.from;
      const text = message.text?.body || "";
      console.log(`💬 Mensaje recibido de ${from}: "${text}"`);

      const respuesta = generarRespuesta(text);

      try {
        await axios.post(
          `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: respuesta },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        console.log("✅ Mensaje enviado correctamente ✔️");
      } catch (error) {
        console.error("⚠️ Error enviando mensaje:", error.response?.data || error.message);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ========================================================
// 🚀 SERVIDOR
// ========================================================

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA Body Elite lista y escuchando mensajes...");
  console.log("///////////////////////////////////////////////");
  console.log(`🌐 Disponible en: https://zara-bodyelite1.onrender.com`);
  console.log("///////////////////////////////////////////////");
});
