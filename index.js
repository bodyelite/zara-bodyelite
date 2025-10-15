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
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

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

// --- Enviar mensaje ---
async function sendMessage(recipientId, text) {
  try {
    const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    const payload = {
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: { text }
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log("✅ Mensaje enviado:", data);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err);
  }
}

// --- Webhook verificación ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Webhook mensajes ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // Log para depuración
    console.log("📩 Entrada recibida:", JSON.stringify(body, null, 2));

    const changes = body.entry?.[0]?.changes?.[0];
    const messages = changes?.value?.messages;

    if (!messages || !Array.isArray(messages)) {
      console.log("ℹ️ Evento recibido sin mensajes (ack o status)");
      return res.sendStatus(200);
    }

    for (const msg of messages) {
      const sender = msg.from;
      const message = msg.text?.body;

      if (!sender || !message) continue;

      saveIncomingMessage({
        from: sender,
        text: { body: message },
        id: msg.id || "",
        profile: msg.profile || {}
      });

      const intentKey = detectIntent(message);
      const replyOptions = responses[intentKey] || responses["fallback"];
      const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      await sendMessage(sender, reply);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err);
    res.sendStatus(500);
  }
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara corriendo en puerto ${PORT}`));
