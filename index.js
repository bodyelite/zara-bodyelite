import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { responses, interpretarIntencion } from "./responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// === FETCH COMPATIBLE CON RENDER ===
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

console.log("🚀 Zara IA Body Elite activa en puerto", PORT);

// === RUTA RAÍZ ===
app.get("/", (req, res) => {
  res.status(200).send("Zara IA Body Elite en línea ✅");
});

// === VERIFICACIÓN DE META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Error de verificación de webhook");
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages[0]) {
        const msg = messages[0];
        const from = msg.from;
        const text = msg.text?.body?.toLowerCase().trim();

        console.log("💬 Mensaje recibido:", text);

        // interpretar intención y seleccionar respuesta
        const intent = interpretarIntencion(text);
        const respuesta = responses[intent]
          ? responses[intent]()
          : responses.fallback();

        await enviarMensaje(from, respuesta);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

// === FUNCIÓN DE ENVÍO ===
async function enviarMensaje(to, message) {
  try {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Error enviando mensaje:", err);
    } else {
      console.log("✅ Mensaje enviado correctamente:", message);
    }
  } catch (err) {
    console.error("❌ Error general en enviarMensaje:", err);
  }
}

// === SERVIDOR ACTIVO ===
app.listen(PORT, () => {
  console.log("✅ Your service is live 🎉");
  console.log("🌐 Disponible en: https://zara-bodyelite1.onrender.com");
});
