import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { procesarMensaje } from "./motor_respuesta_v3.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

// ======================================================
// VERIFICACIÓN DEL WEBHOOK
// ======================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ======================================================
// RECEPCIÓN DE MENSAJES
// ======================================================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value) return;

    // Meta puede mandar mensajes en distintos campos
    const messages =
      value.messages ||
      value.message ||
      value.text ||
      value.interactive ||
      value.button ||
      null;

    if (!messages || !messages[0]) return;

    const msg = messages[0];

    // EXTRACCIÓN UNIVERSAL DE TEXTO
    const texto =
      msg.text?.body ||
      msg.interactive?.button_reply?.title ||
      msg.interactive?.list_reply?.title ||
      msg.button?.text ||
      null;

    if (!texto) return;

    const from = msg.from;
    if (!from) return;

    console.log("MENSAJE RECIBIDO:", texto);

    const respuesta = procesarMensaje(texto, from, "wsp");

    await enviarMensajeWhatsApp(from, respuesta);

  } catch (err) {
    console.error("ERROR webhook:", err);
  }
});

// ======================================================
// ENVÍO DE MENSAJES
// ======================================================
async function enviarMensajeWhatsApp(to, body) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body }
    };

    console.log("RESPUESTA ENVIADA:", body);

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("ERROR enviando mensaje:", e);
  }
}

// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara activo en puerto", PORT);
});
