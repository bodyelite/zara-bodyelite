import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>ZARA 9.0 - DISCO RENDER</title>
        <style>
            body { background: #0f172a; color: white; font-family: sans-serif; margin: 0; display: flex; height: 100vh; }
            .sidebar { width: 300px; border-right: 1px solid #334155; padding: 20px; overflow-y: auto; }
            .chat { flex: 1; padding: 20px; display: flex; flex-direction: column; }
            .lead { padding: 10px; border-bottom: 1px solid #1e293b; cursor: pointer; }
            .lead:hover { background: #1e293b; }
            .msg { margin: 5px 0; padding: 10px; border-radius: 10px; max-width: 80%; }
            .bot { background: #2563eb; align-self: flex-end; }
            .user { background: #334155; align-self: flex-start; }
            #chatBox { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <h3>💎 ZARA 9.0</h3>
            <div id="list">Cargando...</div>
        </div>
        <div class="chat">
            <h2 id="uName">Selecciona Cliente</h2>
            <div id="chatBox"></div>
        </div>
        <script>
            let data = {};
            async function load() {
                const r = await fetch('/api/data');
                data = await r.json();
                const list = document.getElementById('list');
                list.innerHTML = Object.values(data.users).sort((a,b)=>b.lastInteraction-a.lastInteraction).map(u => \`
                    <div class="lead" onclick="show('\${u.phone}')">
                        <b>\${u.name || u.phone}</b><br><small>\${u.tag || 'NUEVO'}</small>
                    </div>
                \`).join('');
            }
            function show(p) {
                const u = data.users[p];
                document.getElementById('uName').innerText = u.name;
                document.getElementById('chatBox').innerHTML = u.history.map(m => \`
                    <div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>
                \`).join('');
            }
            setInterval(load, 5000); load();
        </script>
    </body>
    </html>
    `);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { const { procesarEvento } = await import('./app.js'); await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA ONLINE"));
