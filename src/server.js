import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, procesarEvento, diagnosticarTodo } from './app.js';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors());

// --- DASHBOARD PLATINUM CON PESTAÑA RECICLAJE ---
app.get('/monitor', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8"><title>ZARA PLATINUM</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { 
                --bg-body: #f3f4f6; 
                --bg-sidebar: #ffffff; 
                --text: #1f2937; 
                --primary: #2563eb; 
                --bot-color: #2563eb;       
                --border: #e5e7eb;
            }
            body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-body); color: var(--text); display: flex; height: 100vh; overflow: hidden; font-size: 13px; }
            .sidebar { width: 340px; background: var(--bg-sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
            .main { flex: 1; display: flex; flex-direction: column; background: #e5e7eb; } 
            .tools { width: 300px; background: var(--bg-sidebar); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; gap: 15px; }
            
            /* GRID DE TABS AHORA CON 3 COLUMNAS MÁS ORDENADAS */
            .tabs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; padding: 10px; border-bottom: 1px solid var(--border); background: #f9fafb; }
            .tab-btn { padding: 8px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer; color: #6b7280; font-size: 10px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
            
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-card { padding: 15px; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
            .lead-card:hover { background: #f3f4f6; }
            .lead-card.active { background: #eff6ff; border-left: 4px solid var(--primary); }
            
            .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #f0f2f5; }
            .msg-row { display: flex; flex-direction: column; max-width: 75%; }
            .msg-row.bot { align-self: flex-end; align-items: flex-end; }
            .msg-row.user { align-self: flex-start; align-items: flex-start; }
            
            .msg { padding: 12px 16px; border-radius: 12px; font-size: 13px; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            .msg.user { background: #ffffff; color: #111827; border-bottom-left-radius: 2px; }
            .msg.bot { background: var(--bot-color); color: white; border-bottom-right-radius: 2px; }
            .msg.bot.scheduled { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
            .msg-time { font-size: 9px; margin-top: 4px; opacity: 0.7; font-weight: 500; text-align: right; display: block; }

            .btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; }
            .btn-blue { background: var(--primary); color: white; }
            .btn-outline { background: white; border: 1px solid var(--border); color: var(--text); }
            .btn-purple { background: #7c3aed; color: white; margin-top: 10px; }
            
            .input-group { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; padding: 10px; background: #f9fafb; border-radius: 8px; border: 1px solid var(--border); }
            .note-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 8px; border-radius: 6px; font-size: 12px; color: #92400e; margin-bottom: 10px; }
            
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; justify-content: center; align-items: center; }
            .modal-content { background: white; padding: 20px; border-radius: 10px; width: 90%; max-width: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            textarea.bulk-area { width: 100%; height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; font-size: 11px; margin-bottom: 10px; resize: none; }
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
            <button class="btn btn-blue" style="width: 80px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>

    <div class="tools">
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">ESTADO ACTUAL</label>
            <select id="tagSelect" style="width:100%; padding:8px; border:1px solid var(--border); border-radius:6px; margin-top:5px; background:white;">
                <option value="NUEVO">NUEVO</option>
                <option value="INTERESADO">INTERESADO</option>
                <option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO ✅</option>
                <option value="RECICLAJE">♻️ RECICLAJE EV</option>
                <option value="GESTIÓN FUTURA">GESTIÓN FUTURA 🕒</option>
                <option value="DESCARTADO">DESCARTADO 🗑️</option>
            </select>
            <button class="btn btn-blue" style="margin-top:5px;" onclick="updateTag()">Guardar Estado</button>
        </div>

        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">PROGRAMAR ZARA</label>
            <textarea id="noteIn" style="width:100%; height:60px; border:1px solid var(--border); border-radius:6px; margin-top:5px; resize:none; padding:5px; font-family:inherit;" placeholder="Ej: Preguntarle si ya lo pensó..."></textarea>
            
            <div class="input-group">
                <label class="checkbox-row" style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
                    <input type="checkbox" id="checkZara" onchange="toggleDateInput()"> 
                    <b>Asignar a Zara (Auto-envío)</b>
                </label>
                <input type="datetime-local" id="dateIn" style="display:none; padding:8px; border:1px solid var(--border); border-radius:4px;">
            </div>
            
            <button class="btn btn-outline" style="margin-top:5px;" onclick="addNote()">Guardar Tarea</button>
        </div>
        
        <hr style="border:0; border-top:1px solid var(--border); width:100%; margin: 10px 0;">
        
        <button class="btn btn-purple" onclick="openModal()">📂 Cargar Datos Externos</button>
        <button class="btn btn-outline" style="margin-top:5px" onclick="location.reload()">🔄 Recargar</button>
    </div>

    <div id="bulkModal" class="modal">
        <div class="modal-content">
            <h3 style="margin-top:0">🚀 Carga Masiva (Lista Externa)</h3>
            <p style="font-size:11px; color:#666">Formato: <b>TELEFONO, MENSAJE</b>. <br>⚠️ Se etiquetarán como <b>RECICLAJE</b> automáticamente.</p>
            <textarea id="bulkInput" class="bulk-area" placeholder="56911112222, Hola Juan..."></textarea>
            <div id="bulkStatus" style="font-size:11px; font-weight:bold; color:var(--primary); margin-bottom:10px"></div>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn btn-outline" style="width:auto" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-blue" style="width:auto" onclick="runBulk()">Lanzar Campaña</button>
            </div>
        </div>
    </div>

    <script>
        let curTab='NUEVO', curPhone=null, data={};
        let isUserScrolling = false;

        function toggleDateInput() { document.getElementById('dateIn').style.display = document.getElementById('checkZara').checked ? 'block' : 'none'; }
        function openModal(){ document.getElementById('bulkModal').style.display = 'flex'; }
        function closeModal(){ document.getElementById('bulkModal').style.display = 'none'; }
        document.getElementById('chatBody').addEventListener('scroll', function() { isUserScrolling = (this.scrollTop + this.clientHeight < this.scrollHeight - 50); });

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

        function selectLead(p){ curPhone=p; document.getElementById('tagSelect').value = data.users[p].tag || 'NUEVO'; renderChat(true); renderList(); }
        
        function renderChat(forceScroll = false){
            const u = data.users[curPhone];
            if(!u) return;
            document.getElementById('uName').innerText = u.name;
            document.getElementById('uPhone').innerText = u.phone;
            const status = data.botStatus[curPhone] !== false;
            document.getElementById('botControl').innerHTML = \`<button onclick="toggleBot()" style="border:none; background:\${status?'#dcfce7':'#fee2e2'}; color:\${status?'#166534':'#991b1b'}; padding:5px 10px; border-radius:20px; font-weight:bold; font-size:11px; cursor:pointer">BOT \${status?'ON':'OFF'}</button>\`;
            
            let html = '';
            if(u.notes) u.notes.forEach(n => {
                const date = new Date(n.date).toLocaleString([], {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
                let icon = "📝";
                if(n.status === 'pending') icon = "🕒 " + new Date(n.scheduleTime).toLocaleString();
                if(n.status === 'executed') icon = "✅ EJECUTADO";
                html += \`<div class="note-box"><b>\${icon} (\${date})</b><br>\${n.text}</div>\`;
            });

            (u.history || []).forEach(m => {
                const time = new Date(m.timestamp).toLocaleString([], {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'});
                const scheduledClass = m.source === 'scheduled' ? 'scheduled' : '';
                html += \`<div class="msg-row \${m.role==='user'?'user':'bot'}"><div class="msg \${m.role==='user'?'user':'bot'} \${scheduledClass}">\${m.content}<span class="msg-time">\${time}</span></div></div>\`;
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
            const note = document.getElementById('noteIn').value; 
            const isScheduled = document.getElementById('checkZara').checked;
            const dateStr = document.getElementById('dateIn').value;
            if(!note) return alert("Escribe una nota.");
            if(isScheduled && !dateStr) return alert("Falta la hora.");
            await fetch('/api/note', {
                method:'POST', headers:{'Content-Type':'application/json'}, 
                body:JSON.stringify({ phone:curPhone, text:note, isScheduled: isScheduled, dateStr: dateStr })
            });
            document.getElementById('noteIn').value=''; document.getElementById('checkZara').checked=false; toggleDateInput(); refresh();
        }

        async function runBulk(){
            const raw = document.getElementById('bulkInput').value;
            const lines = raw.split('\\n');
            const status = document.getElementById('bulkStatus');
            let count = 0;
            status.innerText = "Enviando...";
            
            for(let line of lines){
                const parts = line.split(',');
                if(parts.length >= 2){
                    const p = parts[0].trim();
                    const msg = parts.slice(1).join(',').trim();
                    if(p && msg){
                        // ENVÍA MENSAJE
                        await fetch('/api/manual', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:p, text:msg}) });
                        // CAMBIA ETIQUETA A RECICLAJE
                        await fetch('/api/tag', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:p, tag:'RECICLAJE'}) });
                        count++;
                        status.innerText = \`Enviando... (\${count})\`;
                    }
                }
            }
            status.innerText = \`✅ Terminado. \${count} mensajes en RECICLAJE.\`;
            alert("Campaña Lista. Revisa la pestaña RECICLAJE.");
            setTimeout(() => { closeModal(); refresh(); }, 1500);
        }

        function setTab(t){ curTab=t; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.innerText.includes(t.substring(0,3)))); renderList(); }
        setInterval(refresh, 2000); refresh();
    </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text, req.body.isScheduled, req.body.dateStr) }));
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'ZARA_TOKEN_SECURE') res.status(200).send(req.query['hub.challenge']);
    else res.sendStatus(403);
});
app.get('/', (req, res) => res.redirect('/monitor'));

app.listen(process.env.PORT || 3000, () => console.log("ZARA SERVER ONLINE"));
