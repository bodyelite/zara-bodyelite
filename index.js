import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ✅ Verificación de webhook (Meta → Render)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Falló la verificación del webhook");
    res.sendStatus(403);
  }
});

// ✅ Recepción de mensajes entrantes (Meta → Render)
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const messages = body.entry[0].changes[0].value.messages;
      for (const msg of messages) {
        const from = msg.from;
        const text = msg.text?.body?.toLowerCase() || "";

        console.log(`💬 Mensaje recibido de ${from}: ${text}`);

        // 🔹 Respuesta básica
        let reply = "Hola 👋, soy Zara, asistente IA de Body Elite. ¿En qué puedo ayudarte hoy?";
        if (text.includes("botox")) reply = "💉 Sí, realizamos aplicación de toxina botulínica con especialistas certificados.";
        else if (text.includes("pink")) reply = "🌸 Pink Glow es ideal para mejorar la luminosidad y textura de tu piel.";
        else if (text.includes("agenda")) reply = "📅 Puedes agendar fácilmente tu evaluación gratuita acá: Agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nNuestra evaluación y seguimiento se realizan con asistencia IA para resultados óptimos.";

        // 🔹 Enviar mensaje de respuesta a WhatsApp
        await fetch(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: reply }
          })
        });

        console.log(`✅ Respuesta enviada a ${from}: ${reply}`);
      }
    }

    // Confirmar recepción a Meta (evita reintentos)
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando el webhook:", err);
    res.sendStatus(500);
  }
});

// ✅ Inicia servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Zara bot corriendo correctamente en puerto ${PORT}`);
});
