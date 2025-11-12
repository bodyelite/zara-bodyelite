import express from "express";
import bodyParser from "body-parser";
import { sendMessage } from "./sendMessage.js";
import { procesarMensaje as motor_respuesta } from "./motor_respuesta_v3.js";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.entry) {
      for (const entry of body.entry) {
        const messaging = entry.messaging || [];
        for (const event of messaging) {
          const sender = event.sender?.id;
          const text = event.message?.text;
          if (!sender || !text) continue;

          // Detección fiable: IG si entry.id === IG_USER_ID; si no, WhatsApp
          const isIG = String(entry.id) === String(process.env.IG_USER_ID);
          const plataforma = isIG ? "instagram" : "whatsapp";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
