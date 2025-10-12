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

// === MEMORIA CORTA POR NÚMERO ===
const context = new Map();

// === VERIFICACIÓN WEBHOOK ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messageObj = value?.messages?.[0];

    if (!messageObj) return res.sendStatus(200);

    const from = messageObj.from;
    const text = messageObj.text?.body?.toLowerCase().trim();

    console.log("📩 Mensaje recibido:", text);

    const prev = context.get(from) || {};
    const { reply, intent } = await getResponse(text, prev);

    context.set(from, { lastIntent: intent, lastMsg: text });

    await enviarMensaje(from, reply);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook:", err);
    res.sendStatus(500);
  }
});

// === ENVÍO DE MENSAJE ===
async function enviarMensaje(to, body) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body },
  };

  const r = await fetch(
    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await r.json();
  console.log("📤 Enviado:", data);
}

app.listen(PORT, () => {
  console.log(`🚀 Zara IA Body Elite activa en puerto ${PORT}`);
  console.log("🧠 Versión 4.7 — conocimiento técnico + memoria contextual");
});
