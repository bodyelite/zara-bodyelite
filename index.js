import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { procesarMensaje } from "./memoria.js";

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const contextoPrevio = {};
const nombresUsuarios = {};

async function enviarMensaje(phone, text) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
  };
  const body = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text }
  };
  const r = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const errorText = await r.text();
    console.error("Error API WhatsApp:", errorText);
  }
}

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

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry || !entry.from || !entry.text) return res.sendStatus(200);

    const phone = entry.from;
    const texto = entry.text.body.toLowerCase().trim();
    console.log("Mensaje recibido:", texto);

    const anterior = contextoPrevio[phone] || null;

    // Esperar la respuesta real del módulo memoria.js
    const respuesta = await procesarMensaje(texto, anterior, nombresUsuarios[phone]);
    contextoPrevio[phone] = texto;

    const mensajeEnviar =
      respuesta && respuesta.trim() !== ""
        ? respuesta
        : "No logré entenderte bien, pero nuestras profesionales podrán orientarte con una evaluación gratuita asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    await enviarMensaje(phone, mensajeEnviar);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error general en webhook:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zara v31_coreRouter ejecutándose en puerto ${PORT}`);
});
