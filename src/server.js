import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";

dotenv.config();
const app = express();

// MEMORIA PARA EL CHAT WEB (Para que no se resetee)
const webSessions = {}; 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
    next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).send("Zara V6.0 Omnicanal (Memoria Web Activa) 🚀"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200);
    if (entry) procesarEvento(entry).catch(console.error);
  } catch (e) { console.error(e); res.sendStatus(200); }
});

app.post("/reservo-webhook", (req, res) => {
    const data = req.body;
    res.sendStatus(200);
    if (data) procesarReserva(data).catch(console.error);
});

// CHAT WEB CON MEMORIA
app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'anonimo';
        
        console.log(`💬 [WEB] ${uid}: ${message}`);

        // 1. Inicializar sesión si no existe
        if (!webSessions[uid]) {
            webSessions[uid] = { historial: [] };
        }

        // 2. Agregar mensaje del usuario al historial
        webSessions[uid].historial.push({ role: "user", content: message });
        
        // 3. Mantener historial corto (últimos 10 mensajes) para no saturar memoria
        if (webSessions[uid].historial.length > 12) {
            webSessions[uid].historial = webSessions[uid].historial.slice(-12);
        }

        // 4. Generar respuesta con contexto
        const reply = await generarRespuestaIA(webSessions[uid].historial);

        // 5. Guardar respuesta de Zara en el historial
        webSessions[uid].historial.push({ role: "assistant", content: reply });

        res.json({ response: reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Error de conexión temporal." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara Omnicanal corriendo en puerto ${PORT}`));
