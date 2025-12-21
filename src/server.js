import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { pensar } from "./core/brain.js";
import { guardarMensaje, leerDB } from "./core/memory.js";
import { procesarEtiquetas } from "./core/tags.js";
import { enviarMensaje, obtenerNombreIG } from "./channels/meta.js";
import { NEGOCIO } from "./config/business.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processedIds = new Set();

app.get('/monitor', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/monitor.html'));
});

app.get('/api/stats', (req, res) => res.json(leerDB()));

app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
    else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        
        if (body.object === "whatsapp_business_account") {
            const entry = body.entry?.[0]?.changes?.[0]?.value;
            if (entry?.messages?.[0]) {
                const msg = entry.messages[0];
                if (processedIds.has(msg.id)) return;
                processedIds.add(msg.id);
                setTimeout(() => processedIds.delete(msg.id), 60000);

                const senderId = msg.from;
                const text = msg.text?.body;
                const name = entry.contacts?.[0]?.profile?.name || "Amiga WSP";
                
                if(text) await procesarNucleo(senderId, name, text, "whatsapp");
            }
        }
        else if (body.object === "instagram") {
            const entry = body.entry?.[0];
            const messaging = entry?.messaging?.[0];
            if (messaging && messaging.message && !messaging.message.is_echo && !messaging.delivery && !messaging.read) {
                const msgId = messaging.message.mid;
                if (processedIds.has(msgId)) return;
                processedIds.add(msgId);
                setTimeout(() => processedIds.delete(msgId), 60000);

                const senderId = messaging.sender.id;
                const text = messaging.message.text;
                const name = await obtenerNombreIG(senderId);
                
                if(text) await procesarNucleo(senderId, name, text, "instagram");
            }
        }
    } catch (e) { console.error(e); }
});

app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'web_guest';
        const respuesta = await procesarNucleo(uid, "Visitante Web", message, "web", true);
        res.json({ response: respuesta, link: NEGOCIO.agenda_link });
    } catch (e) {
        res.status(500).json({ error: "Internal Error" });
    }
});

async function procesarNucleo(id, nombre, textoUsuario, plataforma, esWeb = false) {
    try {
        const historial = guardarMensaje(id, nombre, textoUsuario, "user", plataforma);
        const respuestaRaw = await pensar(historial, nombre, plataforma === "instagram" ? "(IG)" : "");
        const { texto, estado } = procesarEtiquetas(respuestaRaw, id, nombre, plataforma);
        guardarMensaje(id, nombre, texto, "zara", plataforma, estado);
        
        if (!esWeb) {
            await enviarMensaje(id, texto, plataforma);
        }
        return texto;
    } catch (e) {
        console.error(e);
        return "Dame un segundo 😅.";
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 LIVE PORT ${PORT}`));
