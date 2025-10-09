import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 🔹 Token de verificación (debe coincidir con el que pusiste en Meta)
const VERIFY_TOKEN = "zara-bodyelite-token";

// ✅ Ruta GET para verificación inicial de Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente ✅");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Error de verificación del webhook");
    res.sendStatus(403);
  }
});

// ✅ Ruta POST para recibir mensajes de WhatsApp
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("🔔 Nuevo evento recibido de Meta:", JSON.stringify(body, null, 2));

  if (body.object) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zara Body Elite activa en puerto ${PORT}`));
