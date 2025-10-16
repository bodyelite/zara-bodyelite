import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { aprender, buscarRespuesta } from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 10000;

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

app.post("/webhook", async (req, res) => {
  const body = req.body;
  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const senderId = message?.from;
    const texto = message?.text?.body?.toLowerCase();

    if (senderId && texto) {
      console.log("Mensaje recibido:", texto);

      const respuestaMemoria = buscarRespuesta(texto);
      if (respuestaMemoria) {
        await enviarMensaje(senderId, respuestaMemoria);
        res.sendStatus(200);
        return;
      }

      let respuesta = "";

      if (texto.includes("hola") || texto.includes("buenas")) {
        respuesta = "👋 ¡Hola! Soy Zara IA de Body Elite. ¿Deseas una evaluación facial o corporal sin costo?";
      } else if (texto.includes("muslo") || texto.includes("abdomen") || texto.includes("flacidez")) {
        respuesta = "💧 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. ¿Sobre qué te gustaría saber?";
      } else if (texto.startsWith("aprender ")) {
        const partes = texto.split(" ");
        const clave = partes[1];
        const valor = partes.slice(2).join(" ");
        aprender(clave, valor);
        respuesta = "He guardado tu aprendizaje.";
      } else {
        respuesta = "Puedo ayudarte con tratamientos, precios o agenda. ¿Sobre qué tema quieres saber más?";
      }

      await enviarMensaje(senderId, respuesta);
      res.sendStatus(200);
      return;
    }
  }
  res.sendStatus(404);
});

async function enviarMensaje(senderId, mensaje) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: senderId,
      text: { body: mensaje },
    };

    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await respuesta.json();
    console.log("Mensaje enviado:", data);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Zara corriendo en puerto ${PORT}`);
});
