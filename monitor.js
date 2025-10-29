import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_FILE = path.join(__dirname, "logs_wsp.json");

// === REGISTRO GENERAL DE LOGS ===
app.post("/api/logs", (req, res) => {
  const data = req.body;
  let logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")) : [];
  if (!data.status) data.status = "azul";
  if (data.texto?.includes("reservo.cl")) data.status = "rojo";
  if (data.texto?.includes("clic reserva") || data.texto?.includes("click reserva")) data.status = "amarillo";
  if (data.texto?.includes("reserva ok") || data.texto?.includes("confirmado")) data.status = "verde";
  logs.unshift(data);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 400), null, 2));
  res.json({ status: "ok" });
});

// === CONFIRMACIÓN RESERVA → VERDE ===
app.post("/api/reservo", (req, res) => {
  try {
    const { telefono, nombre, fecha, servicio } = req.body;
    let logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")) : [];
    const idx = logs.findIndex(l => l.from && l.from.includes(telefono));
    if (idx !== -1) {
      logs[idx].status = "verde";
      logs[idx].reserva = { nombre, fecha, servicio };
    } else {
      logs.unshift({
        from: telefono,
        status: "verde",
        reserva: { nombre, fecha, servicio },
        fecha: new Date().toISOString()
      });
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 400), null, 2));
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
});

// === CLICK EN LINK → AMARILLO ===
app.post("/api/reservo-click", (req, res) => {
  try {
    const { telefono } = req.body;
    let logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")) : [];
    const idx = logs.findIndex(l => l.from && l.from.includes(telefono));
    if (idx !== -1) {
      logs[idx].status = "amarillo";
      logs[idx].fecha_click = new Date().toISOString();
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 400), null, 2));
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ error: "Error interno" });
  }
});

// === ENVÍO REAL DE MENSAJES A WHATSAPP ===
app.post("/api/send", async (req, res) => {
  try {
    const { telefono, texto } = req.body;
    if (!telefono || !texto) return res.status(400).json({ error: "Faltan parámetros" });
    const token = process.env.PAGE_ACCESS_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;
    await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: telefono, text: { body: texto } })
    });
    res.json({ status: "ok", enviado: true });
  } catch (e) {
    console.error("❌ Error enviando mensaje real:", e);
    res.status(500).json({ error: "Error interno" });
  }
});

// === LECTURA DE LOGS ===
app.get("/logs", (req, res) => {
  if (!fs.existsSync(LOGS_FILE)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")));
});

// === INTERFAZ DEL MONITOR ===
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Monitor Zara 2.1</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<style>
body{margin:0;font-family:Arial;background:#f2f4f7;}
.tabs{display:flex;background:#1c3d5a;color:white;}
.tab{flex:1;padding:12px;text-align:center;cursor:pointer;}
.tab.active{background:#0f2538;}
.panel{display:flex;height:90vh;}
.lista{width:30%;background:white;overflow-y:auto;border-right:1px solid #ccc;}
.chat{flex:1;display:flex;flex-direction:column;}
.chat-header{background:#1c3d5a;color:white;padding:10px;font-weight:bold;}
.mensajes{flex:1;padding:10px;overflow-y:auto;background:#eef1f4;display:flex;flex-direction:column;}
.msg{margin:6px 0;padding:8px 12px;border-radius:10px;max-width:75%;word-wrap:break-word;}
.msg-rec{background:#fff;align-self:flex-start;}
.msg-env{background:#cce5ff;align-self:flex-end;}
.input-area{display:none;padding:8px;background:white;border-top:1px solid #ccc;}
.input-area input{width:80%;padding:6px;border:1px solid #ccc;border-radius:6px;}
.input-area button{padding:6px 10px;margin-left:5px;border:none;border-radius:6px;background:#1c3d5a;color:white;cursor:pointer;}
.unread{background:#1c3d5a;color:white;border-radius:50%;padding:3px 6px;font-size:11px;float:right;}
.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px;}
.card{background:white;padding:10px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);}
.chart-container{width:300px;margin:auto;}
</style></head>
<body>
<div class="tabs">
  <div class="tab active" id="tab-wsp">WhatsApp</div>
  <div class="tab" id="tab-ig">Instagram</div>
  <div class="tab" id="tab-dash">Dashboard</div>
</div>
<div class="panel" id="panel-main">
  <div class="lista" id="lista"></div>
  <div class="chat">
    <div class="chat-header" id="chatHeader">Selecciona un contacto</div>
    <div class="mensajes" id="mensajes"></div>
    <div class="input-area" id="inputArea">
      <input id="textoManual" placeholder="Escribe un mensaje..." onkeypress="if(event.key==='Enter')enviarManual()">
      <button onclick="enviarManual()">Enviar</button>
    </div>
  </div>
</div>
<div id="dashboard" style="display:none;padding:20px;">
  <h3>Leads Body Elite (último día)</h3>
  <canvas id="grafico" width="400" height="300"></canvas>
  <div class="stats" id="stats"></div>
</div>
<script>
let logs=[];let usuarioActivo=null;let leidos=JSON.parse(localStorage.getItem("leidos")||"{}");let chart;
async function cargar(){const r=await fetch("/logs");logs=await r.json();renderLista();}
function renderLista(){const l=document.getElementById("lista");l.innerHTML="";const porContacto={};logs.forEach(x=>{const f=x.from;if(!porContacto[f])porContacto[f]=[];porContacto[f].push(x);});for(const u in porContacto){const mensajes=porContacto[u];const ult=mensajes[0];const noLeidos=(mensajes.length-(leidos[u]||0));const div=document.createElement("div");div.style.padding="10px";div.style.borderBottom="1px solid #eee";const color=ult.status==="verde"?"🟢":ult.status==="amarillo"?"🟡":ult.status==="rojo"?"🔴":ult.status==="azul"?"🔵":"⚪";div.innerHTML=color+" "+u+(noLeidos>0?'<span class="unread">'+noLeidos+'</span>':"");div.onclick=()=>abrirChat(u,mensajes.length);l.appendChild(div);}}
function abrirChat(u,total){usuarioActivo=u;leidos[u]=total;localStorage.setItem("leidos",JSON.stringify(leidos));document.getElementById("chatHeader").innerText="Chat con "+u;document.getElementById("inputArea").style.display="flex";const m=document.getElementById("mensajes");m.innerHTML="";const msgs=logs.filter(x=>x.from===u).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));msgs.forEach(x=>{const div=document.createElement("div");const tipo=x.estado==="recibido"?"msg-rec":"msg-env";div.className="msg "+tipo;div.innerHTML=x.texto+'<br><small>'+new Date(x.fecha).toLocaleString()+'</small>';m.appendChild(div);});m.scrollTop=m.scrollHeight;renderLista();}
async function enviarManual(){const texto=document.getElementById("textoManual").value.trim();if(!texto||!usuarioActivo)return;document.getElementById("textoManual").value="";const nuevo={from:usuarioActivo,texto:texto,respuesta:"(enviado manual)",fecha:new Date().toISOString(),status:"azul",canal:"whatsapp",estado:"enviado"};logs.unshift(nuevo);await fetch("/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(nuevo)});abrirChat(usuarioActivo,logs.filter(x=>x.from===usuarioActivo).length);await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telefono:usuarioActivo,texto:texto})});}
function renderDashboard(){const hoy=new Date();const ayer=new Date(hoy);ayer.setDate(hoy.getDate()-1);const desde=ayer.toISOString().slice(0,10);const hasta=hoy.toISOString().slice(0,10);const filtrados=logs.filter(x=>{const f=new Date(x.fecha);return f>=ayer&&f<=hoy;});const total=filtrados.length;const estados={azul:0,rojo:0,amarillo:0,verde:0};filtrados.forEach(x=>{if(x.status==="verde")estados.verde++;else if(x.status==="amarillo")estados.amarillo++;else if(x.status==="rojo")estados.rojo++;else estados.azul++;});const ctx=document.getElementById("grafico");if(chart)chart.destroy();chart=new Chart(ctx,{type:"pie",data:{labels:["🔵 Nuevos","🔴 Link","🟡 Click","🟢 Reservados"],datasets:[{data:[estados.azul,estados.rojo,estados.amarillo,estados.verde],backgroundColor:["#34b7f1","#f44336","#ffeb3b","#4caf50"]}]}});const stats=document.getElementById("stats");stats.innerHTML=\`<div class='card'><b>Total:</b> \${total}</div><div class='card'>🟢 \${estados.verde}</div><div class='card'>🟡 \${estados.amarillo}</div><div class='card'>🔴 \${estados.rojo}</div><div class='card'>🔵 \${estados.azul}</div>\`;}
document.getElementById("tab-wsp").onclick=()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById("tab-wsp").classList.add("active");document.getElementById("dashboard").style.display="none";document.getElementById("panel-main").style.display="flex";renderLista();};
document.getElementById("tab-ig").onclick=()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById("tab-ig").classList.add("active");document.getElementById("dashboard").style.display="none";document.getElementById("panel-main").style.display="flex";renderLista();};
document.getElementById("tab-dash").onclick=()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById("tab-dash").classList.add("active");document.getElementById("panel-main").style.display="none";document.getElementById("dashboard").style.display="block";renderDashboard();};
setInterval(cargar,5000);cargar();
</script></body></html>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("✅ Monitor Zara 2.1 operativo en puerto", PORT));
