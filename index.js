import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ======================= WEBHOOK VERIFY ===========================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Fallo en la verificación del webhook.");
    res.sendStatus(403);
  }
});

// ======================= EVENTO PRINCIPAL =========================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.type === "text") {
        const from = message.from;
        const text = message.text.body?.toLowerCase() || "";

        console.log("📩 Mensaje recibido:", text);

        // ---------- LÓGICA PRINCIPAL ----------
        let reply;

        if (text.includes("hola")) {
          reply = "👋 ¡Hola! Soy Zara, asistente IA de Body Elite. ¿Deseas una evaluación facial o corporal sin costo?";
        } else if (text.includes("facial")) {
          reply = "✨ En tratamientos faciales trabajamos según diagnóstico y tipo de piel. Planes desde *$120.000* con Limpieza Facial Full. ¿Quieres que te agendemos una evaluación sin costo?";
        } else if (text.includes("corporal")) {
          reply = "💪 En tratamientos corporales ayudamos a reducir grasa, celulitis y tonificar. Planes desde *$232.000* según diagnóstico. ¿Te gustaría agendar una evaluación gratuita?";
        } else if (text.includes("botox")) {
          reply = "💉 El botox o toxina botulínica ayuda a suavizar líneas de expresión. En Body Elite se aplica con control médico y puede combinarse con *Pink Glow* o *Face Antiage*.";
        } else if (text.includes("pink glow")) {
          reply = "🌸 *Pink Glow* mejora la luminosidad y textura facial con activos regeneradores. Ideal para piel opaca o con manchas.";
        } else if (text.includes("agendar")) {
          reply = "📅 Puedes agendar tu diagnóstico gratuito aquí:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
        } else {
          reply = "🤖 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. ¿Sobre qué te gustaría saber?";
        }

        // ---------- ENVÍO DE RESPUESTA ----------
        const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
        const response = await fetch(url, {
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

        const data = await response.json();
        if (!response.ok) {
          console.error("❌ Error al enviar mensaje:", data);
        } else {
          console.log("✅ Mensaje enviado:", data);
        }
      } else {
        console.log("📭 Evento recibido sin mensajes (status o ack).");
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("💥 Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

// ======================= PUERTO ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara corriendo en puerto ${PORT}`));
