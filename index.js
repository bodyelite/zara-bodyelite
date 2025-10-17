import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarMensaje } from "./intents.js";
import { generarRespuesta } from "./responses.js";
import { enviarMensaje } from "./sendMessage.js";
import { guardarContexto, cargarContexto } from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

let contexto = cargarContexto();

// Verificación webhook Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // corregido
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Error al verificar webhook.");
    res.sendStatus(403);
  }
});

// Recepción de mensajes WhatsApp
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (message && message.text) {
      const from = message.from;
      const texto = message.text.body;
      console.log(`📩 Mensaje recibido: ${texto}`);

      const tipo = procesarMensaje(texto);
      const respuesta = generarRespuesta(tipo, texto, contexto);

      await enviarMensaje(from, respuesta);
      contexto[from] = { ultimo: texto };
      guardarContexto(contexto);

      console.log(`✅ Respuesta enviada a ${from}: ${respuesta.slice(0, 60)}...`);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en procesamiento:", err);
    res.sendStatus(500);
  }
});

// Monitor web
app.get("/monitor", (req, res) => {
  import("fs").then(fs => {
    fs.readFile("./logs/conversaciones.json", "utf8", (err, data) => {
      if (err) return res.send("No hay conversaciones registradas.");
      const conversaciones = JSON.parse(data || "[]");
      const html = `
      <html><head><title>Monitor de Conversaciones - Zara</title></head>
      <body style="font-family:sans-serif;">
        <h2>💬 Monitor de Conversaciones - Zara</h2>
        ${conversaciones.map(c => `
          <div style="margin:10px;padding:10px;background:#eee;border-radius:8px;">
            <b>${c.rol === "user" ? "Usuario" : "Zara"}:</b> ${c.texto}
            <div style="font-size:11px;color:#555;">${c.hora}</div>
          </div>
        `).join("")}
      </body></html>`;
      res.send(html);
    });
  });
});

app.listen(PORT, () =>
  console.log(`✅ Zara operativa con razonamiento, empatía, avisos y monitor en puerto ${PORT}`)
);
