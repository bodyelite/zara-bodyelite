import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { procesarEvento } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
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
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>MONITOR V40</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
body{font-family:'Segoe UI', sans-serif;background:#e5e7eb;display:flex;height:100vh;margin:0}
#app{display:flex;width:100%;max-width:1600px;background:#fff;margin:0 auto;box-shadow:0 0 20px rgba(0,0,0,0.1)}
.sidebar{width:350px;border-right:1px solid #e5e7eb;background:#f9fafb;display:flex;flex-direction:column}
.header{padding:20px;background:#111827;color:white;font-weight:600;display:flex;justify-content:space-between;align-items:center;font-size:1.1rem}
.status-dot{height:10px;width:10px;background-color:#10b981;border-radius:50%;display:inline-block;box-shadow:0 0 5px #10b981;}

/* FILTROS */
.filter-bar { display: flex; padding: 10px; gap: 5px; border-bottom: 1px solid #e5e7eb; background: #fff; }
.filter-btn { flex: 1; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; color: #6b7280; background: transparent; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 5px; }
.filter-btn:hover { background: #f3f4f6; }
.filter-btn.active { background: #1f2937; color: white; }
.filter-btn i { font-size: 14px; }

#list{overflow-y:auto;flex:1}
.contact{padding:15px;cursor:pointer;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;transition:0.2s}
.contact:hover{background:#f3f4f6}
.contact.active{background:#e0e7ff;border-left:4px solid #4f46e5}
.avatar{width:45px;height:45px;border-radius:12px;margin-right:15px;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;flex-shrink:0}
.info{flex:1;min-width:0}
.name{font-weight:600;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.source{font-size:0.75rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px}
.chat-area{flex:1;display:flex;flex-direction:column;background:#fff}
.chat-header{padding:15px 25px;border-bottom:1px solid #e5e7eb;font-weight:bold;font-size:1.1rem;display:flex;align-items:center;gap:10px}
.messages{flex:1;padding:30px;overflow-y:auto;display:flex;flex-direction:column;gap:15px;background:#f9fafb}
.msg{max-width:70%;padding:12px 18px;border-radius:12px;font-size:15px;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,0.05)}
.msg.usuario{align-self:flex-start;background:#fff;border:1px solid #e5e7eb;color:#1f2937;border-bottom-left-radius:2px}
.msg.zara{align-self:flex-end;background:#4f46e5;color:white;border-bottom-right-radius:2px}
.empty-msg{text-align:center;color:#9ca3af;margin-top:20%;font-size:1.2rem}
</style></head>
<body>
<div id="app">
  <div class="sidebar">
    <div class="header">ZARA MONITOR <span id="status" class="status-dot"></span></div>
    
    <div class="filter-bar">
        <button class="filter-btn active" onclick="setFilter('all')" id="btn-all">Todos</button>
        <button class="filter-btn" onclick="setFilter('wsp')" id="btn-wsp"><i class="fab fa-whatsapp"></i></button>
        <button class="filter-btn" onclick="setFilter('ig')" id="btn-ig"><i class="fab fa-instagram"></i></button>
        <button class="filter-btn" onclick="setFilter('web')" id="btn-web"><i class="fas fa-globe"></i></button>
    </div>

    <div id="list"></div>
  </div>
  <div class="chat-area"><div class="chat-header" id="chatTitle">Selecciona un chat</div><div class="messages" id="msgs"><div class="empty-msg">Esperando mensajes...</div></div></div>
</div>
<script>
let chats={}, activeId=null, currentFilter='all';

async function loop() { try{const res=await fetch('/api/data');chats=await res.json();renderList();if(activeId)renderChat(activeId);}catch(e){}}

function setFilter(f) {
    currentFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-'+f).classList.add('active');
    renderList();
}

function renderList() { 
  const ids = Object.keys(chats).sort((a,b) => chats[b].mensajes[chats[b].mensajes.length-1].timestamp - chats[a].mensajes[chats[a].mensajes.length-1].timestamp);
  
  // FILTRADO
  const filteredIds = ids.filter(id => {
      if(currentFilter === 'all') return true;
      return chats[id].origen === currentFilter;
  });

  document.getElementById('list').innerHTML = filteredIds.map(id=>{
    const c=chats[id];
    let icon, bg;
    
    if(c.origen === 'web') { icon = '<i class="fas fa-globe"></i>'; bg = '#2563eb'; } 
    else if(c.origen === 'wsp') { icon = '<i class="fab fa-whatsapp"></i>'; bg = '#10b981'; }
    else if(c.origen === 'ig') { icon = '<i class="fab fa-instagram"></i>'; bg = '#E1306C'; }
    else { icon = '?'; bg = '#9ca3af'; }

    return \`<div class="contact \${id===activeId?'active':''}" onclick="activeId='\${id}';renderChat('\${id}')">
      <div class="avatar" style="background:\${bg}">\${icon}</div>
      <div class="info">
        <div class="name">\${c.nombre}</div>
        <div class="source">\${c.origen}</div>
      </div>
    </div>\`;
  }).join(''); 
}

function renderChat(id) { 
    const c=chats[id];
    let icon = c.origen==='web' ? '<i class="fas fa-globe" style="color:#2563eb"></i>' : (c.origen==='wsp' ? '<i class="fab fa-whatsapp" style="color:#10b981"></i>' : '<i class="fab fa-instagram" style="color:#E1306C"></i>');
    document.getElementById('chatTitle').innerHTML = \`\${icon} \${c.nombre}\`;
    document.getElementById('msgs').innerHTML = c.mensajes.map(m=>\`<div class="msg \${m.tipo}">\${m.texto}</div>\`).join(''); 
}
setInterval(loop, 2000); loop();
</script></body></html>
`;

app.get("/", (req, res) => res.send("Zara V40 Filtered Monitor"));
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
        const { message, userId, userName } = req.body;
        const uid = userId || 'web_user';
        const uName = userName || "Visitante Web";

        registrarMensaje(uid, uName, message, "usuario", "web");

        if (!webSessions[uid]) webSessions[uid] = [];
        if (webSessions[uid].length === 0) webSessions[uid].push({ role: "system", content: `El usuario se llama: ${uName}. TRÁTALO POR SU NOMBRE.` });
        
        webSessions[uid].push({ role: "user", content: message });

        const reply = await generarRespuestaIA(webSessions[uid]);
        webSessions[uid].push({ role: "assistant", content: reply });
        
        registrarMensaje(uid, "Zara", reply, "zara", "web");

        res.json({ response: reply, button: reply.toLowerCase().includes("agenda"), link: NEGOCIO.agenda_link });
    } catch (e) { res.status(500).json({error: "Error"}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara V40 Control Tower corriendo en puerto ${PORT}`));
