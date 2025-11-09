import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleMessage } from "./zara_core_full_2_1.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

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

    if (body.object === "whatsapp_business_account") {
      const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (msg) {
        const from = msg.from;
        const text = msg.text?.body || "(sin texto)";
        console.log(`💬 WhatsApp ${from}: ${text}`);
        await handleMessage(from, text, "whatsapp");
      }
    }

    else if (body.object === "instagram") {
      const messaging = body.entry?.[0]?.messaging?.[0];
      if (messaging) {
        const sender = messaging.sender?.id;
        const text = messaging.message?.text || "(sin texto)";
        console.log(`💬 Instagram ${sender}: ${text}`);
        await handleMessage(sender, text, "instagram");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Zara 3.2 corriendo (IG + WSP activos)");
});

app.listen(PORT, () => {
  console.log(`✅ Zara 3.2 escuchando en puerto ${PORT} (IG + WSP activos)`);
});
