import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA DASHBOARD</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --accent: #00a884; --hot: #e91e63; --int: #ff9800; --frio: #667781; --auto: #a855f7; --estrat: #3b82f6; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        .sidebar-left { width: 350px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; }
        .dash-header { padding: 15px; background: #202c33; border-bottom: 1px solid #2a3942; }
        .dash-title { font-size: 1.1em; font-weight: bold; color: var(--accent); }
        .nav-tabs { display: flex; background: #202c33; padding: 5px; gap: 5px; }
        .tab { flex:1; padding: 8px; font-size: 0.7em; border:none; background:transparent; color:#8696a0; cursor:pointer; font-weight:bold; }
        .tab.active { background: #374248; color: white; border-radius:4px; }
        #list { flex: 1; overflow-y: auto; }
        .card { padding: 12px 15px; border-bottom: 1px solid #222d34; cursor: pointer; }
        .card.active { background: #2a3942; border-left: 4px solid var(--accent); }
        .card.HOT { border-left: 4px solid var(--hot); }
        .card.APAGADO { opacity: 0.3; filter: grayscale(1); }
        .c-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .c-name { font-weight: 600; font-size: 0.95em; }
        .c-tag { font-size: 0.6em; padding: 2px 6px; border-radius: 4px; font-weight: 800; }
        .tag-HOT { background: var(--hot); } .tag-INT { background: var(--int); } .tag-FRI { background: var(--frio); }
        .main-chat { flex:1; display:flex; flex-direction:column; background: #0b141a; }
        #feed { flex:1; padding: 20px 40px; overflow-y:auto; display:flex; flex-direction:column; gap: 10px; }
        .msg { max-width: 70%; padding: 10px 14px; border-radius: 8px; font-size: 0.9em; position: relative; }
        .msg.bot { align-self: flex-end; background: #005c4b; }
        .msg.user { align-self: flex-start; background: #202c33; }
        .msg.auto { background: var(--auto) !important; border-bottom: 3px solid rgba(255,255,255,0.3); }
        .msg.est { background: var(--estrat) !important; }
        .m-time { font-size: 0.65em; opacity: 0.5; text-align: right; margin-top: 5px; }
        .sidebar-right { width: 220px; background: #111b21; border-left: 1px solid #222d34; padding: 20px; display:flex; flex-direction:column; gap:15px; }
        .btn-act { padding: 12px; border:none; border-radius:6px; color:white; font-weight:bold; cursor:pointer; font-size:0.75em; }
        .input-box { padding: 15px; background: #202c33; display: flex; gap: 10px; }
        #m { flex: 1; background: #2a3942; border: none; padding: 12px; border-radius: 8px; color: white; outline: none; }
    </style></head>
    <body>
        <div class="sidebar-left">
            <div class="dash-header"><div class="dash-title">ZARA PANEL 7.0</div></div>
            <div class="nav-tabs">
                <button class="tab active" onclick="setFilter('ALL')">TODOS</button>
                <button class="tab" onclick="setFilter('HOT')">HOT 🔥</button>
            </div>
            <div id="list"></div>
        </div>
        <div class="main-chat">
            <div id="feed"></div>
            <div class="input-box" id="input" style="display:none">
                <input id="m" placeholder="Responder..." onkeypress="if(event.key==='Enter')send()">
            </div>
        </div>
        <div class="sidebar-right">
            <button class="btn-act" style="background:var(--hot)" onclick="run('HOT')">CIERRE HOT 🔥</button>
            <button class="btn-act" style="background:var(--int)" onclick="run('INTERESADO')">IMPULSAR INT 🔸</button>
            <button class="btn-act" style="background:var(--frio)" onclick="run('FRIO')">REVIVIR FRÍOS ❄️</button>
        </div>
        <script>
            let ap = null; let filter = 'ALL';
            const fmt = (ts) => new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            function setFilter(f){ filter=f; update(); }
            async function run(t) { await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                const sorted = Object.keys(d.users).sort((a,b) => (d.users[b].lastInteraction || 0) - (d.users[a].lastInteraction || 0));
                sorted.forEach(p => {
                    const u=d.users[p]; if(filter!=='ALL' && u.tag!==filter) return;
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <div class="c-header"><span class="c-name">\${u.name}</span><span class="c-time">\${fmt(u.lastInteraction)}</span></div>
                        <div style="display:flex;justify-content:space-between"><span style="font-size:0.75em;opacity:0.6">\${u.tag}</span></div>
                    </div>\`;
                });
                if(ap && d.users[ap]) renderChat(d.users[ap]);
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const isA = m.content.includes("[AUTO]"); const isE = m.content.includes("[ESTRATEGIA]");
                    const div = document.createElement("div");
                    div.className = \`msg \${m.role==='assistant'?'bot':'user'} \${isA?'auto':''} \${isE?'est':''}\`;
                    div.innerHTML = \`<div>\${m.content.replace("[AUTO] ","").replace("[ESTRATEGIA] ","")}</div><div class="m-time">\${fmt(m.timestamp)}</div>\`;
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
