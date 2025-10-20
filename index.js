const express = require('express');
const bodyParser = require('body-parser');
const intents = require('./intents');
const responses = require('./responses');
const { sendMessage } = require('./sendMessage');

const app = express();
app.use(bodyParser.json());

// Webhook principal de Meta
app.post('/webhook', (req, res) => {
  try {
    const entry = req.body.entry && req.body.entry[0];
    const changes = entry && entry.changes && entry.changes[0];
    const messageData = changes && changes.value && changes.value.messages && changes.value.messages[0];

    if (messageData && messageData.text && messageData.from) {
      const message = messageData.text.body.toLowerCase().trim();
      const from = messageData.from;

      // Buscar coincidencia de intención
      const intent = intents.find(i => i.patterns.some(p => message.includes(p)));

      if (intent && responses[intent.response]) {
        sendMessage(from, responses[intent.response]);
        console.log('Respuesta enviada para intención:', intent.tag);
      } else {
        sendMessage(from, responses.fallback);
        console.log('Frase desconocida:', message);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.sendStatus(500);
  }
});

// Webhook GET (verificación de Meta)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado correctamente');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Zara IA activa y escuchando');
});

