// index.js — versión estable (mantiene compatibilidad con Meta)

import express from "express";
import bodyParser from "body-parser";
import { getResponse } from "./responses.js";

const app = express();
app.use(bodyParser.json());

// Webhook principal
app.post("/webhook", (req, res) => {
  try {
    let msg = req.body.message;
    if (msg && typeof msg === "object" && msg.text) msg = msg.text;
    if (typeof msg !== "string") msg = String(msg || "");

    msg = msg.toLowerCase();

    const intent = "default";
    const reply = getResponse(intent, msg);

    res.json({ reply });
  } catch (err) {
    console.error("Error webhook:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta base
app.get("/", (req, res) => {
  res.send("🤖 Zara Body Elite conectado y escuchando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});
