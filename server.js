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

    if (body.object) {
      const entry = body.entry && body.entry[0];
      const changes = entry?.changes && entry.changes[0];

      if (changes?.value?.messages) {
        const msg = changes.value.messages[0];
        const from = msg.from || msg.id || "desconocido";
        const text = msg.text?.body || msg.message || "(sin texto)";
        const product = changes.value.messaging_product;

        console.log(`💬 Mensaje recibido desde ${product}: ${from} → ${text}`);

        if (product === "whatsapp" || product === "whatsapp_business") {
          await handleMessage(from, text, "whatsapp");
        } else if (product === "instagram" || product === "instagram_business") {
          const sender = changes.value?.from?.id || msg.from || "IG_USER";
          await handleMessage(sender, text, "instagram");
        } else {
          console.log("⚠️ Producto desconocido:", product);
        }
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
  res.status(200).send("Zara 3.0 corriendo (IG + WSP activos)");
});

// ====== INICIO SERVIDOR ======
app.listen(PORT, () => {
  console.log(`✅ Zara 3.0 escuchando en puerto ${PORT} (IG + WSP activos)`);
  console.log("===========================================");
  console.log(`👉 Webhook activo: /webhook`);
  console.log(`🌐 URL pública: ${process.env.RENDER_EXTERNAL_URL || "Render local"}`);
  console.log("===========================================");
});
