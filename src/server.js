import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { PRODUCTOS } from './config/productos.js';
import { generarRespuestaIA } from './services/openai.js';
import { sendMessage, procesarMensaje } from './services/meta.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- RUTA 1: MONITOR DE ESTADO ---
app.get('/monitor', (req, res) => res.json({ status: 'Online', canales: ['Web', 'WhatsApp', 'Instagram'], version: 'Zara 6.0' }));

// --- RUTA 2: CHAT WEB (Cliente Directo) ---
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

// --- RUTA 3: WEBHOOK UNIFICADO (Meta: WhatsApp + Instagram) ---
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log('[Meta] Webhook verificado');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200); // Responder OK rápido a Meta
    try {
        const body = req.body;
        
        // A) DETECCION WHATSAPP
        if (body.object === 'whatsapp_business_account') {
            const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (message?.text) {
                const senderId = message.from;
                const text = message.text.body;
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente WSP';
                console.log(`[WhatsApp] ${name}: ${text}`);
                await procesarMensaje(senderId, text, name, 'whatsapp');
            }
        } 
        // B) DETECCION INSTAGRAM
        else if (body.object === 'instagram') {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging?.message?.text) {
                const senderId = messaging.sender.id;
                const text = messaging.message.text;
                console.log(`[Instagram] ID ${senderId}: ${text}`);
                // Zara procesa igual, aunque el envío falle por permisos
                await procesarMensaje(senderId, text, 'Usuario IG', 'instagram');
            }
        }
    } catch (error) {
        console.error('[Meta] Error procesando webhook:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara 6.0 Omnicanal en puerto ${PORT}`));
