import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_FILE = path.join(__dirname, "logs_wsp.json");

// === API recepción de logs ===
app.post("/api/logs", (req, res) => {
  const data = req.body;
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")); } catch { logs = []; }
  }
  logs.unshift(data);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 300), null, 2));
  res.json({ status: "ok" });
});

// === API Reservo ===
app.post("/api/reservo", (req, res) => {
  try {
    const { telefono, nombre, fecha, servicio } = req.body;
    if (!telefono) return res.status(400).json({ error: "Falta teléfono" });
    let logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")) : [];
    const idx = logs.findIndex(l => l.from && l.from.includes(telefono));
    if (idx !== -1) {
      logs[idx].estado = "reservado";
      logs[idx].status = "verde";
      logs[idx].reserva = { nombre, fecha, servicio };
      logs[idx].update = new Date().toISOString();
    } else {
      logs.unshift({
        from: telefono, estado: "reservado", status: "verde",
        reserva: { nombre, fecha, servicio }, fecha: new Date().toISOString()
      });
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 300), null, 2));
    res.json({ status: "ok" });
    console.log("✅ Reserva registrada desde Reservo:", telefono, servicio);
  } catch (e) {
    res.status(500).json({ error: "Error interno" });
  }
});

// === API para leer logs ===
app.get("/logs", (req, res) => {
  if (!fs.existsSync(LOGS_FILE)) return res.json([]);
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"));
  res.json(logs);
});

// === Interfaz Web ===
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <meta charset="UTF-8">
  <title>Monitor Zara 2.1</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
  body{margin:0;font-family:Arial;background:#f2f4f7;}
  .tabs{display:flex;background:#1c3d5a;color:white;}
  .tab{flex:1;padding:12px;text-align:center;cursor:pointer;}
  .tab.active{background:#0f2538;}
  .panel{display:flex;height:90vh;}
  .lista{width:30%;background:white;overflow-y:auto;border-right:1px solid #ccc;}
  .chat{flex:1;display:flex;flex-direction:column;}
  .mensajes{flex:1;padding:10px;overflow-y:auto;background:#eef1f4;}
  .msg{margin:8px 0;padding:8px;border-radius:8px;max-width:90%;}
  .msg-rec{background:white;align-self:flex-start;}
  .msg-env{background:#cce5ff;align-self:flex-end;}
  small{color:gray;font-size:11px;}
  #dashboard{padding:20px;display:none;}
  .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px;}
  .card{background:white;padding:10px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);}
  .chart-container{width:300px;margin:auto;}
  button{margin:6px;padding:8px 12px;border:none;border-radius:6px;cursor:pointer;}
  #btn-wsp{background:#25d366;color:white;}
  #btn-ig{background:#e1306c;color:white;}
  #btn-all{background:#999;color:white;}
  .unread{background:#1c3d5a;color:white;border-radius:50%;padding:3px 6px;font-size:11px;float:right;}
  </style>
  </head>
  <body>
    <div class="tabs">
      <div class="tab active" id="tab-wsp">WhatsApp</div>
      <div class="tab" id="tab-ig">Instagram</div>
      <div class="tab" id="tab-dash">Dashboard</div>
    </div>
    <div class="panel">
      <div class="lista" id="lista"></div>
      <div class="chat">
        <div class="mensajes" id="mensajes"></div>
        <div id="dashboard">
          <h3>Distribución de Leads por Estado (último día)</h3>
          <div>
            <button id="btn-wsp" onclick="setCanal('whatsapp')">WhatsApp</button>
            <button id="btn-ig" onclick="setCanal('instagram')">Instagram</button>
            <button id="btn-all" onclick="setCanal('todos')">Todos</button>
          </div>
          <label>Desde: <input type="date" id="desde"></label>
          <label>Hasta: <input type="date" id="hasta"></label>
          <button style="background:#1c3d5a;color:white;" onclick="actualizarDash()">Actualizar</button>
          <div class="chart-container"><canvas id="grafico"></canvas></div>
          <div class="stats" id="stats"></div>
          <button style="background:#1c3d5a;color:white;" onclick="descargarExcel()">Descargar Excel</button>
        </div>
      </div>
    </div>

  <script>
  let logs=[]; let chart; let canalFiltro="todos"; let leidos={};

  async function cargar(){const r=await fetch("/logs");logs=await r.json();renderLista();}

  function renderLista(){
    const l=document.getElementById("lista");
    l.innerHTML="";
    const porContacto={};
    logs.forEach(x=>{
      const f=x.from||"sin usuario";
      if(!porContacto[f])porContacto[f]=[];
      porContacto[f].push(x);
    });
    for(const u in porContacto){
      const mensajes=porContacto[u];
      const noLeidos=(mensajes.length-(leidos[u]||0));
      const div=document.createElement("div");
      div.style.padding="10px";
      div.style.borderBottom="1px solid #eee";
      const color=mensajes.some(x=>x.status==="verde")?"🟢":
                  mensajes.some(x=>x.status==="amarillo")?"🟡":
                  mensajes.some(x=>x.status==="rojo")?"🔴":"🔵";
      div.innerHTML=color+" "+u+(noLeidos>0?'<span class="unread">'+noLeidos+'</span>':"");
      div.onclick=()=>abrirChat(u,mensajes.length);
      l.appendChild(div);
    }
  }

  function abrirChat(u,total){
    leidos[u]=total;
    const msgs=logs.filter(x=>x.from===u);
    const m=document.getElementById("mensajes");
    document.getElementById("dashboard").style.display="none";
    m.style.display="block";
    m.innerHTML="";
    msgs.sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
    msgs.forEach(x=>{
      const div=document.createElement("div");
      div.className="msg "+(x.estado==="recibido"?"msg-rec":"msg-env");
      div.innerHTML='<b>'+u+'</b><br>'+x.texto+'<br><small>'+new Date(x.fecha).toLocaleString()+'</small><br>'+x.respuesta;
      m.appendChild(div);
    });
    renderLista();
  }

  // Dashboard
  document.getElementById("tab-dash").onclick=()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.getElementById("tab-dash").classList.add("active");
    document.getElementById("mensajes").style.display="none";
    document.getElementById("dashboard").style.display="block";
    renderDashboard();
  };

  function setCanal(c){canalFiltro=c;actualizarDash();}

  function renderDashboard(){
    const desdeInput=document.getElementById("desde");
    const hastaInput=document.getElementById("hasta");
    const hoy=new Date();const ayer=new Date(hoy);ayer.setDate(hoy.getDate()-1);
    const fd=ayer.toISOString().slice(0,10);
    desdeInput.value=desdeInput.value||fd;
    hastaInput.value=hastaInput.value||fd;
    actualizarDash();
  }

  function actualizarDash(){
    const desde=new Date(document.getElementById("desde").value);
    const hasta=new Date(document.getElementById("hasta").value);
    hasta.setHours(23,59,59);
    let filtrados=logs.filter(x=>{
      const f=new Date(x.fecha);
      return f>=desde && f<=hasta;
    });
    if(canalFiltro!=="todos") filtrados=filtrados.filter(x=>(x.canal||"").toLowerCase()===canalFiltro);
    const total=filtrados.length;
    const estados={azul:0,rojo:0,amarillo:0,verde:0};
    filtrados.forEach(x=>{
      if(x.status==="verde")estados.verde++;
      else if(x.status==="amarillo")estados.amarillo++;
      else if(x.status==="rojo")estados.rojo++;
      else estados.azul++;
    });
    const stats=document.getElementById("stats");
    stats.innerHTML="";
    const labels=[
      {k:"azul",t:"🔵 Nuevos (Instagram)"},
      {k:"rojo",t:"🔴 Sin agendar"},
      {k:"amarillo",t:"🟡 Interesados"},
      {k:"verde",t:"🟢 Reservados"}
    ];
    labels.forEach(lab=>{
      const q=estados[lab.k],p=((q/total)*100||0).toFixed(1);
      const card=document.createElement("div");
      card.className="card";
      card.innerHTML=\`<b>\${lab.t}</b><br>Q: \${q}<br>%: \${p}%\`;
      stats.appendChild(card);
    });
    const ctx=document.getElementById("grafico");
    const data={labels:labels.map(l=>l.t),
      datasets:[{data:[estados.azul,estados.rojo,estados.amarillo,estados.verde],
      backgroundColor:["#34b7f1","#f44336","#ffeb3b","#4caf50"]}]};
    if(chart)chart.destroy();
    chart=new Chart(ctx,{type:"pie",data});
  }

  function descargarExcel(){
    const encabezado="Telefono,Estado,Fecha,Canal,Respuesta\\n";
    const filtrados=canalFiltro==="todos"?logs:logs.filter(x=>(x.canal||"").toLowerCase()===canalFiltro);
    const rows=filtrados.map(x=>\`\${x.from||""},\${x.status||""},\${x.fecha||""},\${x.canal||""},\${x.respuesta||""}\`).join("\\n");
    const blob=new Blob([encabezado+rows],{type:"text/csv;charset=utf-8;"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="leads_bodyelite.csv";
    link.click();
  }

  document.getElementById("tab-wsp").onclick=()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.getElementById("tab-wsp").classList.add("active");
    document.getElementById("mensajes").style.display="block";
    document.getElementById("dashboard").style.display="none";
  };

  setInterval(cargar,5000); cargar();
  </script>
  </body></html>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>console.log("✅ Monitor Zara 2.1 con Dashboard, filtros y contador local en puerto",PORT));
