// index.js — Bot Zara Body Elite (Render versión token fijo)
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// === CONFIGURACIÓN FIJA ===
const VERIFY_TOKEN = "zara_bodyelite_verify"; // Token fijo para verificación Meta
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "840360109156943";
const PORT = process.env.PORT || 10000;

// === VERIFICACIÓN WEBHOOK ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Error: Token de verificación inválido");
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object) {
      const entry = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (entry) {
        const from = entry.from;
        const text = entry.text?.body?.toLowerCase() || "";

        console.log("📩 Mensaje recibido de", from, ":", text);

        let reply = "";

        // === RESPUESTAS ===
        if (text.includes("hola") || text.includes("buenas")) {
          reply =
            "👋 ¡Hola! Soy Zara, asistente virtual de Body Elite.\n" +
            "La *lipoescultura no invasiva* ayuda a moldear tu cuerpo sin cirugía, combinando *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor*.\n" +
            "💬 Agenda tu *evaluación gratuita con asistencia IA* y descubre tu plan ideal.\n¿Deseas que te ayude a agendar?";
        } else if (
          text.includes("celulitis") ||
          text.includes("flacidez") ||
          text.includes("piernas")
        ) {
          reply =
            "✨ Podemos ayudarte con *BODY TENSOR* o *LIPO REDUCTIVA*, ideales para mejorar textura y firmeza con cavitación y radiofrecuencia.\n" +
            "💬 Agenda tu *evaluación gratuita con asistencia IA* y descubre tu plan ideal en Body Elite.\n¿Deseas que te ayude a agendar?";
        } else if (
          text.includes("cintura") ||
          text.includes("moldear") ||
          text.includes("abdomen")
        ) {
          reply =
            "🔥 Te recomiendo *LIPO BODY ELITE*, con *HIFU 12D + Cavitación + EMS Sculptor*, ideal para definir cintura y reducir grasa localizada.\n" +
            "💬 Agenda tu *evaluación gratuita con asistencia IA*.\n¿Deseas que te ayude a agendar?";
        } else if (
          text.includes("sin cirugía") ||
          text.includes("sin bisturí")
        ) {
          reply =
            "💎 En Body Elite usamos tecnología estética avanzada para modelar el cuerpo *sin cirugía ni dolor*, con resultados visibles desde las primeras sesiones.\n" +
            "💬 Agenda tu *evaluación gratuita con asistencia IA*.\n¿Deseas que te ayude a agendar?";
        } else if (
          text.includes("sí") ||
          text.includes("agenda") ||
          text.includes("quiero") ||
          text.includes("reserva")
        ) {
          reply =
            "Perfecto 💫 selecciona aquí para ver los horarios disponibles:\n" +
            "🗓️ *[Agenda Body Elite](https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9)*";
        } else if (
          text.includes("humano") ||
          text.includes("asesora") ||
          text.includes("persona") ||
          text.includes("llámenme") ||
          text.includes("contacto")
        ) {
          reply =
            "Te conectaré con una de nuestras asesoras 💬\n" +
            "👉 [Hablar con asesora](https://wa.me/56983300262)";
        } else if (
          text.includes("dirección") ||
          text.includes("dónde") ||
          text.includes("ubicación")
        ) {
          reply =
            "📍 Nos encuentras en *Av. Las Perdices Nº2990, Local 23, Peñalolén*.\n🕓 Horarios: *Lun–Vie 9:30–20:00* / *Sáb 9:30–13:00*.";
        } else {
          reply =
            "Soy Zara 💙, asistente virtual de Body Elite.\nPuedo orientarte sobre tratamientos, precios o agendar tu *evaluación gratuita con asistencia IA*.\n¿Te gustaría conocer nuestros planes?";
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
    } else res.sendStatus(404);
  } catch (err) {
    console.error("❌ Error en webhook:", err.message);
    res.sendStatus(500);
  }
});

// === INICIO DE SERVIDOR ===
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
