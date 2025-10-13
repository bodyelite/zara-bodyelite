// index.js
// Servidor principal de Zara IA (Body Elite) - versión estable

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import generarRespuesta from "./responses.js"; // <-- Importación corregida
import fs from "fs";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// ---------------------------------------------------
// Verificación Webhook
// ---------------------------------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ---------------------------------------------------
// Recepción de mensajes
// ---------------------------------------------------
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message && message.type === "text") {
        const from = message.from;
        const text = message.text.body;
        console.log(`📩 Mensaje recibido de ${from}: ${text}`);

        const respuesta = await generarRespuesta(from, text);

        if (!respuesta) {
          console.log("⚠️ No se generó respuesta para el mensaje recibido.");
          return res.sendStatus(200);
        }

        // Diferenciar entre respuestas de texto e interactivas
        let payload;
        if (typeof respuesta === "string") {
          payload = {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: respuesta },
          };
        } else {
          payload = {
            messaging_product: "whatsapp",
            to: from,
            type: respuesta.type,
            interactive: respuesta.interactive,
          };
        }

        await fetch(`https://graph.facebook.com/v18.0/840360109156943/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("✅ Respuesta enviada correctamente a", from);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

// ---------------------------------------------------
// Inicio del servidor
// ---------------------------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Zara IA ejecutándose en puerto ${PORT}`);
});

export default app;
