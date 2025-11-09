import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { procesarMensaje } from "./motor_respuesta_v3.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 3000;

/* ============================================================
   VERIFICACIÓN DEL WEBHOOK (Meta)
   ============================================================ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* ============================================================
   RECEPCIÓN DE EVENTOS (WhatsApp + Instagram)
   ============================================================ */
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // WhatsApp
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      if (message && message.text) {
        const from = message.from;
        const texto = message.text.body;
        console.log(`📲 WhatsApp: ${from} → ${texto}`);
        const respuesta = await procesarMensaje(from, texto);
        await enviarMensaje(from, respuesta, "whatsapp");
        await registrarEnMonitor(from, texto, respuesta, "whatsapp");
      }
    }

    // Instagram
    else if (body.object === "instagram") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const from = changes?.value?.from?.id;
      const message = changes?.value?.message || changes?.value?.text;
      if (message) {
        console.log(`💬 Instagram: ${from} → ${message}`);
        const respuesta = await procesarMensaje(from, message);
        await enviarMensaje(from, respuesta, "instagram");
        await registrarEnMonitor(from, message, respuesta, "instagram");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando webhook:", err);
    res.sendStatus(500);
  }
});

/* ============================================================
   ENVÍO DE MENSAJES A META (WhatsApp / Instagram)
   ============================================================ */
async function enviarMensaje(to, text, canal) {
  try {
    let url, payload;

    if (canal === "whatsapp") {
      url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
      payload = {
        messaging_product: "whatsapp",
        to,
        text: { body: text },
      };
    } else if (canal === "instagram") {
      url = `https://graph.facebook.com/v17.0/${to}/messages`;
      payload = {
        recipient: { id: to },
        message: { text },
      };
    }

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`✅ Mensaje enviado por ${canal.toUpperCase()} → ${to}`);
  } catch (e) {
    console.error("⚠️ Error enviando mensaje:", e);
  }
}

/* ============================================================
   REGISTRO EN MONITOR
   ============================================================ */
async function registrarEnMonitor(from, texto, respuesta, canal) {
  try {
    await fetch("https://zara-monitor-2-1.onrender.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        canal,
        from,
        texto,
        respuesta,
        estado: "recibido",
      }),
    });
  } catch (err) {
    console.error("⚠️ Error registrando en monitor:", err);
  }
}

/* ============================================================
   SERVIDOR ACTIVO
   ============================================================ */
app.listen(PORT, () => {
  console.log(`✅ Zara 3.0 corriendo en puerto ${PORT} (IG + WSP activos)`);
});
