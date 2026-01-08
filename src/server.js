import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, procesarEvento, diagnosticarTodo } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8"><title>ZARA CRM 9.0 POTENTE</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { --primary: #2563eb; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
            body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; font-size: 13px; }
            .sidebar { width: 320px; background: #111827; border-right: 1px solid #334155; display: flex; flex-direction: column; }
            .tabs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 10px; }
            .tab-btn { padding: 8px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; cursor: pointer; font-size: 11px; }
            .tab-btn.active { background: var(--primary); }
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-card { padding: 12px; border-bottom: 1px solid #1e293b; cursor: pointer; transition: 0.2s; }
            .lead-card.active { background: var(--primary); }
            .main { flex: 1; display: flex; flex-direction: column; background: #0f172a; }
            .chat-header { padding: 15px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
            .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 80%; padding: 10px; border-radius: 10px; line-height: 1.4; }
            .msg.bot { align-self: flex-end; background: var(--primary); }
            .msg.user { align-self: flex-start; background: #334155; }
            .tools { width: 280px; background: #111827; border-left: 1px solid #334155; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
            .btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 11px; }
            .btn-blue { background: var(--primary); color: white; }
            .btn-purple { background: #7c3aed; color: white; }
        </style>
    </head>
    <body>
    <div class="sidebar">
        <div style="padding:15px; font-weight:800; color:var(--primary); font-size: 16px;">ZARA 9.0 PRO</div>
        <div class="tabs-grid">
            <button class="tab-btn active" onclick="setTab('NUEVO')">Nuevos</button>
            <button class="tab-btn" onclick="setTab('INTERESADO')">Interesados</button>
            <button class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button class="tab-btn" onclick="setTab('AGENDADO')">Agendados ✅</button>
        </div>
        <div class="lead-list" id="leadList"></div>
    </div>
    <div class="main">
        <div class="chat-header">
            <h3 id="uName" style="margin:0">Selecciona cliente</h3>
            <div id="botControl"></div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div style="padding:15px; background:#1e293b; display:flex; gap:10px">
            <input type="text" id="msgIn" style="flex:1; padding:12px; border-radius:8px; border:none; background:#0f172a; color:white;">
            <button class="btn btn-blue" style="width: 80px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>
    <div class="tools">
        <strong>🏷️ CAMBIAR ETAPA</strong>
        <select id="tagSelect" style="width:100%; padding:8px; background:#0f172a; color:white; border:none; border-radius:4px;">
            <option value="NUEVO">NUEVO</option>
            <option value="INTERESADO">INTERESADO</option>
            <option value="HOT">HOT 🔥</option>
            <option value="AGENDADO">AGENDADO ✅</option>
            <option value="CAMPAÑA">CAMPAÑA</option>
            <option value="DESCARTADO">DESCARTADO</option>
        </select>
        <button class="btn btn-blue" onclick="updateTag()">Guardar Etapa</button>
        <button class="btn btn-purple" onclick="refresh()">Actualizar Leads</button>
    </div>
    <script>
        let curTab='NUEVO', curPhone=null, data={};
        async function refresh(){
            const r = await fetch('/api/data');
            data = await r.json();
            renderList();
            if(curPhone) renderChat();
        }
        function renderList(){
            const list=document.getElementById('leadList'); list.innerHTML='';
            Object.values(data.users || {}).sort((a,b)=>b.lastInteraction-a.lastInteraction).forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    list.innerHTML += \`<div class="lead-card \${curPhone===u.phone?'active':''}" onclick="selectLead('\${u.phone}')">
                        <b>\${u.name}</b><br><small>\${u.phone}</small>
                    </div>\`;
                }
            });
        }
        function selectLead(p){ curPhone=p; document.getElementById('tagSelect').value = data.users[p].tag || 'NUEVO'; refresh(); }
        function renderChat(){
            const u=data.users[curPhone]; document.getElementById('uName').innerText = u.name;
            const status = data.botStatus[curPhone] !== false;
            document.getElementById('botControl').innerHTML = \`<button onclick="toggleBot()" style="background:\${status?'#059669':'#991b1b'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer">BOT: \${status?'ON':'OFF'}</button>\`;
            document.getElementById('chatBody').innerHTML = u.history.map(m => \`<div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>\`).join('');
            document.getElementById('chatBody').scrollTop = document.getElementById('chatBody').scrollHeight;
        }
        async function sendManual(){
            const t = document.getElementById('msgIn').value;
            await fetch('/api/manual', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:t})});
            document.getElementById('msgIn').value=''; refresh();
        }
        async function toggleBot(){ await fetch('/api/toggle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone})}); refresh(); }
        async function updateTag(){ await fetch('/api/tag', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, tag:document.getElementById('tagSelect').value})}); refresh(); }
        function setTab(t){ curTab=t; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.innerText.includes(t))); renderList(); }
        setInterval(refresh, 5000); refresh();
    </script>
    </body></html>\`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text) }));
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM 9.0 POTENTE ONLINE 🚀"));
