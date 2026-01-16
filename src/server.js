import express from 'express';
import cors from 'cors';
import { getSesiones, getBotStatus, enviarMensajeManual, updateTagManual, toggleBot, agregarNota, procesarEvento, diagnosticarTodo, markRead } from './app.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8"><title>ZARA 7.0 DASHBOARD</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { --bg-body:#f3f4f6; --bg-sidebar:#ffffff; --text:#1f2937; --primary:#2563eb; --bot-color:#2563eb; --border:#e5e7eb; }
            body { margin:0; font-family:'Inter',sans-serif; background:var(--bg-body); color:var(--text); display:flex; height:100vh; overflow:hidden; font-size:13px; }
            .sidebar { width:360px; background:var(--bg-sidebar); border-right:1px solid var(--border); display:flex; flex-direction:column; }
            .main { flex:1; display:flex; flex-direction:column; background:#e5e7eb; position:relative; } 
            .tools { width:300px; background:var(--bg-sidebar); border-left:1px solid var(--border); padding:20px; display:flex; flex-direction:column; gap:15px; }
            .tabs-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; padding:10px; border-bottom:1px solid var(--border); background:#f9fafb; }
            
            /* ESTILO PESTAÑAS ACTIVAS */
            .tab-btn { padding:8px; border:1px solid var(--border); background:white; border-radius:6px; cursor:pointer; color:#6b7280; font-size:10px; font-weight:600; text-align:center; transition:all 0.2s; }
            .tab-btn:hover { background:#f3f4f6; }
            .tab-btn.active { background:var(--primary); color:white; border-color:var(--primary); box-shadow: 0 2px 4px rgba(37,99,235,0.2); }
            /* Estilo especial para Campaña */
            .tab-btn.campana-active { background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color:white; border:none; }

            .lead-list { flex:1; overflow-y:auto; }
            .lead-card { padding:12px; border-bottom:1px solid var(--border); cursor:pointer; display:flex; align-items:center; gap:10px; transition:background 0.2s; }
            .lead-card:hover { background:#f8fafc; }
            .lead-card.active { background:#eff6ff; border-left:4px solid var(--primary); }
            
            /* PUNTO NO LEIDO */
            .unread-dot { width:8px; height:8px; background:#ef4444; border-radius:50%; display:none; }
            .lead-card.unread .unread-dot { display:inline-block; }
            .lead-card.unread b { color:#1f2937; font-weight:800; }

            .chat-body { flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:15px; background:#f0f2f5; }
            .msg { padding:12px 16px; border-radius:12px; font-size:13px; box-shadow:0 1px 2px rgba(0,0,0,0.1); max-width:75%; line-height:1.4; }
            .msg.user { background:#ffffff; align-self:flex-start; }
            .msg.bot { background:var(--bot-color); color:white; align-self:flex-end; }
            
            .btn { width:100%; padding:10px; border:none; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px; }
            .btn-blue { background:var(--primary); color:white; }
            .btn-outline { background:white; border:1px solid var(--border); }
            .btn-purple { background:#7c3aed; color:white; margin-top:10px; }
            
            /* BARRA ACCIONES MASIVAS */
            .bulk-toolbar {
                position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
                background: #1f2937; color: white; padding: 10px 20px; border-radius: 30px;
                display: none; align-items: center; gap: 15px; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .bulk-toolbar.visible { display: flex; }
            .bulk-btn { background: #374151; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 11px; }
            .bulk-btn:hover { background: #4b5563; }

            .note-card { background:#fffbeb; padding:10px; border-radius:6px; margin-bottom:10px; font-size:12px; border-left:3px solid #f59e0b; }
            .note-date { font-size:10px; color:#92400e; display:block; margin-bottom:4px; font-weight:bold; }
            
            .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999; justify-content:center; align-items:center; }
            .modal-content { background:white; padding:20px; border-radius:10px; width:90%; max-width:600px; }
        </style>
    </head>
    <body>
    
    <div id="bulkToolbar" class="bulk-toolbar">
        <span id="selectedCount" style="font-weight:bold">0</span> seleccionados
        <div style="height:20px; width:1px; background:#4b5563"></div>
        <button class="bulk-btn" onclick="bulkAction('tag')">🏷 Cambiar Estado</button>
        <button class="bulk-btn" onclick="bulkAction('msg')">💬 Ejecutar Zara</button>
        <button class="bulk-btn" style="color:#ef4444" onclick="clearSelection()">✖</button>
    </div>

    <div class="sidebar">
        <div style="padding:15px; font-weight:700; font-size:16px; color:var(--primary); border-bottom:1px solid var(--border); display:flex; justify-content:space-between;">
            <span>ZARA 7.0</span>
            <span style="font-size:10px; background:#dbeafe; padding:2px 6px; border-radius:4px; color:#1e40af">CRM PRO</span>
        </div>
        <div class="tabs-grid">
            <button id="tab-NUEVO" class="tab-btn" onclick="setTab('NUEVO')">Nuevos</button>
            <button id="tab-CAMPAÑA" class="tab-btn" onclick="setTab('CAMPAÑA')">💎 Campaña</button>
            <button id="tab-INTERESADO" class="tab-btn" onclick="setTab('INTERESADO')">Interés</button>
            <button id="tab-HOT" class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button id="tab-AGENDADO" class="tab-btn" onclick="setTab('AGENDADO')">Citas</button>
            <button id="tab-RECICLAJE" class="tab-btn" onclick="setTab('RECICLAJE')">Reciclaje</button>
            <button id="tab-GESTIÓN FUTURA" class="tab-btn" onclick="setTab('GESTIÓN FUTURA')">Futuro</button>
            <button id="tab-ABANDONADOS" class="tab-btn" onclick="setTab('ABANDONADOS')">Aband.</button>
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
            <input type="text" id="msgIn" style="flex:1; padding:10px; border:1px solid var(--border); border-radius:6px; outline:none;" placeholder="Escribir mensaje manual..." onkeypress="if(event.key==='Enter') sendManual()">
            <button class="btn btn-blue" style="width:80px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>

    <div class="tools">
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">ESTADO ACTUAL</label>
            <select id="tagSelect" style="width:100%; padding:8px; border:1px solid var(--border); border-radius:6px; margin-top:5px; background:white;">
                <option value="NUEVO">NUEVO</option>
                <option value="CAMPAÑA">💎 CAMPAÑA</option>
                <option value="INTERESADO">INTERESADO</option>
                <option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO</option>
                <option value="RECICLAJE">♻️ RECICLAJE</option>
                <option value="ABANDONADOS">💀 ABANDONADOS</option>
                <option value="GESTIÓN FUTURA">FUTURO</option>
                <option value="DESCARTADO">DESCARTADO</option>
            </select>
            <button class="btn btn-blue" style="margin-top:5px;" onclick="updateTag()">Guardar Estado</button>
        </div>
        <div>
            <label style="font-size:11px; font-weight:700; color:#6b7280;">PROGRAMAR TAREA ZARA</label>
            <textarea id="noteIn" style="width:100%; height:60px; border:1px solid var(--border); border-radius:6px; margin-top:5px; padding:5px;" placeholder="Ej: Preguntar mañana por su decisión..."></textarea>
            <div style="margin-top:5px; display:flex; align-items:center; gap:5px; font-size:12px;">
                <input type="checkbox" id="checkZara" onchange="toggleDateInput()"> Asignar a Zara
            </div>
            <input type="datetime-local" id="dateIn" style="display:none; width:100%; margin-top:5px; padding:5px; border:1px solid var(--border); border-radius:4px;">
            <button class="btn btn-outline" style="margin-top:5px;" onclick="addNote()">Guardar Tarea</button>
        </div>
        
        <hr style="border:0; border-top:1px solid var(--border); width:100%; margin:10px 0;">
        
        <div style="background:#f0fdf4; padding:10px; border-radius:6px; border:1px solid #bbf7d0;">
            <label style="font-size:10px; font-weight:bold; color:#166534">📅 REPORTE CSV</label>
            <div style="display:flex; gap:5px; margin:5px 0;">
                <input type="date" id="dateStart" style="width:50%; border:1px solid #bbf7d0; border-radius:4px; font-size:10px; padding:3px;">
                <input type="date" id="dateEnd" style="width:50%; border:1px solid #bbf7d0; border-radius:4px; font-size:10px; padding:3px;">
            </div>
            <button class="btn btn-green" onclick="downloadFunnel()">Descargar</button>
        </div>

        <button class="btn btn-purple" onclick="openModal()">📂 Cargar Datos Externos</button>
        <button class="btn btn-outline" style="margin-top:5px" onclick="location.reload()">🔄 Recargar Todo</button>
    </div>

    <div id="bulkModal" class="modal">
        <div class="modal-content">
            <h3 style="margin-top:0">🚀 Carga Masiva</h3>
            <p style="font-size:11px; color:#666">Formato: TELEFONO, NOMBRE, MENSAJE</p>
            <textarea id="bulkInput" style="width:100%; height:200px; padding:10px; border:1px solid #ccc; border-radius:5px;" placeholder="569..., Juan, Hola..."></textarea>
            <div id="bulkStatus" style="font-size:11px; font-weight:bold; color:var(--primary); margin-bottom:10px"></div>
            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn btn-outline" style="width:auto" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-blue" style="width:auto" onclick="runBulk()">Lanzar</button>
            </div>
        </div>
    </div>

    <script>
        let curTab='NUEVO', curPhone=null, data={};
        let selectedLeads = new Set(); // Para selección múltiple

        function toggleDateInput() { document.getElementById('dateIn').style.display = document.getElementById('checkZara').checked ? 'block' : 'none'; }
        function openModal(){ document.getElementById('bulkModal').style.display = 'flex'; }
        function closeModal(){ document.getElementById('bulkModal').style.display = 'none'; }
        
        async function refresh(){ 
            try { 
                const r=await fetch('/api/data'); 
                data=await r.json(); 
                renderList(); 
                if(curPhone) renderChat(); 
            } catch(e){} 
        }

        // --- RENDERIZADO LISTA ---
        function renderList(){
            const list=document.getElementById('leadList'); 
            list.innerHTML='';
            
            // Actualizar Tabs Visualmente
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active', 'campana-active');
                if(b.id === 'tab-'+curTab) {
                    if(curTab === 'CAMPAÑA') b.classList.add('campana-active');
                    else b.classList.add('active');
                }
            });

            Object.values(data.users||{}).sort((a,b)=>b.lastInteraction-a.lastInteraction).forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    // Iconos Campaña
                    let icon = '';
                    if (u.campaign === 'lipo') icon = '👙 ';
                    else if (u.campaign === 'push_up') icon = '🍑 ';
                    else if (u.campaign === 'rostro') icon = '✨ ';

                    const isUnread = u.unread ? 'unread' : '';
                    const isChecked = selectedLeads.has(u.phone) ? 'checked' : '';

                    list.innerHTML += \`
                    <div class="lead-card \${curPhone===u.phone?'active':''} \${isUnread}">
                        <input type="checkbox" \${isChecked} onclick="toggleSelect('\${u.phone}', event)">
                        <div onclick="selectLead('\${u.phone}')" style="flex:1">
                            <div style="display:flex; justify-content:space-between;">
                                <b>\${icon}\${u.name}</b>
                                <span class="unread-dot"></span>
                            </div>
                            <span style="font-size:11px; color:#6b7280">\${u.phone}</span>
                        </div>
                    </div>\`;
                }
            });
            updateBulkToolbar();
        }

        // --- LOGICA SELECCIÓN MULTIPLE ---
        function toggleSelect(phone, event) {
            event.stopPropagation();
            if (selectedLeads.has(phone)) selectedLeads.delete(phone);
            else selectedLeads.add(phone);
            updateBulkToolbar();
        }
        
        function clearSelection() {
            selectedLeads.clear();
            renderList();
        }

        function updateBulkToolbar() {
            const toolbar = document.getElementById('bulkToolbar');
            document.getElementById('selectedCount').innerText = selectedLeads.size;
            if (selectedLeads.size > 0) toolbar.classList.add('visible');
            else toolbar.classList.remove('visible');
        }

        async function bulkAction(type) {
            const phones = Array.from(selectedLeads);
            if(phones.length === 0) return;
            
            if (type === 'tag') {
                const newTag = prompt("Escribe el NUEVO ESTADO para " + phones.length + " clientes:");
                if(newTag) {
                    for (let p of phones) await fetch('/api/tag', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p,tag:newTag.toUpperCase()})});
                    clearSelection(); refresh();
                }
            } else if (type === 'msg') {
                const msg = prompt("Escribe la TAREA PARA ZARA (se enviará a " + phones.length + " clientes):");
                if(msg) {
                    for (let p of phones) await fetch('/api/manual', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p,text:msg})});
                    alert("Enviando mensajes... esto puede tomar unos segundos.");
                    clearSelection(); refresh();
                }
            }
        }

        // --- RENDERIZADO CHAT ---
        async function selectLead(p){ 
            curPhone=p; 
            document.getElementById('tagSelect').value = data.users[p].tag||'NUEVO';
            // Marcar como leido al abrir
            await fetch('/api/read', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:p})});
            data.users[p].unread = false; // Optimistic UI update
            renderChat(); 
            renderList(); 
        }

        function renderChat(){
            const u=data.users[curPhone]; if(!u) return;
            document.getElementById('uName').innerText=u.name; document.getElementById('uPhone').innerText=u.phone;
            const status=data.botStatus[curPhone]!==false;
            document.getElementById('botControl').innerHTML=\`<button type="button" onclick="toggleBot()" style="border:none; background:\${status?'#dcfce7':'#fee2e2'}; color:\${status?'#166534':'#991b1b'}; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:11px; cursor:pointer; border:1px solid \${status?'#166534':'#991b1b'}">BOT \${status?'ON':'OFF'}</button>\`;
            
            let html='';
            
            // Render Notas con Fecha de Ejecución
            if(u.notes) u.notes.forEach(n=>{ 
                const created = new Date(n.date).toLocaleDateString();
                let scheduledHtml = '';
                if(n.scheduleTime) {
                    const sched = new Date(n.scheduleTime);
                    scheduledHtml = \`<br>⏰ <b>Ejecutar:</b> \${sched.toLocaleDateString()} \${sched.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}\`;
                }
                html+=\`<div class="note-card"><span class="note-date">Creada: \${created}</span>\${n.text}\${scheduledHtml}</div>\`; 
            });

            // Render Historial con Fecha Completa
            (u.history||[]).forEach(m=>{ 
                const dateObj = new Date(m.timestamp);
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
                html+=\`<div style="display:flex; flex-direction:column; align-items:\${m.role==='user'?'flex-start':'flex-end'}"><div class="msg \${m.role}">\${m.content}</div><span style="font-size:9px; color:#999; margin-top:2px;">\${dateStr}</span></div>\`; 
            });
            
            const chatDiv=document.getElementById('chatBody');
            const isAtBottom = (chatDiv.scrollHeight - chatDiv.scrollTop) <= (chatDiv.clientHeight + 100);
            chatDiv.innerHTML=html;
            if(isAtBottom) { chatDiv.scrollTop = chatDiv.scrollHeight; }
        }
        
        async function sendManual(){ const t=document.getElementById('msgIn').value; if(!t)return; await fetch('/api/manual',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,text:t})}); document.getElementById('msgIn').value=''; refresh(); }
        async function toggleBot(){ if(!curPhone) return alert("Selecciona un cliente"); await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone})}); if(data.botStatus[curPhone] === undefined) data.botStatus[curPhone] = true; data.botStatus[curPhone] = !data.botStatus[curPhone]; renderChat(); refresh(); }
        async function updateTag(){ await fetch('/api/tag',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,tag:document.getElementById('tagSelect').value})}); refresh(); }
        async function addNote(){ const n=document.getElementById('noteIn').value; const s=document.getElementById('checkZara').checked; const d=document.getElementById('dateIn').value; if(!n)return alert("Escribe algo"); await fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:curPhone,text:n,isScheduled:s,dateStr:d})}); document.getElementById('noteIn').value=''; toggleDateInput(); refresh(); }
        
        function downloadFunnel() {
            const d1 = document.getElementById('dateStart').value; const d2 = document.getElementById('dateEnd').value;
            if(!d1 || !d2) return alert("Selecciona fechas");
            const start = new Date(d1).getTime(); const end = new Date(d2).getTime() + (24 * 60 * 60 * 1000);
            let csvContent = "data:text/csv;charset=utf-8,FECHA,NOMBRE,TELEFONO,ESTADO,MSJ_USUARIO,ULTIMO_MENSAJE\\n";
            Object.values(data.users || {}).forEach(u => {
                if(u.lastInteraction >= start && u.lastInteraction <= end) {
                    const date = new Date(u.lastInteraction).toLocaleDateString();
                    const lastMsg = u.history.length ? u.history[u.history.length-1].content.replace(/,/g, ' ').replace(/\\n/g, ' ') : '';
                    const userMsgs = u.history.filter(m => m.role === 'user').length;
                    csvContent += \`\${date},\${u.name},\${u.phone},\${u.tag},\${userMsgs},\${lastMsg}\\n\`;
                }
            });
            const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", \`REPORTE_FUNNEL_\${d1}_\${d2}.csv\`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
        }

        async function runBulk(){
            const lines = document.getElementById('bulkInput').value.split('\\n'); const status = document.getElementById('bulkStatus');
            let count = 0; status.innerText = "Procesando...";
            for(let line of lines){
                const parts = line.split(',');
                if(parts.length >= 2){
                    let p = parts[0].trim(); let name = "Cliente"; let msg = "";
                    if(parts.length >= 3) { name = parts[1].trim(); msg = parts.slice(2).join(',').trim(); } else { msg = parts.slice(1).join(',').trim(); }
                    if(p && msg){ await fetch('/api/manual', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ phone:p, text:msg, name: name, tag: 'RECICLAJE' }) }); count++; status.innerText = \`Enviando... (\${count})\`; }
                }
            }
            status.innerText = "✅ Listo!"; setTimeout(() => { closeModal(); refresh(); }, 2000);
        }

        function setTab(t){ curTab=t; renderList(); }
        setInterval(refresh, 3000); refresh();
    </script>
    </body></html>`);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text, 'manual', req.body.name, req.body.tag); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text, req.body.isScheduled, req.body.dateStr) }));
app.post('/api/read', (req, res) => { const success = markRead(req.body.phone); res.json({ success }); }); // NUEVA API LEIDO
app.post('/api/diagnostic', async (req, res) => { await diagnosticarTodo(); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'ZARA_TOKEN_SECURE') res.status(200).send(req.query['hub.challenge']);
    else res.sendStatus(403);
});
app.get('/', (req, res) => res.redirect('/monitor'));

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM ONLINE"));
