import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import procesarMensaje from "./memoria.js";

const app = express();
app.use(express.json());
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* === WEBHOOK WHATSAPP CLOUD API === */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages && messages[0]) {
      const mensaje = messages[0].text?.body || "";
      const from = messages[0].from;
      const respuesta = await procesarMensaje(mensaje);
      await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.ZARA_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: respuesta },
        }),
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook WhatsApp:", e);
    res.sendStatus(500);
  }
});

/* === VERIFICACIÓN META === */
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN || "ZARA_TOKEN";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* === WEBHOOK INSTAGRAM DM === */
app.post("/igwebhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const sender = messaging?.sender?.id;
    const mensaje = messaging?.message?.text || "";
    if (mensaje && sender) {
      const respuesta = await procesarMensaje(mensaje);
      await fetch(`https://graph.facebook.com/v19.0/${sender}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.ZARA_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_type: "RESPONSE",
          recipient: { id: sender },
          message: { text: respuesta },
        }),
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook Instagram:", e);
    res.sendStatus(500);
  }
});

/* === MONITOR Y DASHBOARD === */
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Zara 2.1 Monitor</title>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial; background:#e0d5ca; margin:0; }
      header { background:#036b63; color:white; padding:10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center; }
      section { padding:20px; }
      textarea { width:100%; height:400px; border-radius:10px; border:1px solid #ccc; padding:10px; }
      footer { background:#036b63; color:white; text-align:center; padding:5px; position:fixed; bottom:0; width:100%; }
    </style>
  </head>
  <body>
    <header><div>Zara 2.1 Monitor</div><div>Body Elite</div></header>
    <section>
      <h3>Estado del sistema</h3>
      <p>✅ Servidor activo y escuchando en puerto 3000</p>
      <textarea readonly id="logs"></textarea>
    </section>
    <footer>Body Elite Estética Avanzada</footer>
    <script>
      async function cargarLogs(){
        try{
          const res = await fetch('/logs');
          const txt = await res.text();
          document.getElementById('logs').value = txt;
        }catch(e){ console.error(e); }
      }
      cargarLogs();
      setInterval(cargarLogs,10000);
    </script>
  </body>
  </html>
  `);
});

app.get("/logs", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "logs_wsp.json"), "utf8");
    res.type("text").send(data);
  } catch {
    res.type("text").send("Sin registros");
  }
});

/* === SERVIDOR === */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara 2.1 operativo en puerto ${PORT}`));
