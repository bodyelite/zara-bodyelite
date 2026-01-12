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
        <meta charset="UTF-8"><title>ZARA PLATINUM</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { --bg-body:#f3f4f6; --bg-sidebar:#ffffff; --text:#1f2937; --primary:#2563eb; --bot-color:#2563eb; --border:#e5e7eb; }
            body { margin:0; font-family:'Inter',sans-serif; background:var(--bg-body); color:var(--text); display:flex; height:100vh; overflow:hidden; font-size:13px; }
            .sidebar { width:340px; background:var(--bg-sidebar); border-right:1px solid var(--border); display:flex; flex-direction:column; }
            .main { flex:1; display:flex; flex-direction:column; background:#e5e7eb; } 
            .tools { width:300px; background:var(--bg-sidebar); border-left:1px solid var(--border); padding:20px; display:flex; flex-direction:column; gap:15px; }
            .tabs-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; padding:10px; border-bottom:1px solid var(--border); background:#f9fafb; }
            .tab-btn { padding:8px; border:1px solid var(--border); background:white; border-radius:6px; cursor:pointer; color:#6b7280; font-size:10px; font-weight:600; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            .tab-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
            .lead-list { flex:1; overflow-y:auto; }
            .lead-card { padding:15px; border-bottom:1px solid var(--border); cursor:pointer; display:flex; justify-content:space-between; align-items:center; }
            .lead-card:hover { background:#f3f4f6; }
            .lead-card.active { background:#eff6ff; border-left:4px solid var(--primary); }
            .chat-body { flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:15px; background:#f0f2f5; }
            .msg { padding:12px 16px; border-radius:12px; font-size:13px; box-shadow:0 1px 2px rgba(0,0,0,0.1); max-width:75%; }
            .msg.user { background:#ffffff; align-self:flex-start; }
            .msg.bot { background:var(--bot-color); color:white; align-self:flex-end; }
            .btn { width:100%; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px; }
            .btn-blue { background:var(--primary); color:white; }
            .btn-outline { background:white; border:1px solid var(--border); }
            .btn-purple { background:#7c3aed; color:white; margin-top:10px; }
            .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999; justify-content:center; align-items:center; }
            .modal-content { background:white; padding:20px; border-radius:10px; width:90%; max-width:600px; }
            textarea { resize:none; font-family:inherit; }
        </style>
    </head>
    <body>
    <div class="sidebar">
        <div style="padding:15px; font-weight:700; font-size:16px; color:var(--primary); border-bottom:1px solid var(--border)">ZARA 11.0</div>
        <div class="tabs-grid">
            <button class="tab-btn active" onclick="setTab('NUEVO')">Nuevos</button>
            <button class="tab-btn" onclick="setTab('INTERESADO')">Interés</button>
            <button class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button class="tab-btn" onclick="setTab('AGENDADO')">Citas</button>
            <button class="tab-btn" onclick="setTab('RECICLAJE')">♻️ Reciclaje</button>
            <button class="tab-btn" onclick="setTab('GESTIÓN FUTURA')">Futuro</button>
        </div>
        <div class="lead-list" id="leadList"></div>
    </div>
    <div class="main">
        <div style="padding:15px; background:white; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div><h3 id="uName" style="margin:0; font-size:15px">Selecciona cliente</h3><small id="uPhone" style="color:#6b7280"></small></div>
            <div id="botControl"></div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div style="padding:15px; background:white; border-top:1px solid var(--border); display:flex; gap:10px">
            <input type="text" id="msgIn" style="flex:1; padding:10px; border:1px solid var(--border); border-radius:6px; outline:none;" placeholder="Escribir..." onkeypress="if(event.key==='Enter') sendManual()">
            <button class="btn btn-blue" style="width:80px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>
    <div class="tools">
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">ESTADO</label>
            <select id="tagSelect" style="width:100%; padding:8px; border:1px solid var(--border); border-radius:6px; margin-top:5px; background:white;">
                <option value="NUEVO">NUEVO</option><option value="INTERESADO">INTERESADO</option><option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO</option><option value="RECICLAJE">♻️ RECICLAJE</option><option value="GESTIÓN FUTURA">FUTURO</option>
                <option value="DESCARTADO">DESCARTADO</option>
            </select>
            <button class="btn btn-blue" style="margin-top:5px;" onclick="updateTag()">Guardar Estado</button>
        </div>
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">PROGRAMAR</label>
            <textarea id="noteIn" style="width:100%; height:60px; border:1px solid var(--border); border-radius:6px; margin-top:5px; padding:5px;" placeholder="Nota..."></textarea>
            <div style="margin-top:5px; display:flex; align-items:center; gap:5px; font-size:12px;">
                <input type="checkbox" id="checkZara" onchange="toggleDateInput()"> Asignar a Zara
            </div>
            <input type="datetime-local" id="dateIn" style="display:none; width:100%; margin-top:5px; padding:5px; border:1px solid var(--border); border-radius:4px;">
            <button class="btn btn-outline" style="margin-top:5px;" onclick="addNote()">Guardar Tarea</button>
        </div>
        <hr style="border:0; border-top:1px solid var(--border); width:100%; margin:10px 0;">
        <button class="btn btn-purple" onclick="openModal()">📂 Cargar Datos Externos</button>
        <button class="btn btn-outline" style="margin-top:5px" onclick="location.reload()">🔄 Recargar</button>
    </div>

    <div id="bulkModal" class="modal">
        <div class="modal-content">
            <h3 style="margin-top:0">🚀 Carga Masiva (3 Columnas)</h3>
            <p style="font-size:11px; color:#666">Pega aquí tu Excel.<br>Formato: <b>TELEFONO, NOMBRE, MENSAJE</b>.<br>Se etiquetarán como <b>♻️ RECICLAJE</b> y se corregirá el nombre automáticamente.</p>
            <textarea id="bulkInput" style="width:100%; height:200px; padding:10px; border:1px solid #ccc; border-radius:5px;" placeholder="56911112222, Juan, Hola Juan..."></textarea>
            <div id="bulkStatus" style="font-size:11px; font-weight:bold; color:var(--primary); margin-bottom:10px"></div>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn btn-outline" style="width:auto" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-blue" style="width:auto" onclick="runBulk()">Lanzar Campaña</button>
            </div>
        </div>
    </div>

    <script>
        let curTab='NUEVO', curPhone=null, data={};
        function toggleDateInput() { document.getElementById('dateIn').style.display = document.getElementById('checkZara').checked ? 'block' : 'none'; }
        function openModal(){ document.getElementById('bulkModal').style.display = 'flex'; }
        function closeModal(){ document.getElementById('bulkModal').style.display = 'none'; }
        
        async function refresh(){ try { const r=await fetch('/api/data'); data=await r.json(); renderList(); if(curPhone) renderChat(); } catch(e){} }
        function renderList(){
            const list=document.getElementById('leadList'); list.innerHTML='';
            Object.values(data.users||{}).sort((a,b)=>b.lastInteraction-a.lastInteraction).forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    list.innerHTML+=\`<div class="lead-card \${curPhone===u.phone?'active':''}" onclick="selectLead('\${u.phone}')"><div><b>\${u.name}</b><br><span style="font-size:11px; color:#6b7280">\${u.phone}</span></div></div>\`;
                }
            });
        }
        function selectLead(p){ curPhone=p; document.getElementById('tagSelect').value = data.users[p].tag||'NUEVO'; renderChat(); renderList(); }
        function renderChat(){
            const u=data.users[curPhone]; if(!u) return;
            document.getElementById('uName').innerText=u.name; document.getElementById('uPhone').innerText=u.phone;
            const status=data.botStatus[curPhone]!==false;
            document.getElementById('botControl').innerHTML=\`<button onclick="toggleBot()" style="border:none; background:\${status?'#dcfce7':'#fee2e2'}; color:\${status?'#166534':'#991b1b'}; padding:5px 10px; border-radius:20px; font-weight:bold; font-size:11px; cursor:pointer">BOT \${status?'ON':'OFF'}</button>\`;
            let html='';
            if(u.notes) u.notes.forEach(n=>{ html+=\`<div style="background:#fffbeb; padding:8px; border-radius:6px; margin-bottom:10px; font-size:12px; color:#92400e;"><b>📝 Nota:</b> \${n.text}</div>\`; });
            (u.history||[]).forEach(m=>{ html+=\`<div style="display:flex; flex-direction:column; align-items:\${m.role==='user'?'flex-start':'flex-end'}"><div class="msg \${m.role}">\${m.content}</div><span style="font-size:9px; color:#999; margin-top:2px;">\${new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>\`; });
            const chatDiv=document.getElementById('chatBody'); chatDiv.innerHTML=html; chatDiv.scrollTop=chatDiv.scrollHeight;
        }
        async function sendManual(){ const t=document.getElementById('msgIn').value; if(!t)return; await fetch('/api/manual',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,text:t})}); document.getElementById('msgIn').value=''; refresh(); }
        async function toggleBot(){ await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone})}); refresh(); }
        async function updateTag(){ await fetch('/api/tag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,tag:document.getElementById('tagSelect').value})}); refresh(); }
        async function addNote(){ const n=document.getElementById('noteIn').value; const s=document.getElementById('checkZara').checked; const d=document.getElementById('dateIn').value; if(!n)return alert("Escribe algo"); await fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,text:n,isScheduled:s,dateStr:d})}); document.getElementById('noteIn').value=''; toggleDateInput(); refresh(); }
        
        async function runBulk(){
            const lines = document.getElementById('bulkInput').value.split('\\n');
            const status = document.getElementById('bulkStatus');
            let count = 0;
            status.innerText = "Procesando...";
            for(let line of lines){
                const parts = line.split(',');
                if(parts.length >= 2){
                    let p = parts[0].trim();
                    let name = "Cliente";
                    let msg = "";
                    if(parts.length >= 3) {
                        name = parts[1].trim(); 
                        msg = parts.slice(2).join(',').trim(); 
                    } else {
                        msg = parts.slice(1).join(',').trim(); 
                    }
                    if(p && msg){
                        await fetch('/api/manual', {
                            method:'POST', 
                            headers:{'Content-Type':'application/json'}, 
                            body:JSON.stringify({ phone:p, text:msg, name: name, tag: 'RECICLAJE' }) 
                        });
                        count++;
                        status.innerText = \`Enviando... (\${count})\`;
                    }
                }
            }
            status.innerText = "✅ Listo! Revisa la pestaña 'RECICLAJE'.";
            setTimeout(() => { closeModal(); refresh(); }, 2000);
        }

        function setTab(t){ curTab=t; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.innerText.includes(t.substring(0,3)))); renderList(); }
        setInterval(refresh, 3000); refresh();
    </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text, 'manual', req.body.name, req.body.tag); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text, req.body.isScheduled, req.body.dateStr) }));
app.post('/api/diagnostic', async (req, res) => { await diagnosticarTodo(); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'ZARA_TOKEN_SECURE') res.status(200).send(req.query['hub.challenge']);
    else res.sendStatus(403);
});
app.get('/', (req, res) => res.redirect('/monitor'));

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM ONLINE"));
