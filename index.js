import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { getResponse } from "./responses.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PORT = process.env.PORT || 10000;

// === Memoria extendida por usuario ===
const memory = new Map();

// === Webhook Meta ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

// === Mensajes entrantes ===
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg?.text?.body) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text.body.toLowerCase().trim();
    const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
    const prev = memory.get(from) || { lastTopic: null, lastValidTopic: null, history: [] };

    const { reply, topic, intent } = await getResponse(text, prev);

    memory.set(from, {
      lastTopic: topic || prev.lastTopic,
      lastValidTopic: topic || prev.lastValidTopic,
      history: [...prev.history.slice(-5), text],
    });

    // Derivación manual
    if (/humano|persona|alguien|asesor|profesional|ayuda/.test(text)) {
      const resumen =
        `🧠 Derivación automática desde Zara IA\n` +
        `Cliente: ${from}\n` +
        `Conversación:\n- ${memory.get(from).history.join("\n- ")}\n` +
        `Hora: ${timestamp}`;
      await sendMsg(from, "Perfecto ✨ te dejo el número directo de nuestras especialistas: +56 9 8330 0262. Enviaré un resumen para que te contacten pronto.");
      await sendMsg("+56983300262", resumen);
      return res.sendStatus(200);
    }

    await sendMsg(from, reply);
    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Error webhook:", e);
    res.sendStatus(500);
  }
});

async function sendMsg(to, body) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const payload = { messaging_product: "whatsapp", to, text: { body } };
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

app.listen(PORT, () => console.log(`🚀 Zara IA Body Elite v5.2 corriendo en puerto ${PORT}`));
