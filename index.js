import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 3000;

// WEBHOOK VERIFICATION
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// RECEIVE MESSAGES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body || "";
      console.log("Mensaje recibido:", text);

      await sendMessage(from, `Hola 👋 soy Zara IA de Body Elite. Recibí tu mensaje: "${text}"`);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook:", err);
    res.sendStatus(500);
  }
});

// SEND MESSAGE
async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Error enviando mensaje:", data);
    } else {
      console.log("Mensaje enviado correctamente:", data);
    }
  } catch (error) {
    console.error("Fallo de envío:", error);
  }
}

// SERVER
app.listen(PORT, () => {
  console.log(`Servidor Zara IA activo en puerto ${PORT}`);
});
