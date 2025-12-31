import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA BONITA</title><style>:root { --bg: #111b21; --accent: #00a884; --hot: #ff0044; --int: #ff9900; } body { margin:0; font-family: sans-serif; background: var(--bg); color: white; display: flex; height: 100vh; } .sidebar { width: 350px; background: #202c33; border-right: 1px solid #333; overflow-y: auto; display:flex; flex-direction:column; } .card { padding: 12px; border-bottom: 1px solid #2a3942; cursor: pointer; } .card.ELIMINADO { opacity: 0.3; } .tag { font-size: 0.7em; padding: 2px 5px; border-radius: 3px; font-weight: bold; float: right; } .HOT { background: var(--hot); } .INTERESADO { background: var(--int); } .FRIO { background: #667781; } .NUEVO { background: var(--accent); } .ELIMINADO { background: #000; } .msg { max-width: 75%; padding: 8px; border-radius: 8px; margin-bottom: 5px; position: relative; } .time { font-size: 0.65em; opacity: 0.5; text-align: right; margin-top: 3px; }</style></head>
    <body>
        <div class="sidebar">
            <div style="padding:10px; display:flex; gap:5px">
                <button onclick="run('FRIO')" style="background:#667781; color:white; border:none; padding:8px; flex:1; cursor:pointer">FRIO ❄️</button>
                <button onclick="run('INTERESADO')" style="background:var(--int); color:white; border:none; padding:8px; flex:1; cursor:pointer">INT 🔥</button>
            </div>
            <div id="list"></div>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; background:#0b141a">
            <div id="feed" style="flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column"></div>
            <div id="input" style="padding:15px; background:#202c33; display:none"><input id="m" style="width:90%; padding:10px; background:#2a3942; border:none; color:white" onkeypress="if(event.key==='Enter')send()"></div>
        </div>
        <script>
            let ap = null;
            const fmt = (ts) => new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            async function run(t) { await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                const sorted = Object.keys(d.users).sort((a,b) => {
                    if (d.users[a].tag === "ELIMINADO" && d.users[b].tag !== "ELIMINADO") return 1;
                    if (d.users[a].tag !== "ELIMINADO" && d.users[b].tag === "ELIMINADO") return -1;
                    return (d.users[b].lastInteraction || 0) - (d.users[a].lastInteraction || 0);
                });
                sorted.forEach(p => {
                    const u=d.users[p]; const last=u.history[u.history.length-1];
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <span class="tag \${u.tag}">\${u.tag}</span><b>\${u.name}</b><br>
                        <small style="opacity:0.6">\${fmt(u.lastInteraction)} - \${last?.content.substring(0,25)}...</small>
                    </div>\`;
                });
                if(ap) renderChat(d.users[ap]);
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="block"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const isB = m.role==='assistant';
                    const div = document.createElement("div");
                    div.className = "msg";
                    div.style = \`align-self:\${isB?'flex-end':'flex-start'}; background:\${isB?'#005c4b':'#202c33'}\`;
                    div.innerHTML = \`<div>\${m.content}</div><div class="time">\${fmt(m.timestamp)}</div>\`;
                    f.appendChild(div);
                });
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ const i=document.getElementById("m"); if(!i.value) return; await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:i.value})}); i.value=""; update(); }
            setInterval(update, 3000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
