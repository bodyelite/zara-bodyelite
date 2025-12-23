import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { pensar } from "./core/brain.js";
import { guardarMensaje, leerDB } from "./core/memory.js";
import { procesarEtiquetas } from "./core/tags.js";
import { enviarMensajeMeta, obtenerNombreIG, notificarStaff } from "./channels/meta.js";
import { NEGOCIO } from "./config/business.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../public')));

const processedIds = new Set();
const BASE_URL = process.env.RENDER_EXTERNAL_URL || "https://zara-bodyelite-1.onrender.com";

app.get('/monitor', (req, res) => res.sendFile(path.join(__dirname, '../public/monitor.html')));
app.get('/api/stats', (req, res) => res.json(leerDB()));

app.get('/agenda', (req, res) => {
    res.send(`<!DOCTYPE html><html lang="es"><head><meta property="og:title" content="📅 Agenda Online Body Elite" /><meta property="og:description" content="Reserva tu Evaluación Gratuita con IA aquí." /><meta property="og:image" content="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" /><meta property="og:url" content="${NEGOCIO.agenda_link}" /><script>window.location.href = "${NEGOCIO.agenda_link}";</script></head><body>Redirigiendo...</body></html>`);
});

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
                const profileName = changes.contacts?.[0]?.profile?.name || "Cliente";
                
                if(text) await procesarNucleo(senderId, profileName, text, "whatsapp");
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
        const uid = userId || 'web_guest_session';
        let nombreWeb = "Visitante";
        const resultado = await procesarNucleo(uid, nombreWeb, message, "web", true);
        res.json({ text: resultado.textoFinal, reply: resultado.textoFinal });
    } catch (e) { res.status(500).json({ text: "Dame un segundo..." }); }
});

async function procesarNucleo(id, nombre, textoUsuario, plataforma, esWeb = false) {
    try {
        const historial = guardarMensaje(id, nombre, textoUsuario, "user", plataforma);
        const suffix = plataforma === "instagram" ? "(IG)" : "";
        
        const respuestaRaw = await pensar(historial, nombre, suffix);
        
        const hasLink = respuestaRaw.includes("{LINK}");
        const notifyCall = respuestaRaw.includes("{CALL}");
        let textoBase = respuestaRaw.replace("{LINK}", "").replace("{CALL}", "").trim();
        
        const { texto, estado } = procesarEtiquetas(textoBase, id, nombre, plataforma);
        guardarMensaje(id, nombre, textoBase, "zara", plataforma, estado);
        
        if (notifyCall) await notificarStaff(id, nombre || "Cliente", plataforma, textoUsuario);

        let textoFinal = textoBase;

        if (esWeb && hasLink) {
            textoFinal += `<br><br><a href="${NEGOCIO.agenda_link}" target="_blank" style="background-color:#d4af37; color:white; padding:10px 15px; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block;">📅 RESERVAR AQUÍ</a>`;
        } else if (!esWeb) {
            const shortLink = `${BASE_URL}/agenda`;
            await enviarMensajeMeta(id, textoBase, plataforma, hasLink, shortLink);
        }

        return { textoFinal };
    } catch (e) { return { textoFinal: "Dame un segundo..." }; }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 5.0 FINAL PORT ${PORT}`));
