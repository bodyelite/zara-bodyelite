import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA MONITOR 6.1</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --panel: #202c33; --accent: #00a884; --hot: #e91e63; --int: #ff9800; --frio: #667781; --auto: #a855f7; --estrat: #3b82f6; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        .sidebar { width: 380px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; } 
        .header { padding: 15px; background: #202c33; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid #2a3942; }
        .btn-strat { border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; color: white; text-transform: uppercase; font-size: 0.75em; }
        #list { flex: 1; overflow-y: auto; background: var(--sidebar); }
        .card { padding: 15px; border-bottom: 1px solid #222d34; cursor: pointer; transition: 0.2s; position: relative; display: flex; flex-direction: column; gap: 4px; }
        .card.active { background: #2a3942; border-right: 4px solid var(--accent); }
        .card.HOT { background: rgba(233, 30, 99, 0.15); animation: pulse-hot 2s infinite; }
        @keyframes pulse-hot { 0% { background: rgba(233, 30, 99, 0.1); } 50% { background: rgba(233, 30, 99, 0.25); } 100% { background: rgba(233, 30, 99, 0.1); } }
        .name { font-weight: 600; font-size: 1.05em; color: #f1f1f1; }
        .tag { font-size: 0.65em; padding: 3px 8px; border-radius: 50px; font-weight: 800; text-transform: uppercase; float: right; }
        .tag.HOT { background: var(--hot); } .tag.INTERESADO { background: var(--int); } .tag.FRIO { background: var(--frio); } .tag.NUEVO { background: var(--accent); }
        
        /* CHAT BUBBLES */
        #feed { flex:1; padding: 30px 60px; overflow-y:auto; display:flex; flex-direction:column; gap: 10px; z-index: 1; }
        .msg { max-width: 75%; padding: 10px 14px; border-radius: 8px; font-size: 0.95em; position: relative; line-height: 1.4; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); margin-bottom: 5px; }
        .msg.bot { align-self: flex-end; background: #005c4b; color: #e9edef; }
        .msg.user { align-self: flex-start; background: #202c33; color: #e9edef; }
        
        /* COLORES ESPECIALES PARA ZARA */
        .msg.auto { background: var(--auto) !important; border: 1px solid #c084fc; }
        .msg.estrat { background: var(--estrat) !important; border: 1px solid #60a5fa; }
        
        .msg-label { font-size: 0.6em; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; display: block; opacity: 0.8; }
        .msg-time { font-size: 0.65em; color: rgba(255,255,255,0.5); text-align: right; margin-top: 4px; }
        
        .input-area { padding: 15px 30px; background: #202c33; display: flex; align-items: center; gap: 15px; z-index: 1; }
        #m { flex: 1; background: #2a3942; border: none; padding: 12px 15px; border-radius: 8px; color: white; outline: none; }
    </style></head>
    <body>
        <div class="sidebar"><div class="header"><button class="btn-strat" style="background:var(--hot);width:100%" onclick="run('HOT')">Estrategia Cierre HOT 🔥</button>
        <div style="display:flex;gap:10px"><button class="btn-strat" style="background:var(--frio);flex:1" onclick="run('FRIO')">FRIO ❄️</button>
        <button class="btn-strat" style="background:var(--int);flex:1" onclick="run('INTERESADO')">INT 🔸</button></div></div><div id="list"></div></div>
        <div style="flex:1;display:flex;flex-direction:column;background:#0b141a"><div id="feed"></div>
        <div class="input-area" id="input" style="display:none"><input id="m" placeholder="Mensaje manual..." onkeypress="if(event.key==='Enter')send()"></div></div>
        <script>
            let ap = null;
            const fmt = (ts) => new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            async function run(t) { if(!confirm("¿Lanzar estrategia para "+t+"?")) return; await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                const sorted = Object.keys(d.users).sort((a,b) => (d.users[b].lastInteraction || 0) - (d.users[a].lastInteraction || 0));
                sorted.forEach(p => {
                    const u=d.users[p]; const last=u.history[u.history.length-1];
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <div style="display:flex;justify-content:space-between"><span class="name">\${u.name}</span><span class="tag \${u.tag}">\${u.tag}</span></div>
                        <div style="font-size:0.8em;color:#8696a0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${last?.content || ''}</div>
                    </div>\`;
                });
                if(ap) renderChat(d.users[ap]);
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const isAuto = m.content.includes("[AUTO]");
                    const isEstrat = m.content.includes("[ESTRATEGIA]");
                    const div = document.createElement("div");
                    div.className = \`msg \${m.role==='assistant'?'bot':'user'} \${isAuto?'auto':''} \${isEstrat?'estrat':''}\`;
                    const label = isAuto ? '<span class="msg-label">⚡ Autoseguimiento</span>' : (isEstrat ? '<span class="msg-label">🧪 Estrategia</span>' : '');
                    div.innerHTML = \`\${label}<div>\${m.content.replace("[AUTO] ","").replace("[ESTRATEGIA] ","")}</div><div class="msg-time">\${fmt(m.timestamp)}</div>\`;
                    f.appendChild(div);
                });
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ const i=document.getElementById("m"); if(!i.value) return; await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:i.value})}); i.value=""; update(); }
            setInterval(update, 4000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
