import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendMessage } from "./sendMessage.js";
import { procesarMensaje as motor_respuesta } from "./motor_respuesta_v3.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// --- VERIFICACIÓN DEL WEBHOOK ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- WEBHOOK PRINCIPAL PARA META (WHATSAPP + INSTAGRAM) ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const value = body.entry[0].changes[0].value;
      const messages = value.messages;
      const metadata = value.metadata || {};
      const platform = metadata.display_phone_number ? "whatsapp" : "instagram";

      for (const msg of messages) {
        const from = msg.from;
        const text = msg.text?.body;

        if (text) {
          console.log(`📥 Mensaje recibido (${platform}) de ${from}: ${text}`);
          const respuesta = await motor_respuesta(from, text);
          if (respuesta) {
            await sendMessage(from, respuesta, platform);
          } else {
            console.log("⚠️ motor_respuesta no devolvió texto");
          }
        }
      }
    } else {
      console.log("⚠️ No se detectaron mensajes válidos en el body:", JSON.stringify(body, null, 2));
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
