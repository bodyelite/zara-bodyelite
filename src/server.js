import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NEGOCIO } from './config/negocio.js';
import { SYSTEM_PROMPT } from './config/personalidad.js';
import { PRODUCTOS } from './config/productos.js';
import { generarRespuestaIA } from './services/openai.js';
import { procesarMensaje, getInstagramUser } from './services/meta.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/monitor', (req, res) => res.json({ status: 'Online', version: 'Zara 8.1 + Querubín (Name Recog)' }));

// --- WEBCHAT (Recibe nombre opcional) ---
app.post('/webchat', async (req, res) => {
    try {
        // Ahora aceptamos 'userName'
        const { message, history, ref, userName } = req.body;
        const nombreCliente = userName || "Visitante Web"; // Si no hay nombre, usa genérico
        
        console.log(`[Web] ${nombreCliente}: ${message}`);
        
        let sys = SYSTEM_PROMPT + `\n\n[CATÁLOGO]\n${PRODUCTOS}`;
        if (ref) sys += `\n\n[CAMPAÑA ACTIVA: ${ref}]`;

        const messages = [{ role: "system", content: sys }, ...(history || []), { role: "user", content: `[Cliente ${nombreCliente}]: ${message}` }];
        const reply = await generarRespuestaIA(messages);
        res.json({ reply });
    } catch (error) {
        console.error('[Web Error]', error);
        res.status(500).json({ error: "Error" });
    }
});

// --- META WEBHOOK ---
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);
    try {
        const body = req.body;
        // WSP
        if (body.object === 'whatsapp_business_account') {
            const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
            if (msg?.text) {
                const name = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Cliente WSP';
                await procesarMensaje(msg.from, msg.text.body, name, 'whatsapp');
            }
        } 
        // IG (Con Querubín activado)
        else if (body.object === 'instagram') {
            const messaging = body.entry?.[0]?.messaging?.[0];
            if (messaging) {
                const senderId = messaging.sender.id;
                // USAMOS QUERUBÍN AQUÍ:
                const name = await getInstagramUser(senderId); 
                const campana = messaging.referral?.ref || null;

                if (messaging.message?.text) {
                    await procesarMensaje(senderId, messaging.message.text, name, 'instagram', campana);
                }
            }
        }
    } catch (error) {
        console.error('[Meta Webhook Error]', error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara 8.1 Querubín Activo en puerto ${PORT}`));
