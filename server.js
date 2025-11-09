import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { procesarMensaje } from "./motor_respuesta_v3.js";

const app = express();
app.use(bodyParser.json());

const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

/* ============================================================
   VERIFICACIÓN DEL WEBHOOK (WhatsApp + Instagram)
   ============================================================ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* ============================================================
   RECEPCIÓN DE MENSAJES (unifica WhatsApp + Instagram)
   ============================================================ */
app.post("/webhook", async (req, res) => {
  try {
    // Debug completo del evento
    console.log("🧩 Webhook completo IG/WSP:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text =
      message.text?.body ||
      message.message?.text ||
      message.message?.body ||
      message.message ||
      "";
    const product =
      message.messaging_product || value.messaging_product || "unknown";

    console.log(`📩 Mensaje recibido (${product}):`, text);

    const respuesta = await procesarMensaje(from, text);
    console.log("🤖 Respuesta generada:", respuesta);

    await enviarMensaje(product, from, respuesta);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

/* ============================================================
   ENVÍO UNIFICADO (WhatsApp + Instagram)
   ============================================================ */
async function enviarMensaje(product, to, text) {
  try {
    let url, body;

    if (product === "whatsapp") {
      url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
      body = {
        messaging_product: "whatsapp",
        to,
        text: { body: text },
      };
    } else {
      // Envío para Instagram
      url = `https://graph.facebook.com/v18.0/me/messages`;
      body = {
        recipient: { id: to },
        message: { text },
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("📤 Respuesta API Meta:", data);
  } catch (e) {
    console.error("⚠️ Error enviando mensaje:", e);
  }
}

/* ============================================================
   SERVIDOR ACTIVO
   ============================================================ */
app.listen(PORT, () => {
  console.log(`✅ Zara 3.0 escuchando en puerto ${PORT} (IG + WSP activos)`);
});
