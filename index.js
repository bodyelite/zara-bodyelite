import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { procesarMensaje } from "./intents.js";
import { generarRespuesta } from "./responses.js";
import { sendMessage } from "./sendMessage.js";
import { guardarContexto, cargarContexto } from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

let contexto = cargarContexto();
const LOG_PATH = "./logs/conversaciones.json";
if (!fs.existsSync("./logs")) fs.mkdirSync("./logs");
if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, "[]");

// === Verificación Webhook Meta ===
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Error al verificar webhook.");
    res.sendStatus(403);
  }
});

// === Recepción Mensajes WhatsApp ===
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message?.text) {
      const from = message.from;
      const texto = message.text.body;
      console.log(`📩 Mensaje recibido: ${texto}`);

      const tipo = procesarMensaje(texto);
      const respuesta = generarRespuesta(tipo, texto, contexto);

      // Guarda conversación en log
      const logs = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
      const ahora = new Date().toLocaleString("es-CL");
      logs.push({ rol: "user", texto, hora: ahora });
      logs.push({ rol: "zara", texto: respuesta, hora: ahora });
      fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));

      // Envía mensaje
      await sendMessage(from, respuesta);
      console.log(`✅ Respuesta enviada a ${from}: ${respuesta.slice(0, 50)}...`);

      contexto[from] = { ultimo: texto };
      guardarContexto(contexto);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en procesamiento:", err);
    res.sendStatus(500);
  }
});

// === Monitor Web ===
app.get("/monitor", (req, res) => {
  try {
    const conversaciones = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    const html = `
    <html><head><title>Monitor de Conversaciones - Zara</title></head>
    <body style="font-family:sans-serif;">
      <h2>💬 Monitor de Conversaciones - Zara</h2>
      ${conversaciones.map(c => `
        <div style="margin:10px;padding:10px;background:${c.rol==="user"?"#ddd":"#cfe8ff"};border-radius:8px;">
          <b>${c.rol==="user"?"Usuario":"Zara"}:</b> ${c.texto}
          <div style="font-size:11px;color:#555;">${c.hora}</div>
        </div>`).join("")}
    </body></html>`;
    res.send(html);
  } catch {
    res.send("No hay conversaciones registradas.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Zara operativa con razonamiento, empatía, avisos y monitor en puerto ${PORT}`);
});
