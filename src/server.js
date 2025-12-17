import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { procesarEvento } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje, chats } from "./utils/memory.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const webSessions = {};

app.use(bodyParser.json());
// Servir archivos estáticos (el index.html que acabamos de crear)
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
    next();
});

const MONITOR_HTML = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Zara Monitor V23</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
<style>
body{font-family:sans-serif;background:#d1d7db;display:flex;height:100vh;margin:0}
#app{display:flex;width:100%;max-width:1400px;background:#fff;margin:0 auto}
.sidebar{width:300px;border-right:1px solid #ddd;overflow-y:auto}
.header{padding:15px;background:#f0f2f5;font-weight:bold;border-bottom:1px solid #ddd}
.contact{padding:10px;cursor:pointer;border-bottom:1px solid #f0f2f5;display:flex;align-items:center}
.contact.active{background:#e9edef}
.avatar{width:40px;height:40px;border-radius:50%;background:#ddd;margin-right:10px;display:flex;align-items:center;justify-content:center}
.chat-area{flex:1;display:flex;flex-direction:column;background:#efeae2}
.messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.msg{max-width:70%;padding:10px;border-radius:10px;font-size:14px}
.msg.usuario{align-self:flex-start;background:#fff}
.msg.zara{align-self:flex-end;background:#d9fdd3}
</style></head>
<body>
<div id="app">
  <div class="sidebar"><div class="header">Chats</div><div id="list"></div></div>
  <div class="chat-area"><div class="header" id="chatTitle">Selecciona</div><div class="messages" id="msgs"></div></div>
</div>
<script>
let chats={}, activeId=null;
async function loop() {
  try {
    const res = await fetch('/api/data'); chats = await res.json(); renderList();
    if(activeId) renderChat(activeId);
  } catch(e){}
}
function renderList() {
  document.getElementById('list').innerHTML = Object.keys(chats).map(id => {
    const c = chats[id];
    return \`<div class="contact \${id===activeId?'active':''}" onclick="activeId='\${id}';renderChat('\${id}')">
      <div class="avatar">\${c.origen[0].toUpperCase()}</div><div><b>\${c.nombre}</b></div>
    </div>\`;
  }).join('');
}
function renderChat(id) {
  const c = chats[id];
  document.getElementById('chatTitle').innerText = c.nombre;
  document.getElementById('msgs').innerHTML = c.mensajes.map(m => 
    \`<div class="msg \${m.tipo}">\${m.texto}</div>\`
  ).join('');
}
setInterval(loop, 2000); loop();
</script></body></html>
`;

// RUTA RAIZ: Sirve el archivo index.html (Interfaz Web)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/data", (req, res) => res.json(chats));

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try { if (req.body.entry) await procesarEvento(req.body.entry[0]); } catch (e) { console.error(e); }
});

app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'web_user';
        registrarMensaje(uid, "Web", message, "usuario", "web");

        if (!webSessions[uid]) webSessions[uid] = [];
        webSessions[uid].push({ role: "user", content: message });

        const reply = await generarRespuestaIA(webSessions[uid]);
        webSessions[uid].push({ role: "assistant", content: reply });
        registrarMensaje(uid, "Web", reply, "zara", "web");

        let showButton = reply.toLowerCase().includes("agenda") || reply.toLowerCase().includes("botón");
        res.json({ response: reply, button: showButton, link: NEGOCIO.agenda_link });
    } catch (e) { res.status(500).json({error: "Error"}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara V24 + WEB corriendo en puerto ${PORT}`));
