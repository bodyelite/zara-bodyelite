import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";
import inteligencia from "./inteligencia.js";
import sendMessage from "./sendMessage.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Verificación de Meta
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN || "ZARA_TOKEN_VERIFICACION";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verifyToken) {
    console.log("✅ Verificación de webhook confirmada");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Endpoint de mensajes entrantes
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body || "";
        console.log("Mensaje recibido:", text);

        const respuesta = await inteligencia.analizarMensaje(text);
        await sendMessage(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error procesando mensaje:", error.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("✅ Zara IA ejecutándose en puerto 3000"));
