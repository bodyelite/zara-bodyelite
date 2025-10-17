import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { procesarMensaje } from "./intents.js";
import { generarRespuesta } from "./responses.js";
import { sendMessage } from "./sendMessage.js";
import { guardarContexto, cargarContexto, aprenderNuevaFrase } from "./memoria.js";
import { entrenarIA } from "./entrenador.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

let contexto = cargarContexto();
const LOG_PATH = "./logs/conversaciones.json";
if (!fs.existsSync("./logs")) fs.mkdirSync("./logs");
if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, "[]");

// ======= VERIFICACIÓN WEBHOOK =======
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// ======= PROCESAMIENTO DE MENSAJES =======
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.text) {
      const from = message.from;
      const texto = message.text.body.toLowerCase().trim();

      console.log(`📩 Mensaje recibido: ${texto}`);

      const tipo = procesarMensaje(texto, contexto);
      const respuesta = generarRespuesta(tipo, texto, contexto);

      // Guardar conversación
      const logs = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
      const ahora = new Date().toLocaleString("es-CL");
      logs.push({ rol: "user", texto, hora: ahora });
      logs.push({ rol: "zara", texto: respuesta, hora: ahora });
      fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));

      await sendMessage(from, respuesta);
      console.log(`✅ Respuesta enviada a ${from}`);

      contexto[from] = { ultimo: texto, tipo };
      guardarContexto(contexto);
      if (tipo === "desconocido") aprenderNuevaFrase(texto);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err);
    res.sendStatus(500);
  }
});

// ======= MONITOR DE CONVERSACIONES =======
app.get("/monitor", (req, res) => {
  try {
    const conversaciones = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    const html = `
    <html><head><title>Zara Monitor</title></head>
    <body style="font-family:sans-serif;background:#fafafa;">
      <h2>💬 Conversaciones - Zara IA</h2>
      ${conversaciones.map(c => `
        <div style="margin:6px;padding:10px;border-radius:8px;background:${c.rol==="user"?"#eee":"#cce0ff"};">
          <b>${c.rol==="user"?"Usuario":"Zara"}:</b> ${c.texto}
          <div style="font-size:11px;color:#666;">${c.hora}</div>
        </div>`).join("")}
    </body></html>`;
    res.send(html);
  } catch {
    res.send("Sin conversaciones registradas.");
  }
});

// ======= EVENTO DE CLIC EN ENLACE RESERVO =======
app.get("/reservado", async (req, res) => {
  const cliente = req.query.user || "usuario";
  const mensaje = `✅ Gracias ${cliente}! Tu reserva fue registrada con éxito en Body Elite. Te recordaremos 12 horas antes de tu cita.`;
  await sendMessage(process.env.PHONE_NUMBER_ID, mensaje);
  res.send("Confirmación enviada.");
});

// ======= INICIO =======
app.listen(PORT, () => console.log(`✅ Zara IA contextual activa en puerto ${PORT}`));
