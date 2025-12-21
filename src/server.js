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
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
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
                
                const senderId = msg.from;
                const text = msg.text?.body;
                // MEJORA: Si no hay nombre público, usar null para que el cerebro no fuerce un nombre falso.
                const profileName = changes.contacts?.[0]?.profile?.name;
                const name = profileName || null; 
                
                if(text) await procesarNucleo(senderId, name, text, "whatsapp");
            }
        } else if (body.object === "instagram") {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging && messaging.message && !messaging.message.is_echo) {
                const msgId = messaging.message.mid;
                if (processedIds.has(msgId)) return;
                processedIds.add(msgId);
                
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
        // En web no solemos tener nombre, pasamos null para que sea neutral o pregunte si es necesario.
        const respuesta = await procesarNucleo(uid, null, message, "web", true);
        
        res.json({ 
            response: respuesta, 
            reply: respuesta,
            text: respuesta,
            link: NEGOCIO.agenda_link 
        });
    } catch (e) { res.status(500).json({ error: "Error" }); }
});

async function procesarNucleo(id, nombre, textoUsuario, plataforma, esWeb = false) {
    try {
        const historial = guardarMensaje(id, nombre, textoUsuario, "user", plataforma);
        
        // El cerebro recibe el nombre real o null.
        const respuestaRaw = await pensar(historial, nombre, plataforma === "instagram" ? "(IG)" : "");
        
        const { texto, estado } = procesarEtiquetas(respuestaRaw, id, nombre, plataforma);
        guardarMensaje(id, nombre, texto, "zara", plataforma, estado);
        
        if (!esWeb) await enviarMensaje(id, texto, plataforma);
        return texto;
    } catch (e) { return "Dame un momento..."; }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 LIVE PORT ${PORT}`));
