import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { intents } from "./intents.js";
import { responses } from "./responses.js";
import { knowledge } from "./knowledge.js";
import { saveIncomingMessage } from "./saveMessages.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// --- Buscar intent predefinido ---
function detectIntent(message) {
  const text = message.toLowerCase();
  for (const intent of intents) {
    if (intent.patterns.some(p => text.includes(p.toLowerCase()))) {
      return intent.responses[0];
    }
  }
  return "fallback";
}

// --- Buscar conocimiento clínico ---
function searchKnowledge(text) {
  const lower = text.toLowerCase();
  for (const key in knowledge) {
    const item = knowledge[key];
    if (item.requerimiento) {
      const match = item.requerimiento.find(p => lower.includes(p.toLowerCase()));
      if (match) return key;
    }
  }
  return null;
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
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err);
  }
}

// --- Webhook de verificación ---
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Webhook de mensajes ---
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page" && body.entry?.[0]?.messaging) {
    for (const event of body.entry[0].messaging) {
      const sender = event.sender?.id;
      const message = event.message?.text;

      if (message && sender) {
        console.log("📩 Mensaje recibido:", message);

        saveIncomingMessage({
          from: sender,
          text: { body: message },
          id: event.message?.mid,
          profile: event.sender,
        });

        let intentKey = detectIntent(message);
        let reply;

        // --- Motor de conocimiento clínico ---
        if (intentKey === "fallback" || intentKey === "search_knowledge") {
          const foundKey = searchKnowledge(message);
          if (foundKey && knowledge[foundKey]) {
            const data = knowledge[foundKey];
            reply =
              `🔹 ${data.descripcion}\n\n💆‍♀️ *Tratamientos sugeridos:*\n- ${data.tratamientos.join("\n- ")}\n\n💎 *Planes recomendados:* ${data.planes.join(", ")}\n\n🕐 ${data.sesiones}\n✨ ${data.resultados}\n\n🤍 ${data.experiencia}`;
          } else {
            reply = "💬 Puedo ayudarte con diagnóstico facial o corporal. Cuéntame qué te gustaría mejorar: grasa, flacidez, arrugas o piel.";
          }
        } else {
          const replyOptions = responses[intentKey];
          reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
        }

        // --- Fallback seguro ---
        if (!reply || reply.trim() === "") {
          reply = "💆‍♀️ Puedo ayudarte con diagnóstico facial o corporal. Cuéntame qué zona o problema te gustaría tratar.";
        }

        await sendMessage(sender, reply);
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
