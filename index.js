// index.js — Bot Body Elite versión estable para Render + Meta verificado
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "zara_bodyelite_verify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "840360109156943";
const PORT = process.env.PORT || 10000;

// === ENDPOINT DE VERIFICACIÓN WEBHOOK ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verificación fallida");
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const text = message.text?.body?.toLowerCase() || "";

        console.log("📩 Mensaje recibido de", from, ":", text);

        // === RESPUESTAS AUTOMÁTICAS ===
        let reply = "";

        if (
          text.includes("hola") ||
          text.includes("buenas") ||
          text.includes("saludo")
        ) {
          reply =
            "👋 ¡Hola! Soy la asistente virtual de *Body Elite*.\n" +
            "La *lipoescultura no invasiva* combina *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor* para moldear tu cuerpo sin cirugía.\n" +
            "💬 ¿Te gustaría agendar tu *evaluación gratuita*?";
        } else if (
          text.includes("celulitis") ||
          text.includes("flacidez") ||
          text.includes("piernas")
        ) {
          reply =
            "✨ Podemos ayudarte con *BODY TENSOR* o *LIPO REDUCTIVA*, tratamientos que mejoran textura y firmeza de la piel.\n" +
            "💬 ¿Quieres que te ayude a reservar tu evaluación gratuita?";
        } else if (
          text.includes("cintura") ||
          text.includes("moldear") ||
          text.includes("abdomen") ||
          text.includes("reductor")
        ) {
          reply =
            "🔥 Te recomiendo el plan *LIPO BODY ELITE*, con *HIFU 12D + Cavitación + EMS Sculptor*, ideal para definir cintura y reducir grasa localizada.\n" +
            "💬 ¿Deseas agendar tu evaluación gratuita?";
        } else if (
          text.includes("agenda") ||
          text.includes("quiero") ||
          text.includes("sí") ||
          text.includes("reserva")
        ) {
          reply =
            "Perfecto 💫 selecciona aquí para ver los horarios disponibles:\n" +
            "🗓️ *[Agenda Body Elite](https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9)*";
        } else if (
          text.includes("humano") ||
          text.includes("asesora") ||
          text.includes("persona") ||
          text.includes("contacto")
        ) {
          reply =
            "Te conectaré con una asesora 💬\n" +
            "👉 [Hablar con asesora](https://wa.me/56983300262)";
        } else if (
          text.includes("dirección") ||
          text.includes("ubicación") ||
          text.includes("dónde")
        ) {
          reply =
            "📍 Nos encuentras en *Av. Las Perdices Nº2990, Local 23, Peñalolén*.\n🕘 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.";
        } else {
          reply =
            "Soy la asistente virtual de Body Elite 💙.\nPuedo orientarte sobre tratamientos, precios o ayudarte a agendar tu *evaluación gratuita con asistencia IA*.\n¿Quieres que te ayude a empezar?";
        }

        // === ENVÍO DE RESPUESTA ===
        await axios.post(
          `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: reply },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Respuesta enviada a", from);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error en webhook:", error.message);
    res.sendStatus(500);
  }
});

// === INICIO DE SERVIDOR ===
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
