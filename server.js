import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { responderZara } from "./core/zara_core.js";

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Verificación del webhook Meta
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

// Recepción de mensajes entrantes
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry || !entry.from || !entry.text) return res.sendStatus(200);

    const phone = entry.from;
    const mensaje = entry.text.body;
    const respuesta = responderZara(mensaje, "WSP");

    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    };
    const payload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: respuesta }
    };

    await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error general en webhook:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara 2.0 corriendo en puerto ${PORT}`));
