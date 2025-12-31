import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, enviarMensajeManual } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA DASHBOARD</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --accent: #00a884; --hot: #e91e63; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; } 
        .sidebar-left { width: 350px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; }
        #list { flex: 1; overflow-y: auto; }
        .card { padding: 12px 15px; border-bottom: 1px solid #222d34; cursor: pointer; }
        .card.active { background: #2a3942; border-left: 4px solid var(--accent); }
        .c-header { display: flex; justify-content: space-between; align-items: center; }
        .c-name { font-weight: 600; font-size: 0.9em; }
        .c-time { font-size: 0.65em; color: #8696a0; }
        .main-chat { flex:1; display:flex; flex-direction:column; }
        #feed { flex:1; padding: 20px; overflow-y:auto; display:flex; flex-direction:column; gap: 10px; }
        .msg { max-width: 80%; padding: 8px 12px; border-radius: 8px; font-size: 0.9em; }
        .msg.bot { align-self: flex-end; background: #005c4b; }
        .msg.user { align-self: flex-start; background: #202c33; }
        .m-meta { font-size: 0.6em; opacity: 0.5; margin-top: 4px; text-align: right; }
        .input-box { padding: 15px; background: #202c33; display: flex; gap: 10px; }
        #m { flex: 1; background: #2a3942; border: none; padding: 10px; border-radius: 8px; color: white; outline: none; }
    </style></head>
    <body>
        <div class="sidebar-left"><div id="list"></div></div>
        <div class="main-chat"><div id="feed"></div><div class="input-box" id="input" style="display:none"><input id="m" placeholder="Escribir..." onkeypress="if(event.key==='Enter')send()"></div></div>
        <script>
            let ap = null;
            const fmt = (ts) => new Date(ts).toLocaleString('es-CL', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
            function update(){ fetch("/api/data").then(r=>r.json()).then(d=>{
                const l=document.getElementById("list"); l.innerHTML="";
                Object.keys(d.users).sort((a,b)=>d.users[b].lastInteraction - d.users[a].lastInteraction).forEach(p => {
                    const u=d.users[p];
                    l.innerHTML += \`<div class="card \${ap===p?'active':''}" onclick="select('\${p}')">
                        <div class="c-header"><span class="c-name">\${u.name}</span><span class="c-time">\${fmt(u.lastInteraction)}</span></div>
                    </div>\`;
                });
                if(ap) renderChat(d.users[ap]);
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const div = document.createElement("div"); div.className = \`msg \${m.role==='assistant'?'bot':'user'}\`;
                    div.innerHTML = \`<div>\${m.content}</div><div class="m-meta">\${fmt(m.timestamp)}</div>\`;
                    f.appendChild(div);
                });
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ const i=document.getElementById("m"); if(!i.value) return; await fetch("/api/manual",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({phone:ap,text:i.value})}); i.value=\"\"; update(); }
            setInterval(update, 4000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
