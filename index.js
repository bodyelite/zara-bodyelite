import express from "express";
import bodyParser from "body-parser";
import { obtenerRespuesta, manejarReserva } from "./responses.js";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// --- Webhook principal WhatsApp ---
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";
    const respuesta = obtenerRespuesta(text);

    await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: respuesta }
      })
    });

    console.log("Mensaje respondido:", text);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook:", err);
    res.sendStatus(500);
  }
});

// --- Webhook de Reservo (avisos internos) ---
app.post("/reservowebhook", manejarReserva);

// --- Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Zara Body Elite activa en puerto ${PORT}`));
