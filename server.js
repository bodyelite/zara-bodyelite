import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, eliminarNota, procesarEvento, forzarRecalculo, procesarPushBatch, marcarLeido } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>ZARA 7.0</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <meta charset="UTF-8">
    <style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:12px;background:#f3f4f6;height:100vh;overflow:hidden}
        .sidebar{width:290px;background:#fff;border-right:1px solid #e5e7eb;display:flex;flex-direction:column;height:100vh}
        .chat-area{flex:1;display:flex;flex-direction:column;height:100vh;background:#e5e7eb}
        .info-panel{width:320px;background:#fff;border-left:1px solid #e5e7eb;padding:10px;display:flex;flex-direction:column;height:100vh}
        .client-list{flex:1;overflow-y:auto}
        .client-item{padding:12px 10px;border-bottom:1px solid #f3f4f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:background 0.2s}
        .client-item:hover{background:#f9fafb}
        .client-item.active{background:#eff6ff;border-left:4px solid #2563eb}
        .unread-dot { width: 10px; height: 10px; background: #ef4444; border-radius: 50%; display: inline-block; box-shadow: 0 0 4px rgba(239,68,68,0.5); }
        .chat-box{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}
        .msg{max-width:80%;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.4}
        .msg-user{background:#fff;align-self:flex-start;border-bottom-left-radius:0;box-shadow:0 1px 2px rgba(0,0,0,0.05)}
        .msg-bot{background:#dcfce7;align-self:flex-end;border-bottom-right-radius:0;color:#14532d;box-shadow:0 1px 2px rgba(0,0,0,0.05)}
        .tab-btn{padding:6px;border:1px solid #e5e7eb;cursor:pointer;text-align:center;font-weight:700;font-size:10px;background:#fff;border-radius:4px;color:#6b7280}
        .tab-btn.active{background:#2563eb;color:white;border-color:#2563eb}
        .tabs-container{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:8px;background:#f9fafb;border-bottom:1px solid #e5e7eb}
        .badge-tag { padding:2px 6px; border-radius:4px; font-size:9px; font-weight:bold; color:white; }
        .bg-HOT { background:#f59e0b; color:black; } .bg-NUEVO { background:#3b82f6; } .bg-PUSH { background:#db2777; }
    </style>
    </head><body><div class="d-flex w-100 h-100">
    <div class="sidebar">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
            <span class="fw-bold text-primary">ZARA 7.0</span> 
            <span id="connStatus" class="badge bg-success" style="font-size:9px">ONLINE</span>
        </div>
        <div class="p-2 border-bottom bg-white"><input id="search" class="form-control form-control-sm" placeholder="🔍 Buscar..." onkeyup="renderList()"></div>
        <div class="tabs-container">
            <div class="tab-btn active" onclick="setFiltro('NUEVO',this)">NUEVOS</div>
            <div class="tab-btn" onclick="setFiltro('PUSH',this)">PUSH 🚀</div>
            <div class="tab-btn" onclick="setFiltro('INTERESADO',this)">INTERESADOS</div>
            <div class="tab-btn" onclick="setFiltro('HOT',this)">HOT 🔥</div>
            <div class="tab-btn" onclick="setFiltro('AGENDADO',this)">AGENDADOS ✅</div>
            <div class="tab-btn" onclick="setFiltro('GESTIÓN',this)">GESTIÓN</div>
            <div class="tab-btn" onclick="setFiltro('ABANDONADOS',this)">ABANDONADOS 🗑️</div>
            <div class="tab-btn" onclick="setFiltro('TODOS',this)">VER TODOS</div>
        </div>
        <div id="list" class="client-list"></div>
    </div>
    <div class="chat-area">
        <div id="chatHeader" class="p-3 bg-white border-bottom d-flex justify-content-between align-items-center shadow-sm" style="height:50px">
            <span class="fw-bold">Selecciona un cliente</span>
            <button id="botToggle" class="btn btn-sm btn-secondary" style="font-size:10px" disabled>BOT</button>
        </div>
        <div id="chat" class="chat-box"></div>
        <div class="p-3 bg-white border-top d-flex gap-2">
            <input id="txt" class="form-control" placeholder="Escribe un mensaje manual..." onkeypress="if(event.key==='Enter') send()">
            <button onclick="send()" class="btn btn-primary fw-bold">ENVIAR</button>
        </div>
    </div>
    <div class="info-panel">
        <div class="mb-3 border-bottom pb-3">
            <label class="small fw-bold text-muted mb-1">CARGA MASIVA EXCEL / CSV</label>
            <textarea id="csvInput" class="form-control form-control-sm mb-2" rows="3" placeholder="Pega aquí desde Excel (Nombre | Telefono | Mensaje)"></textarea>
            <button onclick="processCsv()" class="btn btn-danger btn-sm w-100 fw-bold">🚀 PROCESAR Y ENVIAR</button>
        </div>
        <div class="mb-3 border-bottom pb-3">
            <label class="small fw-bold text-muted">ESTADO ACTUAL</label>
            <div class="d-flex gap-1 mt-1">
                <select id="tagSelector" class="form-select form-select-sm" onchange="updateTag()">
                    <option value="NUEVO">NUEVO</option><option value="PUSH">PUSH</option><option value="INTERESADO">INTERESADO</option>
                    <option value="HOT">HOT</option><option value="AGENDADO">AGENDADO</option><option value="GESTIÓN">GESTIÓN</option>
                    <option value="ABANDONADOS">ABANDONADOS</option>
                </select>
            </div>
            <button onclick="recalc()" class="btn btn-warning btn-sm w-100 mt-2 fw-bold">♻️ RECALCULAR</button>
        </div>
        <div class="flex-grow-1 d-flex flex-column" style="overflow:hidden">
            <label class="small fw-bold text-muted">TAREA ZARA</label>
            <textarea id="noteInput" class="form-control form-control-sm mb-1" rows="2" placeholder="Tarea..."></textarea>
            <div class="d-flex align-items-center gap-2 mb-2">
                <input type="checkbox" id="checkZara" onchange="toggleDate()"> <span style="font-size:10px">Asignar a Zara</span>
            </div>
            <input type="datetime-local" id="dateInput" class="form-control form-control-sm mb-2" style="display:none">
            <button onclick="addNote()" class="btn btn-outline-secondary btn-sm w-100 mb-2">Guardar</button>
            <label class="small fw-bold text-muted">BITÁCORA</label>
            <div id="log" style="flex:1;overflow-y:auto;background:#f9fafb;border:1px solid #eee;border-radius:4px;padding:5px"></div>
        </div>
    </div>
    </div>
    <script>
    let d={users:{}}; let cur=null; let tab='NUEVO';
    function toggleDate(){ document.getElementById('dateInput').style.display = document.getElementById('checkZara').checked ? 'block' : 'none'; }
    async function r(){ try{ const x=await fetch('/api/data'); d=await x.json(); renderList(); if(cur && d.users[cur]) renderChat(); }catch(e){} }
    setInterval(r,3000); r();
    function renderList(){
        const l=document.getElementById('list'); l.innerHTML='';
        const s=document.getElementById('search').value.toLowerCase();
        Object.values(d.users).sort((a,b)=>b.lastInteraction-a.lastInteraction).forEach(u=>{
            let show = (tab==='TODOS' || u.tag===tab || (tab==='NUEVO' && (!u.tag || u.tag==='NUEVO')));
            if(s) show = (u.name.toLowerCase().includes(s) || u.phone.includes(s));
            if(show){
                const time = new Date(u.lastInteraction).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});
                const badgeColor = u.tag==='HOT'?'bg-HOT':(u.tag==='PUSH'?'bg-PUSH':'bg-NUEVO');
                const badge = u.tag ? \`<span class="badge-tag \${badgeColor}">\${u.tag}</span>\` : '';
                const dot = u.unread ? '<div class="unread-dot"></div>' : '';
                const active = cur===u.phone ? 'active' : '';
                l.innerHTML += \`<div class="client-item \${active}" onclick="selectUser('\${u.phone}')">
                    <div style="flex:1"><div class="d-flex justify-content-between align-items-center"><span class="fw-bold text-truncate" style="max-width:140px">\${u.name}</span><span style="font-size:10px;color:#9ca3af">\${time}</span></div>
                    <div class="d-flex justify-content-between align-items-center mt-1"><span style="font-size:10px;color:#6b7280">\${u.phone}</span>\${badge}</div></div>
                    <div style="width:20px;text-align:right">\${dot}</div></div>\`;
            }
        });
    }
    function selectUser(p){
        cur=p; fetch('/api/leido', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:p})}); r();
        const u = d.users[p];
        document.getElementById('chatHeader').innerHTML = \`<div><span class="fw-bold">\${u.name}</span> <span class="text-muted small">\${u.phone}</span></div><button onclick="toggleBot('\${p}')" class="btn btn-sm \${d.botStatus[p]!==false?'btn-success':'btn-secondary'}" style="font-size:10px">\${d.botStatus[p]!==false?'BOT ON':'BOT OFF'}</button>\`;
        document.getElementById('tagSelector').value = u.tag || 'NUEVO';
        renderLog(u);
    }
    function renderChat(){
        const c=document.getElementById('chat'); const u = d.users[cur];
        c.innerHTML=(u.history||[]).map(m=>\`<div class="msg \${m.role==='user'?'msg-user':'msg-bot'}">\${m.content}<div style="text-align:right;font-size:9px;opacity:0.5;margin-top:2px">\${new Date(m.timestamp).toLocaleString('es-CL', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</div></div>\`).join('');
    }
    function renderLog(u){
        const log = document.getElementById('log');
        if(!u.notes || u.notes.length===0) { log.innerHTML='<div class="text-center text-muted mt-3" style="font-size:10px">Sin notas</div>'; return; }
        log.innerHTML = u.notes.map((n,i)=>\`<div style="padding:5px;border-bottom:1px solid #eee;font-size:11px;background:\${n.status==='executed'?'#dcfce7':'#fff'}"><div class="d-flex justify-content-between"><b>\${n.isScheduled?'⏰':'📝'} \${new Date(n.date).toLocaleDateString()}</b><span style="cursor:pointer;color:red" onclick="delNote('\${u.phone}',\${i})">×</span></div><div>\${n.text}</div>\${n.targetDate ? \`<div class="text-primary">📅 \${new Date(n.targetDate).toLocaleString()}</div>\` : ''}</div>\`).reverse().join('');
    }
    function setFiltro(t,e){tab=t;document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));e.classList.add('active');renderList();}
    async function send(){const t=document.getElementById('txt').value; if(t){await fetch('/api/manual',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:cur,text:t})});document.getElementById('txt').value='';r();}}
    async function toggleBot(p){await fetch('/api/bot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p})});r();}
    async function updateTag(){const t=document.getElementById('tagSelector').value; await fetch('/api/tag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:cur,tag:t})});r();}
    async function recalc(){await fetch('/api/recalc');r();}
    async function addNote(){const t=document.getElementById('noteInput').value; const d=document.getElementById('dateInput').value; const c=document.getElementById('checkZara').checked; await fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:cur,text:t,isScheduled:c,targetDate:d})}); document.getElementById('noteInput').value=''; r();}
    async function delNote(p,i){if(confirm('Borrar?')) await fetch('/api/delete-note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p,index:i})}); r();}
    async function processCsv(){const raw=document.getElementById('csvInput').value; if(!raw)return; await fetch('/api/push-batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({raw})}); alert('Enviando...'); document.getElementById('csvInput').value=''; r();}
    </script></body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ok:true}); });
app.post('/api/tag', (req, res) => { updateTagManual(req.body.phone, req.body.tag); res.json({ok:true}); });
app.post('/api/bot', (req, res) => { toggleBot(req.body.phone); res.json({ok:true}); });
app.post('/api/note', (req, res) => { agregarNota(req.body.phone, req.body.text, req.body.isScheduled, req.body.targetDate); res.json({ok:true}); });
app.post('/api/delete-note', (req, res) => { eliminarNota(req.body.phone, req.body.index); res.json({ok:true}); });
app.get('/api/recalc', (req, res) => { const c = forzarRecalculo(); res.json({count:c}); });
app.post('/api/push-batch', async (req, res) => {
    try {
        const rows = req.body.raw.split('\n').filter(r => r.trim());
        const lista = rows.map(r => { const [n, p, m] = r.split('|'); return { nombre: n, telefono: p, mensaje: m }; });
        const c = await procesarPushBatch(lista);
        res.json({ count: c });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/leido', (req, res) => { marcarLeido(req.body.phone); res.json({ok:true}); });

app.get('/webhook', (req, res) => { if (req.query['hub.verify_token'] === 'BODYELITE_SECRET_123') res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.post('/webhook', async (req, res) => { try { await procesarEvento(req.body); res.sendStatus(200); } catch (e) { console.error(e); res.sendStatus(500); } });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ZARA 7.0 VISUAL UP 🚀`));
