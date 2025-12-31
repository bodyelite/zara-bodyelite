import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA ESTRATEGIA</title><style>:root { --bg: #111b21; --accent: #00a884; --hot: #ff0044; --int: #ff9900; } body { margin:0; font-family: sans-serif; background: var(--bg); color: white; display: flex; height: 100vh; } .sidebar { width: 350px; background: #202c33; border-right: 1px solid #333; overflow-y: auto; } .main { flex: 1; display: flex; flex-direction: column; background: #0b141a; } .card { padding: 15px; border-bottom: 1px solid #2a3942; cursor: pointer; } .tag { font-size: 0.7em; padding: 2px 5px; border-radius: 3px; font-weight: bold; float: right; } .HOT { background: var(--hot); } .INTERESADO { background: var(--int); } .FRIO { background: #667781; } .NUEVO { background: var(--accent); } .strategy-bar { padding: 10px; background: #202c33; display: flex; gap: 10px; border-bottom: 1px solid #333; }</style></head>
    <body>
        <div class="sidebar">
            <div class="strategy-bar">
                <button onclick="run('FRIO')" style="background:#667781; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer">Lanzar FRIOS</button>
                <button onclick="run('INTERESADO')" style="background:var(--int); color:white; border:none; padding:5px; border-radius:4px; cursor:pointer">Lanzar INTERESADOS</button>
            </div>
            <div id="list"></div>
        </div>
        <div class="main"><div id="feed" style="flex:1; padding:20px; overflow-y:auto"></div></div>
        <script>
            async function run(tag) { if(!confirm("¿Lanzar estrategia para "+tag+"?")) return; await fetch("/api/estrat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({tag})}); alert("Estrategia enviada"); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{ 
                const l=document.getElementById("list"); l.innerHTML="";
                Object.keys(d.users).forEach(p=>{ const u=d.users[p]; l.innerHTML += \`<div class="card"><b>\${u.name}</b> <span class="tag \${u.tag}">\${u.tag}</span><br><small>\${u.history[u.history.length-1].content.substring(0,40)}</small></div>\`; });
            });} setInterval(update, 3000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/estrat', async (req, res) => { const count = await ejecutarEstrategia(req.body.tag); res.json({ success: true, count }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
