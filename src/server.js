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
    <title>ZARA ANALYTICS 9.9.3</title>
    <style>
        :root { --bg: #000000; --sidebar: #0a0a0a; --text: #ffffff; --accent: #00ff88; --danger: #ff0044; --strategy: #bd00ff; --gold: #ffd700; --bubble-user: #222; --bubble-bot: #003322; --bubble-system: #004400; --bar-1: #444; --bar-2: #0077ff; --bar-3: #ffaa00; --bar-4: #00ff88; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        
        .sidebar { width: 360px; background: var(--sidebar); border-right: 1px solid #222; display: flex; flex-direction: column; z-index: 20; }
        .header { padding: 20px; border-bottom: 2px solid var(--accent); font-weight: 900; font-size: 1.3rem; letter-spacing: 1px; background: #000; color: var(--accent); display: flex; justify-content: space-between; align-items: center; }
        
        .header-controls { display: flex; gap: 10px; align-items: center; }
        .dl-btn { background: #111; border: 1px solid #333; color: var(--accent); border-radius: 5px; cursor: pointer; padding: 5px 10px; font-size: 0.8rem; text-decoration: none; }
        
        .live-dot { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

        .user-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #333 #000; }
        .card { padding: 18px; border-bottom: 1px solid #1a1a1a; cursor: pointer; transition: 0.2s; display: flex; gap: 15px; align-items: flex-start; }
        .card:hover { background: #111; }
        .card.active { background: #161616; border-left: 4px solid var(--accent); }
        .card.flash { background: #002211; transition: background 0.5s; }
        
        .tag { font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; vertical-align: middle; }
        .tag.frio { background: #333; color: #aaa; border: 1px solid #444; }
        .tag.medio { background: #ffaa00; color: #000; border: 1px solid #ffcc00; }
        .tag.capturado { background: #ff0055; color: #fff; border: 1px solid #ff4477; animation: pulseRed 2s infinite; }
        .tag.agendado { background: #00ff88; color: #000; box-shadow: 0 0 5px #00ff88; border: 1px solid #ccffdd; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 rgba(255,0,85,0.4); } 50% { box-shadow: 0 0 10px rgba(255,0,85,0.8); } 100% { box-shadow: 0 0 0 rgba(255,0,85,0.4); } }
        
        .avatar { width: 50px; height: 50px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #fff; border: 1px solid #333; flex-shrink: 0; }
        .info { flex: 1; overflow: hidden; }
        .top-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; }
        .name-container { display: flex; align-items: center; overflow: hidden; }
        .name { font-weight: 700; font-size: 1rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .time-ago { font-size: 0.8rem; color: var(--accent); font-family: monospace; white-space: nowrap; margin-left: 5px; }
        .preview { font-size: 0.9rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .main { flex: 1; display: flex; flex-direction: column; background: #000; position: relative; width: 100%; }
        .chat-head { padding: 15px; border-bottom: 1px solid #222; background: #0a0a0a; display: flex; justify-content: space-between; align-items: center; height: 70px; }
        
        .back-btn { display: none; background: none; border: none; color: var(--accent); font-size: 2rem; padding: 0 15px 0 0; cursor: pointer; }
        .chat-info h2 { margin: 0; font-size: 1.1rem; }
        
        .controls { display: flex; gap: 10px; }
        .controls button { padding: 8px 15px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.8rem; }
        .btn-toggle { background: var(--accent); color: #000; }
        .btn-toggle.off { background: var(--danger); color: #fff; }
        .btn-strategy { background: var(--strategy); color: #fff; box-shadow: 0 0 10px rgba(189, 0, 255, 0.4); }
        .btn-report { background: #333; color: #fff; border: 1px solid #555; }

        .notification-area { position: absolute; top: 80px; right: 20px; z-index: 100; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .notif-card { background: var(--gold); color: #000; padding: 15px 20px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); font-weight: bold; animation: slideIn 0.5s ease-out; display: flex; align-items: center; gap: 10px; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #000; }
        
        .msg { max-width: 85%; padding: 12px 16px; border-radius: 12px; font-size: 1rem; line-height: 1.5; position: relative; word-wrap: break-word; }
        .msg.user { align-self: flex-start; background: var(--bubble-user); color: #ddd; border-bottom-left-radius: 2px; border: 1px solid #333; }
        .msg.bot { align-self: flex-end; background: var(--bubble-bot); color: #fff; border: 1px solid #005533; border-bottom-right-radius: 2px; }
        .msg.system { align-self: center; background: var(--bubble-system); color: #0f0; border: 1px solid #0f0; font-weight: bold; font-size: 0.9rem; text-align: center; max-width: 95%; }
        
        .time { font-size: 0.7rem; color: rgba(255,255,255,0.4); text-align: right; margin-top: 5px; }

        .input-area { padding: 15px; background: #0a0a0a; border-top: 1px solid #222; display: flex; gap: 10px; align-items: flex-end; }
        textarea { flex: 1; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 12px; border-radius: 8px; font-size: 1rem; resize: none; height: 50px; outline: none; }
        textarea:focus { border-color: var(--accent); }
        .send-btn { width: 50px; height: 50px; background: var(--accent); border: none; border-radius: 8px; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 200; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .modal { background: #111; border: 1px solid #333; padding: 25px; border-radius: 10px; width: 90%; max-width: 450px; color: #fff; box-shadow: 0 0 30px rgba(0,255,136,0.1); }
        .modal h3 { margin-top: 0; color: var(--accent); text-align: center; text-transform: uppercase; letter-spacing: 1px; }
        .date-inputs { display: flex; gap: 10px; margin: 20px 0; align-items: center; }
        .date-inputs input { background: #222; border: 1px solid #444; color: #fff; padding: 8px; border-radius: 5px; flex: 1; color-scheme: dark; }
        .btn-filter { background: var(--accent); color: #000; font-weight: bold; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
        .btn-filter:hover { opacity: 0.9; }
        .funnel-chart { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
        .bar-group { display: flex; flex-direction: column; gap: 5px; }
        .bar-label { font-size: 0.9rem; color: #ccc; display: flex; justify-content: space-between; }
        .bar-track { width: 100%; background: #222; height: 10px; border-radius: 5px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 5px; width: 0%; transition: width 1s ease; }
        .modal-close { margin-top: 20px; width: 100%; padding: 10px; background: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .modal-close:hover { background: #444; }

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
        <div class="header">
            ZARA 9.9.3
            <div class="header-controls">
                <button onclick="openModal()" class="dl-btn btn-report" title="Ver Reporte">📊</button>
                <a href="/api/export-csv" target="_blank" class="dl-btn" title="Descargar CSV">📥 CSV</a>
                <div class="live-dot"></div>
            </div>
        </div>
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
                <button id="strategyBtn" class="btn-strategy" onclick="runStrategy()">🎯 ESTRATEGIA</button>
                <button id="toggleBtn" class="btn-toggle" onclick="toggleCurrent()">ZARA ON</button>
            </div>
        </div>
        <div class="notification-area" id="notifArea"></div>
        <div class="feed" id="feed"></div>
        <div class="input-area" id="inputArea" style="display:none;">
            <textarea id="msgInput" placeholder="Escribe como humano..."></textarea>
            <button class="send-btn" onclick="sendManual()">➤</button>
        </div>
    </div>

    <div class="modal-overlay" id="reportModal">
        <div class="modal">
            <h3>Embudo de Ventas</h3>
            <div class="date-inputs">
                <input type="date" id="dateStart">
                <input type="date" id="dateEnd">
                <button onclick="calcFunnel()" class="btn-filter">FILTRAR</button>
            </div>
            <div class="funnel-chart" id="funnelChart">
                <div style="text-align:center; color:#666;">Selecciona fechas y filtra...</div>
            </div>
            <button class="modal-close" onclick="closeModal()">Cerrar</button>
        </div>
    </div>

    <script>
        function getTimestamp(timeStr) {
            if (!timeStr) return 0;
            const s = timeStr.replace(/\u00A0/g, ' ').trim();
            if (s.includes(',')) {
                try {
                    const parts = s.split(',');
                    const datePart = parts[0].trim().split('/');
                    const day = parseInt(datePart[0]);
                    const month = parseInt(datePart[1]) - 1;
                    let year = new Date().getFullYear(); 
                    if(datePart.length > 2) year = parseInt(datePart[2]);
                    let timePart = parts[1].trim();
                    let isPM = timePart.toLowerCase().includes('p') && !timePart.toLowerCase().includes('a');
                    let isAM = timePart.toLowerCase().includes('a');
                    timePart = timePart.replace(/[a-z\.\s]/gi, '');
                    let [h, m] = timePart.split(':').map(n => parseInt(n));
                    if (isPM && h < 12) h += 12;
                    if (isAM && h === 12) h = 0;
                    return new Date(year, month, day, h, m).getTime();
                } catch(e) {}
            }
            try {
                let d = new Date(s);
                if (!isNaN(d.getTime())) return d.getTime();
                if (s.includes('/') && s.includes(':')) {
                    const [dStr, tStr] = s.split(' ');
                    const [day, month, year] = dStr.split('/').map(n => parseInt(n));
                    const [h, m] = tStr.split(':').map(n => parseInt(n));
                    const y = year || new Date().getFullYear();
                    return new Date(y, month - 1, day, h, m).getTime();
                }
            } catch(e) {}
            return 0;
        }

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
        const strategyBtn = document.getElementById('strategyBtn');
        const notifArea = document.getElementById('notifArea');
        const reportModal = document.getElementById('reportModal');
        let users = {}; let activeId = null; let botStatus = {};

        function calculateStatus(history) {
            let userCount = 0; let isAgendado = false; let isCapturado = false;
            history.forEach(m => {
                if (m.role === 'user') userCount++;
                if (m.role === 'system' && m.txt.includes("RESERVA CONFIRMADA")) isAgendado = true;
                if (m.role === 'bot' && m.txt.includes("llamará")) isCapturado = true;
            });
            if (isAgendado) return { label: 'AGENDADO', class: 'agendado' };
            if (isCapturado) return { label: 'CAPTURADO', class: 'capturado' };
            if (userCount > 1) return { label: 'MEDIO', class: 'medio' };
            return { label: 'FRIO', class: 'frio' };
        }

        Promise.all([fetch('/api/history').then(r => r.json()), fetch('/api/status').then(r => r.json())]).then(([data, status]) => {
            botStatus = status; let sortedUsers = [];
            Object.keys(data).forEach(id => {
                const hist = data[id];
                if(hist.length > 0) {
                    let name = "Cliente";
                    const m = hist[0].content.match(/\\[Cliente: (.*?)\\]/); if(m) name = m[1];
                    const clean = hist.map(x => ({ 
                        role: x.system ? 'system' : (x.role === 'assistant' ? 'bot' : 'user'), 
                        txt: x.content.replace(/\\[Cliente: .*?\\] /, ''),
                        time: x.timestamp || '' 
                    }));
                    const lastMsg = clean[clean.length-1];
                    sortedUsers.push({ id, name, phone: id, history: clean, lastMsg, sortTime: getTimestamp(lastMsg.time) });
                }
            });
            sortedUsers.sort((a, b) => b.sortTime - a.sortTime);
            sortedUsers.forEach(u => { users[u.id] = u; createCard(u, u.lastMsg.txt, u.lastMsg.time, u.history); });
            document.getElementById('dateStart').valueAsDate = new Date();
            document.getElementById('dateEnd').valueAsDate = new Date();
            calcFunnel();
        });

        const evt = new EventSource("/monitor-stream");
        evt.onmessage = (e) => {
            const d = JSON.parse(e.data);
            if (d.tipo === "RESERVA") showNotification(d.nombre);
            else if (d.tipo === "MENSAJE" || d.tipo === "RESPUESTA_ZARA" || d.tipo === "REACTIVACION") update(d);
        };

        function showNotification(nombre) {
            const div = document.createElement('div'); div.className = 'notif-card';
            div.innerHTML = '💰 NUEVA RESERVA CONFIRMADA:<br>' + nombre; notifArea.appendChild(div);
            setTimeout(() => div.remove(), 5000);
            new Audio('https://actions.google.com/sounds/v1/cartoon/clank_car_crash.ogg').play().catch(e=>{});
        }

        function update(d) {
            const id = d.telefono; if(!id) return;
            if (!users[id]) { users[id] = { name: d.nombre || 'Cliente', phone: id, history: [] }; createCard(users[id], "...", "", []); }
            const isSystem = d.nombre === "SISTEMA" || d.texto?.includes("[SISTEMA]");
            const txt = d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? d.texto : d.mensaje;
            const role = isSystem ? 'system' : (d.tipo.includes("ZARA") || d.tipo === "REACTIVACION" ? 'bot' : 'user');
            const time = d.timestamp || new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', hour12: true});

            if(!d.restore) {
                users[id].history.push({ role, txt, time });
                if (activeId === id) renderBubble({ role, txt, time });
                const card = document.getElementById('c-' + id);
                if(card) {
                    const st = calculateStatus(users[id].history);
                    const tagEl = card.querySelector('.tag');
                    if(tagEl) { tagEl.className = 'tag ' + st.class; tagEl.innerText = st.label; }
                    let prev = (role==='bot'?'🤖 ':'') + (role==='system'?'✅ ':'') + txt;
                    card.querySelector('.preview').innerText = prev;
                    let timeShow = time.includes(',') ? time.split(',')[1] : time;
                    card.querySelector('.time-ago').innerText = timeShow;
                    list.prepend(card); card.classList.add('flash'); setTimeout(() => card.classList.remove('flash'), 500);
                }
            }
        }

        function createCard(u, prev, time, history) {
            if(document.getElementById('c-' + u.phone)) return;
            const st = calculateStatus(history || []);
            const div = document.createElement('div'); div.className = 'card'; div.id = 'c-' + u.phone; div.onclick = () => select(u.phone);
            const timeDisplay = time ? (time.includes(',') ? time.split(',')[1] : time) : '';
            div.innerHTML = \`<div class="avatar">\${u.name[0]}</div><div class="info"><div class="top-row"><div class="name-container"><div class="name">\${u.name}</div><div class="tag \${st.class}">\${st.label}</div></div><div class="time-ago">\${timeDisplay}</div></div><div class="preview">\${prev}</div></div>\`;
            list.appendChild(div); 
        }

        function select(id) {
            activeId = id; if(window.innerWidth <= 768) { sidebar.classList.add('hidden'); mainView.classList.add('active'); }
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active')); document.getElementById('c-' + id).classList.add('active');
            chatTitle.innerText = users[id].name; chatPhone.innerText = '+' + users[id].phone; chatPhone.href = "https://wa.me/" + users[id].phone;
            controls.style.display = "flex"; inputArea.style.display = "flex"; updateToggleBtn(id);
            feed.innerHTML = ''; users[id].history.forEach(renderBubble); feed.scrollTop = feed.scrollHeight;
        }
        function showList() { sidebar.classList.remove('hidden'); mainView.classList.remove('active'); activeId = null; }
        function renderBubble(m) {
            const d = document.createElement('div'); d.className = 'msg ' + m.role;
            d.innerHTML = m.txt + (m.time ? \`<div class="time">\${m.time}</div>\` : ''); feed.appendChild(d); feed.scrollTop = feed.scrollHeight;
        }
        function updateToggleBtn(id) {
            const status = botStatus[id] !== false; toggleBtn.innerText = status ? "ZARA: ON 🟢" : "ZARA: OFF 🔴"; toggleBtn.className = status ? "btn-toggle" : "btn-toggle off";
        }
        window.toggleCurrent = async function() { if(!activeId) return; const res = await fetch('/api/toggle-bot?id=' + activeId, { method: 'POST' }); const newState = await res.json(); botStatus[activeId] = newState.status; updateToggleBtn(activeId); }
        window.runStrategy = async function() {
            if(!activeId) return; if(!confirm("¿Lanzar Estrategia?")) return;
            strategyBtn.innerText = "⏳...";
            try { const res = await fetch('/api/strategy-msg', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone: activeId }) });
                if(res.ok) { const data = await res.json(); const nowTime = new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', hour12: true}); renderBubble({ role: 'bot', txt: data.msg, time: nowTime }); } 
            } catch(e) {} strategyBtn.innerText = "🎯 ESTRATEGIA";
        }
        window.sendManual = async function() {
            const txt = msgInput.value.trim(); if(!activeId || !txt) return; msgInput.value = "";
            const nowTime = new Date().toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', hour12: true}); renderBubble({ role: 'bot', txt: txt, time: nowTime });
            await fetch('/api/manual-msg', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone: activeId, text: txt }) });
        }

        window.openModal = function() { reportModal.style.display = 'flex'; calcFunnel(); }
        window.closeModal = function() { reportModal.style.display = 'none'; }
        
        window.calcFunnel = function() {
            const startInput = document.getElementById('dateStart').value;
            const endInput = document.getElementById('dateEnd').value;
            if(!startInput || !endInput) return;

            const [sY, sM, sD] = startInput.split('-').map(Number);
            const start = new Date(sY, sM-1, sD, 0, 0, 0, 0);

            const [eY, eM, eD] = endInput.split('-').map(Number);
            const end = new Date(eY, eM-1, eD, 23, 59, 59, 999);

            let leads = 0, conversados = 0, interesados = 0, agendados = 0;

            Object.values(users).forEach(u => {
                const msgsInRange = u.history.filter(m => {
                    const ts = getTimestamp(m.time);
                    return ts >= start.getTime() && ts <= end.getTime();
                });

                if(msgsInRange.length > 0) {
                    leads++;
                    let userMsgCount = 0; let isAgendado = false; let isCapturado = false;

                    msgsInRange.forEach(m => {
                        if (m.role === 'user') userMsgCount++;
                        if (m.role === 'system' && m.txt.includes("RESERVA CONFIRMADA")) isAgendado = true;
                        if (m.role === 'bot' && m.txt.includes("llamará")) isCapturado = true;
                    });

                    if(userMsgCount > 0) conversados++;
                    if(userMsgCount > 1 || isCapturado || isAgendado) interesados++;
                    if(isAgendado) agendados++;
                }
            });

            const max = leads > 0 ? leads : 1;
            const pConversados = Math.round((conversados / max) * 100);
            const pInteresados = Math.round((interesados / max) * 100);
            const pAgendados = Math.round((agendados / max) * 100);

            document.getElementById('funnelChart').innerHTML = \`
                <div class="bar-group">
                    <div class="bar-label"><span>📉 Total Leads</span><span>\${leads} (100%)</span></div>
                    <div class="bar-track"><div class="bar-fill" style="width: 100%; background: var(--bar-1)"></div></div>
                </div>
                <div class="bar-group">
                    <div class="bar-label"><span>💬 Conversados</span><span>\${conversados} (\${pConversados}%)</span></div>
                    <div class="bar-track"><div class="bar-fill" style="width: \${pConversados}%; background: var(--bar-2)"></div></div>
                </div>
                <div class="bar-group">
                    <div class="bar-label"><span>🔥 Interesados</span><span>\${interesados} (\${pInteresados}%)</span></div>
                    <div class="bar-track"><div class="bar-fill" style="width: \${pInteresados}%; background: var(--bar-3)"></div></div>
                </div>
                <div class="bar-group">
                    <div class="bar-label"><span>💰 Agendados (Ventas)</span><span>\${agendados} (\${pAgendados}%)</span></div>
                    <div class="bar-track"><div class="bar-fill" style="width: \${pAgendados}%; background: var(--bar-4); box-shadow: 0 0 10px var(--bar-4)"></div></div>
                </div>
            \`;
        }
    </script>
</body>
</html>
`;

app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/history", (req, res) => res.json(getSesiones()));
app.get("/api/status", (req, res) => res.json(getStatus()));
app.get("/monitor-stream", (req, res) => conectarCliente(req, res));
app.get("/api/export-csv", (req, res) => {
    const data = getSesiones();
    const status = getStatus();
    let csv = "\uFEFFNombre,Telefono,Estado,Link_WSP,Estado_Bot,Ultimo_Mensaje,Fecha\n";
    for (const [phone, history] of Object.entries(data)) {
        if (!history || history.length === 0) continue;
        let name = "Cliente"; let userMsgCount = 0; let isAgendado = false; let isCapturado = false;
        history.forEach(m => {
            if (m.role === 'user') { userMsgCount++; const matchName = m.content.match(/\[Cliente: (.*?)\]/); if (matchName) name = matchName[1]; }
            if (m.role === 'assistant') { if (m.content.includes("te llamarán muy pronto")) isCapturado = true; if (m.content.includes("RESERVA CONFIRMADA")) isAgendado = true; }
        });
        let clasificacion = "FRIO";
        if (isAgendado) clasificacion = "AGENDADO (Objetivo)";
        else if (isCapturado) clasificacion = "CAPTURADO (Llamar)";
        else if (userMsgCount > 1) clasificacion = "MEDIO (Interesado)";
        const last = history[history.length - 1];
        const safeMsg = last.content.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""');
        const botState = status[phone] === false ? "OFF" : "ON";
        csv += `"${name}","${phone}","${clasificacion}","https://wa.me/${phone}","${botState}","${safeMsg}","${last.timestamp}"\n`;
    }
    res.header("Content-Type", "text/csv"); res.attachment("zara_clientes.csv"); res.send(csv);
});

app.post("/api/toggle-bot", (req, res) => { const id = req.query.id; if(id) { const s = toggleBot(id); res.json({ status: s }); } else res.sendStatus(400); });
app.post("/api/manual-msg", async (req, res) => { const { phone, text } = req.body; if(phone && text) { const ok = await enviarMensajeManual(phone, text); res.sendStatus(ok ? 200 : 500); } else res.sendStatus(400); });

// === ESTRATEGIA INTELIGENTE RECONQUISTA ===
app.post("/api/strategy-msg", async (req, res) => {
    const { phone } = req.body; const historial = getSesiones()[phone]; if (!phone || !historial) return res.sendStatus(404);
    let isAgendado = false; let isCapturado = false; let userMsgCount = 0;
    historial.forEach(m => { if (m.role === 'user') userMsgCount++; if (m.role === 'assistant') { if (m.content.includes("te llamarán muy pronto")) isCapturado = true; if (m.content.includes("RESERVA CONFIRMADA")) isAgendado = true; } });
    
    let mensajeEstrategico = "";
    if (isAgendado) {
        mensajeEstrategico = "Hola! 🌟 Veo tu reserva confirmada. Todo listo por aquí. ¿Necesitas que te envíe la ubicación exacta?";
    } else if (isCapturado) {
        mensajeEstrategico = "Hola! 📞 Te escribo para chequear: ¿Te alcanzaron a llamar mis compañeras para agendar o prefieres ver horarios por aquí?";
    } else if (userMsgCount > 1) {
        mensajeEstrategico = "Hola! 👋 Me quedé pensando en tu caso. Se nos liberó un cupo de evaluación para mañana. ¿Te gustaría tomarlo?";
    } else {
        mensajeEstrategico = "Hola! ✨ Estamos cerrando agenda de la semana. ¿Te interesaba agendar una cita o prefieres que te avise para el próximo mes?";
    }

    const enviado = await enviarMensajeManual(phone, mensajeEstrategico);
    if (enviado) res.json({ msg: mensajeEstrategico }); else res.sendStatus(500);
});

app.get("/webhook", (req, res) => { if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VERIFY_TOKEN) res.send(req.query["hub.challenge"]); else res.sendStatus(403); });
app.post("/webhook", async (req, res) => { try { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); } catch (e) { res.sendStatus(500); } });
app.get("/api/reservo-webhook", async (req, res) => { try { const { name, phone, date } = req.query; console.log(`[RESERVO] Nueva reserva: ${name} - ${phone} - ${date}`); await procesarReserva({ clientName: name || "Cliente Reservo", clientPhone: phone, date: date, status: "CONFIRMADO" }); res.send("Reserva Procesada"); } catch (e) { console.error(e); res.sendStatus(500); } });

app.listen(PORT, () => {
    console.log(`🟢 ZARA 9.9.3 STRATEGY en puerto ${PORT}`);
    console.log(`📊 MONITOR: https://zara-bodyelite-1.onrender.com/monitor`);
});
