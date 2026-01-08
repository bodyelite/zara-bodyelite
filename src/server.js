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
            .tab-btn.active { background: var(--primary); border-color: var(--primary); }
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-card { padding: 12px; border-bottom: 1px solid #1e293b; cursor: pointer; transition: 0.2s; }
            .lead-card:hover { background: #1e293b; }
            .lead-card.active { background: var(--primary); }
            .main { flex: 1; display: flex; flex-direction: column; background: #0f172a; }
            .chat-header { padding: 15px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
            .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 80%; padding: 10px; border-radius: 10px; line-height: 1.4; font-size: 13px; }
            .msg.bot { align-self: flex-end; background: var(--primary); color: white; }
            .msg.user { align-self: flex-start; background: #334155; color: white; }
            .tools { width: 280px; background: #111827; border-left: 1px solid #334155; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
            .tool-box { background: #1e293b; padding: 12px; border-radius: 8px; }
            .btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 5px; font-size: 11px; }
            .btn-blue { background: var(--primary); color: white; }
            .btn-purple { background: #7c3aed; color: white; }
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; }
            .modal-content { background: #1e293b; padding: 25px; border-radius: 12px; width: 80%; max-width: 700px; color: white; }
            .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: #334155; padding: 15px; border-radius: 8px; text-align: center; }
            .funnel-container { margin-top: 20px; }
            .funnel-stage { height: 30px; background: #334155; border-radius: 15px; margin-bottom: 10px; position: relative; overflow: hidden; }
            .funnel-fill { height: 100%; background: var(--primary); transition: width 1s; }
            .funnel-label { position: absolute; left: 10px; top: 5px; font-weight: bold; font-size: 11px; }
        </style>
    </head>
    <body>
    <div class="sidebar">
        <div style="padding:15px; font-weight:800; color:var(--primary); font-size: 16px; border-bottom: 1px solid #334155;">ZARA CRM 9.0 PRO</div>
        <div class="tabs-grid">
            <button class="tab-btn active" onclick="setTab('NUEVO')">Nuevos</button>
            <button class="tab-btn" onclick="setTab('INTERESADO')">Interesados</button>
            <button class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button class="tab-btn" onclick="setTab('AGENDADO')">Agendados ✅</button>
            <button class="tab-btn" onclick="setTab('CAMPAÑA')">Campaña 🚀</button>
            <button class="tab-btn" onclick="setTab('DESCARTADO')">Descartados</button>
        </div>
        <div class="lead-list" id="leadList"></div>
        <button class="btn btn-purple" onclick="openAnalytics()" style="margin: 10px; width: calc(100% - 20px);">📊 VER ANALYTICS</button>
    </div>
    <div class="main">
        <div class="chat-header">
            <h3 id="uName" style="margin:0">Selecciona un cliente</h3>
            <div id="botToggleArea"></div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div style="padding:15px; background:#1e293b; border-top:1px solid #334155; display:flex; gap:10px">
            <input type="text" id="msgIn" style="flex:1; padding:10px; border-radius:6px; border:none; background:#0f172a; color:white;" placeholder="Mensaje manual...">
            <button class="btn btn-blue" style="width: 80px; margin:0;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>
    <div class="tools">
        <div class="tool-box">
            <strong>🏷️ CAMBIAR ETAPA</strong>
            <select id="tagSelect" style="width:100%; margin-top:10px; padding:5px; border-radius:4px; background:#0f172a; color:white; border:none;">
                <option value="NUEVO">NUEVO</option>
                <option value="INTERESADO">INTERESADO</option>
                <option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO ✅</option>
                <option value="CAMPAÑA">CAMPAÑA</option>
                <option value="DESCARTADO">DESCARTADO</option>
            </select>
            <button class="btn btn-blue" onclick="updateTag()">Guardar Etapa</button>
        </div>
        <div class="tool-box">
            <strong>📝 NOTA INTERNA</strong>
            <textarea id="noteIn" style="width:100%; height:80px; margin-top:10px; border-radius:4px; background:#0f172a; color:white; border:none; padding:5px; resize:none;"></textarea>
            <button class="btn btn-blue" onclick="addNote()">Añadir Nota</button>
        </div>
        <div class="tool-box">
            <strong>⚙️ ACCIONES</strong>
            <button class="btn btn-purple" onclick="runDiagnostic()">Diagnosticar Todo</button>
        </div>
    </div>
    <div id="analyticsModal" class="modal" onclick="closeAnalytics()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>📊 Reporte de Conversión</h2>
                <button onclick="closeAnalytics()" style="background:none; border:none; color:white; cursor:pointer; font-size:20px;">×</button>
            </div>
            <div class="stat-grid" id="statGrid"></div>
            <h3>Embudo de Ventas</h3>
            <div class="funnel-container" id="funnel"></div>
        </div>
    </div>
    <script>
        let curTab='NUEVO', curPhone=null, data={};
        async function refresh(){
            try {
                const r = await fetch('/api/data');
                data = await r.json();
                renderList();
                if(curPhone) renderChat();
            } catch(e) {}
        }
        function renderList(){
            const list=document.getElementById('leadList'); list.innerHTML='';
            const users = Object.values(data.users || {}).sort((a,b)=>b.lastInteraction-a.lastInteraction);
            users.forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    const div = document.createElement('div');
                    div.className = \`lead-card \${curPhone===u.phone?'active':''}\`;
                    div.onclick = () => selectLead(u.phone);
                    div.innerHTML = \`<b>\${u.name}</b><br><small style="opacity:0.7">\${u.phone}</small>\`;
                    list.appendChild(div);
                }
            });
        }
        function selectLead(p){
            curPhone=p;
            document.getElementById('tagSelect').value = data.users[p].tag || 'NUEVO';
            renderList();
            renderChat();
        }
        function renderChat(){
            const u=data.users[curPhone];
            document.getElementById('uName').innerText = u.name;
            const status = data.botStatus[curPhone] !== false;
            document.getElementById('botToggleArea').innerHTML = \`
                <button class="btn \${status?'btn-blue':'btn-purple'}" style="width:120px;" onclick="toggleBot()">Bot: \${status?'ON':'OFF'}</button>\`;
            const chat = document.getElementById('chatBody'); chat.innerHTML='';
            if(u.notes && u.notes.length > 0){
                u.notes.forEach(n => {
                    chat.innerHTML += \`<div style="background:#fde68a; color:#92400e; padding:10px; border-radius:6px; margin-bottom:10px; font-size:11px;">📌 NOTA: \${n.text}</div>\`;
                });
            }
            u.history.forEach(m => {
                chat.innerHTML += \`<div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>\`;
            });
            chat.scrollTop = chat.scrollHeight;
        }
        async function sendManual(){
            const t = document.getElementById('msgIn').value; if(!t) return;
            await fetch('/api/manual', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:t})});
            document.getElementById('msgIn').value=''; refresh();
        }
        async function toggleBot(){
            await fetch('/api/toggle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone})});
            refresh();
        }
        async function updateTag(){
            const tag = document.getElementById('tagSelect').value;
            await fetch('/api/tag', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, tag:tag})});
            refresh();
        }
        async function addNote(){
            const note = document.getElementById('noteIn').value; if(!note) return;
            await fetch('/api/note', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:note})});
            document.getElementById('noteIn').value=''; refresh();
        }
        async function runDiagnostic(){
            await fetch('/api/diagnostic', {method:'POST'});
            alert('Diagnóstico completado.'); refresh();
        }
        function setTab(t){
            curTab=t;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(t.toLowerCase().charAt(0).toUpperCase() + t.toLowerCase().slice(1))));
            renderList();
        }
        function openAnalytics(){
            document.getElementById('analyticsModal').style.display='flex';
            const users = Object.values(data.users || {});
            const total = users.length;
            const agendados = users.filter(u=>u.tag==='AGENDADO').length;
            const hot = users.filter(u=>u.tag==='HOT').length;
            const interesados = users.filter(u=>u.tag==='INTERESADO').length;
            document.getElementById('statGrid').innerHTML = \`
                <div class="stat-card"><h3>\${total}</h3><small>Leads</small></div>
                <div class="stat-card"><h3>\${interesados}</h3><small>Interesados</small></div>
                <div class="stat-card"><h3>\${hot}</h3><small>Calientes</small></div>
                <div class="stat-card"><h3>\${agendados}</h3><small>Ventas</small></div>\`;
            renderFunnel(total, interesados, hot, agendados);
        }
        function renderFunnel(total, int, hot, age){
            const funnel = document.getElementById('funnel');
            const stages = [
                {label:'Captación (Nuevos)', val:total, color:'#3b82f6'},
                {label:'Interés (Interesados)', val:int, color:'#8b5cf6'},
                {label:'Deseo (Hot 🔥)', val:hot, color:'#ef4444'},
                {label:'Cierre (Agendados ✅)', val:age, color:'#10b981'}
            ];
            funnel.innerHTML = stages.map(s => {
                const pct = total === 0 ? 0 : (s.val/total*100).toFixed(0);
                return \`<div class="funnel-stage">
                    <div class="funnel-fill" style="width:\${pct}%; background:\${s.color};"></div>
                    <div class="funnel-label">\${s.label}: \${s.val} (\${pct}%)</div>
                </div>\`;
            }).join('');
        }
        function closeAnalytics(){ document.getElementById('analyticsModal').style.display='none'; }
        setInterval(refresh, 5000); refresh();
    </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text) }));
app.post('/api/diagnostic', async (req, res) => { await diagnosticarTodo(); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM 9.0 POTENTE ONLINE 🚀"));
