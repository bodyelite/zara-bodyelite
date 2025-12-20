import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { PRODUCTOS } from './config/productos.js';
import { procesarMensaje, getInstagramUser } from './services/meta.js';
import { obtenerChats } from './utils/history.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

// RUTAS MONITOR
app.get('/monitor', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/api/monitor', (req, res) => {
    const chats = obtenerChats();
    const lista = Object.values(chats).sort((a, b) => {
        const lastA = a.mensajes[a.mensajes.length - 1]?.fecha || 0;
        const lastB = b.mensajes[b.mensajes.length - 1]?.fecha || 0;
        return lastB - lastA;
    });
    res.json(lista);
});

// RUTA WEBCHAT
app.post('/webchat', async (req, res) => {
    try {
        const { message, history, ref, userName } = req.body;
        const nombre = userName || "Visitante Web";
        // Añadimos sufijo al ID para no mezclar sesiones si el nombre es igual
        const idSesion = nombre.replace(/\s+/g, '_') + "_" + (new Date().getDate());
        
        const reply = await procesarMensaje(idSesion, message, nombre, 'web', ref);
        res.json({ reply });
    } catch (e) { res.status(500).json({ error: "Error interno" }); }
});

// WEBHOOK META (IG + WSP)
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else { res.sendStatus(403); }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        
        // 1. WHATSAPP
        if (body.object === 'whatsapp_business_account') {
            const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (msg?.text) {
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente WSP';
                await procesarMensaje(msg.from, msg.text.body, name, 'whatsapp');
            }
        } 
        // 2. INSTAGRAM
        else if (body.object === 'instagram') {
            const entry = body.entry?.[0];
            const messaging = entry?.messaging?.[0];
            
            // FILTRO ANTI-ECO (Evita duplicados)
            if (messaging?.message?.is_echo) return; 

            if (messaging?.message?.text) {
                const senderId = messaging.sender.id;
                const name = await getInstagramUser(senderId); 
                const campana = messaging.referral?.ref || null;
                await procesarMensaje(senderId, messaging.message.text, name, 'instagram', campana);
            }
        }
    } catch (error) { console.error('[Meta Error]', error); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara V9.2 (Anti-Eco + Monitor) en puerto ${PORT}`));
