import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import intents from "./intents.js";

const app = express();
app.use(bodyParser.json());

// VERIFICACIÓN WEBHOOK META
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body?.toLowerCase();

    if (!text) {
      console.log("⚠️ Mensaje sin texto recibido");
      return res.sendStatus(200);
    }

    console.log("📩 Mensaje recibido:", text);

    // --- RECONOCIMIENTO DE FRASE ---
    let matchedIntent = null;

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        if (text.includes(pattern.toLowerCase())) {
          matchedIntent = intent;
          break;
        }
      }
      if (matchedIntent) break;
    }

    // --- RESPUESTA SEGÚN INTENCIÓN ---
    let responseText;
    if (matchedIntent) {
      console.log(`🎯 Intención detectada: ${matchedIntent.tag}`);
      responseText = matchedIntent.response;
    } else {
      console.log(`❌ Frase desconocida: ${text}`);
      responseText =
        "No entendí tu mensaje. Escribe *hola* para comenzar o indica si te interesa un tratamiento *facial* o *corporal* 🌸";
    }

    // ENVÍO DE RESPUESTA A WHATSAPP
    const token = process.env.PAGE_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: responseText },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Respuesta enviada a", from);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// PUERTO SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
