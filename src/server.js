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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

const processedIds = new Set();

app.get('/monitor', (req, res) => res.sendFile(path.join(__dirname, '../public/monitor.html')));
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
            const changes = body.entry?.[0]?.changes?.[0]?.value;
            if (changes?.messages?.[0]) {
                const msg = changes.messages[0];
                if (processedIds.has(msg.id)) return;
                processedIds.add(msg.id);
                setTimeout(() => processedIds.delete(msg.id), 60000);

                const senderId = msg.from;
                const text = msg.text?.body;
                const name = changes.contacts?.[0]?.profile?.name || "Cliente WSP";
                if(text) await procesarNucleo(senderId, name, text, "whatsapp");
            }
        }
        else if (body.object === "instagram") {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging && messaging.message && !messaging.message.is_echo) {
                const msgId = messaging.message.mid;
                if (processedIds.has(msgId)) return;
                processedIds.add(msgId);
                setTimeout(() => processedIds.delete(msgId), 60000);

                const senderId = messaging.sender.id;
                const text = messaging.message.text;
                if(text) {
                    const name = await obtenerNombreIG(senderId);
                    await procesarNucleo(senderId, name, text, "instagram");
                }
            }
        }
    } catch (e) { console.error(e); }
});

app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'web_guest';
        
        // Timeout de seguridad de 5 segundos para la web
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));
        const processPromise = procesarNucleo(uid, "Visitante Web", message, "web", true);

        const respuesta = await Promise.race([processPromise, timeoutPromise]);
        
        res.json({ response: respuesta, link: NEGOCIO.agenda_link });
    } catch (e) {
        console.error("Webchat Error:", e);
        res.json({ response: "¡Hola! Estoy revisando agenda, dame un segundo... (Intenta de nuevo)", link: NEGOCIO.agenda_link });
    }
});

async function procesarNucleo(id, nombre, textoUsuario, plataforma, esWeb = false) {
    try {
        const historial = guardarMensaje(id, nombre, textoUsuario, "user", plataforma);
        const respuestaRaw = await pensar(historial, nombre, plataforma === "instagram" ? "(IG)" : "");
        const { texto, estado } = procesarEtiquetas(respuestaRaw, id, nombre, plataforma);
        guardarMensaje(id, nombre, texto, "zara", plataforma, estado);
        
        if (!esWeb) await enviarMensaje(id, texto, plataforma);
        return texto;
    } catch (e) { return "Un momento..."; }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 LIVE PORT ${PORT}`));
