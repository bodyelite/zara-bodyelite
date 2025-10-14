// index.js
// Servidor principal de Zara IA (Body Elite)
// No se modifican conexiones ni variables de entorno

import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { generarRespuesta } from "./responses.js"; // <--- corrección aquí

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook de verificación
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verificación fallida.");
    res.sendStatus(403);
  }
});

// Recepción de mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
    const message = body.entry[0].changes[0].value.messages[0];
    const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
    const from = message.from;
    const msgBody = message.text?.body || "";

    console.log("📩 Mensaje recibido de:", from, "→", msgBody);

    try {
      // Generar respuesta con comprensión avanzada
      const respuesta = await generarRespuesta(msgBody, PAGE_ACCESS_TOKEN, from);

      if (respuesta && respuesta.trim() !== "") {
        await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: respuesta }
          })
        });
        console.log("✅ Respuesta enviada correctamente a", from);
      } else {
        console.log("⚠️ No se generó respuesta para:", msgBody);
      }
    } catch (error) {
      console.error("❌ Error procesando mensaje:", error);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Puerto dinámico (Render usa process.env.PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Zara IA ejecutándose en puerto ${PORT}`);
});
