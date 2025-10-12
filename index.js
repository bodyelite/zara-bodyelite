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
  } else res.sendStatus(403);
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (!message?.text?.body) return res.sendStatus(200);

    const from = message.from;
    const text = message.text.body.toLowerCase().trim();
    const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

    console.log(`📩 ${from}: "${text}"`);

    const prev = context.get(from) || { history: [] };
    const { reply, intent } = await getResponse(text, prev);

    // Guardar historial (máximo 5)
    const updatedHistory = [...(prev.history || []), text].slice(-5);
    context.set(from, { lastIntent: intent, history: updatedHistory });

    // === DERIVACIÓN A HUMANO ===
    if (/hablar|persona|alguien|profesional|humano|atender|comunicarme/.test(text)) {
      const resumen =
        `Derivación automática desde Zara IA\n` +
        `Número cliente: ${from}\n` +
        `Mensajes recientes:\n- ${updatedHistory.join("\n- ")}\n` +
        `Fecha/Hora: ${timestamp}`;

      await enviarMensaje(from, "Perfecto ✨ te dejo el número directo de nuestras especialistas: +56 9 8330 0262. También enviaré un resumen para que te contacten con tu información ya registrada.");
      await enviarMensajeInterno("+56983300262", resumen);
      return res.sendStatus(200);
    }

    await enviarMensaje(from, reply);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error webhook:", err);
    res.sendStatus(500);
  }
});

// === ENVÍO DE MENSAJE A CLIENTE ===
async function enviarMensaje(to, body) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) console.error("❌ Error enviando mensaje:", data);
}

// === ENVÍO INTERNO A HUMANO ===
async function enviarMensajeInterno(to, resumenPlano) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: resumenPlano },
  };
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("📨 Derivación enviada a humano:", to);
}

// === SERVIDOR ===
app.listen(PORT, () => {
  console.log(`🚀 Zara IA Body Elite activa en puerto ${PORT}`);
  console.log("🧠 Versión 4.9 — motivacional cálida + comprensión anatómica");
});
