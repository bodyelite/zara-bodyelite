import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendMessage } from "./sendMessage.js";
import { analizarMensaje } from "./inteligencia.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body;
      if (from && text) {
        console.log("Mensaje recibido:", text);
        const respuesta = await analizarMensaje(text);
        await sendMessage(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
