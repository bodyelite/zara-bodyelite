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


// === Registro y panel de conversaciones ===
import fs from "fs";
const LOG_PATH = "./conversaciones.json";

// Función para registrar cada mensaje entrante
function registrarConversacion(from, mensajeTexto) {
  const registro = {
    numero: from,
    mensaje: mensajeTexto,
    fecha: new Date().toLocaleString("es-CL")
  };
  let data = [];
  if (fs.existsSync(LOG_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
    } catch {
      data = [];
    }
  }
  data.push(registro);
  fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
  console.log(`📩 Registro guardado: ${from} → ${mensajeTexto}`);
}

// Inserta la llamada justo donde procesas mensajes
app.post("/webhook", (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const mensajeTexto = entry?.messages?.[0]?.text?.body;
    const from = entry?.messages?.[0]?.from;

    if (mensajeTexto && from) {
      registrarConversacion(from, mensajeTexto);
    }
  }
  res.sendStatus(200);
});

// Endpoint para ver conversaciones
app.get("/panel", (req, res) => {
  if (!fs.existsSync(LOG_PATH)) return res.send("Sin registros aún.");
  const data = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  const html = `
  <html>
  <head><title>Conversaciones Zara</title>
  <style>
    body { font-family: Arial; background:#f6f8fa; padding:20px; }
    h1 { color:#003366; }
    .msg { background:white; margin:10px 0; padding:10px; border-radius:8px; box-shadow:0 0 3px rgba(0,0,0,0.1); }
    .numero { font-weight:bold; color:#0056b3; }
    .fecha { color:#666; font-size:12px; }
  </style>
  </head>
  <body>
  <h1>📊 Conversaciones Zara Body Elite</h1>
  ${data.map(m => `<div class='msg'><div class='numero'>${m.numero}</div><div>${m.mensaje}</div><div class='fecha'>${m.fecha}</div></div>`).join("")}
  </body>
  </html>`;
  res.send(html);
});
