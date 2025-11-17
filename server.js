import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendMessage } from "./sendMessage.js";
import { procesarMensaje } from "./motor_respuesta_v3.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// VERIFY TOKEN
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    // Detectar plataforma
    const plataforma =
      String(entry.id) === String(process.env.IG_USER_ID)
        ? "instagram"
        : "whatsapp";

    // WhatsApp Cloud API
    const msg = entry.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    const from = msg.from;
    const texto =
      msg.text?.body ||
      msg.button?.text ||
      msg.interactive?.button_reply?.title ||
      "";

    if (!from || !texto) return res.sendStatus(200);

    console.log(`📥 Mensaje recibido de ${from} (${plataforma}): ${texto}`);

    // Procesar mensaje
    const respuesta = await procesarMensaje(texto, plataforma);

    if (respuesta) {
      await sendMessage(from, respuesta, plataforma);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor activo en puerto ${PORT}`)
);
