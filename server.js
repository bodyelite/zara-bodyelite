import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import motor from "./motor_respuesta_v3.js";   // <── CAMBIO CLAVE

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Variables desde Render
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ============================
// Endpoint básico para prueba
// ============================
app.get("/", (req, res) => {
  res.status(200).send("Zara 2.1 corriendo en puerto 3000");
});

// ============================
// Verificación Webhook (GET)
// ============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ============================
// Webhook WhatsApp (POST)
// ============================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const mensaje = value?.messages?.[0];
      const texto = mensaje?.text?.body;
      const usuario = mensaje?.from;

      if (texto && usuario) {
        console.log("MENSAJE RECIBIDO:", texto);

        // Motor nuevo usa motor(texto, usuario)
        const respuesta = motor(texto, usuario);

        console.log("RESPUESTA GENERADA:", respuesta);

        if (respuesta) {
          await enviarMensajeWhatsApp(usuario, respuesta);
        }
      }
      return res.sendStatus(200);
    }

    return res.sendStatus(404);
  } catch (error) {
    console.error("Error en webhook:", error);
    return res.sendStatus(500);
  }
});

// ============================
// Envío de mensaje a WhatsApp
// ============================
async function enviarMensajeWhatsApp(to, body) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: String(body) }
    };

    console.log("RESPUESTA ENVIADA:", body);

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Error al enviar mensaje a WhatsApp:", err);
  }
}

// ============================
// Levantar servidor
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Zara 2.1 corriendo en puerto " + PORT);
});
