import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
    next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).send("Zara V5.0 Omnicanal Activa"));

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

app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const reply = await generarRespuestaIA([{ role: "user", content: message }]);
        res.json({ response: reply });
    } catch (error) {
        res.status(500).json({ response: "Error de conexión." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara Omnicanal corriendo en puerto ${PORT}`));
