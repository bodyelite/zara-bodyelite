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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ZARA MONITOR 9.1</title>
    <style>
        :root { --bg: #000000; --sidebar: #0a0a0a; --text: #ffffff; --accent: #00ff88; --danger: #ff0044; --bubble-user: #222; --bubble-bot: #003322; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        
        .sidebar { width: 360px; background: var(--sidebar); border-right: 1px solid #222; display: flex; flex-direction: column; z-index: 20; }
        .header { padding: 20px; border-bottom: 2px solid var(--accent); font-weight: 900; font-size: 1.3rem; letter-spacing: 1px; background: #000; color: var(--accent); display: flex; justify-content: space-between; align-items: center; }
        .live-dot { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

        .user-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #333 #000; }
        .card { padding: 18px; border-bottom: 1px solid #1a1a1a; cursor: pointer; transition: 0.2s; display: flex; gap: 15px; align-items: flex-start; }
        .card:hover { background: #111; }
        .card.active { background: #161616; border-left: 4px solid var(--accent); }
        .card.flash { background: #002211; transition: background 0.5s; }
        
        .avatar { width: 50px; height: 50px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #fff; border: 1px solid #333; flex-shrink: 0; }
        .info { flex: 1; overflow: hidden; }
        .top-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .name { font-weight: 700; font-size: 1rem; color: #fff; }
        .time-ago { font-size: 0.8rem; color: var(--accent); font-family: monospace; }
        .preview { font-size: 0.9rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .main { flex: 1; display: flex; flex-direction: column; background: #000; position: relative; width: 100%; }
        .chat-head { padding: 15px; border-bottom: 1px solid #222; background: #0a0a0a; display: flex; justify-content: space-between; align-items: center; height: 70px; }
        
        .back-btn { display: none; background: none; border: none; color: var(--accent); font-size: 2rem; padding: 0 15px 0 0; cursor: pointer; }
        .chat-info h2 { margin: 0; font-size: 1.1rem; }
        .chat-info a { color: #888; text-decoration: none; font-size: 0.9rem; }
        
        .controls button { padding: 8px 15px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; background: var(--accent); color: #000; font-size: 0.9rem; }
        .controls button.off { background: var(--danger); color: #fff; }

        .feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #000; }
        
        .msg { max-width: 85%; padding: 12px 16px; border-radius: 12px; font-size: 1rem; line-height: 1.5; position: relative; word-wrap: break-word; }
        .msg.user { align-self: flex-start; background: var(--bubble-user); color: #ddd; border-bottom-left-radius: 2px; border: 1px solid #333; }
        .msg.bot { align-self: flex-end; background: var(--bubble-bot); color: #fff; border: 1px solid #005533; border-bottom-right-radius: 2px; }
        .time { font-size: 0.7rem; color: rgba(255,255,255,0.4); text-align: right; margin-top: 5px; }

        .input-area { padding: 15px; background: #0a0a0a; border-top: 1px solid #222; display: flex; gap: 10px; align-items: flex-end; }
        textarea { flex: 1; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 8px; font-size: 1rem; resize: none; height: 50px; outline: none; }
        textarea:focus { border-color: var(--accent); }
        .send-btn { width: 50px; height: 50px; background: var(--accent); border: none; border-radius: 8px; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 768px) {
            .sidebar { width: 100%; position: absolute; height: 100%; transition: transform 0.3s ease; }
            .sidebar.hidden { transform: translateX(-100%); }
            .main { width: 100%; display: none; }
            .main.active { display: flex; }
            .back-btn { display: block; }
        }
    </style>
</head>
<body>
    <div class="sidebar" id="sidebar">
        <div class="header">ZARA 9.1 <div class="live-dot"></div></div>
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
            <button class="send-btn" onclick="sendManual()">➤</button>
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

        // PARSER ESPECÍFICO PARA: "26/12, 06:47 p. m."
        function getTimestamp(timeStr) {
            if (!timeStr) return 0;
            try {
                // Separar fecha y hora
                const parts = timeStr.split(','); 
                if (parts.length < 2) return 0;

                const dateParts = parts[0].trim().split('/');
                const day = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]) - 1; // Mes 0-11
                
                let timeRaw = parts[1].trim(); // "06:47 p. m."
                let isPM = timeRaw.includes("p. m.") || timeRaw.includes("pm") || timeRaw.includes("PM");
                let timeClean = timeRaw.replace("p. m.", "").replace("a. m.", "").replace("p.m.", "").replace("a.m.", "").trim();
                
                const timeParts = timeClean.split(':');
                let hour = parseInt(timeParts[0]);
                const min = parseInt(timeParts[1]);

                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;

                const now = new Date();
                const d = new Date(now.getFullYear(), month, day, hour, min);
                return d.getTime();
            } catch (e) { return 0; }
        }

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
                    
                    const lastMsg = clean[clean.length-1];

                    sortedUsers.push({
                        id: id,
                        name: name,
                        phone: id,
                        history: clean,
                        lastMsg: lastMsg,
                        sortTime: getTimestamp(lastMsg.time)
                    });
                }
            });

            // ORDENAR: Mayor timestamp primero
            sortedUsers.sort((a, b) => b.sortTime - a.sortTime);

            sortedUsers.forEach(u => {
                users[u.id] = u;
                createCard(u, u.lastMsg.txt, u.lastMsg.time);
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
                createCard(users[id], "...", "");
            }
            
            const txt = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? d.texto : d.mensaje;
            const role = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? 'bot' : 'user';
            const time = d.timestamp || new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', hour12: true});

            if(!d.restore) {
                users[id].history.push({ role, txt, time });
                if (activeId === id) renderBubble({ role, txt, time });
                
                const card = document.getElementById('c-' + id);
                if(card) {
                    let prev = (role==='bot'?'🤖 ':'') + txt;
                    card.querySelector('.preview').innerText = prev;
                    
                    // Actualizar hora y mover al inicio
                    let timeShow = time.includes(',') ? time.split(',')[1] : time;
                    card.querySelector('.time-ago').innerText = timeShow;
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
            list.appendChild(div); 
        }

        function select(id) {
            activeId = id;
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
            
            // Render optimista
            const nowTime = new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', hour12: true});
            renderBubble({ role: 'bot', txt: txt, time: nowTime });
            
            await fetch('/api/manual-msg', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ phone: activeId, text: txt })
            });
        }
    </script>
</body>
</html>
