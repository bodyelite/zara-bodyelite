import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, getBotStatus, enviarMensajeManual, ejecutarEstrategia, updateTagManual, toggleBot } from './app.js';

const app = express(); app.use(express.json()); app.use(cors());

app.get('/monitor', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZARA 9.2 ANALYTICS</title>
    <style>
        :root{--bg:#0b141a;--sb:#111b21;--ac:#00a884;--ht:#e91e63;--it:#ff9800;--fr:#667781;--mn:#3b82f6;--txt:#e9edef;}
        body{margin:0;font-family:'Segoe UI',sans-serif;background:var(--bg);color:var(--txt);display:flex;height:100vh;overflow:hidden;}
        
        .sl{width:320px;background:var(--sb);border-right:1px solid #222d34;display:flex;flex-direction:column;flex-shrink:0;}
        .filters{padding:10px;background:#202c33;display:flex;gap:5px;border-bottom:1px solid #2a3942;}
        .f-btn{flex:1;background:transparent;border:1px solid #374045;color:#8696a0;padding:5px;border-radius:4px;cursor:pointer;font-size:0.7em;font-weight:bold;}
        .f-btn.active{background:#374045;color:white;border-color:var(--ac);}
        
        .cd{padding:15px;border-bottom:1px solid #222d34;cursor:pointer;transition:0.2s;}
        .cd:hover{background:#202c33;}
        .cd.active{background:#2a3942;border-left:4px solid var(--ac);}
        .tag{font-size:0.65em;padding:2px 6px;border-radius:4px;color:white;font-weight:bold;display:inline-block;margin-left:5px;}
        .tag-NUEVO{background:var(--ac);} .tag-HOT{background:var(--ht);} .tag-INTERESADO{background:var(--it);} .tag-FRIO{background:var(--fr);} .tag-APAGADO{background:#333;}

        .mc{flex:1;display:flex;flex-direction:column;background:var(--bg);min-width:0;}
        .ch{padding:10px 20px;background:#202c33;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a3942;}
        #fd{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
        .msg{max-width:75%;padding:10px 14px;border-radius:8px;font-size:0.9em;position:relative;line-height:1.4;}
        .msg.bot{align-self:flex-end;background:#005c4b;color:white;}
        .msg.user{align-self:flex-start;background:#202c33;color:white;}
        .msg.manual{align-self:flex-end;background:var(--mn);border:1px solid #fff3;}
        
        .ib{padding:15px;background:#202c33;display:flex;gap:10px;}
        #m{flex:1;background:#2a3942;border:none;padding:12px;border-radius:8px;color:white;outline:none;}
        .btn{padding:12px;border:none;border-radius:6px;color:white;font-weight:bold;cursor:pointer;font-size:0.8em;width:100%;transition:0.2s;}
        .btn:hover{filter:brightness(1.1);}

        .sr{width:220px;background:var(--sb);border-left:1px solid #222d34;padding:20px;display:flex;flex-direction:column;gap:15px;flex-shrink:0;}
        
        .mod{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:700px;background:#111b21;display:none;padding:30px;border-radius:12px;z-index:100;box-shadow:0 0 50px rgba(0,0,0,0.9);border:1px solid #374045;max-height:90vh;overflow-y:auto;}
        .d-picker{background:#2a3942;border:1px solid #444;color:white;padding:8px;border-radius:5px;}
        .stat-grid{display:grid;grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));gap:10px;margin-top:20px;}
        .stat-box{padding:15px;border-radius:8px;text-align:center;color:white;position:relative;}
        .stat-num{font-size:1.8em;font-weight:bold;margin:5px 0;}
        .stat-pct{font-size:0.8em;opacity:0.8;}
        .total-box{background:#202c33;padding:15px;border-radius:8px;text-align:center;margin-top:15px;border:1px solid #374045;}

        @media(max-width:900px){body{flex-direction:column;}.sl{width:100%;height:35vh;}.sr{display:none;}.mc{height:65vh;}}
    </style></head>
    <body>
        <div class="sl">
            <div style="padding:15px;font-weight:bold;color:var(--ac);text-align:center;letter-spacing:1px">ZARA 9.2</div>
            <div class="filters">
                <button class="f-btn active" onclick="setFilter('ALL',this)">TODOS</button>
                <button class="f-btn" onclick="setFilter('HOT',this)">HOT 🔥</button>
                <button class="f-btn" onclick="setFilter('INTERESADO',this)">INT 🔸</button>
            </div>
            <div id="list" style="flex:1;overflow-y:auto"></div>
        </div>
        
        <div class="mc">
            <div class="ch" id="h" style="display:none">
                <div style="display:flex;flex-direction:column">
                    <b id="n" style="font-size:1.1em;color:var(--ac)"></b>
                    <small id="p" style="color:#8696a0;font-size:0.7em"></small>
                </div>
                <div style="display:flex;gap:10px;align-items:center">
                    <button id="bt" class="btn" style="width:auto;padding:5px 15px;font-size:0.7em" onclick="tg()"></button>
                    <select id="ts" onchange="st()" style="background:#2a3942;color:white;border:1px solid #444;padding:6px;border-radius:6px;font-weight:bold">
                        <option value="NUEVO">NUEVO</option><option value="HOT">HOT 🔥</option><option value="INTERESADO">INTERESADO 🔸</option><option value="FRIO">FRIO ❄️</option><option value="APAGADO">APAGADO 🗑️</option>
                    </select>
                </div>
            </div>
            <div id="fd"></div>
            <div class="ib" id="i" style="display:none">
                <input id="m" placeholder="Escribe tu respuesta manual..." onkeypress="if(event.key==='Enter')sd()">
            </div>
        </div>

        <div class="sr">
            <div style="font-size:0.75em;color:#8696a0;font-weight:bold">ESTRATEGIAS</div>
            <button class="btn" style="background:var(--ht)" onclick="rn('HOT')">CIERRE HOT 🔥</button>
            <button class="btn" style="background:var(--it)" onclick="rn('INTERESADO')">IMPULSAR INT 🔸</button>
            <hr style="border:0;border-top:1px solid #374045;width:100%">
            <button class="btn" style="background:var(--mn)" onclick="op()">📊 VER ANALYTICS</button>
            <button class="btn" style="background:#444" onclick="location.reload()">REFRESCAR</button>
        </div>

        <div id="rp" class="mod">
            <h2 style="margin-top:0;color:var(--ac)">Funnel Analytics</h2>
            
            <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;justify-content:center">
                <button class="f-btn" onclick="setRange('hoy', this)">HOY</button>
                <button class="f-btn" onclick="setRange('ayer', this)">AYER</button>
                <button class="f-btn" onclick="setRange('semana', this)">SEMANA</button>
                <button class="f-btn" onclick="setRange('mes', this)">MES</button>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;align-items:center">
                <span>Desde:</span>
                <input type="date" id="d-start" class="d-picker" onchange="calcStats()">
                <span>Hasta:</span>
                <input type="date" id="d-end" class="d-picker" onchange="calcStats()">
            </div>

            <div id="total-display" class="total-box">
                <div style="font-size:0.9em;color:#8696a0">TOTAL LEADS (Fecha Seleccionada)</div>
                <div id="total-num" style="font-size:2.5em;font-weight:bold;color:white">0</div>
            </div>

            <div id="fn" class="stat-grid"></div>
            
            <button class="btn" style="background:#444;margin-top:20px" onclick="document.getElementById('rp').style.display='none'">CERRAR</button>
        </div>

        <script>
            let ap=null; let fl='ALL'; let allUsers={};
            const f=(t)=>new Date(t).toLocaleString('es-CL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
            
            async function tg(){await fetch("/api/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap})});up();}
            async function st(){await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,tag:document.getElementById("ts").value})});up();}
            async function rn(t){if(!confirm("¿Lanzar estrategia masiva?"))return;await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})});up();}
            
            function setFilter(filterName, btn) {
                fl = filterName;
                document.querySelectorAll('.filters .f-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderList();
            }

            // Helper para formatear fechas a YYYY-MM-DD sin problemas de zona horaria
            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return \`\${year}-\${month}-\${day}\`;
            }

            function setRange(type, btn) {
                const today = new Date();
                let start = new Date();
                let end = new Date();

                // Quitar clase active a otros botones de rango
                if(btn) {
                    const parent = btn.parentElement;
                    Array.from(parent.children).forEach(c => c.classList.remove('active'));
                    btn.classList.add('active');
                }

                if(type === 'hoy') {
                    // Start y End son hoy
                } else if (type === 'ayer') {
                    start.setDate(today.getDate() - 1);
                    end.setDate(today.getDate() - 1);
                } else if (type === 'semana') {
                    // Lunes de la semana actual
                    const day = today.getDay() || 7; // Hacer que Domingo sea 7
                    if(day !== 1) start.setHours(-24 * (day - 1));
                    // End es hoy
                } else if (type === 'mes') {
                    start.setDate(1);
                    // End es hoy
                }
                
                document.getElementById('d-start').value = formatDate(start);
                document.getElementById('d-end').value = formatDate(end);
                calcStats();
            }

            function calcStats() {
                const sVal = document.getElementById('d-start').value;
                const eVal = document.getElementById('d-end').value;
                if(!sVal || !eVal) return;

                // Crear fechas usando string para evitar confusiones de zona
                const s = new Date(sVal + "T00:00:00");
                const e = new Date(eVal + "T23:59:59");

                const c = { NUEVO:0, INTERESADO:0, HOT:0, FRIO:0, APAGADO:0 };
                let total = 0;
                
                Object.values(allUsers).forEach(u => {
                    const last = new Date(u.lastInteraction || 0);
                    if (last >= s && last <= e) {
                        const tag = u.tag || "NUEVO";
                        if(c[tag] !== undefined) c[tag]++;
                        total++;
                    }
                });

                document.getElementById("total-num").innerText = total;

                // Helper para porcentaje
                const pct = (val) => total > 0 ? ((val/total)*100).toFixed(1) + '%' : '0%';

                document.getElementById("fn").innerHTML = \`
                    <div class="stat-box" style="background:var(--ac)">
                        <div>NUEVOS</div><div class="stat-num">\${c.NUEVO}</div><div class="stat-pct">\${pct(c.NUEVO)}</div>
                    </div>
                    <div class="stat-box" style="background:var(--it)">
                        <div>INT</div><div class="stat-num">\${c.INTERESADO}</div><div class="stat-pct">\${pct(c.INTERESADO)}</div>
                    </div>
                    <div class="stat-box" style="background:var(--ht)">
                        <div>HOT</div><div class="stat-num">\${c.HOT}</div><div class="stat-pct">\${pct(c.HOT)}</div>
                    </div>
                    <div class="stat-box" style="background:var(--fr)">
                        <div>FRIOS</div><div class="stat-num">\${c.FRIO}</div><div class="stat-pct">\${pct(c.FRIO)}</div>
                    </div>
                    <div class="stat-box" style="background:#333;border:1px solid #555">
                        <div>OFF</div><div class="stat-num">\${c.APAGADO}</div><div class="stat-pct">\${pct(c.APAGADO)}</div>
                    </div>
                \`;
            }

            function op(){
                document.getElementById("rp").style.display='block';
                // Por defecto selecciona HOY al abrir si no hay fechas
                if(!document.getElementById('d-start').value) setRange('hoy', null);
                else calcStats();
            }

            function up(){
                fetch("/api/data").then(r=>r.json()).then(d=>{
                    allUsers = d.users || {};
                    renderList(d.botStatus || {});
                    if(ap && allUsers[ap]) updateChatUI(allUsers[ap], d.botStatus || {});
                });
            }