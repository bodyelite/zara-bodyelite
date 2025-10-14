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

// --- Buscar intent más probable ---
function detectIntent(message) {
  const text = message.toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some(p => text.includes(p.toLowerCase()))) {
      return intent.responses[0];
    }
  }
  return "fallback";
}

// --- Enviar mensaje ---
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

// --- Webhook verificación ---
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// --- Webhook de mensajes ---
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
        const replyOptions = responses[intentKey];
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
