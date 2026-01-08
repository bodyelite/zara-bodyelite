import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, procesarEvento } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8"><title>ZARA CRM 9.0 POTENTE</title>
    <style>
        :root { --primary: #2563eb; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 320px; border-right: 1px solid #334155; display: flex; flex-direction: column; background: #111827; }
        .main { flex: 1; display: flex; flex-direction: column; background: #0f172a; }
        .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; background: #1e293b; border-bottom: 1px solid #334155; }
        .stat-card { background: #334155; padding: 10px; border-radius: 8px; text-align: center; font-size: 11px; }
        .lead-list { flex: 1; overflow-y: auto; }
        .lead-item { padding: 15px; border-bottom: 1px solid #1e293b; cursor: pointer; border-left: 4px solid transparent; }
        .lead-item.active { background: var(--primary); }
        .badge { font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; background: #475569; }
        .chat-area { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
        .msg { max-width: 80%; padding: 10px; border-radius: 12px; font-size: 13px; }
        .msg.user { align-self: flex-start; background: #334155; }
        .msg.bot { align-self: flex-end; background: var(--primary); }
    </style>
</head>
<body>
    <div class="sidebar">
        <div style="padding:20px; border-bottom:1px solid #334155">
            <h2 style="margin:0; font-size:16px; color:var(--primary)">💎 ZARA CRM 9.0 PRO</h2>
        </div>
        <div class="stats-bar" id="stats"></div>
        <div class="lead-list" id="list"></div>
    </div>
    <div class="main">
        <div style="padding:15px; background:#1e293b; border-bottom:1px solid #334155; display:flex; justify-content:space-between">
            <h3 id="uName" style="margin:0; font-size:16px">Selecciona un cliente</h3>
            <div id="botControl"></div>
        </div>
        <div class="chat-area" id="chat"></div>
        <div style="padding:15px; background:#1e293b; display:flex; gap:10px">
            <input type="text" id="input" style="flex:1; padding:12px; border-radius:8px; border:none; background:#0f172a; color:white" placeholder="Mensaje...">
            <button onclick="send()" style="padding:0 20px; background:var(--primary); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold">ENVIAR</button>
        </div>
    </div>
    <script>
        let data = {}; let selected = null;
        async function refresh() {
            try {
                const r = await fetch('/api/data');
                data = await r.json();
                render();
            } catch(e) {}
        }
        function render() {
            const list = document.getElementById('list');
            const stats = document.getElementById('stats');
            const users = Object.values(data.users || {}).sort((a,b) => b.lastInteraction - a.lastInteraction);
            
            stats.innerHTML = \`<div class="stat-card"><b>\${users.length}</b><br>LEADS</div>
                               <div class="stat-card"><b>\${users.filter(u=>u.tag==='HOT').length}</b><br>HOT</div>
                               <div class="stat-card"><b>\${users.filter(u=>u.tag==='AGENDADO').length}</b><br>CITAS</div>\`;

            list.innerHTML = users.map(u => \`
                <div class="lead-item \${selected === u.phone ? 'active' : ''}" onclick="selectUser('\${u.phone}')">
                    <b>\${u.name || u.phone}</b><br><span class="badge">\${u.tag || 'NUEVO'}</span>
                </div>\`).join('');

            if(selected && data.users[selected]) {
                const u = data.users[selected];
                const botOn = data.botStatus[selected] !== false;
                document.getElementById('uName').innerText = u.name;
                document.getElementById('botControl').innerHTML = \`<button onclick="toggleBot()" style="background:\${botOn?'#059669':'#991b1b'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer">BOT: \${botOn?'ON':'OFF'}</button>\`;
                document.getElementById('chat').innerHTML = u.history.map(m => \`<div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>\`).join('');
                const c = document.getElementById('chat'); c.scrollTop = c.scrollHeight;
            }
        }
        function selectUser(p) { selected = p; render(); }
        async function toggleBot() { await fetch('/api/toggle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:selected})}); refresh(); }
        async function send() {
            const i = document.getElementById('input');
            await fetch('/api/manual', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({phone: selected, text: i.value}) });
            i.value = ''; refresh();
        }
        setInterval(refresh, 4000); refresh();
    </script>
</body>
</html>
    `);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM 9.0 POTENTE ONLINE 🚀"));
