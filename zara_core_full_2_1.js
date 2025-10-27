import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";
import { generarRespuesta } from "./respuestas.js";

const app = express();
app.use(bodyParser.json());

const token = process.env.PAGE_ACCESS_TOKEN;
const verifyToken = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

const LOG_WSP = "./logs_wsp.json";

// === FUNCIÓN PARA ENVIAR MENSAJES A META ===
async function enviarMensaje(to, text) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          text: { body: text }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) console.error("❌ Error al enviar mensaje:", data);
  } catch (error) {
    console.error("❌ Error en enviarMensaje:", error);
  }
}

// === VERIFICACIÓN WEBHOOK META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (mode && verify_token === verifyToken) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const msg = changes?.value?.messages?.[0];

    if (!msg || !msg.from || !msg.text) {
      return res.sendStatus(200);
    }

    const from = msg.from;
    const texto = msg.text.body.toLowerCase().trim();

    // Mensaje base genérico
    const base = "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar hoy?";
    // Genera la respuesta usando el módulo inteligente
    const respuesta = generarRespuesta(texto, base);

    // Guarda log local
    const log = {
      fecha: new Date().toISOString(),
      canal: "wsp",
      from,
      texto,
      respuesta,
      status: "nuevo"
    };
    fs.appendFileSync(LOG_WSP, JSON.stringify(log) + ",\n");

    // Envía respuesta al usuario
    await enviarMensaje(from, respuesta);
    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Error webhook:", error);
    res.sendStatus(500);
  }
});

// === ENDPOINT DE LOGS PARA EL MONITOR ===
app.get("/logs", (req, res) => {
  try {
    const contenido = fs.readFileSync(LOG_WSP, "utf8");
    const mensajes = "[" + contenido.replace(/,\s*$/, "") + "]";
    res.setHeader("Content-Type", "application/json");
    res.send(mensajes);
  } catch {
    res.send("[]");
  }
});

// === INICIO DEL SERVIDOR ===
app.listen(PORT, () => {
  console.log(`✅ Zara IA 2.1 activa en puerto ${PORT}`);
});
