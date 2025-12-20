import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { PRODUCTOS } from './config/productos.js';
import { generarRespuestaIA } from './services/openai.js';
import { procesarMensaje, getInstagramUser } from './services/meta.js';
import { obtenerChats } from './utils/history.js';

dotenv.config();

// Configuración para leer archivos en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- RUTA 1: VISTA DEL MONITOR (HTML) ---
app.get('/monitor', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// --- RUTA 2: API DE DATOS (JSON para el Monitor) ---
app.get('/api/monitor', (req, res) => {
    const chats = obtenerChats();
    const listaOrdenada = Object.values(chats).sort((a, b) => {
        const lastA = a.mensajes[a.mensajes.length - 1]?.fecha || 0;
        const lastB = b.mensajes[b.mensajes.length - 1]?.fecha || 0;
        return lastB - lastA;
    });
    res.json(listaOrdenada);
});

// --- RUTA 3: CHAT WEB ---
app.post('/webchat', async (req, res) => {
    try {
        const { message, history, ref, userName } = req.body;
        const nombreCliente = userName || "Visitante Web";
        const reply = await procesarMensaje(nombreCliente + "_WEB_ID", message, nombreCliente, 'web', ref);
        res.json({ reply });
    } catch (error) {
        console.error('[Web] Error:', error);
        res.status(500).json({ error: "Error interno" });
    }
});

// --- RUTA 4: WEBHOOK META ---
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else { res.sendStatus(403); }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        if (body.object === 'whatsapp_business_account') {
            const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (msg?.text) {
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente WSP';
                await procesarMensaje(msg.from, msg.text.body, name, 'whatsapp');
            }
        } else if (body.object === 'instagram') {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging?.message?.text) {
                const senderId = messaging.sender.id;
                const name = await getInstagramUser(senderId); 
                const campana = messaging.referral?.ref || null;
                await procesarMensaje(senderId, messaging.message.text, name, 'instagram', campana);
            }
        }
    } catch (error) { console.error('[Meta] Error:', error); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara 9.1 Monitor Hosteado en puerto ${PORT}`));
