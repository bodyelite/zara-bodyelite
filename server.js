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

// =======================================
// VERIFICACION WEBHOOK (GET)
// =======================================
app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } catch {
    return res.sendStatus(500);
  }
});

// =======================================
// RECEPCION DE MENSAJES (POST)
// =======================================
app.post("/webhook", async (req, res) => {
  try {
    res.sendStatus(200); // responder inmediatamente

    const body = req.body;
    if (!body.entry || !body.entry[0].changes) return;

    const changes = body.entry[0].changes;

    for (const c of changes) {
      if (!c.value || !c.value.messages) continue;

      const message = c.value.messages[0];
      const from = message.from;
      const text = message.text ? message.text.body : null;

      if (!from || !text) continue;

      const respuesta = procesarMensaje(text, from, "wsp");

      await enviarMensajeWhatsApp(from, respuesta);
    }
  } catch (e) {
    console.error("ERROR en webhook:", e);
  }
});

// =======================================
// ENVIO DE MENSAJES
// =======================================
async function enviarMensajeWhatsApp(to, mensaje) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: mensaje }
    };

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

// =======================================
// SERVIDOR
// =======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara activo en puerto " + PORT);
});
