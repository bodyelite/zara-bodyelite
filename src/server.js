import express from "express";
import bodyParser from "body-parser";
import { procesarEvento, procesarReserva, getSesiones, getStatus, toggleBot, enviarMensajeManual } from "./app.js"; 
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
        :root { --bg: #050505; --sidebar: #0f0f0f; --text: #ffffff; --accent: #00ff88; --danger: #ff3333; --bubble-user: #1f1f1f; --bubble-bot: #004d33; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        
        .sidebar { width: 350px; background: var(--sidebar); border-right: 1px solid #333; display: flex; flex-direction: column; z-index: 10; }
        .header { padding: 18px; border-bottom: 2px solid var(--accent); font-weight: 900; font-size: 1.2rem; letter-spacing: 0.5px; background: #000; display: flex; justify-content: space-between; align-items: center; }
        .status-dot { width: 12px; height: 12px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        .user-list { flex: 1; overflow-y: auto; }
        .card { padding: 18px; border-bottom: 1px solid #222; cursor: pointer; transition: background 0.2s; display: flex; gap: 12px; align-items: flex-start; }
        .card:hover { background: #1a1a1a; }
        .card.active { background: #1a1a1a; border-left: 4px solid var(--accent); }
        .card.flash { background: #223322; transition: background 0.5s; }
        
        .avatar { width: 45px; height: 45px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; color: #ccc; flex-shrink: 0; }
        .info { flex: 1; overflow: hidden; }
        .top-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .name { font-weight: 700; font-size: 1rem; color: #fff; }
        .time-ago { font-size: 0.75rem; color: var(--accent); font-weight: bold; }
        .preview { font-size: 0.85rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .main { flex: 1; display: flex; flex-direction: column; background: #000; position: relative; }
        .chat-head { padding: 15px 20px; border-bottom: 1px solid #333; background: #111; display: flex; justify-content: space-between; align-items: center; height: 70px; }
        
        .back-btn { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; margin-right: 10px; }
        .chat-info { display: flex; flex-direction: column; }
        #chatTitle { font-weight: bold; font-size: 1.1rem; }
        #chatPhone { font-size: 0.8rem; color: #aaa; text-decoration: none; margin-top: 2px; }
        
        .controls { display: flex; gap: 10px; }
        #toggleBtn { padding: 8px 16px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; background: var(--accent); color: #000; font-size: 0.85rem; }
        #toggleBtn.off { background: var(--danger); color: #fff; }

        .feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
        
        .msg { max-width: 80%; padding: 12px 16px; border-radius: 12px; font-size: 0.95rem; line-height: 1.5; position: relative; word-wrap: break-word; }
        .msg.user { align-self: flex-start; background: var(--bubble-user); color: #e0e0e0; border-bottom-left-radius: 2px; }
        .msg.bot { align-self: flex-end; background: var(--bubble-bot); color: #fff; border: 1px solid #006644; border-bottom-right-radius: 2px; }
        .time { font-size: 0.7rem; color: rgba(255,255,255,0.5); text-align: right; margin-top: 4px; font-variant-numeric: tabular-nums; }
        
        .input-area { padding: 15px; background: #111; border-top: 1px solid #333; display: flex; gap: 10px; }
        #msgInput { flex: 1; background: #222; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 8px; font-size: 1rem; resize: none; outline: none; height: 50px; }
        #msgInput:focus { border-color: var(--accent); }
        #sendBtn { background: var(--accent); color: #000; border: none; border-radius: 8px; width: 50px; font-size: 1.5rem; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        #sendBtn:hover { transform: scale(1.05); }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
            .sidebar { width: 100%; position: absolute; height: 100%; }
            .sidebar.hidden { display: none; }
            .main { display: none; width: 100%; }
            .main.active { display: flex; }
            .back-btn { display: block; }
            .card { padding: 15px; }
            .avatar { width: 40px; height: 40px; }
            .msg { max-width: 85%; font-size: 0.9rem; }
        }
    </style>
</head>
<body>
    <div class="sidebar" id="sidebar">
        <div class="header">ZARA 8.0 <div class="status-dot"></div></div>
        <div class="user-list" id="list"></div>
    </div>
    
    <div class="main" id="mainView">
        <div class="chat-head">
            <div style="display:flex; align-items:center;">
                <button class="back-btn" onclick="showList()">←</button>
                <div class="chat-info">
                    <span id="chatTitle">Selecciona un chat</span>
                    <a id="chatPhone" href="#" target="_blank"></a>
                </div>
            </div>
            <div class="controls" id="controls" style="display:none;">
                <button id="toggleBtn" onclick="toggleCurrent()">ZARA ON</button>
            </div>
        </div>
        
        <div class="feed" id="feed"></div>
        
        <div class="input-area" id="inputArea" style="display:none;">
            <textarea id="msgInput" placeholder="Escribe como humano..."></textarea>
            <button id="sendBtn" onclick="sendManual()">➤</button>
        </div>
    </div>

    <script>
        const list = document.getElementById('list');
        const feed = document.getElementById('feed');
        const sidebar = document.getElementById('sidebar');
        const mainView = document.getElementById('mainView');
        const chatTitle = document.getElementById('chatTitle');
        const chatPhone = document.getElementById('chatPhone');
        const controls = document.getElementById('controls');
        const inputArea = document.getElementById('inputArea');
        const msgInput = document.getElementById('msgInput');
        const toggleBtn = document.getElementById('toggleBtn');
        
        let users = {};
        let activeId = null;
        let botStatus = {};

        function parseTime(timeStr) {
            if(!timeStr) return 0;
            // Formato esperado: "DD/MM, HH:MM"
            // Hack simple: Extraer HH:MM y ordenar por eso si es del mismo dia,
            // pero mejor ordenar por momento de llegada en el array original.
            return timeStr; 
        }

        // FETCH INICIAL
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

            // RENDERIZAR EN ORDEN INVERSO PARA QUE EL ÚLTIMO LEIDO QUEDE ARRIBA
            // (El evento stream se encargará de reordenar dinámicamente)
            sortedUsers.reverse().forEach(u => {
                users[u.id] = u;
                createCard(u, u.lastMsg.txt, u.lastMsg.time);
            });
        });

        // STREAM
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
                createCard(users[id], "...", "");
            }
            
            const txt = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? d.texto : d.mensaje;
            const role = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? 'bot' : 'user';
            const time = d.timestamp || new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit'});

            if(!d.restore) {
                users[id].history.push({ role, txt, time });
                
                if (activeId === id) {
                    renderBubble({ role, txt, time });
                }
                
                // REORDENAR: MOVER CARD AL INICIO
                const card = document.getElementById('c-' + id);
                if(card) {
                    let prev = (role==='bot'?'🤖 ':'') + txt;
                    card.querySelector('.preview').innerText = prev;
                    card.querySelector('.time-ago').innerText = time.split(',')[1] || time;
                    list.prepend(card);
                    card.classList.add('flash');
                    setTimeout(() => card.classList.remove('flash'), 500);
                }
            }
        }

        function createCard(u, prev, time) {
            if(document.getElementById('c-' + u.phone)) return;
            const div = document.createElement('div');
            div.className = 'card';
            div.id = 'c-' + u.phone;
            div.onclick = () => select(u.phone);
            
            const timeDisplay = time ? (time.includes(',') ? time.split(',')[1] : time) : '';

            div.innerHTML = \`
                <div class="avatar">\${u.name[0]}</div>
                <div class="info">
                    <div class="top-row">
                        <div class="name">\${u.name}</div>
                        <div class="time-ago">\${timeDisplay}</div>
                    </div>
                    <div class="preview">\${prev}</div>
                </div>\`;
            list.prepend(div); 
        }

        function select(id) {
            activeId = id;
            
            // MOBILE UI
            if(window.innerWidth <= 768) {
                sidebar.classList.add('hidden');
                mainView.classList.add('active');
            }

            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            document.getElementById('c-' + id).classList.add('active');
            
            chatTitle.innerText = users[id].name;
            chatPhone.innerText = '+' + users[id].phone;
            chatPhone.href = "https://wa.me/" + users[id].phone;
            
            controls.style.display = "flex";
            inputArea.style.display = "flex";
            
            updateToggleBtn(id);
            
            feed.innerHTML = '';
            users[id].history.forEach(renderBubble);
            feed.scrollTop = feed.scrollHeight;
        }

        function showList() {
            sidebar.classList.remove('hidden');
            mainView.classList.remove('active');
            activeId = null;
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

        window.sendManual = async function() {
            const txt = msgInput.value.trim();
            if(!activeId || !txt) return;
            
            msgInput.value = "";
            // Optimistic update
            renderBubble({ role: 'bot', txt: txt, time: new Date().toLocaleTimeString() });
            
            await fetch('/api/manual-msg', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ phone: activeId, text: txt })
            });
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
    } else res.sendStatus(400);
});

app.post("/api/manual-msg", async (req, res) => {
    const { phone, text } = req.body;
    if(phone && text) {
        const ok = await enviarMensajeManual(phone, text);
        res.sendStatus(ok ? 200 : 500);
    } else res.sendStatus(400);
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
    console.log(`🟢 ZARA 8.0 CONTROL TOTAL en puerto ${PORT}`);
    console.log(`📊 MONITOR: https://zara-bodyelite-1.onrender.com/monitor`);
});
