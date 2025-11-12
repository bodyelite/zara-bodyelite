import express from "express";
import bodyParser from "body-parser";
import { sendMessage } from "./sendMessage.js";
import { procesarMensaje as motor_respuesta } from "./motor_respuesta_v3.js";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Verificación Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

// Webhook principal
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.entry) {
      for (const entry of body.entry) {
        const messaging = entry.messaging || [];
        for (const event of messaging) {
          const sender = event.sender?.id;
          const text = event.message?.text;

          // Procesa solo mensajes de texto
          if (!sender || !text) continue;

          // Detección robusta de plataforma:
          // - WhatsApp: sender es número (8-15 dígitos, suele iniciar con código país)
          // - IG/Messenger: sender es PSID (no es SOLO dígitos o no parece número telefónico)
          const isWhatsApp = /^\d{8,15}$/.test(sender);
          const plataforma = isWhatsApp ? "whatsapp" : "instagram";

          console.log(`📥 ${plataforma.toUpperCase()} <- ${sender}: ${text}`);

          const respuesta = await motor_respuesta(sender, text);
          if (respuesta) await sendMessage(sender, respuesta, plataforma);
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
