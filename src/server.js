import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";

dotenv.config();
const app = express();

// --- CORRECCIÓN CRÍTICA: CORS (Permisos para Reservo) ---
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permitir conexión desde cualquier web (Reservo)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Responder OK al chequeo previo del navegador
    }
    next();
});

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

// Webhook Reservo (Ahora acepta cualquier estructura para debug)
app.post("/reservo-webhook", (req, res) => {
  try {
    console.log("📥 [SERVER] POST /reservo-webhook recibido"); // Log de entrada
    const data = req.body;
    
    // Respondemos rápido para que Reservo no de timeout
    res.sendStatus(200);

    // Pasamos todo a app.js
    if (data) {
      procesarReserva(data).catch(err => console.error("❌ Reservo Logic Error:", err));
    }
  } catch (e) { console.error("❌ Server Reservo Error:", e); res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara activa en puerto ${PORT}`));
