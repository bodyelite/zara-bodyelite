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
  if (mode && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") return res.sendStatus(404);

    const entry = body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    const senderId = message?.from;
    const texto = message?.text?.body?.toLowerCase();
    if (!senderId || !texto) return res.sendStatus(200);

    console.log("Mensaje recibido:", texto);

    const respuestaMemoria = buscarRespuesta(texto);
    let respuesta = respuestaMemoria;

    if (!respuesta) {
      if (texto.includes("hola") || texto.includes("buenas")) {
        respuesta = "👋 ¡Hola! Soy Zara IA de Body Elite. ¿Deseas una evaluación facial o corporal sin costo?";
      } else if (texto.includes("muslo") || texto.includes("abdomen") || texto.includes("flacidez") || texto.includes("celulitis")) {
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
    }

    await enviarMensaje(senderId, respuesta);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

async function enviarMensaje(senderId, mensaje) {
  try {
    const texto = String(mensaje || "").trim() || " ";
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: senderId,
      type: "text",
      text: {
        preview_url: false,
        body: texto
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Mensaje enviado con texto:", texto);
    console.log("Respuesta Meta:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
}

app.listen(PORT, () => console.log(`🚀 Zara corriendo en puerto ${PORT}`));

