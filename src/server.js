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

// 1. Monitor de Estado
app.get('/monitor', (req, res) => {
    res.json({ status: 'Online', negocio: NEGOCIO.nombre, version: 'Zara 4.0' });
});

// 2. Verificación del Webhook (Meta)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 3. Recepción de Mensajes (Meta)
app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        
        if (value?.messages) {
            const message = value.messages[0];
            const senderId = message.from;
            const text = message.text?.body;
            const name = value.contacts?.[0]?.profile?.name || 'Cliente';
            
            if (text) {
                console.log(`[Mensaje] ${name}: ${text}`);
                await procesarMensaje(senderId, text, name, SYSTEM_PROMPT, PRODUCTOS);
            }
        }
    } catch (error) {
        console.error('Error en webhook:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zara 4.0 activa en puerto ${PORT}`));
