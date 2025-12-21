import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { pensar } from "./core/brain.js";
import { guardarMensaje, leerDB } from "./core/memory.js";
import { procesarEtiquetas } from "./core/tags.js";
import { enviarMensaje, obtenerNombreIG, notificarStaff } from "./channels/meta.js";
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
        // WEB: Usamos ID dinámico si no viene, para evitar mezcla de sesiones en pruebas
        const uid = userId || `web_${Date.now()}`;
        
        // WEB: Detectamos si el mensaje es corto (nombre) para pasarlo como nombre
        let nombreWeb = null;
        if (message.length < 15 && !message.toLowerCase().includes("info")) {
            nombreWeb = message; 
        }

        const resultado = await procesarNucleo(uid, nombreWeb, message, "web", true);
        
        res.json({
            response: resultado.texto,
            reply: resultado.texto,
            text: resultado.texto,
            link: resultado.hasLink ? NEGOCIO.agenda_link : null
        });
    } catch (e) { 
        res.status(500).json({ response: "Dame un segundo..." }); 
    }
});

async function procesarNucleo(id, nombre, textoUsuario, plataforma, esWeb = false) {
    try {
        const historial = guardarMensaje(id, nombre, textoUsuario, "user", plataforma);
        
        const respuestaRaw = await pensar(historial, nombre, plataforma === "instagram" ? "(IG)" : "");
        
        const hasLink = respuestaRaw.includes("{LINK}");
        const notifyCall = respuestaRaw.includes("{CALL}");
        let textoLimpio = respuestaRaw.replace("{LINK}", "").replace("{CALL}", "").trim();
        
        const { texto, estado } = procesarEtiquetas(textoLimpio, id, nombre, plataforma);
        guardarMensaje(id, nombre, texto, "zara", plataforma, estado);
        
        if (notifyCall) await notificarStaff(id, nombre || "Cliente", plataforma, textoUsuario);

        if (esWeb) {
            return { texto, hasLink };
        } else {
            await enviarMensaje(id, texto, plataforma, hasLink);
            return texto;
        }
    } catch (e) { 
        return { texto: "Dame un segundo...", hasLink: false }; 
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 LIVE PORT ${PORT}`));
