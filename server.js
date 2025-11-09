import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleMessage } from "./zara_core_full_2_1.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (msg?.from && (msg.text?.body || msg.button?.text)) {
        const from = msg.from;
        const text = msg.text?.body || msg.button?.text || "";
        console.log(`📲 WhatsApp: ${from} → ${text}`);
        await handleMessage(text, from, "whatsapp");
      }
    } else if (body.object === "instagram") {
      const changes = body.entry?.[0]?.changes?.[0];
      const from = changes?.value?.from?.id;
      const text = changes?.value?.message || changes?.value?.text || "";
      if (from && text) {
        console.log(`💬 Instagram: ${from} → ${text}`);
        await handleMessage(text, from, "instagram");
      }
    } else if (body.object === "page") {
      const evt = body.entry?.[0]?.messaging?.[0];
      const from = evt?.sender?.id;
      const text = evt?.message?.text || "";
      if (from && text) {
        console.log(`💭 Messenger: ${from} → ${text}`);
        await handleMessage(text, from, "messenger");
      }
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Error al procesar evento:", e);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Zara 3.0 escuchando en puerto ${PORT} (IG + WSP activos)`);
});

export default app;
