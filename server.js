import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { handleMessage } from "./zara_core_full_2_1.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

// ====== WEBHOOK GET ======
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ====== WEBHOOK POST ======
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

    // ==== FORMATO WHATSAPP ====
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const msg = changes?.value?.messages?.[0];

      if (msg) {
        const from = msg.from;
        const text = msg.text?.body || "(sin texto)";
        console.log(`💬 WhatsApp ${from}: ${text}`);
        await handleMessage(from, text, "whatsapp");
      }
    }

    // ==== FORMATO INSTAGRAM (nuevo formato Graph API) ====
    else if (body.object === "instagram") {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (messaging) {
        const sender = messaging.sender?.id || "IG_USER";
        const text = messaging.message?.text || "(sin texto)";
        console.log(`💬 Instagram ${sender}: ${text}`);
        await handleMessage(sender, text, "instagram");
      } else {
        console.log("⚠️ Mensaje Instagram vacío o no reconocido");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

// ====== RUTA BASE ======
app.get("/", (req, res) => {
  res.status(200).send("Zara 3.1 corriendo (IG + WSP activos)");
});

// ====== INICIO SERVIDOR ======
app.listen(PORT, () => {
  console.log(`✅ Zara 3.1 escuchando en puerto ${PORT} (IG + WSP activos)`);
  console.log("===========================================");
  console.log(`👉 Webhook activo: /webhook`);
  console.log(`🌐 URL pública: ${process.env.RENDER_EXTERNAL_URL || "Render local"}`);
  console.log("===========================================");
});
