import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { intents } from "./intents.js";
import { responses } from "./responses.js";
import { saveIncomingMessage } from "./saveMessages.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// --- Detección de intención flexible ---
function detectIntent(message) {
  const text = message.toLowerCase().trim();
  if (text.match(/botox|toxina|antiarrugas|relleno|frente|labios|arruga/)) return "facial_treatment";
  if (text.match(/facial|acne|manchas|hifu|pink|radiofrecuencia/)) return "facial_treatment";
  if (text.match(/abdomen|piernas|cuerpo|lipo|cavitacion|sculptor/)) return "corporal_treatment";
  if (text.match(/ubicacion|direccion|donde|horario/)) return "location";
  if (text.match(/promo|descuento|gratis/)) return "promo";
  if (text.match(/agendar|evaluacion|diagnostico|reserva/)) return "booking";
  if (text.match(/hola|buenas|saludo/)) return "greeting";
  return "fallback";
}

// --- Envío de mensaje ---
async function sendMessage(phoneNumberId, to, text) {
  await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    })
  });
}

// --- Webhook verificación ---
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// --- Webhook mensajes entrantes ---
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messageObj = value?.messages?.[0];
    const phoneNumberId = value?.metadata?.phone_number_id;

    if (messageObj && messageObj.text?.body) {
      const from = messageObj.from;
      const text = messageObj.text.body;

      saveIncomingMessage({
        from,
        text: { body: text },
        id: messageObj.id,
        profile: from
      });

      const intentKey = detectIntent(text);
      const replyOptions = responses[intentKey] || responses["fallback"];
      const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

      await sendMessage(phoneNumberId, from, reply);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara corriendo en puerto ${PORT}`));
