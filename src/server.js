import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, enviarMensajeManual, ejecutarEstrategia, updateTagManual } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ZARA DASHBOARD 7.7</title>
    <style>
        :root { --bg: #0b141a; --sidebar: #111b21; --panel: #202c33; --accent: #00a884; --hot: #e91e63; --int: #ff9800; --frio: #667781; --auto: #a855f7; --off: #333; } 
        body { margin:0; font-family: 'Segoe UI', sans-serif; background: var(--bg); color: #e9edef; display: flex; height: 100vh; overflow:hidden; } 
        .sidebar-left { width: 350px; background: var(--sidebar); border-right: 1px solid #222d34; display:flex; flex-direction:column; flex-shrink:0; }
        .dash-header { padding: 15px; background: #202c33; border-bottom: 1px solid #2a3942; text-align:center; font-weight:bold; color:var(--accent); font-size:1.1em; }
        #list { flex: 1; overflow-y: auto; }
        .card { padding: 15px; border-bottom: 1px solid #222d34; cursor: pointer; transition: 0.2s; }
        .card.active { background: #2a3942; border-left: 4px solid var(--accent); }
        .card.HOT { border-left: 4px solid var(--hot); background: rgba(233, 30, 99, 0.05); }
        .c-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .c-name { font-weight: 600; font-size: 0.95em; }
        .c-time { font-size: 0.7em; color: #8696a0; }
        .c-tag { font-size: 0.6em; padding: 2px 6px; border-radius: 4px; font-weight: 800; color:white; text-transform:uppercase; }
        .tag-HOT { background: var(--hot); } .tag-INT { background: var(--int); } .tag-FRI { background: var(--frio); } .tag-OFF { background: var(--off); } .tag-NUE { background: var(--accent); }
        .main-chat { flex:1; display:flex; flex-direction:column; background: #0b141a; min-width: 0; }
        .chat-header { padding: 12px 25px; background: #202c33; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a3942; }
        #feed { flex:1; padding: 20px 40px; overflow-y:auto; display:flex; flex-direction:column; gap: 12px; }
        .msg { max-width: 75%; padding: 10px 14px; border-radius: 8px; font-size: 0.95em; position: relative; }
        .msg.bot { align-self: flex-end; background: #005c4b; }
        .msg.user { align-self: flex-start; background: #202c33; }
        .msg.auto { background: var(--auto) !important; border-bottom: 3px solid white; }
        .m-meta { font-size: 0.65em; opacity: 0.5; text-align: right; margin-top: 5px; }
        .sidebar-right { width: 220px; background: #111b21; border-left: 1px solid #222d34; padding: 20px; display:flex; flex-direction:column; gap:15px; }
        .btn-act { padding: 12px; border:none; border-radius:8px; color:white; font-weight:bold; cursor:pointer; font-size:0.8em; }
        .input-box { padding: 15px 25px; background: #202c33; display: flex; gap: 15px; }
        #m { flex: 1; background: #2a3942; border: none; padding: 12px; border-radius: 8px; color: white; outline: none; }
        @media (max-width: 1024px) { body { flex-direction: column; } .sidebar-left { width: 100%; height: 35vh; } .sidebar-right { display: none; } .main-chat { height: 65vh; } }
    </style></head>
    <body>
        <div class="sidebar-left"><div class="dash-header">ZARA DASHBOARD</div><div id="list"></div></div>
        <div class="main-chat">
            <div class="chat-header" id="c-head" style="display:none">
                <span id="active-name" style="font-weight:bold; color:var(--accent)"></span>
                <select style="background:#2a3942;color:white;border:1px solid #444;padding:5px;border-radius:5px" id="tag-sel" onchange="changeTag()">
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
                Object.keys(d.users).sort((a,b)=>d.users[b].lastInteraction - d.users[a].lastInteraction).forEach(p => {
                    const u = d.users[p];
                    l.innerHTML += \`<div class="card \${u.tag} \${ap===p?'active':''}" onclick="select('\${p}')">
                        <div class="c-header"><span class="c-name">\${u.name}</span><span class="c-time">\${new Date(u.lastInteraction).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>
                        <div style="display:flex;justify-content:space-between;font-size:0.7em;opacity:0.6"><span>\${fmt(u.lastInteraction)}</span><span class="c-tag tag-\${u.tag.substring(0,3)}">\${u.tag}</span></div>
                    </div>\`;
                });
                if(ap && d.users[ap]) { document.getElementById("active-name").innerText = d.users[ap].name; document.getElementById("tag-sel").value = d.users[ap].tag; renderChat(d.users[ap]); }
            });}
            function select(p){ ap=p; document.getElementById("input").style.display="flex"; document.getElementById("c-head").style.display="flex"; update(); }
            function renderChat(u){
                const f=document.getElementById("feed");
                f.innerHTML = u.history.map(m => {
                    const isA = m.content.includes("[AUTO]");
                    return \`<div class="msg \${m.role==='assistant'?'bot':'user'} \${isA?'auto':''}"><div>\${m.content.replace("[AUTO] ","")}</div><div class="m-meta">\${fmt(m.timestamp)}</div></div>\`;
                }).join("");
                f.scrollTop = f.scrollHeight;
            }
            async function send(){ const i=document.getElementById("m"); if(!i.value) return; await fetch("/api/manual",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({phone:ap,text:i.value})}); i.value=\"\"; update(); }
            setInterval(update, 5000); update();
        </script>
    </body></html>\`);
});
