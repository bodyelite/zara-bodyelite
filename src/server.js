import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, getBotStatus, enviarMensajeManual, ejecutarEstrategia, updateTagManual, toggleBot } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZARA 8.0 PRO</title>
    <style>
        :root { --bg:#0b141a; --sb:#111b21; --ac:#00a884; --ht:#e91e63; --it:#ff9800; --fr:#667781; --manual:#3b82f6; }
        body { margin:0; font-family:'Segoe UI',sans-serif; background:var(--bg); color:#e9edef; display:flex; height:100vh; overflow:hidden; }
        .sidebar { width:320px; background:var(--sb); border-right:1px solid #222d34; display:flex; flex-direction:column; }
        .main { flex:1; display:flex; flex-direction:column; background:var(--bg); }
        .right-bar { width:240px; background:var(--sb); border-left:1px solid #222d34; padding:20px; display:flex; flex-direction:column; gap:15px; }
        
        .chat-h { padding:15px 20px; background:#202c33; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #2a3942; }
        #feed { flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }
        
        .card { padding:12px; border-bottom:1px solid #222d34; cursor:pointer; }
        .card.active { background:#2a3942; border-left:4px solid var(--ac); }
        
        .msg { max-width:75%; padding:10px; border-radius:8px; font-size:0.9em; position:relative; }
        .msg.bot { align-self:flex-end; background:#005c4b; }
        .msg.user { align-self:flex-start; background:#202c33; }
        .msg.manual { align-self:flex-end; background:var(--manual); border:1px solid #fff5; }
        
        .tag { font-size:0.6em; padding:2px 6px; border-radius:4px; font-weight:bold; color:white; }
        .btn { padding:12px; border:none; border-radius:6px; color:white; font-weight:bold; cursor:pointer; font-size:0.8em; }
        
        .report-modal { position:fixed; top:10%; left:10%; width:80%; height:80%; background:#202c33; z-index:100; display:none; padding:30px; border-radius:10px; box-shadow:0 0 50px #000; }
    </style></head>
    <body>
        <div class="sidebar">
            <div style="padding:15px; background:#202c33; display:flex; gap:5px">
                <button class="btn" style="flex:1; background:#444" onclick="filter='ALL';up()">TODOS</button>
                <button class="btn" style="flex:1; background:var(--ht)" onclick="filter='HOT';up()">HOT</button>
            </div>
            <div id="list"></div>
        </div>
        
        <div class="main">
            <div class="chat-h" id="h" style="display:none">
                <div><b id="n"></b> <span id="s-p" style="font-size:0.7em; color:#8696a0"></span></div>
                <div style="display:flex; gap:10px; align-items:center">
                    <button id="bot-toggle" class="btn" onclick="tglBot()"></button>
                    <select id="tag-sel" onchange="st()" style="background:#2a3942;color:#fff;border:1px solid #444;padding:5px;border-radius:4px">
                        <option value="NUEVO">NUEVO</option><option value="HOT">HOT 🔥</option><option value="INTERESADO">INTERESADO 🔸</option><option value="FRIO">FRIO ❄️</option><option value="APAGADO">APAGADO 🗑️</option>
                    </select>
                </div>
            </div>
            <div id="feed"></div>
            <div style="padding:15px; background:#202c33; display:flex; gap:10px" id="ib" style="display:none">
                <input id="m" style="flex:1; background:#2a3942; border:none; padding:12px; border-radius:8px; color:#fff" placeholder="Respuesta manual..." onkeypress="if(event.key==='Enter')sd()">
            </div>
        </div>

        <div class="right-bar">
            <b style="font-size:0.8em; color:var(--fr)">ESTRATEGIAS</b>
            <button class="btn" style="background:var(--ht)" onclick="rn('HOT')">CIERRE HOT 🔥</button>
            <button class="btn" style="background:var(--it)" onclick="rn('INTERESADO')">IMPULSAR INT 🔸</button>
            <hr style="border:0; border-top:1px solid #222d34">
            <button class="btn" style="background:var(--manual)" onclick="openRep()">REPORTES / FUNNEL</button>
            <button class="btn" style="background:#444" onclick="location.reload()">REFRESCAR</button>
        </div>

        <div id="rep" class="report-modal">
            <h2>Funnel de Leads - Zara 8.0</h2>
            <div id="funnel-data" style="display:flex; gap:20px; margin-top:30px; text-align:center"></div>
            <button class="btn" style="background:var(--ht); margin-top:40px" onclick="document.getElementById('rep').style.display='none'">CERRAR</button>
        </div>

        <script>
            let ap=null; let filter='ALL';
            const f=(ts)=>new Date(ts).toLocaleString('es-CL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
            
            async function tglBot(){ await fetch("/api/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap})}); up(); }
            async function st(){ await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,tag:document.getElementById("tag-sel").value})}); up(); }
            async function rn(t){ if(!confirm("¿Lanzar estrategia?"))return; await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})}); up(); }
            
            function openRep(){
                fetch("/api/data").then(r=>r.json()).then(d=>{
                    const counts = {NUEVO:0, INTERESADO:0, HOT:0, APAGADO:0};
                    Object.values(d.users).forEach(u => counts[u.tag]++);
                    document.getElementById("funnel-data").innerHTML = \`
                        <div style="flex:1; background:var(--ac); padding:20px; border-radius:8px"><h3>NUEVOS</h3><h1>\${counts.NUEVO}</h1></div>
                        <div style="flex:1; background:var(--it); padding:20px; border-radius:8px"><h3>INT</h3><h1>\${counts.INTERESADO}</h1></div>
                        <div style="flex:1; background:var(--ht); padding:20px; border-radius:8px"><h3>HOT</h3><h1>\${counts.HOT}</h1></div>
                    \`;
                    document.getElementById("rep").style.display='block';
                });
            }

            function up(){
                fetch("/api/data").then(r=>r.json()).then(d=>{
                    const l=document.getElementById("list"); l.innerHTML="";
                    const us=d.users||{}; const status=d.botStatus||{};
                    Object.keys(us).sort((a,b)=>us[b].lastInteraction-us[a].lastInteraction).forEach(p=>{
                        const u=us[p]; if(filter!=='ALL' && u.tag!==filter) return;
                        l.innerHTML+='<div class="card '+(ap===p?'active':'')+'" onclick="sl(\\''+p+'\\')"><b>'+u.name+'</b><br><small>'+f(u.lastInteraction)+' | '+u.tag+'</small></div>';
                    });
                    if(ap&&us[ap]){
                        document.getElementById("n").innerText=us[ap].name;
                        document.getElementById("s-p").innerText=ap;
                        document.getElementById("tag-sel").value=us[ap].tag;
                        const b=document.getElementById("bot-toggle");
                        b.innerText=status[ap]===false?'BOT APAGADO ❌':'BOT ACTIVO ✅';
                        b.style.background=status[ap]===false?var('--ht'):var('--ac');
                        rd(us[ap]);
                    }
                });
            }

            function sl(p){ ap=p; document.getElementById("h").style.display="flex"; document.getElementById("ib").style.display="flex"; up(); }
            function rd(u){
                const fd=document.getElementById("feed");
                fd.innerHTML=u.history.map(m=>\`<div class="msg \${m.role==='user'?'user':(m.source==='manual'?'manual':'bot')}">
                    <div>\${m.content}</div>
                    <div style="font-size:0.6em; opacity:0.5; text-align:right; margin-top:4px">\${f(m.timestamp)}</div>
                </div>\`).join("");
                fd.scrollTop=fd.scrollHeight;
            }

            async function sd(){ const v=document.getElementById("m"); if(!v.value)return; await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:v.value})}); v.value=""; up(); }
            setInterval(up, 5000); up();
        </script>
    </body></html>\`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/estrat', async (req, res) => { await ejecutarEstrategia(req.body.tag); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); });
app.listen(process.env.PORT || 3000);
