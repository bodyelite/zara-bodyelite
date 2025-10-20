import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";
import inteligencia from "./inteligencia.js";
import sendMessage from "./sendMessage.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Zara IA activa y operativa");
});

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

app.listen(3000, () => console.log("Zara IA ejecutándose en puerto 3000"));
