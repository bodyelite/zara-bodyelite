import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { generarRespuestaIA } from './services/openai.js';
import { procesarMensaje } from './services/meta.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- RUTA 1: MONITOR ---
app.get('/monitor', (req, res) => res.json({ status: 'Online', version: 'Zara 6.1 (Variables Fixed)' }));

// --- RUTA 2: CHAT WEB ---
app.post('/webchat', async (req, res) => {
    try {
        const { message, history } = req.body;
        console.log(`[Web] Mensaje: ${message}`);
        const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...(history || []), { role: "user", content: message }];
        const reply = await generarRespuestaIA(messages);
        res.json({ reply });
    } catch (error) {
        console.error('[Web] Error:', error);
        res.status(500).json({ error: "Error interno" });
    }
});

// --- RUTA 3: WEBHOOK META ---
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    // CORREGIDO: Usamos process.env.VERIFY_TOKEN
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log('[Meta] Webhook verificado correctamente');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        // Lógica WhatsApp
        if (body.object === 'whatsapp_business_account') {
            const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (msg?.text) {
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente';
                console.log(`[WhatsApp] ${name}: ${msg.text.body}`);
                await procesarMensaje(msg.from, msg.text.body, name, 'whatsapp');
            }
        } 
        // Lógica Instagram
        else if (body.object === 'instagram') {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging?.message?.text) {
                console.log(`[Instagram] Msg: ${messaging.message.text}`);
                await procesarMensaje(messaging.sender.id, messaging.message.text, 'Usuario IG', 'instagram');
            }
        }
    } catch (error) {
        console.error('[Meta] Error webhook:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara 6.1 Corrigiendo Variables en puerto ${PORT}`));
