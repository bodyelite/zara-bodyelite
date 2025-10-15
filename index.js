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

// --- Detectar intención con coincidencia flexible ---
function detectIntent(message) {
  const text = message.toLowerCase().trim();
  let bestMatch = "fallback";

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, "i");
      if (regex.test(text)) {
        return intent.responses[0];
      }
    }
  }

  // Coincidencias aproximadas
  if (text.match(/botox|toxina|antiarrugas|frente|relleno/)) bestMatch = "facial_treatment";
  else if (text.match(/abdomen|piernas|cuerpo|bajar|lipo|cavitacion/)) bestMatch = "corporal_treatment";
  else if (text.match(/ubicacion|direccion|donde/)) bestMatch = "location";
  else if (text.match(/promo|descuento|gratis/)) bestMatch = "promo";

  return bestMatch;
}

// --- Enviar mensaje a usuario ---
async function sendMessage(recipientId, text) {
  await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: { text }
    })
  });
}

// --- Webhook verificación Meta ---
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
  if (body.object === "page" && body.entry?.[0]?.messaging) {
    for (const event of body.entry[0].messaging) {
      const sender = event.sender?.id;
      const message = event.message?.text;

      if (message && sender) {
        saveIncomingMessage({
          from: sender,
          text: { body: message },
          id: event.message?.mid,
          profile: event.sender,
        });

        const intentKey = detectIntent(message);
        const replyOptions = responses[intentKey] || responses["fallback"];
        const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

        await sendMessage(sender, reply);
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } else res.sendStatus(404);
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara corriendo en puerto ${PORT}`));
