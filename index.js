// index.js — versión definitiva sin errores de msg.toLowerCase

import express from "express";
import bodyParser from "body-parser";
import { getResponse } from "./responses.js";

const app = express();
app.use(bodyParser.json());

// Webhook principal
app.post("/webhook", (req, res) => {
  try {
    // Captura y valida mensaje recibido
    const rawMsg = req.body.message;
    let msg = "";

    if (typeof rawMsg === "string") msg = rawMsg.toLowerCase();
    else if (rawMsg && typeof rawMsg.text === "string") msg = rawMsg.text.toLowerCase();
    else msg = String(rawMsg || "").toLowerCase();

    // Procesa respuesta
    const intent = "default";
    const reply = getResponse(intent, msg);

    res.json({ reply });
  } catch (err) {
    console.error("Error webhook:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Endpoint base
app.get("/", (req, res) => {
  res.send("🤖 Zara AI Body Elite activo y estable ✅");
});

// Inicialización
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zara bot corriendo correctamente en puerto ${PORT}`);
});
