import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento } from "./app.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    
    // 🔥 SOLUCIÓN DUPLICADOS:
    // Respondemos 200 OK inmediatamente a Meta, sin esperar a la IA.
    res.sendStatus(200);

    // Procesamos el mensaje en "segundo plano"
    if (entry) {
      procesarEvento(entry).catch(err => console.error("❌ Error procesando evento:", err));
    }
    
  } catch (e) { 
    console.error(e); 
    // Si falló el parsing inicial, igual respondemos 200 para que no reintente
    res.sendStatus(200); 
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara activa en puerto ${PORT}`));
