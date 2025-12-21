import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { procesarEvento } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { leerChats, registrar } from "./utils/memory.js";
import { NEGOCIO } from "./config/negocio.js";

dotenv.config();
const app = express();
const sesionesWeb = {};

app.use(cors());
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
    else res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        if (body.object && body.entry) {
            body.entry.forEach(entry => procesarEvento(entry).catch(console.error));
        }
    } catch (e) { console.error(e); }
});

app.post("/webchat", async (req, res) => {
    const { message, userId } = req.body;
    const uid = userId || 'invitado_web';
    
    if (!sesionesWeb[uid]) sesionesWeb[uid] = [];
    sesionesWeb[uid].push({ role: "user", content: message });
    registrar(uid, "Visitante Web", message, "usuario", "web");

    const rawReply = await generarRespuestaIA(sesionesWeb[uid].slice(-10), "Amiga");
    const cleanReply = rawReply.replace(/{.*?}/g, "").trim();
    
    sesionesWeb[uid].push({ role: "assistant", content: cleanReply });
    registrar(uid, "Zara", cleanReply, "zara", "web");

    res.json({ 
        response: cleanReply, 
        link: NEGOCIO.agenda_link 
    });
});

app.get("/api/chats", (req, res) => res.json(leerChats()));

app.get("/monitor", (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>Zara Monitor</title><meta http-equiv="refresh" content="5"></head><body><h1>Zara 5.0 Activa</h1><p>Monitor funcionando. Usa el endpoint /api/chats para ver datos JSON o implementa el frontend completo.</p></body></html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 LIVE - PORT ${PORT}`));
