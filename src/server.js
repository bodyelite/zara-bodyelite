import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// 👇 AQUÍ ESTÁ LA CLAVE: Conectamos con la IA, no con el motor viejo
import { procesarEvento } from "./app.js"; 

dotenv.config();
const app = express();
app.use(bodyParser.json());

// VERIFICACIÓN DE META
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

// RECEPCIÓN DE MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200); // Responder rápido a Meta

    if (entry) {
      // Enviamos el mensaje a la IA (app.js)
      procesarEvento(entry).catch(err => console.error("❌ Error en IA:", err));
    }
  } catch (e) {
    console.error("❌ Error servidor:", e);
    if (!res.headersSent) res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ZARA IA ACTIVA en puerto ${PORT}`));
