import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import detectIntent from "./intents.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// === Verificación del webhook ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// === Recepción de mensajes ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text) {
      const from = message.from;
      const text = message.text.body.toLowerCase();
      console.log("Mensaje recibido:", text);

      const reply = detectIntent(text);
      await sendMessage(from, reply);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error.message);
    res.sendStatus(500);
  }
});

// === Envío de mensajes ===
async function sendMessage(to, message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error enviando mensaje:", error.response?.data || error);
  }
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("✅ Zara IA Body Elite activa en puerto", PORT)
);
