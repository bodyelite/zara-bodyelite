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
app.get("/panel", (req, res) => {
  import fs from "fs";
  const data = JSON.parse(fs.readFileSync("conversaciones.json", "utf8"));
  let html = `
  <html><head><title>Panel Zara</title>
  <style>body{font-family:Arial;padding:20px;background:#f5f5f5;}
  .msg{background:#fff;margin-bottom:10px;padding:10px;border-radius:8px;}
  .numero{color:#333;font-weight:bold;}
  .fecha{color:#888;font-size:12px;}
  </style></head><body><h1>Conversaciones Zara Body Elite</h1>
  ${data.map(m=>`<div class="msg"><div class="numero">${m.numero}</div><div>${m.mensaje}</div><div class="fecha">${m.fecha}</div></div>`).join("")}
  </body></html>`;
  res.send(html);
});app.listen(PORT, () => console.log('🚀 Zara corriendo en puerto', PORT));


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

// === Registro y panel de conversaciones ===
import fs from "fs";
const LOG_PATH = "./conversaciones.json";

// Guarda cada mensaje recibido
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
  console.log(`📩 ${from} → ${mensajeTexto}`);
}

// Inserta registro dentro del webhook
app.post("/webhook", (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const mensajeTexto = entry?.messages?.[0]?.text?.body;
    const from = entry?.messages?.[0]?.from;
    if (mensajeTexto && from) registrarConversacion(from, mensajeTexto);
  }
  res.sendStatus(200);
});

// Endpoint /panel para ver los registros
app.get("/panel", (req, res) => {
  if (!fs.existsSync(LOG_PATH)) return res.send("Sin registros aún.");
  const data = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  const html = `
  <html>
  <head><title>Conversaciones Zara Body Elite</title>
  <style>
    body { font-family: Arial; background:#f6f8fa; padding:20px; }
    h1 { color:#003366; }
    .msg { background:white; margin:10px 0; padding:10px; border-radius:8px; box-shadow:0 0 3px rgba(0,0,0,0.1); }
    .numero { font-weight:bold; color:#0056b3; }
    .fecha { color:#666; font-size:12px; }
    button { margin-bottom:15px; background:#0056b3; color:white; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; }
  </style>
  </head>
  <body>
  <h1>📊 Conversaciones Zara Body Elite</h1>
  <button onclick="location.reload()">Actualizar</button>
  ${data.map(m => `<div class='msg'><div class='numero'>${m.numero}</div><div>${m.mensaje}</div><div class='fecha'>${m.fecha}</div></div>`).join("")}
  </body>
  </html>`;
  res.send(html);
});

// === Registro extendido de conversaciones ===
import fs from 'fs';
const LOG_PATH = './conversaciones.json';

// Función para guardar entradas de chat (usuario o Zara)
function registrarConversacion(origen, contenido, tipo) {
  const registro = {
    tipo, // "usuario" o "zara"
    origen,
    contenido,
    fecha: new Date().toLocaleString('es-CL')
  };
  let data = [];
  if (fs.existsSync(LOG_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
    } catch {
      data = [];
    }
  }
  data.push(registro);
  fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));
  console.log(`💬 ${tipo.toUpperCase()} (${origen}): ${contenido}`);
}

// Intercepta mensajes entrantes del webhook
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0]?.text?.body;
    const from = entry?.messages?.[0]?.from;
    if (msg && from) registrarConversacion(from, msg, 'usuario');
  }
  res.sendStatus(200);
});

// Intercepta respuestas de Zara (enviarMensaje)
const originalSend = globalThis.sendMessage;
globalThis.sendMessage = async function (numero, texto) {
  registrarConversacion(numero, texto, 'zara');
  if (originalSend) return originalSend(numero, texto);
};

// Panel visual
app.get('/panel', (req, res) => {
  if (!fs.existsSync(LOG_PATH)) return res.send('Sin registros aún.');
  const data = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
  const html = `
  <html><head><title>Panel Zara Body Elite</title>
  <style>
    body{font-family:Arial;background:#f6f8fa;padding:20px;}
    h1{color:#003366;}
    .msg{margin:10px 0;padding:10px;border-radius:8px;}
    .usuario{background:#fff;border-left:4px solid #0066cc;}
    .zara{background:#e9f5ff;border-left:4px solid #00a36f;}
    .fecha{font-size:12px;color:#666;}
  </style></head><body>
  <h1>📊 Conversaciones Zara Body Elite</h1>
  <button onclick="location.reload()">Actualizar</button>
  ${data.map(m => `
    <div class='msg ${m.tipo}'>
      <b>${m.tipo === 'zara' ? 'Zara' : m.origen}</b><br>${m.contenido}<br>
      <div class='fecha'>${m.fecha}</div>
    </div>`).join('')}
  </body></html>`;
  res.send(html);
});

// === Panel de conversaciones (corrección de ruta) ===
import fs from "fs";
const LOG_FILE = "./conversaciones.json";

app.get("/panel", (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.send("<h2>📭 Aún no hay registros de conversaciones.</h2>");
  }

  const data = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
  const html = `
  <html>
  <head>
    <title>Panel Zara Body Elite</title>
    <style>
      body { font-family: Arial; background: #f9fafc; padding: 20px; }
      h1 { color: #003366; }
      .msg { margin: 10px 0; padding: 10px; border-radius: 8px; }
      .usuario { background: #fff; border-left: 4px solid #007bff; }
      .zara { background: #e6fff3; border-left: 4px solid #28a745; }
      .fecha { font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <h1>📊 Conversaciones Zara Body Elite</h1>
    <button onclick="location.reload()">Actualizar</button>
    ${data.map(m => `
      <div class='msg ${m.tipo}'>
        <b>${m.tipo === 'zara' ? 'Zara' : m.origen}</b><br>${m.contenido}<br>
        <div class='fecha'>${m.fecha}</div>
      </div>`).join('')}
  </body>
  </html>`;
  res.send(html);
});

// === Panel de conversaciones Zara Body Elite ===
import fs from "fs";
const LOG_FILE = "./conversaciones.json";

app.get("/panel", (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.send("<h2>📭 Aún no hay registros de conversaciones.</h2>");
  }

  const data = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
  const html = `
  <html>
  <head>
    <title>Panel Zara Body Elite</title>
    <style>
      body { font-family: Arial; background: #f9fafc; padding: 20px; }
      h1 { color: #003366; }
      .msg { margin: 10px 0; padding: 10px; border-radius: 8px; }
      .usuario { background: #fff; border-left: 4px solid #007bff; }
      .zara { background: #e6fff3; border-left: 4px solid #28a745; }
      .fecha { font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <h1>📊 Conversaciones Zara Body Elite</h1>
    <button onclick="location.reload()">Actualizar</button>
    ${data.map(m => `
      <div class='msg ${m.tipo}'>
        <b>${m.tipo === 'zara' ? 'Zara' : m.origen}</b><br>${m.contenido}<br>
        <div class='fecha'>${m.fecha}</div>
      </div>`).join('')}
  </body>
  </html>`;
  res.send(html);
});
app.get("/panel", (req, res) => {
  import fs from "fs";
  const data = JSON.parse(fs.readFileSync("conversaciones.json", "utf8"));
  let html = `
  <html>
  <head>
    <title>Panel de conversaciones Zara</title>
    <style>
      body { font-family: Arial; padding: 20px; background: #f5f5f5; }
      h1 { color: #003366; }
      .msg { background: white; padding: 10px; margin-bottom: 10px; border-radius: 8px; }
      .numero { color: #666; font-size: 14px; }
      .fecha { color: #999; font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>Conversaciones Zara Body Elite</h1>
    ${data.map(m => `
      <div class="msg">
        <div class="numero"><b>${m.numero}</b></div>
        <div>${m.mensaje}</div>
        <div class="fecha">${m.fecha}</div>
      </div>`).join("")}
  </body>
  </html>`;
  res.send(html);
});

// === PANEL DE CONVERSACIONES ZARA ===
import fs from "fs";
app.get("/panel", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("conversaciones.json", "utf8"));
    let html = `
    <html>
    <head><title>Panel Zara</title>
    <style>
      body {font-family: Arial; background:#f5f5f5; padding:20px;}
      h1 {color:#333;}
      .msg {background:#fff; margin-bottom:10px; padding:10px; border-radius:8px;}
      .numero {color:#333; font-weight:bold;}
      .fecha {color:#888; font-size:12px;}
    </style></head>
    <body>
    <h1>Conversaciones Zara Body Elite</h1>
    ${data.map(m=>`
      <div class='msg'>
        <div class='numero'>${m.numero}</div>
        <div>${m.mensaje}</div>
        <div class='fecha'>${m.fecha}</div>
      </div>`).join("")}
    </body></html>`;
    res.send(html);
  } catch (e) {
    res.status(500).send("Error al cargar conversaciones");
  }
});

import fs from "fs";
app.get("/panel", (req, res) => {
  try {
    const filePath = "./conversaciones.json";
    if (!fs.existsSync(filePath)) return res.send("<h3>No hay conversaciones registradas</h3>");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    let html = `
    <html><head><title>Panel Zara</title>
    <style>
      body{font-family:Arial;background:#fafafa;padding:20px;}
      .msg{background:#fff;margin-bottom:12px;padding:12px;border-radius:8px;box-shadow:0 0 4px #ccc;}
      .numero{font-weight:bold;color:#333;}
      .fecha{color:#777;font-size:12px;}
    </style></head>
    <body><h2>Conversaciones Zara Body Elite</h2>
    ${data.map(m=>`<div class="msg"><div class="numero">${m.numero}</div><div>${m.mensaje}</div><div class="fecha">${m.fecha}</div></div>`).join("")}
    </body></html>`;
    res.send(html);
  } catch(e) {
    res.status(500).send("Error al cargar conversaciones: " + e.message);
  }
});

