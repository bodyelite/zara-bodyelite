import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA BONITA</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --accent: #00a884; --hot: #ff0044; --int: #ff9900; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        .sidebar { width: 350px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; } 
        
        .card { padding: 15px; border-bottom: 1px solid #222d34; cursor: pointer; position: relative; transition: 0.3s; } 
        .card.active { background: #2a3942; }
        
        /* ALERTA HOT ROJA PARPADEANTE */
        .card.HOT { 
            background: #440011 !important; 
            border-left: 8px solid var(--hot) !important; 
            animation: pulse-red 1.5s infinite;
        }
        @keyframes pulse-red { 0% { background: #440011; } 50% { background: #880022; } 100% { background: #440011; } }
        
        .card.INTERESADO { border-left: 5px solid var(--int); }
        .card.ELIMINADO { opacity: 0.2; background: #000 !important; }
        
        .tag { font-size: 0.7em; padding: 2px 6px; border-radius: 4px; font-weight: bold; float: right; text-transform: uppercase; } 
        .HOT { background: var(--hot); } .INTERESADO { background: var(--int); } 
        .FRIO { background: #667781; } .NUEVO { background: var(--accent); } 
        .ELIMINADO { background: #333; }

        #feed { flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-opacity: 0.05; }
        .msg { max-width: 70%; padding: 10px; border-radius: 10px; margin-bottom: 8px; font-size: 0.95em; line-height: 1.4; } 
        .time { font-size: 0.7em; opacity: 0.5; text-align: right; margin-top: 4px; }
    </style></head>
    <body>
        <div class="sidebar">
            <div style="padding:15px; background:var(--sidebar); border-bottom:1px solid #222d34">
                <button onclick="run('HOT')" style="background:var(--hot); color:white; border:none; padding:12px; cursor:pointer; border-radius:6px; font-weight:bold; width:100%; margin-bottom:10px">ESTRATEGIA CIERRE HOT 🔥</button>
                <div style="display:flex; gap:8px">
                    <button onclick="run('FRIO')" style="background:#667781; color:white; border:none; padding:10px; flex:1; cursor:pointer; border-radius:5px">FRIO ❄️</button>
                    <button onclick="run('INTERESADO')" style="background:var(--int); color:white; border:none; padding:10px; flex:1; cursor:pointer; border-radius:5px">INT 🔥</button>
                </div>
            </div>
            <div id="list"></div>
        </div>
        <div style="flex:1; display:flex; flex-direction:column;">
            <div id="feed"></div>
            <div id="input" style="padding:20px; background:#111b21; border-top:1px solid #222d34; display:none">
                <input id="m" style="width:100%; padding:12px; background:#2a3942; border:none; color:white; border-radius:8px; outline:none" placeholder="Escribe un mensaje..." onkeypress="if(event.key==='Enter')send()">
            </div>
        </div>
        <script>
            let ap = null;
            const fmt = (ts) => new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            async function run(t) { if(!confirm("¿Lanzar estrategia de cierre para "+t+"?")) return; await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                const sorted = Object.keys(d.users).sort((a,b) => {
                    if (d.users[a].tag === "HOT" && d.users[b].tag !== "HOT") return -1;
                    if (d.users[a].tag !== "HOT" && d.users[b].tag === "HOT") return 1;
                    if (d.users[a].tag === "ELIMINADO" && d.users[b].tag !== "ELIMINADO") return 1;
                    return (d.users[b].lastInteraction || 0) - (d.users[a].lastInteraction || 0);
                });
                sorted.forEach(p => {
                    const u=d.users[p]; const last=u.history[u.history.length-1];
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <span class="tag \${u.tag}">\${u.tag}</span><b style="font-size:1.1em">\${u.name}</b><br>
                        <small style="opacity:0.6">\${fmt(u.lastInteraction)} - \${last?.content.substring(0,30)}...</small>
                    </div>\`;
                });
                if(ap) renderChat(d.users[ap]);
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="block"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const isB = m.role==='assistant';
                    const div = document.createElement("div"); div.className = "msg";
                    div.style = \`align-self:\${isB?'flex-end':'flex-start'}; background:\${isB?'#005c4b':'#202c33'}; border-radius:\${isB?'10px 0 10px 10px':'0 10px 10px 10px'}\`;
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
