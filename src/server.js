import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { PRODUCTOS } from './config/productos.js';
import { generarRespuestaIA } from './services/openai.js';
import { procesarMensaje } from './services/meta.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MONITOR
app.get('/monitor', (req, res) => res.json({ status: 'Online', version: 'Zara 8.0 (Web Campaign Ready)' }));

// --- RUTA CHAT WEB (Con Detección de Campaña) ---
app.post('/webchat', async (req, res) => {
    try {
        const { message, history, ref } = req.body; // Recibimos 'ref' (Campaña)
        console.log(`[Web] Mensaje: ${message} | Campaña: ${ref || 'Orgánico'}`);
        
        // Inyectamos el contexto de la campaña en la mente de Zara para este turno
        let contextoSistema = SYSTEM_PROMPT + `\n\n[CATÁLOGO]\n${PRODUCTOS}`;
        
        if (ref) {
            contextoSistema += `\n\n[⚠️ ATENCIÓN: ESTE CLIENTE LLEGÓ A LA WEB POR UN ANUNCIO DE: "${ref.toUpperCase()}". PRIORIZA VENDER ESTE SERVICIO EN TU RESPUESTA.]`;
        }

        const messages = [
            { role: "system", content: contextoSistema },
            ...(history || []), 
            { role: "user", content: message }
        ];

        const reply = await generarRespuestaIA(messages);
        res.json({ reply });
    } catch (error) {
        console.error('[Web] Error:', error);
        res.status(500).json({ error: "Error interno" });
    }
});

// --- RUTA WEBHOOK META (IG/WSP) ---
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        if (body.object === 'whatsapp_business_account') {
            const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (msg?.text) {
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente';
                await procesarMensaje(msg.from, msg.text.body, name, 'whatsapp');
            }
        } else if (body.object === 'instagram') {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging) {
                const senderId = messaging.sender.id;
                let campana = messaging.referral?.ref || null;
                if (messaging.message?.text) {
                    await procesarMensaje(senderId, messaging.message.text, 'Usuario IG', 'instagram', campana);
                }
            }
        }
    } catch (error) {
        console.error('[Meta] Error:', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara 8.0 Full Omnichannel Ads en puerto ${PORT}`));
