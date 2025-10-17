import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { generarRespuesta, manejarWebhookReservo, registrarClickAgenda } from "./responses.js";

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

// -------- WHATSAPP VERIFY --------
app.get("/webhook", (req, res) => {
  const verify = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (verify === process.env.VERIFY_TOKEN) res.send(challenge);
  else res.sendStatus(403);
});

// -------- MENSAJES DE WHATSAPP --------
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (entry && entry.text) {
      const from = entry.from;
      const texto = entry.text.body;
      console.log("Mensaje recibido:", texto);

      const respuesta = generarRespuesta(texto);

      const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
      const headers = {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      };
      await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: respuesta },
        }),
      });

      console.log("✅ Respuesta enviada:", respuesta);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

// -------- CLICK TRACKING --------
app.get("/agenda", registrarClickAgenda);

// -------- CONFIRMACIÓN RESERVA --------
app.post("/reservowebhook", manejarWebhookReservo);

// -------- SERVIDOR --------
app.listen(PORT, () => {
  console.log(`✅ Zara Body Elite activa en puerto ${PORT}`);
});
