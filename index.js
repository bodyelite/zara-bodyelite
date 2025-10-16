import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { obtenerRespuesta } from './responses.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const messages = change.value?.messages;
        if (messages && messages[0]) {
          const msg = messages[0];
          const from = msg.from;
          const texto = msg.text?.body?.toLowerCase() || '';
          console.log('Mensaje recibido:', texto);

          const respuesta = obtenerRespuesta(texto);
          console.log('Respuesta generada:', respuesta);

          await fetch('https://graph.facebook.com/v18.0/' + process.env.PHONE_NUMBER_ID + '/messages', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + PAGE_ACCESS_TOKEN,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: from,
              text: { body: respuesta || '💬 Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito.' }
            })
          });
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('🚀 Zara corriendo en puerto', PORT));

