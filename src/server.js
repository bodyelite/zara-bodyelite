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
        <meta charset="UTF-8"><title>ZARA CRM PRO</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { 
                --bg-body: #f3f4f6; 
                --bg-card: #ffffff; 
                --text-main: #1f2937; 
                --text-muted: #6b7280;
                --primary: #2563eb; 
                --primary-dark: #1e40af;
                --accent-hot: #ef4444;
                --accent-success: #10b981;
                --border: #e5e7eb;
            }
            body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-body); color: var(--text-main); display: flex; height: 100vh; overflow: hidden; font-size: 13px; }
            
            /* SIDEBAR */
            .sidebar { width: 340px; background: var(--bg-card); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
            .header-bar { padding: 15px 20px; border-bottom: 1px solid var(--border); font-weight: 600; font-size: 16px; color: var(--primary-dark); display: flex; justify-content: space-between; align-items: center; }
            .tabs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 15px; border-bottom: 1px solid var(--border); background: #f9fafb; }
            .tab-btn { padding: 8px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer; color: var(--text-muted); font-size: 11px; font-weight: 500; transition: all 0.2s; }
            .tab-btn:hover { background: #f3f4f6; }
            .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
            
            .lead-list { flex: 1; overflow-y: auto; }
            .lead-card { padding: 15px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center; }
            .lead-card:hover { background: #f9fafb; }
            .lead-card.active { background: #eff6ff; border-left: 4px solid var(--primary); }
            .lead-info b { display: block; font-size: 14px; margin-bottom: 3px; }
            .lead-info small { color: var(--text-muted); font-size: 11px; }
            .tag-badge { font-size: 10px; padding: 2px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; background: #e5e7eb; color: var(--text-muted); }
            .tag-HOT { background: #fee2e2; color: #b91c1c; }
            .tag-AGENDADO { background: #d1fae5; color: #047857; }

            /* MAIN CHAT */
            .main { flex: 1; display: flex; flex-direction: column; background: #f8fafc; }
            .chat-header { padding: 15px 25px; background: var(--bg-card); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .chat-body { flex: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
            
            .msg-row { display: flex; flex-direction: column; max-width: 75%; }
            .msg-row.bot { align-self: flex-end; align-items: flex-end; }
            .msg-row.user { align-self: flex-start; align-items: flex-start; }
            
            .msg { padding: 12px 16px; border-radius: 12px; line-height: 1.5; font-size: 14px; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .msg.bot { background: var(--primary); color: white; border-bottom-right-radius: 2px; }
            .msg.user { background: white; border: 1px solid var(--border); color: var(--text-main); border-bottom-left-radius: 2px; }
            .msg-time { font-size: 10px; margin-top: 4px; opacity: 0.7; }
            
            .input-area { padding: 20px; background: var(--bg-card); border-top: 1px solid var(--border); display: flex; gap: 10px; }
            .input-box { flex: 1; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-family: inherit; outline: none; background: #f9fafb; }
            .input-box:focus { border-color: var(--primary); background: white; }
            
            /* TOOLS SIDEBAR */
            .tools { width: 300px; background: var(--bg-card); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; gap: 20px; }
            .tool-section { display: flex; flex-direction: column; gap: 10px; }
            .section-title { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
            
            .btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.2s; }
            .btn-primary { background: var(--primary); color: white; box-shadow: 0 2px 4px rgba(37,99,235,0.2); }
            .btn-primary:hover { background: var(--primary-dark); }
            .btn-outline { background: white; border: 1px solid var(--border); color: var(--text-main); }
            .btn-outline:hover { background: #f3f4f6; }
            
            .select-box { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: white; cursor: pointer; }
            
            /* MODAL */
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
            .modal-content { background: white; padding: 30px; border-radius: 16px; width: 80%; max-width: 800px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; }
            .stat-box { padding: 20px; border-radius: 8px; background: #f8fafc; border: 1px solid var(--border); text-align: center; }
            .stat-num { font-size: 24px; font-weight: 700; color: var(--primary); display: block; }
            .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-top: 5px; display: block; }
        </style>
    </head>
    <body>
    <div class="sidebar">
        <div class="header-bar">
            <span>ZARA CRM</span>
            <span style="font-size:10px; background:#e0e7ff; color:var(--primary); padding:2px 6px; border-radius:4px;">PRO 9.0</span>
        </div>
        <div class="tabs-grid">
            <button class="tab-btn active" onclick="setTab('NUEVO')">Nuevos</button>
            <button class="tab-btn" onclick="setTab('INTERESADO')">Interés</button>
            <button class="tab-btn" onclick="setTab('HOT')">Hot 🔥</button>
            <button class="tab-btn" onclick="setTab('AGENDADO')">Citas ✅</button>
            <button class="tab-btn" onclick="setTab('CAMPAÑA')">Campaña</button>
            <button class="tab-btn" onclick="setTab('DESCARTADO')">Papelera</button>
        </div>
        <div class="lead-list" id="leadList"></div>
    </div>
    
    <div class="main">
        <div class="chat-header">
            <div>
                <h2 id="uName" style="margin:0; font-size:16px;">Selecciona un cliente</h2>
                <small id="uPhone" style="color:var(--text-muted)">-</small>
            </div>
            <div id="botControl"></div>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <div class="input-area">
            <input type="text" id="msgIn" class="input-box" placeholder="Escribe un mensaje manual..." onkeypress="if(event.key==='Enter') sendManual()">
            <button class="btn btn-primary" style="width: 100px;" onclick="sendManual()">ENVIAR</button>
        </div>
    </div>
    
    <div class="tools">
        <div class="tool-section">
            <span class="section-title">Estado del Lead</span>
            <select id="tagSelect" class="select-box" onchange="updateTag()">
                <option value="NUEVO">NUEVO</option>
                <option value="INTERESADO">INTERESADO</option>
                <option value="HOT">HOT 🔥</option>
                <option value="AGENDADO">AGENDADO ✅</option>
                <option value="CAMPAÑA">CAMPAÑA</option>
                <option value="DESCARTADO">DESCARTADO</option>
            </select>
        </div>
        
        <div class="tool-section">
            <span class="section-title">Notas Internas</span>
            <textarea id="noteIn" class="input-box" style="height:80px; resize:none;" placeholder="Agregar nota..."></textarea>
            <button class="btn btn-outline" onclick="addNote()">Guardar Nota</button>
        </div>
        
        <hr style="border:0; border-top:1px solid var(--border); width:100%;">
        
        <div class="tool-section">
            <span class="section-title">Acciones</span>
            <button class="btn btn-outline" onclick="openAnalytics()">📊 Ver Reporte Analytics</button>
            <button class="btn btn-outline" onclick="runDiagnostic()">🩺 Diagnosticar con IA</button>
            <button class="btn btn-primary" onclick="refresh()">🔄 Actualizar Datos</button>
        </div>
    </div>

    <div id="analyticsModal" class="modal" onclick="if(event.target===this)this.style.display='none'">
        <div class="modal-content">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0">📊 Reporte de Rendimiento</h2>
                <button onclick="document.getElementById('analyticsModal').style.display='none'" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <div id="statGrid" class="stat-grid"></div>
        </div>
    </div>

    <script>
        let curTab='NUEVO', curPhone=null, data={};
        
        async function refresh(){
            try {
                const r = await fetch('/api/data');
                data = await r.json();
                renderList();
                if(curPhone && data.users[curPhone]) renderChat();
            } catch(e) { console.error("Error cargando datos"); }
        }

        function renderList(){
            const list = document.getElementById('leadList'); 
            list.innerHTML='';
            const users = Object.values(data.users || {}).sort((a,b)=>b.lastInteraction-a.lastInteraction);
            
            users.forEach(u=>{
                if(u.tag===curTab || (curTab==='NUEVO' && !u.tag)){
                    const div = document.createElement('div');
                    div.className = \`lead-card \${curPhone===u.phone?'active':''}\`;
                    div.onclick = () => selectLead(u.phone);
                    div.innerHTML = \`
                        <div class="lead-info">
                            <b>\${u.name || 'Sin Nombre'}</b>
                            <small>\${u.phone}</small>
                        </div>
                        <span class="tag-badge tag-\${u.tag}">\${u.tag || 'NUEVO'}</span>
                    \`;
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
            const u = data.users[curPhone];
            if(!u) return;
            
            document.getElementById('uName').innerText = u.name;
            document.getElementById('uPhone').innerText = u.phone;
            
            const botActive = data.botStatus[curPhone] !== false;
            document.getElementById('botControl').innerHTML = \`
                <button onclick="toggleBot()" class="btn" style="background:\${botActive?'#10b981':'#ef4444'}; color:white; width:auto; padding:5px 15px;">
                    BOT: \${botActive ? 'ENCENDIDO' : 'APAGADO'}
                </button>\`;

            let html = '';
            if(u.notes) {
                u.notes.forEach(n => {
                    html += \`<div style="background:#fff7ed; color:#9a3412; padding:10px; border-radius:8px; border:1px solid #fed7aa; font-size:12px; text-align:center; margin-bottom:10px;">
                        📝 <b>Nota:</b> \${n.text}
                    </div>\`;
                });
            }

            (u.history || []).forEach(m => {
                const time = new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                html += \`
                    <div class="msg-row \${m.role==='user'?'user':'bot'}">
                        <div class="msg \${m.role==='user'?'user':'bot'}">\${m.content}</div>
                        <span class="msg-time">\${time}</span>
                    </div>
                \`;
            });
            
            const body = document.getElementById('chatBody');
            body.innerHTML = html;
            body.scrollTop = body.scrollHeight;
        }

        async function sendManual(){
            const t = document.getElementById('msgIn').value;
            if(!t || !curPhone) return;
            await fetch('/api/manual', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:t})});
            document.getElementById('msgIn').value=''; 
            refresh();
        }

        async function toggleBot(){ 
            if(!curPhone) return;
            await fetch('/api/toggle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone})}); 
            refresh(); 
        }

        async function updateTag(){ 
            if(!curPhone) return;
            const newTag = document.getElementById('tagSelect').value;
            await fetch('/api/tag', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, tag:newTag})}); 
            refresh(); 
        }

        async function addNote(){
            const note = document.getElementById('noteIn').value; 
            if(!note || !curPhone) return;
            await fetch('/api/note', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phone:curPhone, text:note})});
            document.getElementById('noteIn').value=''; 
            refresh();
        }

        async function runDiagnostic(){ 
            await fetch('/api/diagnostic', {method:'POST'}); 
            alert('Diagnóstico IA completado en todos los chats.'); 
            refresh(); 
        }

        function openAnalytics(){
            const users = Object.values(data.users || {});
            const total = users.length;
            const hot = users.filter(u=>u.tag==='HOT').length;
            const agendados = users.filter(u=>u.tag==='AGENDADO').length;
            const conversion = total > 0 ? ((agendados/total)*100).toFixed(1) : 0;

            document.getElementById('statGrid').innerHTML = \`
                <div class="stat-box"><span class="stat-num">\${total}</span><span class="stat-label">Total Leads</span></div>
                <div class="stat-box"><span class="stat-num">\${hot}</span><span class="stat-label">🔥 Hot Leads</span></div>
                <div class="stat-box"><span class="stat-num">\${agendados}</span><span class="stat-label">✅ Citas</span></div>
                <div class="stat-box"><span class="stat-num">\${conversion}%</span><span class="stat-label">Conversión</span></div>
            \`;
            document.getElementById('analyticsModal').style.display='flex';
        }

        function setTab(t){ 
            curTab=t; 
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.toggle('active', b.innerText.toUpperCase().includes(t.substring(0,3)));
            });
            renderList(); 
        }

        setInterval(refresh, 4000); 
        refresh();
    </script>
    </body>
    </html>
    `);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), botStatus: getBotStatus() }));
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.post('/api/tag', (req, res) => res.json({ success: updateTagManual(req.body.phone, req.body.tag) }));
app.post('/api/toggle', (req, res) => res.json({ status: toggleBot(req.body.phone) }));
app.post('/api/note', (req, res) => res.json({ success: agregarNota(req.body.phone, req.body.text) }));
app.post('/api/diagnostic', async (req, res) => { await diagnosticarTodo(); res.json({ success: true }); });
app.post('/webhook', async (req, res) => { await procesarEvento(req.body); res.sendStatus(200); });

app.listen(process.env.PORT || 3000, () => console.log("ZARA CRM PRO ONLINE 🚀"));
