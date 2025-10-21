import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import { procesarMensaje } from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let contextoPrevio = {}; // guarda última intención por usuario

// Webhook verificación
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook recepción de mensajes
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text && message.from) {
      const phone = message.from;
      const texto = message.text.body.toLowerCase().trim();
      console.log("📩 Mensaje recibido:", texto);

      // mantener intención previa si aplica
      const anterior = contextoPrevio[phone] || null;
      const respuesta = procesarMensaje(texto, anterior);

      contextoPrevio[phone] = texto; // guarda último mensaje

      if (respuesta && respuesta.trim() !== "") {
        await enviarMensaje(phone, respuesta);
      } else {
        const fallback =
          "🤍 No comprendí tu mensaje, pero nuestras profesionales podrán orientarte en una evaluación gratuita. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
        await enviarMensaje(phone, fallback);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error general en webhook:", error);
    res.sendStatus(500);
  }
});

// Envío de mensaje
async function enviarMensaje(to, text) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
  };

  const body = {
    messaging_product: "whatsapp",
    to,
    text: { body: text }
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ Error API WhatsApp:", errorData);
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara IA ejecutándose en puerto ${PORT}`));
