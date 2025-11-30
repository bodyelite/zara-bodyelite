import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// 👇 AQUÍ ESTÁ EL CAMBIO: Conectamos con la Nueva Arquitectura
import { procesarEvento } from "./app.js"; 

dotenv.config();
const app = express();
app.use(bodyParser.json());

// VERIFY TOKEN (Para conectar con Meta)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    
    // Respondemos 200 OK de inmediato a Meta para evitar duplicados
    res.sendStatus(200);

    // Procesamos el evento en segundo plano con la NUEVA Lógica
    if (entry) {
      procesarEvento(entry).catch(err => console.error("❌ Error en lógica Zara:", err));
    }

  } catch (e) {
    console.error("❌ Error crítico servidor:", e);
    // Si no respondimos antes, respondemos ahora para no bloquear
    if (!res.headersSent) res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ZARA 4.0 (CEREBRO NUEVO) activa en puerto ${PORT}`));
