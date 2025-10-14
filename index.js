// index.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { generarRespuesta, saludoInicial } from "./responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ---------------------------------------------------------------------------
// WEBHOOK GET (verificación)
// ---------------------------------------------------------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Verificación del webhook fallida");
    res.sendStatus(403);
  }
});

// ---------------------------------------------------------------------------
// WEBHOOK POST (recepción de mensajes desde Meta)
// ---------------------------------------------------------------------------
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.text && message.from) {
        const numeroCliente = message.from.replace(/\D/g, "");
        const texto = message.text.body;
        console.log(`📩 Mensaje recibido de ${numeroCliente}: ${texto}`);

        const respuesta = await generarRespuesta(texto, numeroCliente);
        await enviarMensaje(numeroCliente, respuesta);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error en webhook POST:", error);
    res.sendStatus(500);
  }
});

// ---------------------------------------------------------------------------
// ENVÍO DE MENSAJES (usado tanto por Zara como por avisos internos)
// ---------------------------------------------------------------------------
async function enviarMensaje(destino, texto) {
  try {
    const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
    const body = {
      messaging_product: "whatsapp",
      to: destino,
      text: { body: texto }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Error al enviar mensaje:", err);
    } else {
      console.log(`✅ Mensaje enviado a ${destino}`);
    }
  } catch (error) {
    console.error("⚠️ Fallo en enviarMensaje:", error);
  }
}

// ---------------------------------------------------------------------------
// ENDPOINT RAÍZ
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Zara IA ejecutándose correctamente para Body Elite 🚀");
});

// ---------------------------------------------------------------------------
// PUERTO DE EJECUCIÓN
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("////////////////////////////////////////////////////////");
  console.log(`⚡ Zara IA ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Disponible en Render: ${process.env.RENDER_EXTERNAL_URL || "URL no definida"}`);
  console.log("////////////////////////////////////////////////////////");
});
