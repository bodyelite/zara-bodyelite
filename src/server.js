import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Verificación Meta
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

// Mensajes Meta
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200);
    if (entry) procesarEvento(entry).catch(err => console.error("❌ Meta Event Error:", err));
  } catch (e) { console.error(e); res.sendStatus(200); }
});

// Webhook Reservo
app.post("/reservo-webhook", (req, res) => {
  try {
    const data = req.body;
    res.sendStatus(200);
    if (data && (data.clientName || data.contactPhone)) {
      procesarReserva(data).catch(err => console.error("❌ Reservo Error:", err));
    }
  } catch (e) { console.error(e); res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara activa en puerto ${PORT}`));
