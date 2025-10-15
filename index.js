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

// --- Detectar intent ---
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
  try {
    await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        messaging_type: "RESPONSE",
        message: { text }
      })
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
  }
}

// --- Webhook verificación ---
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

// --- Webhook de mensajes (WhatsApp Cloud API) ---
app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("📩 Mensaje recibido:", JSON.stringify(body, null, 2));

  try {
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const messages = body.entry[0].changes[0].value.messages;

      for (const msg of messages) {
        const sender = msg.from;
        const message = msg.text?.body;

        if (sender && message) {
          saveIncomingMessage({
            from: sender,
            text: { body: message },
            id: msg.id,
            profile: {},
          });

          const intentKey = detectIntent(message);
          const replyOptions = responses[intentKey];
          const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

          await sendMessage(sender, reply);
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara corriendo en puerto ${PORT}`));
