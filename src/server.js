import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA BONITA MONITOR</title><style>:root { --bg: #111b21; --accent: #00a884; --hot: #ff0044; --int: #ff9900; --frio: #667781; --elim: #333; } body { margin:0; font-family: sans-serif; background: var(--bg); color: white; display: flex; height: 100vh; } .sidebar { width: 350px; background: #202c33; border-right: 1px solid #333; overflow-y: auto; display:flex; flex-direction:column; } .card { padding: 15px; border-bottom: 1px solid #2a3942; cursor: pointer; } .card.ELIMINADO { opacity: 0.4; } .tag { font-size: 0.7em; padding: 2px 5px; border-radius: 3px; font-weight: bold; float: right; } .HOT { background: var(--hot); } .INTERESADO { background: var(--int); } .FRIO { background: var(--frio); } .NUEVO { background: var(--accent); } .ELIMINADO { background: var(--elim); }</style></head>
    <body>
        <div class="sidebar">
            <div style="padding:15px; background:#202c33; border-bottom:1px solid #333">
                <button onclick="run('FRIO')" style="background:var(--frio); color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; width:100%; margin-bottom:5px">Simular Estrategia FRIOS ❄️</button>
                <button onclick="run('INTERESADO')" style="background:var(--int); color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; width:100%">Simular Estrategia INTERESADOS 🔥</button>
            </div>
            <div id="list" style="flex:1; overflow-y:auto"></div>
        </div>
        <div class="main"><div id="feed" style="flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:10px"></div></div>
        <script>
            let ap = null;
            async function run(tag) { await fetch("/api/estrat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({tag})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{ 
                const l=document.getElementById("list"); l.innerHTML="";
                const users = d.users;
                const sorted = Object.keys(users).sort((a,b) => {
                    if (users[a].tag === "ELIMINADO" && users[b].tag !== "ELIMINADO") return 1;
                    if (users[a].tag !== "ELIMINADO" && users[b].tag === "ELIMINADO") return -1;
                    return (users[b].history[users[b].history.length-1]?.timestamp || 0) - (users[a].history[users[a].history.length-1]?.timestamp || 0);
                });
                sorted.forEach(p=>{ const u=users[p]; const last = u.history[u.history.length-1]; l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')"><b>\${u.name}</b> <span class="tag \${u.tag}">\${u.tag}</span><br><small>\${last.content.substring(0,30)}</small></div>\`; });
                if(ap) renderChat(users[ap]);
            });}
            function select(p){ ap=p; update(); }
            function renderChat(u){ const f=document.getElementById("feed"); f.innerHTML=""; u.history.forEach(m=>{ const d=document.createElement("div"); d.style = \`max-width:70%; padding:10px; border-radius:8px; \${m.role==='assistant'?'align-self:flex-end; background:#005c4b':'align-self:flex-start; background:#202c33'}\`; d.innerHTML = \`<div>\${m.content}</div>\`; f.appendChild(d); }); f.scrollTop = f.scrollHeight; }
            setInterval(update, 3000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
