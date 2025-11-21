import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { procesarMensaje } from "./motor_respuesta_v3.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_ID;

// ======================================================
// VERIFICACIÓN DEL WEBHOOK
// ======================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ======================================================
// RECEPCIÓN DE MENSAJES (POST)
// ======================================================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    if (!value) return;

    // Meta cambia contenedores constantemente → normalizamos
    const messages =
      value.messages ||
      value.message ||
      value.text ||
      value.interactive ||
      value.button ||
      null;

    if (!messages || !messages[0]) return;

    const msg = messages[0];

    // ======================================================
    // EXTRACCIÓN UNIVERSAL DE TEXTO
    // ======================================================
    const texto =
      msg.text?.body ||                                        // Mensaje tradicional
      msg.body ||                                              // Simple text
      msg.interactive?.button_reply?.title ||                  // Botón
      msg.interactive?.list_reply?.title ||                    // Lista
      msg.button?.text ||                                     // Respuesta tipo botón
      null;

    if (!texto) return;

    const from = msg.from;
    if (!from) return;

    console.log("MENSAJE RECIBIDO:", texto);

    // PROCESAR
    const respuesta = procesarMensaje(texto, from, "wsp");

    // RESPONDER
    await enviarMensajeWhatsApp(from, respuesta);

  } catch (err) {
    console.error("ERROR EN WEBHOOK:", err);
  }
});

// ======================================================
// ENVÍO DE MENSAJES
// ======================================================
async function enviarMensajeWhatsApp(to, body) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: String(body) }
    };

    console.log("RESPUESTA ENVIADA:", body);

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("ERROR AL ENVIAR:", err);
  }
}

// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor Zara activo en puerto", PORT);
});