import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleMessage } from "./zara_core_full_2_1.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PORT = process.env.PORT || 3000;

// Verificación del webhook (Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recepción de eventos (WhatsApp + Instagram)
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // WhatsApp Business API
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      if (message) {
        const from = message.from;
        const text = message.text?.body || "";
        console.log(`📲 WhatsApp: ${from} → ${text}`);
        await handleMessage(text, from, "whatsapp");
      }
    }

    // Instagram Business
    else if (body.object === "instagram") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.message || changes?.value?.text || "";
      const from = changes?.value?.from?.id || "instagram_user";
      if (message) {
        console.log(`💬 Instagram: ${from} → ${message}`);
        await handleMessage(message, from, "instagram");
      }
    }

    // Messenger (por compatibilidad futura)
    else if (body.object === "page") {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];
      const sender = messaging?.sender?.id;
      const text = messaging?.message?.text;
      if (text) {
        console.log(`💭 Messenger: ${sender} → ${text}`);
        await handleMessage(text, sender, "messenger");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error al procesar evento:", error);
    res.sendStatus(500);
  }
});

// Servidor activo
app.listen(PORT, () => {
  console.log(`✅ Zara 3.0 escuchando en puerto ${PORT} (IG + WSP activos)`);
});

export default app;
