import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";

dotenv.config();
const app = express();

// CONFIGURACIÓN CORS (VERSIÓN 2.0: SOLUCIÓN AL PREFLIGHT DE RESERVO)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') {
        // Respuesta OK (200) para peticiones de precarga (preflight)
        res.sendStatus(200); 
        return; 
    }
    next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Zara Body Elite IA está en vivo.");
});

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200);
    if (entry) procesarEvento(entry).catch(err => console.error("❌ Meta Event Error:", err));
  } catch (e) { console.error(e); res.sendStatus(200); }
});

app.post("/reservo-webhook", (req, res) => {
  try {
    console.log("📥 [SERVER] POST /reservo-webhook recibido");
    const data = req.body;
    res.sendStatus(200);
    if (data) {
      procesarReserva(data).catch(err => console.error("❌ Reservo Logic Error:", err));
    }
  } catch (e) { console.error("❌ Server Reservo Error:", e); res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara activa en puerto ${PORT}`));
