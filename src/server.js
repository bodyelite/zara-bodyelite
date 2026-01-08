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
        <meta charset="UTF-8"><title>ZARA CRM 9.0</title>
        <style>
            :root { --primary: #2563eb; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
            body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
            .sidebar { width: 350px; border-right: 1px solid #334155; display: flex; flex-direction: column; background: #111827; }
            .main { flex: 1; display: flex; flex-direction: column; }
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-item { padding: 15px; border-bottom: 1px solid #1e293b; cursor: pointer; border-left: 4px solid transparent; }
            .lead-item.active { background: #1e293b; border-left-color: var(--primary); }
            .chat-area { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 80%; padding: 10px; border-radius: 10px; font-size: 14px; }
            .msg.user { align-self: flex-start; background: #334155; }
            .msg.bot { align-self: flex-end; background: var(--primary); }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div style="padding:20px; border-bottom:1px solid #334155"><h2>💎 ZARA 9.0</h2></div>
            <div class="lead-list" id="list"></div>
        </div>
        <div class="main">
            <div style="padding:20px; background:#1e293b; border-bottom:1px solid #334155"><h3 id="uName">Selecciona un cliente</h3></div>
            <div class="chat-area" id="chat"></div>
            <div style="padding:20px; background:#1e293b; display:flex; gap:10px">
                <input type="text" id="input" style="flex:1; padding:12px; border-radius:8px; border:none; background:#0f172a; color:white" placeholder="Mensaje...">
                <button onclick="send()" style="padding:10px 20px; background:var(--primary); color:white; border:none; border-radius:8px; cursor:pointer">ENVIAR</button>
            </div>
        </div>
        <script>
            let data = {}; let selected = null;
            async function load() {
                try {
                    const r = await fetch('/api/data');
                    data = await r.json();
                    const list = document.getElementById('list');
                    const users = Object.values(data.users).sort((a,b)=>b.lastInteraction-a.lastInteraction);
                    list.innerHTML = users.map(u => \`
                        <div class="lead-item \${selected === u.phone ? 'active' : ''}" onclick="show('\${u.phone}')">
                            <b>\${u.name || u.phone}</b><br><small>\${u.tag || 'NUEVO'}</small>
                        </div>\`).join('');
                    if(selected) show(selected);
                } catch(e) {}
            }
            function show(p) {
                selected = p; const u = data.users[p];
                if(!u) return;
                document.getElementById('uName').innerText = u.name;
                document.getElementById('chat').innerHTML = u.history.map(m => \`
                    <div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>\`).join('');
                const c = document.getElementById('chat'); c.scrollTop = c.scrollHeight;
            }
            async function send() {
                const i = document.getElementById('input');
                await fetch('/api/manual', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({phone: selected, text: i.value}) });
                i.value = ''; load();
            }
            setInterval(load, 5000); load();
        </script>
    </body>
    </html>
    `);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA ONLINE 🚀"));
