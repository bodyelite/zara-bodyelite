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

// =============== VERIFICACION (GET) ===============
app.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Invalid verify token");
    }
  } catch (e) {
    return res.status(500).send("Webhook verification error");
  }
});

// =============== RECEPCION (POST) ===============
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // Confirmación inmediata
    res.sendStatus(200);

    if (!body || !body.entry || !body.entry[0] || !body.entry[0].changes) {
      return;
    }

    const changes = body.entry[0].changes;

    for (const c of changes) {
      if (!c.value || !c.value.messages) continue;

      const message = c.value.messages[0];
      const from = message.from;
      const text = message.text ? message.text.body : null;

      if (!text || !from) continue;

      const plataforma = c.field === "messages" ? "wsp" : "ig";
      const respuesta = procesarMensaje(text, from, plataforma);

      await enviarMensajeWhatsApp(from, respuesta);
    }
  } catch (e) {
    console.error("ERROR en webhook:", e);
  }
});

// =============== ENVIO DE MENSAJES ===============
async function enviarMensajeWhatsApp(to, texto) {
  try {
    const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_ID + "/messages";

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: texto }
    };

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + WHATSAPP_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("ERROR enviando mensaje:", e);
  }
}

// =============== SERVIDOR ===============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara activo en puerto " + PORT);
});
