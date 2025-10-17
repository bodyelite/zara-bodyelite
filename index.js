import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { procesarMensaje } from "./intents.js";
import { generarRespuesta } from "./responses.js";
import { guardarContexto, cargarContexto } from "./memoria.js";
import { sendMessage } from "./sendMessage.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 10000;
const TOKEN = process.env.ZARA_TOKEN;

const ADMIN_NUMBERS = ["56983300262", "56931720760", "56937648536"];
const LOG_PATH = path.join(__dirname, "logs/conversaciones.json");
if (!fs.existsSync(path.join(__dirname, "logs"))) fs.mkdirSync(path.join(__dirname, "logs"));

const mensajes = [];
function registrarMensaje(origen, texto) {
  const fecha = new Date().toLocaleString("es-CL", { hour12: false });
  const entry = { origen, texto, fecha };
  mensajes.push(entry);
  if (mensajes.length > 500) mensajes.shift();
  fs.writeFileSync(LOG_PATH, JSON.stringify(mensajes, null, 2));
}

// ==================== RESPUESTAS AUTOMÁTICAS ==================== //
async function responderWhatsApp(to, texto) {
  await fetch("https://graph.facebook.com/v19.0/311816848671292/messages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: texto }
    })
  });
}

// ==================== WEBHOOK PRINCIPAL ==================== //
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return res.sendStatus(200);

    const from = entry.from;
    const text = entry.text?.body || "";
    registrarMensaje("cliente", text);

    const contexto = cargarContexto(from);
    const analisis = procesarMensaje(text, contexto);
    const respuesta = generarRespuesta(analisis, contexto);
    registrarMensaje("zara", respuesta);

    await sendMessage(from, respuesta);
    guardarContexto(from, contexto);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error webhook:", err);
    res.sendStatus(500);
  }
});

// ==================== AVISOS INTERNOS ==================== //
app.post("/lead-click", async (req, res) => {
  try {
    const { from, nombre, contexto } = req.body;
    const aviso = `📲 Lead interesado en agendar.
👤 Cliente: ${nombre || "No identificado"}
🗒 Contexto: ${contexto || "Clic en enlace de agenda"}
Número: ${from || "sin número"}`;
    registrarMensaje("sistema", aviso);
    for (const n of ADMIN_NUMBERS) await sendMessage(n, aviso);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error lead-click:", e);
    res.sendStatus(500);
  }
});

app.post("/lead-confirm", async (req, res) => {
  try {
    const { nombre, fecha, hora, codigo, local, tratamiento } = req.body;
    const aviso = `📅 *Nueva reserva confirmada en Reservo*
👤 ${nombre || "Sin nombre"}
💆‍♀️ ${tratamiento || "Evaluación Body Elite"}
🗓 ${fecha || "Sin fecha"} ⏰ ${hora || "Sin hora"}
📍 ${local || "Body Elite"}
Código: ${codigo || "N/A"}`;
    registrarMensaje("sistema", aviso);
    for (const n of ADMIN_NUMBERS) await sendMessage(n, aviso);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error lead-confirm:", e);
    res.sendStatus(500);
  }
});

// ==================== MONITOR WEB ==================== //
app.get("/mensajes", (req, res) => res.json(mensajes));

app.get("/monitor", (req, res) => {
  res.send(`
  <html lang="es">
  <head>
  <meta charset="UTF-8" />
  <title>Monitor Zara</title>
  <style>
    body { font-family: Arial; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 700px; margin: auto; padding: 20px; }
    .msg { padding: 10px 15px; margin: 6px 0; border-radius: 12px; max-width: 70%; }
    .cliente { background: #e0e0e0; margin-right: auto; }
    .zara { background: #0078ff; color: white; margin-left: auto; }
    .sistema { background: #ffd966; color: #222; margin: auto; text-align: center; font-weight: bold; }
    .fecha { font-size: 0.75em; color: #666; text-align: right; }
  </style>
  <script>
    async function cargar() {
      const r = await fetch('/mensajes');
      const data = await r.json();
      const c = document.getElementById('chat');
      c.innerHTML = data.map(m => {
        let clase = m.origen;
        return \`<div class="msg \${clase}">\${m.texto}<div class="fecha">\${m.fecha}</div></div>\`;
      }).join('');
    }
    setInterval(cargar, 3000);
    window.onload = cargar;
  </script>
  </head>
  <body><div class="container"><h2>💬 Monitor de Conversaciones - Zara</h2><div id="chat"></div></div></body></html>
  `);
});

// ==================== SERVER ==================== //
app.listen(PORT, () => {
  console.log(`✅ Zara operativa con razonamiento, empatía, avisos internos y monitor web en puerto ${PORT}`);
});
