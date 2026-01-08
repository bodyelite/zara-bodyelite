import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota } from './app.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// --- DASHBOARD POTENTE 9.0 (MODO DISCO RENDER) ---
app.get('/monitor', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8"><title>ZARA CRM POTENTE 9.0</title>
    <style>
        :root { --primary: #2563eb; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 350px; border-right: 1px solid #334155; display: flex; flex-direction: column; background: #111827; }
        .main { flex: 1; display: flex; flex-direction: column; background: #0f172a; }
        .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; background: #1e293b; border-bottom: 1px solid #334155; }
        .stat-card { background: #334155; padding: 10px; border-radius: 8px; text-align: center; font-size: 12px; }
        .lead-list { flex: 1; overflow-y: auto; }
        .lead-item { padding: 15px; border-bottom: 1px solid #1e293b; cursor: pointer; transition: 0.2s; border-left: 4px solid transparent; }
        .lead-item:hover { background: #1e293b; }
        .lead-item.active { background: #1e293b; border-left-color: var(--primary); }
        .badge { font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; background: #475569; }
        .chat-area { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 15px; font-size: 13.5px; line-height: 1.5; position: relative; }
        .msg.user { align-self: flex-start; background: #334155; color: white; border-bottom-left-radius: 2px; }
        .msg.bot { align-self: flex-end; background: var(--primary); color: white; border-bottom-right-radius: 2px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div style="padding:20px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center">
            <h2 style="margin:0; font-size:16px; color:var(--primary)">💎 ZARA 9.0 POTENTE</h2>
            <span style="font-size:10px; color:#64748b">DISCO ACTIVO</span>
        </div>
        <div class="stats-bar" id="stats"></div>
        <div class="lead-list" id="list"></div>
    </div>
    <div class="main">
        <div id="chatHeader" style="padding:15px 20px; background:#1e293b; border-bottom:1px solid #334155; display:flex; justify-content:space-between">
            <h3 id="curUser" style="margin:0; font-size:16px">Selecciona un cliente</h3>
            <div id="statusBadge"></div>
        </div>
        <div class="chat-area" id="chat"></div>
        <div style="padding:15px; background:#1e293b; display:flex; gap:10px; border-top:1px solid #334155">
            <input type="text" id="input" style="flex:1; padding:12px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:white" placeholder="Mensaje manual...">
            <button onclick="send()" style="padding:0 20px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer">ENVIAR</button>
        </div>
    </div>
    <script>
        let data = {}; let selected = null;
        async function refresh() {
            try {
                const r = await fetch('/api/data');
                data = await r.json();
                render();
            } catch(e) { console.error("Error refresh"); }
        }
        function render() {
            const list = document.getElementById('list');
            const stats = document.getElementById('stats');
            const users = Object.values(data.users || {}).sort((a,b) => b.lastInteraction - a.lastInteraction);
            
            stats.innerHTML = \`<div class="stat-card"><b style="color:var(--primary)">\${users.length}</b><br>LEADS</div>
                               <div class="stat-card"><b style="color:#fbbf24">\${users.filter(u=>u.tag==='HOT').length}</b><br>HOT</div>
                               <div class="stat-card"><b style="color:#4ade80">\${users.filter(u=>u.tag==='AGENDADO').length}</b><br>CITAS</div>\`;

            list.innerHTML = users.map(u => \`
                <div class="lead-item \${selected === u.phone ? 'active' : ''}" onclick="selectUser('\${u.phone}')">
                    <div style="display:flex; justify-content:space-between"><b>\${u.name || u.phone}</b></div>
                    <span class="badge" style="background:\${u.tag==='AGENDADO'?'#065f46':u.tag==='HOT'?'#991b1b':'#334155'}">\${u.tag || 'NUEVO'}</span>
                </div>
            \`).join('');

            if(selected && data.users[selected]) {
                const u = data.users[selected];
                document.getElementById('curUser').innerText = u.name || selected;
                document.getElementById('chat').innerHTML = u.history.map(m => \`
                    <div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>
                \`).join('');
                const c = document.getElementById('chat'); c.scrollTop = c.scrollHeight;
            }
        }
        function selectUser(p) { selected = p; render(); }
        async function send() {
            const i = document.getElementById('input'); if(!i.value || !selected) return;
            await fetch('/api/manual', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({phone: selected, text: i.value})
            });
            i.value = ''; refresh();
        }
        setInterval(refresh, 5000);
        refresh();
    </script>
</body>
</html>
    `);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { const { procesarEvento } = await import('./app.js'); await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA DASHBOARD 9.0 ONLINE"));
