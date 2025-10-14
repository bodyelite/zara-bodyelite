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

// --- Detectar intención ---
function detectIntent(message) {
  const text = message.toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some(p => text.includes(p.toLowerCase()))) {
      return intent.responses[0];
    }
  }
  return "fallback";
}

// --- Webhook de verificación ---
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Webhook de mensajes (WhatsApp Business) ---
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const changes = body.entry?.[0]?.changes || [];
    for (const change of changes) {
      const value = change.value;
      const messages = value.messages || [];

      for (const msg of messages) {
        const from = msg.from;
        const text = msg.text?.body;

        if (text && from) {
          console.log(`📩 Mensaje recibido de ${from}: ${text}`);

          saveIncomingMessage({
            from,
            text: { body: text },
            id: msg.id,
            profile: value.contacts?.[0],
          });

          const intentKey = detectIntent(text);
          const replyOptions = responses[intentKey];
          const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

          console.log(`🤖 Respondiendo: ${reply}`);

          await fetch(
            `https://graph.facebook.com/v17.0/${value.metadata.phone_number_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: from,
                text: { body: reply },
              }),
            }
          );
        }
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara corriendo en puerto ${PORT}`));
