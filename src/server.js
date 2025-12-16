import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { OpenAI } from "openai"; // Importamos OpenAI para el chat web
import { procesarEvento, procesarReserva } from "./app.js";
// Importamos la info del negocio para el contexto del chat web
import { SYSTEM_PROMPT, TRATAMIENTOS } from "../config/knowledge_base.js";

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CONFIGURACIÓN CORS (Permite que tu web hable con el servidor)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') {
        res.sendStatus(200); 
        return; 
    }
    next();
});

app.use(bodyParser.json());

// RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.status(200).send("Zara Body Elite IA (Híbrida: WhatsApp + Web) está viva. 🚀");
});

// --- SECCIÓN WHATSAPP / INSTAGRAM (NO TOCAR) ---
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
// ------------------------------------------------

// --- NUEVA SECCIÓN: CHAT WEB (ZARA WIDGET) ---
app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        console.log(`💬 [WEB] Mensaje de ${userId || 'Anónimo'}: ${message}`);

        // Crear contexto rápido para el chat web
        const infoTratamientos = JSON.stringify(TRATAMIENTOS);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT + "\n\nINFORMACIÓN DE TRATAMIENTOS (SOLO LECTURA):\n" + infoTratamientos },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 350
        });

        const reply = completion.choices[0].message.content;
        res.json({ response: reply });

    } catch (error) {
        console.error("❌ Error en WebChat:", error);
        res.status(500).json({ 
            response: "Lo siento, tuve un pequeño parpadeo. 😵‍💫 ¿Me lo puedes repetir?", 
            error: error.message 
        });
    }
});
// ---------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara Híbrida activa en puerto ${PORT}`));
