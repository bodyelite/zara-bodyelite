import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, procesarEvento, diagnosticarTodo, ejecutarEstrategia } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8"><title>ZARA CRM PRO</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { --bg-body: #f3f4f6; --bg-sidebar: #ffffff; --text-main: #111827; --primary: #2563eb; --border: #e5e7eb; }
            body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-body); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; font-size: 13px; }
            .sidebar { width: 340px; background: var(--bg-sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
            .main { flex: 1; display: flex; flex-direction: column; background: #f8fafc; }
            .tools { width: 300px; background: var(--bg-sidebar); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; gap: 20px; }
            .tabs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; padding: 10px; border-bottom: 1px solid var(--border); background: #f9fafb; }
            .tab-btn { padding: 8px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer; color: #6b7280; font-size: 11px; font-weight: 500; }
            .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-card { padding: 15px; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
            .lead-card:hover { background: #f3f4f6; }
            .lead-card.active { background: #eff6ff; border-left: 4px solid var(--primary); }
            .chat-header { padding: 15px 20px; background: white; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
            .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
            .msg-row { display: flex; flex-direction: column; max-width: 80%; }
            .msg-row.bot { align-self: flex-end; align-items: flex-end; }
            .msg-row.user { align-self: flex-start; align-items: flex-start; }
            .msg { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.4; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .msg.bot { background: var(--primary); color: white; border-bottom-right-radius: 2px; }
            .msg.user { background: white; border: 1px solid var(--border); border-bottom-left-radius: 2px; }
            .msg-time { font-size: 10px; color: #9ca3af; margin-top: 3px; }
            .btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: 0.2s; }
            .btn-blue { background: var(--primary); color: white; }
            .btn-blue:hover { background: #1d4ed8; }
            .btn-outline { background: white; border: 1px solid var(--border); color: var(--text-main); }
            .btn-strat { background: #8b5cf6; color: white; margin-top: 5px; }
            .note-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 8px; border-radius: 6px; font-size: 12px; color: #92400e; margin-bottom: 10px; }
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; }
            .modal-content { background: white; padding: 30px; border-radius: 12px; width: 80%; max-width: 800px; }
            .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; }
            .stat-box { padding: 15px; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; text-align: center; }
        </style>
    </head>
    <body>
    <div class="sidebar">
        <div style="padding:15px; font-weight:700; font-size:16px; color:var(--primary); border-bottom:1px solid var(--border)">ZARA CRM 9.5</div>
        <div class="tabs-grid">
            <button class="tab-btn active" onclick="setTab('NUEVO')">Nuevos</button>
            <button class="tab-btn" onclick="setTab('INTERESADO')">Interés</button>
            <button class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button class="tab-btn" onclick="setTab('AGENDADO')">Citas</button>
            <button class="tab-btn" onclick="setTab('CAMPAÑA')">Campaña</button>
            <button class="tab-btn" onclick="setTab('DESCARTADO')">Papelera</button>
        </div>
        <div class="lead-list" id="leadList"></div>
    </div>
    <div class="main">
        <div class="chat-header">
            <div><h3 id="uName" style="margin:0; font-size:15px">Selecciona cliente</h3><small id="uPhone" style="color:#6b7280"></small></div>
            <div id="botControl"></div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div style="padding:15px; background:white; border-top:1px solid var(--border); display:flex; gap:10px">
            <input type="text" id="msgIn" style="flex:1; padding:10px; border:1px solid var(--border); border-radius:6px; outline:none;" placeholder="Escribir..." onkeypress="if(event.key==='Enter') sendManual()">
            <button class="btn btn-blue" style="width: 80px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>
    <div class="tools">
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">ESTADO</label>
            <select id="tagSelect" style="width:100%; padding:8px; border:1px solid var(--border); border-radius:6px; margin-top:5px; background:white;">
                <option value="NUEVO">NUEVO</option>
                <option value="INTERESADO">INTERESADO</option>
                <option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO ✅</option>
                <option value="CAMPAÑA">CAMPAÑA</option>
                <option value="DESCARTADO">DESCARTADO</option>
            </select>
            <button class="btn btn-blue" style="margin-top:5px;" onclick="updateTag()">Guardar Estado</button>
        </div>
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">ESTRATEGIAS</label>
            <div id="strategyArea"><small style="color:#9ca3af">Selecciona un chat...</small></div>
        </div>
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">NOTAS</label>
            <textarea id="noteIn" style="width:100%; height:60px; border:1px solid var(--border); border-radius:6px; margin-top:5px; resize:none; padding:5px;"></textarea>
            <button class="btn btn-outline" style="margin-top:5px;" onclick="addNote()">+ Nota</button>
        </div>
        <hr style="border:0; border-top:1px solid var(--border); width:100%;">
        <button class="btn btn-outline" onclick="openAnalytics()">📊 Ver Reporte</button>
        <button class="btn btn-outline" onclick="location.reload()">🔄 Recargar</button>
    </div>
    <div id="analyticsModal" class="modal" onclick="if(event.target===this)this.style.display='none'">
        <div class="modal-content">
            <div style="display:flex; justify-content:space-between;"><h2>📊 Rendimiento</h2><button onclick="document.getElementById('analyticsModal').style.display='none'" style="border:none; background:none; font-size:20px; cursor:pointer">&times;</button></div>
            <div id="statGrid" class="stat-grid"></div>
        </div>
    </div>
    <script>
        let curTab='NUEVO', curPhone=null, data={};
        let isUserScrolling = false;
        document.getElementById('chatBody').addEventListener('scroll', function() {
            const { scrollTop, scrollHeight, clientHeight } = this;
            isUserScrolling = (scrollTop + clientHeight < scrollHeight - 50);
        });
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
            Object.values(data.users || {}).sort((a,b)=>b.lastInteraction-a.lastInteraction).forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    list.innerHTML += \`<div class="lead-card \${curPhone===u.phone?'active':''}" onclick="selectLead('\${u.phone}')">
                        <div><b>\${u.name}</b><br><span style="font-size:11px; color:#6b7280">\${u.phone}</span></div>
                    </div>\`;
                }
            });
        }
        function selectLead(p){ 
            curPhone=p; 
            document.getElementById('tagSelect').value = data.users[p].tag || 'NUEVO';
            updateStrategies(data.users[p].tag || 'NUEVO');
            renderChat(true); 
            renderList();
        }
        function updateStrategies(tag){
            const area = document.getElementById('strategyArea');
            if(tag === 'NUEVO') area.innerHTML = \`<button class="btn btn-strat" onclick="runStrat('SALUDO')">👋 Saludo Reactivación</button>\`;
            else if(tag === 'INTERESADO') area.innerHTML = \`<button class="btn btn-strat" onclick="runStrat('OFERTA')">💎 Enviar Oferta</button>\`;
            else if(tag === 'HOT') area.innerHTML = \`<button class="btn btn-strat" onclick="runStrat('CIERRE')">🎯 Cierre Directo</button>\`;
            else area.innerHTML = \`<small style="color:#9ca3af">Sin acciones sugeridas</small>\`;
        }
        function renderChat(forceScroll = false){
            const u = data.users[curPhone];
            if(!u) return;
            document.getElementById('uName').innerText = u.name;
            document.getElementById('uPhone').innerText = u.phone;
            const status = data.botStatus[curPhone] !== false;
            document.getElementById('botControl').innerHTML = \`<button onclick="toggleBot()" style="border:none; background:\${status?'#dcfce7':'#fee2e2'}; color:\${status?'#166534':'#991b1b'}; padding:5px 10px; border-radius:20px; font-weight:bold; font-size:11px; cursor:pointer">BOT \${status?'ON':'OFF'}</button>\`;
            let html = '';
            if(u.notes) u.notes.forEach(n => {
                const date = new Date(n.date).toLocaleString();
                html += \`<div class="note-box"><b>\${date}</b><br>\${n.text}</div>\`;
            });
            (u.history || []).forEach(m => {
                const time = new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                html += \`<div class="msg-row \${m.role==='user'?'user':'bot'}">
                    <div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>
                    <span class="msg-time">\${time}</span>
                </div>\`;
            });
            const chatDiv = document.getElementById('chatBody');
            const prevScroll = chatDiv.scrollTop;
            chatDiv.innerHTML = html;
            if(forceScroll || !isUserScrolling) chatDiv.scrollTop = chatDiv.scrollHeight;
            else chatDiv.scrollTop = prevScroll;
        }
        async function sendManual(){
            const t = document.getElementById('msgIn').value; if(!t) return;
            await fetch('/api/manual', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:t})});
            document.getElementById('msgIn').value=''; refresh();
        }
        async function toggleBot(){ await fetch('/api/toggle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone})}); refresh(); }
        async function updateTag(){ await fetch('/api/tag', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, tag:document.getElementById('tagSelect').value})}); refresh(); }
        async function addNote(){
            const note = document.getElementById('noteIn').value; if(!note) return;
            await fetch('/api/note', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:note})});
            document.getElementById('noteIn').value=''; refresh();
        }
        async function runStrat(tipo){
            if(!confirm('¿Enviar estrategia automática?')) return;
            await fetch('/api/strategy', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, type:tipo})});
            refresh();
        }
        function openAnalytics(){
            const users = Object.values(data.users||{});
            const tot=users.length, hot=users.filter(u=>u.tag==='HOT').length, age=users.filter(u=>u.tag==='AGENDADO').length;
            document.getElementById('statGrid').innerHTML=\`
                <div class="stat-box"><h1>\${tot}</h1>TOTAL</div>
                <div class="stat-box"><h1>\${hot}</h1>HOT</div>
                <div class="stat-box"><h1>\${age}</h1>CITAS</div>
                <div class="stat-box"><h1>\${((age/tot)*100).toFixed(1)}%</h1>CONV.</div>\`;
            document.getElementById('analyticsModal').style.display='flex';
        }
        function setTab(t){ curTab=t; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.innerText.includes(t.substring(0,3)))); renderList(); }
        setInterval(refresh, 3000); refresh();
    </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text) }));
app.post('/api/strategy', async (req, res) => { await ejecutarEstrategia(req.body.phone, req.body.type); res.json({ success: true }); });
app.post('/api/diagnostic', async (req, res) => { await diagnosticarTodo(); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM 9.5 FINAL ONLINE 🚀"));
