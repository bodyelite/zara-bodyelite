import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { obtenerRespuesta, responses } from "./responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// --- LOG DE INICIO ---
console.log("🚀 Zara IA Body Elite activa en puerto", PORT);

// --- RUTA PRINCIPAL ---
app.get("/", (req, res) => {
  res.status(200).send("Zara IA Body Elite en línea ✅");
});

// --- VERIFICACIÓN DE WEBHOOK ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Error en la verificación del webhook");
    res.sendStatus(403);
  }
});

// --- RECEPCIÓN DE MENSAJES ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages[0]) {
        const msg = messages[0];
        const from = msg.from; // número del cliente
        const text = msg.text?.body;

        console.log("💬 Mensaje recibido de", from + ":", text);

        const respuesta = obtenerRespuesta(text);

        if (!respuesta) {
          console.log("⚠️ No se generó respuesta, usando fallback");
          await enviarMensaje(from, responses.fallback());
        } else {
          await enviarMensaje(from, respuesta);
        }
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

// --- FUNCIÓN: ENVIAR MENSAJE ---
async function enviarMensaje(to, message) {
  try {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    };

    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error("❌ Error enviando mensaje:", err);
    } else {
      console.log("✅ Mensaje enviado a", to, ":", message);
    }
  } catch (err) {
    console.error("❌ Error general al enviar mensaje:", err);
  }
}

// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log(`✅ Your service is live 🎉`);
  console.log(`🌐 Available at: https://zara-bodyelite1.onrender.com`);
});
