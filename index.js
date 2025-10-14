import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import { generarRespuesta } from "./responses.js";
import { detectarIntencion } from "./intents.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// === Enviar mensaje al cliente ===
async function enviarMensaje(numero, texto) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to: numero,
    text: { body: texto },
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Error al enviar mensaje:", error.message);
  }
}

// === Enviar aviso interno ===
async function enviarAvisoInterno(numeroCliente, mensajeCliente) {
  const fecha = new Date().toISOString();
  const aviso = `📅 Nuevo interesado en agendar evaluación.\nFecha: ${fecha}\nNúmero: ${numeroCliente}\nMensaje: ${mensajeCliente}`;
  const internos = ["56931720760", "56983300262", "56937648536"];

  for (const interno of internos) {
    await enviarMensaje(interno, aviso);
  }

  // === Registrar evento en log JSON ===
  const registro = {
    fecha,
    cliente: numeroCliente,
    mensaje: mensajeCliente,
    tipo: "agenda",
  };

  const logPath = "./logs/agenda.log";
  try {
    fs.mkdirSync("./logs", { recursive: true });
    const contenido = fs.existsSync(logPath)
      ? JSON.parse(fs.readFileSync(logPath, "utf8") || "[]")
      : [];
    contenido.push(registro);
    fs.writeFileSync(logPath, JSON.stringify(contenido, null, 2));
  } catch (error) {
    console.error("Error al guardar log:", error.message);
  }
}

// === Webhook de recepción ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const numero = message.from;
    const texto = message.text?.body || "";
    const intencion = detectarIntencion(texto);
    const respuesta = await generarRespuesta(intencion, texto);

    await enviarMensaje(numero, respuesta);

    if (intencion === "agendar") {
      await enviarAvisoInterno(numero, texto);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error.message);
    res.sendStatus(500);
  }
});

// === Verificación META ===
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Zara IA activa en puerto ${PORT}`));
