import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { procesarEvento } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje, chats } from "./utils/memory.js";

dotenv.config();
const app = express();
const webSessions = {};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

const MONITOR_HTML = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>MONITOR V27 OFICIAL</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
<style>
body{font-family:sans-serif;background:#d1d7db;display:flex;height:100vh;margin:0}
#app{display:flex;width:100%;max-width:1400px;background:#fff;margin:0 auto}
.sidebar{width:300px;border-right:1px solid #ddd;overflow-y:auto}
.header{padding:15px;background:#008069;color:white;font-weight:bold;display:flex;justify-content:space-between;align-items:center}
.status-dot{height:10px;width:10px;background-color:#fff;border-radius:50%;display:inline-block;animation:pulse 2s infinite;}
@keyframes pulse { 0% {opacity:1;} 50% {opacity:0.5;} 100% {opacity:1;} }
.contact{padding:10px;cursor:pointer;border-bottom:1px solid #f0f2f5;display:flex;align-items:center}
.contact:hover{background:#f5f6f6}
.contact.active{background:#e9edef}
.avatar{width:40px;height:40px;border-radius:50%;background:#ddd;margin-right:10px;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white;}
.chat-area{flex:1;display:flex;flex-direction:column;background:#efeae2}
.messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.msg{max-width:70%;padding:10px;border-radius:10px;font-size:14px;box-shadow:0 1px 1px rgba(0,0,0,0.1);}
.msg.usuario{align-self:flex-start;background:#fff}
.msg.zara{align-self:flex-end;background:#d9fdd3}
.empty-msg{text-align:center;color:#888;margin-top:50px;}
</style></head>
<body>
<div id="app">
  <div class="sidebar">
    <div class="header">MONITOR V27 <span id="status" class="status-dot"></span></div>
    <div id="list"></div>
  </div>
  <div class="chat-area"><div class="header" id="chatTitle" style="background:#f0f2f5;color:#000">Selecciona un chat</div><div class="messages" id="msgs"><div class="empty-msg">Esperando mensajes en V27...</div></div></div>
</div>
<script>
let chats={}, activeId=null;
async function loop() {
  try {
    const res = await fetch('/api/data'); 
    chats = await res.json(); 
    renderList();
    if(activeId) renderChat(activeId);
  } catch(e){}
}
function renderList() {
  const ids = Object.keys(chats).sort((a,b) => chats[b].mensajes[chats[b].mensajes.length-1].timestamp - chats[a].mensajes[chats[a].mensajes.length-1].timestamp);
  document.getElementById('list').innerHTML = ids.map(id => {
    const c = chats[id];
    let color = c.origen === 'web' ? '#3498db' : '#25D366';
    if(c.origen === 'ig') color = '#e1306c';
    return \`<div class="contact \${id===activeId?'active':''}" onclick="activeId='\${id}';renderChat('\${id}')">
      <div class="avatar" style="background:\${color}">\${c.origen[0].toUpperCase()}</div>
      <div><b>\${c.nombre}</b><br><small style="color:#666">\${c.origen}</small></div>
    </div>\`;
  }).join('');
}
function renderChat(id) {
  const c = chats[id];
  document.getElementById('chatTitle').innerText = c.nombre + " (" + c.origen + ")";
  const html = c.mensajes.map(m => 
    \`<div class="msg \${m.tipo}">\${m.texto.replace(/\\n/g, '<br>')}</div>\`
  ).join('');
  const box = document.getElementById('msgs');
  if(box.innerHTML !== html) { box.innerHTML = html; box.scrollTop = box.scrollHeight; }
}
setInterval(loop, 2000); loop();
</script></body></html>
`;

app.get("/", (req, res) => res.send("Zara V27 Brain Active"));
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
app.listen(PORT, () => console.log(`🚀 Zara V27 OFICIAL corriendo en puerto ${PORT}`));
