import express from "express";
import bodyParser from "body-parser";
import { procesarEvento, procesarReserva, getSesiones, getStatus, toggleBot } from "./app.js"; 
import { conectarCliente } from "./utils/stream.js";

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(bodyParser.json());

const MONITOR_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZARA MONITOR PRO</title>
    <style>
        :root { --bg: #090909; --sidebar: #111; --text: #eee; --accent: #00ff88; --danger: #ff4444; }
        body { margin: 0; font-family: -apple-system, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        
        .sidebar { width: 320px; background: var(--sidebar); border-right: 1px solid #333; display: flex; flex-direction: column; }
        .header { padding: 15px; border-bottom: 2px solid var(--accent); font-weight: 800; font-size: 1.1rem; letter-spacing: 1px; }
        
        .user-list { flex: 1; overflow-y: auto; }
        .card { padding: 15px; border-bottom: 1px solid #222; cursor: pointer; transition: 0.2s; display: flex; gap: 10px; }
        .card:hover { background: #1a1a1a; }
        .card.active { background: #1f1f1f; border-left: 3px solid var(--accent); }
        .avatar { width: 40px; height: 40px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        
        .info { flex: 1; overflow: hidden; }
        .name { font-weight: 600; font-size: 0.95rem; display: flex; justify-content: space-between; }
        .preview { font-size: 0.8rem; color: #888; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .main { flex: 1; display: flex; flex-direction: column; background: #000; }
        .chat-head { padding: 15px; border-bottom: 1px solid #333; font-weight: bold; color: var(--accent); display: flex; justify-content: space-between; align-items: center; }
        
        .controls { display: flex; gap: 10px; align-items: center; }
        #chatPhone { font-size: 1rem; background: #333; padding: 5px 10px; border-radius: 5px; color: #fff; text-decoration: none; }
        
        #toggleBtn { 
            padding: 5px 15px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; 
            background: var(--accent); color: #000; transition: 0.2s;
        }
        #toggleBtn.off { background: var(--danger); color: #fff; }

        .feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        
        .msg { max-width: 70%; padding: 12px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; position: relative; }
        .msg.user { align-self: flex-start; background: #222; border-bottom-left-radius: 2px; }
        .msg.bot { align-self: flex-end; background: #00442a; border: 1px solid #006633; border-bottom-right-radius: 2px; color: #fff; }
        .time { font-size: 0.65rem; color: #aaa; text-align: right; margin-top: 5px; opacity: 0.8; font-family: monospace; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="header">ZARA LIVE 🟢</div>
        <div class="user-list" id="list"></div>
    </div>
    <div class="main">
        <div class="chat-head">
            <span id="chatTitle">Selecciona un chat</span>
            <div class="controls" id="controls" style="display:none;">
                <a id="chatPhone" href="#" target="_blank">...</a>
                <button id="toggleBtn" onclick="toggleCurrent()">ZARA ON</button>
            </div>
        </div>
        <div class="feed" id="feed"></div>
    </div>
    <script>
        const list = document.getElementById('list');
        const feed = document.getElementById('feed');
        const chatTitle = document.getElementById('chatTitle');
        const chatPhone = document.getElementById('chatPhone');
        const controls = document.getElementById('controls');
        const toggleBtn = document.getElementById('toggleBtn');
        
        let users = {};
        let activeId = null;
        let botStatus = {};

        Promise.all([
            fetch('/api/history').then(r => r.json()),
            fetch('/api/status').then(r => r.json())
        ]).then(([data, status]) => {
            botStatus = status;
            
            let sortedUsers = [];
            Object.keys(data).forEach(id => {
                const hist = data[id];
                if(hist.length > 0) {
                    let name = "Cliente";
                    const m = hist[0].content.match(/\\[Cliente: (.*?)\\]/);
                    if(m) name = m[1];
                    
                    const clean = hist.map(x => ({ 
                        role: x.role === 'assistant' ? 'bot' : 'user', 
                        txt: x.content.replace(/\\[Cliente: .*?\\] /, ''),
                        time: x.timestamp || '' 
                    }));
                    
                    sortedUsers.push({
                        id: id,
                        name: name,
                        phone: id,
                        history: clean,
                        lastMsg: clean[clean.length-1]
                    });
                }
            });

            sortedUsers.forEach(u => {
                users[u.id] = u;
                createCard(u, u.lastMsg.txt);
            });
        });

        const evt = new EventSource("/monitor-stream");
        evt.onmessage = (e) => {
            const d = JSON.parse(e.data);
            if (d.tipo === "MENSAJE" || d.tipo === "RESPUESTA_ZARA" || d.tipo === "REACTIVACION") update(d);
        };

        function update(d) {
            const id = d.telefono;
            if(!id || id === 'undefined') return;

            if (!users[id]) {
                users[id] = { name: d.nombre || 'Cliente', phone: id, history: [] };
                createCard(users[id], "...");
            }
            
            const txt = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? d.texto : d.mensaje;
            const role = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? 'bot' : 'user';
            const time = d.timestamp || new Date().toLocaleTimeString();

            if(!d.restore) {
                users[id].history.push({ role, txt, time });
                if (activeId === id) renderBubble({ role, txt, time });
                
                const card = document.getElementById('c-' + id);
                if(card) {
                    let prev = (role==='bot'?'🤖 ':'') + txt;
                    card.querySelector('.preview').innerText = prev;
                    list.prepend(card); 
                }
            }
        }

        function createCard(u, prev) {
            if(document.getElementById('c-' + u.phone)) return;
            const div = document.createElement('div');
            div.className = 'card';
            div.id = 'c-' + u.phone;
            div.onclick = () => select(u.phone);
            div.innerHTML = \`
                <div class="avatar">\${u.name[0]}</div>
                <div class="info">
                    <div class="name">\${u.name}</div>
                    <div class="preview">\${prev}</div>
                </div>\`;
            list.prepend(div); 
        }

        function select(id) {
            activeId = id;
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            document.getElementById('c-' + id).classList.add('active');
            
            chatTitle.innerText = users[id].name;
            chatPhone.innerText = '+' + users[id].phone;
            chatPhone.href = "https://wa.me/" + users[id].phone;
            controls.style.display = "flex";
            
            updateToggleBtn(id);
            
            feed.innerHTML = '';
            users[id].history.forEach(renderBubble);
            feed.scrollTop = feed.scrollHeight;
        }

        function renderBubble(m) {
            const d = document.createElement('div');
            d.className = 'msg ' + m.role;
            d.innerHTML = m.txt + (m.time ? \`<div class="time">\${m.time}</div>\` : '');
            feed.appendChild(d);
            feed.scrollTop = feed.scrollHeight;
        }
        
        function updateToggleBtn(id) {
            const status = botStatus[id] !== false; 
            toggleBtn.innerText = status ? "ZARA: ON 🟢" : "ZARA: OFF 🔴";
            toggleBtn.className = status ? "" : "off";
        }

        window.toggleCurrent = async function() {
            if(!activeId) return;
            const res = await fetch('/api/toggle-bot?id=' + activeId, { method: 'POST' });
            const newState = await res.json();
            botStatus[activeId] = newState.status;
            updateToggleBtn(activeId);
        }
    </script>
</body>
</html>
`;

app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/history", (req, res) => res.json(getSesiones()));
app.get("/api/status", (req, res) => res.json(getStatus()));
app.get("/monitor-stream", (req, res) => conectarCliente(req, res));
app.post("/api/toggle-bot", (req, res) => {
    const id = req.query.id;
    if(id) {
        const s = toggleBot(id);
        res.json({ status: s });
    } else {
        res.sendStatus(400);
    }
});

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});
app.post("/webhook", async (req, res) => {
  try { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});
app.post("/reservo-webhook", async (req, res) => {
  try { await procesarReserva(req.body); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});

app.listen(PORT, () => {
    console.log(`🟢 ZARA 6.0 LIVE en puerto ${PORT}`);
    console.log(`📊 MONITOR: https://zara-bodyelite-1.onrender.com/monitor`);
});
