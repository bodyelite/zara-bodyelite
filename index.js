import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendMessage } from "./sendMessage.js";
import { obtenerRespuesta } from "./inteligencia.js";
import { aprender } from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente.");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.text && message.from) {
        const textoUsuario = message.text.body.trim();
        const telefono = message.from;

        console.log("📩 Mensaje recibido:", textoUsuario);

        const respuesta = obtenerRespuesta(textoUsuario);
        await sendMessage(telefono, respuesta);
        console.log("💬 Respuesta enviada:", respuesta);

        // Aprendizaje automático (solo si no reconoció la frase)
        if (respuesta.includes("No entendí tu mensaje")) {
          aprender(textoUsuario, "Respuesta pendiente de definir (autoaprendizaje)");
          console.log("🧠 Frase desconocida guardada para revisión.");
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
