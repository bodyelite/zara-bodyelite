import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js"; 
import { NEGOCIO } from "./config/knowledge_base.js";

dotenv.config();
const app = express();
const webSessions = {}; 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
    next();
});
app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).send("Zara V8.0 Omnicanal Activa"));

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
        const uid = userId || 'anonimo';

        const telefonoMatch = message.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/);
        if (telefonoMatch) {
            const fono = telefonoMatch[0].replace(/\D/g, '');
            const alerta = `🚨 *SOLICITUD LLAMADA (DESDE WEB)* 🚨\n👤 Cliente Web\n📞 ${fono}`;
            for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
        }

        if (!webSessions[uid]) webSessions[uid] = { historial: [] };
        webSessions[uid].historial.push({ role: "user", content: message });
        if (webSessions[uid].historial.length > 12) webSessions[uid].historial = webSessions[uid].historial.slice(-12);

        let reply = await generarRespuestaIA(webSessions[uid].historial);
        webSessions[uid].historial.push({ role: "assistant", content: reply });

        let showButton = false;
        let buttonLink = "";
        
        if (reply.includes("agendamiento.reservo.cl") || (reply.toLowerCase().includes("link") && reply.toLowerCase().includes("agenda"))) {
            showButton = true;
            buttonLink = NEGOCIO.agenda_link;
            reply = reply.replace(NEGOCIO.agenda_link, "").replace("https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9", "");
        }

        res.json({ response: reply, button: showButton, link: buttonLink });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Error de conexión temporal." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara corriendo en puerto ${PORT}`));
