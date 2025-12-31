import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, enviarMensajeManual, ejecutarEstrategia, updateTagManual } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ZARA DASHBOARD</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --panel: #202c33; --accent: #00a884; --hot: #e91e63; --int: #ff9800; --frio: #667781; --auto: #a855f7; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        .sidebar-left { width: 320px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; flex-shrink:0; }
        #list { flex: 1; overflow-y: auto; }
        .card { padding: 12px 15px; border-bottom: 1px solid #222d34; cursor: pointer; transition: 0.2s; }
        .card.active { background: #2a3942; border-left: 4px solid var(--accent); }
        .card.HOT { border-left: 4px solid var(--hot); background: rgba(233, 30, 99, 0.05); }
        .main-chat { flex:1; display:flex; flex-direction:column; background: #0b141a; min-width: 0; }
        .chat-header { padding: 12px 20px; background: #202c33; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a3942; }
        #feed { flex:1; padding: 20px; overflow-y:auto; display:flex; flex-direction:column; gap: 10px; }
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 8px; font-size: 0.9em; position: relative; }
        .msg.bot { align-self: flex-end; background: #005c4b; }
        .msg.user { align-self: flex-start; background: #202c33; }
        .m-meta { font-size: 0.65em; opacity: 0.5; text-align: right; margin-top: 5px; }
        .sidebar-right { width: 220px; background: #111b21; border-left: 1px solid #222d34; padding: 20px; display:flex; flex-direction:column; gap:15px; }
        .btn-act { padding: 12px; border:none; border-radius:6px; color:white; font-weight:bold; cursor:pointer; font-size:0.75em; }
        .input-box { padding: 15px; background: #202c33; display: flex; gap: 10px; }
        #m { flex: 1; background: #2a3942; border: none; padding: 12px; border-radius: 8px; color: white; outline: none; }
        @media (max-width: 768px) { body { flex-direction: column; } .sidebar-left { width: 100%; height: 35vh; } .sidebar-right { display: none; } .main-chat { height: 65vh; } }
    </style></head>
    <body>
        <div class="sidebar-left"><div id="list"></div></div>
        <div class="main-chat">
            <div class="chat-header" id="c-head" style="display:none">
                <span id="active-name" style="font-weight:bold; color:var(--accent)"></span>
                <select style="background:#2a3942;color:white;padding:5px;border-radius:4px" id="tag-sel" onchange="changeTag()">
                    <option value="NUEVO">NUEVO</option><option value="HOT">HOT 🔥</option><option value="INTERESADO">INTERESADO 🔸</option><option value="FRIO">FRIO ❄️</option><option value="APAGADO">APAGADO 🗑️</option>
                </select>
            </div>
            <div id="feed"></div>
            <div class="input-box" id="input" style="display:none"><input id="m" placeholder="Escribir..." onkeypress="if(event.key==='Enter')send()"></div>
        </div>
        <div class="sidebar-right"><button class="btn-act" style="background:var(--hot)" onclick="run('HOT')">CIERRE HOT 🔥</button><button class="btn-act" style="background:#444;margin-top:20px" onclick="location.reload()">REFRESCAR</button></div>
        <script>
            let ap = null; const fmt = (ts) => new Date(ts).toLocaleString('es-CL', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
            async function changeTag() { const nt = document.getElementById("tag-sel").value; await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,tag:nt})}); update(); }
            async function run(t) { if(!confirm("Estrategia para "+t+"?")) return; await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); update(); }
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                const users = d.users || {};
                Object.keys(users).sort((a,b)=>(users[b].lastInteraction||0)-(users[a].lastInteraction||0)).forEach(p => {
                    const u = users[p];
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <div class="c-header"><span class="c-name">\${u.name}</span><span class="c-time">\${new Date(u.lastInteraction).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>
                        <div style="font-size:0.7em;opacity:0.6">\${fmt(u.lastInteraction)} | \${u.tag}</div>
                    </div>\`;
                });
                if(ap && users[ap]) { document.getElementById("active-name").innerText = users[ap].name; document.getElementById("tag-sel").value = users[ap].tag; renderChat(users[ap]); }
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; document.getElementById("c-head").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed");
                f.innerHTML = (u.history || []).map(m => \`<div class="msg \${m.role==='assistant'?'bot':'user'}"><div>\${m.content}</div><div class="m-meta">\${fmt(m.timestamp)}</div></div>\`).join("");
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ const i=document.getElementById("m"); if(!i.value) return; await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:i.value})}); i.value=""; update(); }
            setInterval(update, 5000); update();
        </script>
    </body></html>\`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/tag', (req, res) => { const r = updateTagManual(req.body.phone, req.body.tag); res.json({ success: r }); });
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
