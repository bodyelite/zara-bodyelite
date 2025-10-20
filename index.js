import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendMessage } from "./sendMessage.js";
import { interpretarMensaje } from "./interpretador.js";
import { obtenerRespuesta } from "./inteligencia.js";
import { generarRespuesta } from "./respuestas.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (message?.text?.body && message?.from) {
      const from = message.from;
      const texto = message.text.body.trim().toLowerCase();
      console.log("Mensaje recibido:", texto);

      const interpretacion = interpretarMensaje(texto);
      const respuestaIA = obtenerRespuesta(interpretacion);
      const respuestaFinal = generarRespuesta(texto, respuestaIA);

      await sendMessage(from, respuestaFinal);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al procesar webhook:", error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
