import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual, ejecutarEstrategia } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ZARA MONITOR 6.0</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --panel: #202c33; --accent: #00a884; --hot: #e91e63; --int: #ff9800; --frio: #667781; } 
        body { margin:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        
        /* Sidebar Estilizada */
        .sidebar { width: 380px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; } 
        .header { padding: 15px; background: #202c33; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid #2a3942; }
        
        /* Botones de Estrategia */
        .btn-strat { border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; color: white; text-transform: uppercase; font-size: 0.75em; }
        .btn-hot { background: var(--hot); width: 100%; box-shadow: 0 0 10px rgba(233, 30, 99, 0.3); }
        .btn-hot:hover { background: #c2185b; }
        
        /* Lista de Clientes */
        #list { flex: 1; overflow-y: auto; background: var(--sidebar); }
        .card { padding: 15px; border-bottom: 1px solid #222d34; cursor: pointer; transition: 0.2s; position: relative; display: flex; flex-direction: column; gap: 4px; }
        .card:hover { background: #2a3942; }
        .card.active { background: #2a3942; border-right: 4px solid var(--accent); }
        
        /* Colores por Etiqueta */
        .card.HOT { background: rgba(233, 30, 99, 0.15); animation: pulse-hot 2s infinite; }
        .card.INTERESADO { border-left: 5px solid var(--int); }
        .card.FRIO { border-left: 5px solid var(--frio); opacity: 0.8; }
        .card.ELIMINADO { opacity: 0.3; filter: grayscale(1); }
        
        @keyframes pulse-hot { 0% { background: rgba(233, 30, 99, 0.1); } 50% { background: rgba(233, 30, 99, 0.25); } 100% { background: rgba(233, 30, 99, 0.1); } }
        
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .name { font-weight: 600; font-size: 1.05em; color: #f1f1f1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
        .tag { font-size: 0.65em; padding: 3px 8px; border-radius: 50px; font-weight: 800; text-transform: uppercase; }
        .tag.HOT { background: var(--hot); color: white; }
        .tag.INTERESADO { background: var(--int); color: white; }
        .tag.FRIO { background: var(--frio); color: white; }
        .tag.NUEVO { background: var(--accent); color: white; }
        
        .last-msg { font-size: 0.85em; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .time { font-size: 0.7em; color: #8696a0; }

        /* Panel de Chat */
        .chat-panel { flex:1; display:flex; flex-direction:column; background-color: #0b141a; position: relative; }
        .chat-panel::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); opacity: 0.05; pointer-events: none; }
        
        #feed { flex:1; padding: 30px 60px; overflow-y:auto; display:flex; flex-direction:column; gap: 10px; z-index: 1; }
        .msg { max-width: 65%; padding: 8px 12px; border-radius: 8px; font-size: 0.95em; position: relative; line-height: 1.4; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
        .msg.bot { align-self: flex-end; background: #005c4b; color: #e9edef; border-top-right-radius: 0; }
        .msg.user { align-self: flex-start; background: #202c33; color: #e9edef; border-top-left-radius: 0; }
        .msg-time { font-size: 0.65em; color: rgba(255,255,255,0.5); text-align: right; margin-top: 4px; }
        
        .input-area { padding: 15px 30px; background: #202c33; display: flex; align-items: center; gap: 15px; z-index: 1; }
        #m { flex: 1; background: #2a3942; border: none; padding: 12px 15px; border-radius: 8px; color: white; outline: none; font-size: 0.95em; }
    </style></head>
    <body>
        <div class="sidebar">
            <div class="header">
                <button class="btn-strat btn-hot" onclick="run('HOT')">Estrategia Cierre HOT 🔥</button>
                <div style="display:flex; gap:10px">
                    <button class="btn-strat" style="background:var(--frio); flex:1" onclick="run('FRIO')">Fríos ❄️</button>
                    <button class="btn-strat" style="background:var(--int); flex:1" onclick="run('INTERESADO')">Interesados 🔸</button>
                </div>
            </div>
            <div id="list"></div>
        </div>
        <div class="chat-panel">
            <div id="feed"></div>
            <div class="input-area" id="input" style="display:none">
                <input id="m" placeholder="Escribe un mensaje manual..." onkeypress="if(event.key==='Enter')send()">
            </div>
        </div>
        <script>
            let ap = null;
            const fmt = (ts) => {
                const d = new Date(ts);
                return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            };
            async function run(t) { 
                if(!confirm("¿Lanzar estrategia para " + t + "?")) return;
                await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); 
                update(); 
            }
            function update(){ 
                fetch("/api/data").then(r=>r.json()).then(d=>{
                    const l=document.getElementById("list"); l.innerHTML="";
                    const sorted = Object.keys(d.users).sort((a,b) => {
                        if (d.users[a].tag === "HOT" && d.users[b].tag !== "HOT") return -1;
                        if (d.users[a].tag !== "HOT" && d.users[b].tag === "HOT") return 1;
                        return (d.users[b].lastInteraction || 0) - (d.users[a].lastInteraction || 0);
                    });
                    sorted.forEach(p => {
                        const u=d.users[p]; const last=u.history[u.history.length-1];
                        l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                            <div class="card-top">
                                <span class="name">\${u.name}</span>
                                <span class="time">\${fmt(u.lastInteraction)}</span>
                            </div>
                            <div class="card-top">
                                <span class="last-msg">\${last?.content || 'Sin mensajes'}</span>
                                <span class="tag \${u.tag}">\${u.tag}</span>
                            </div>
                        </div>\`;
                    });
                    if(ap) renderChat(d.users[ap]);
                });
            }
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed"); f.innerHTML="";
                u.history.forEach(m => {
                    const isB = m.role==='assistant';
                    const div = document.createElement("div");
                    div.className = \`msg \${isB?'bot':'user'}\`;
                    div.innerHTML = \`<div>\${m.content}</div><div class="msg-time">\${fmt(m.timestamp)}</div>\`;
                    f.appendChild(div);
                });
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ 
                const i=document.getElementById("m"); 
                if(!i.value) return; 
                await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:i.value})}); 
                i.value=""; update(); 
            }
            setInterval(update, 4000); update();
        </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
