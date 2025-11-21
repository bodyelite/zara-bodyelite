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
// VERIFICACIÓN DEL WEBHOOK (GET)
// ======================================================
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
  } catch (err) {
    console.error("ERROR en verificación:", err);
    return res.sendStatus(500);
  }
});

// ======================================================
// RECEPCIÓN DEL WEBHOOK (POST)
// ======================================================
app.post("/webhook", async (req, res) => {
  try {
    // Meta necesita respuesta inmediata
    res.sendStatus(200);

    const body = req.body;
    if (!body.entry || !body.entry[0] || !body.entry[0].changes) return;

    const changes = body.entry[0].changes;

    for (const c of changes) {
      const value = c.value;
      if (!value) continue;

      // ======================================================
      // NORMALIZACIÓN DE MENSAJES (Meta cambia formatos)
      // ======================================================
      const messages =
        value.messages ||
        value.message ||
        value?.statuses ||
        null;

      if (!messages || !messages[0]) continue;

      const msg = messages[0];

      // SOLO PROCESAMOS MENSAJES DE USUARIO (no status ni delivery)
      if (msg.type !== "text" && !msg.text) continue;

      const from = msg.from;
      const texto = msg.text ? msg.text.body : null;

      if (!from || !texto) continue;

      // ======================================================
      // PROCESAR MENSAJE CON EL MOTOR
      // ======================================================
      const respuesta = procesarMensaje(texto, from, "wsp");

      // ======================================================
      // RESPONDER AL USUARIO
      // ======================================================
      await enviarMensajeWhatsApp(from, respuesta);
    }
  } catch (err) {
    console.error("ERROR en webhook:", err);
  }
});

// ======================================================
// FUNCIÓN DE ENVÍO DE MENSAJES
// ======================================================
async function enviarMensajeWhatsApp(destino, texto) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: destino,
      text: { body: texto }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("ERROR al enviar mensaje:", err);
  }
}

// ======================================================
// LEVANTAR SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara activo en puerto " + PORT);
});
