import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_FILE = path.join(__dirname, "logs_wsp.json");

// === API para recibir logs desde Zara (mantiene conexión actual) ===
app.post("/api/logs", (req, res) => {
  const data = req.body;
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")); } catch { logs = []; }
  }
  logs.unshift(data);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 200), null, 2));
  res.json({ status: "ok" });
});

// === API para entregar logs al navegador ===
app.get("/logs", (req, res) => {
  if (!fs.existsSync(LOGS_FILE)) return res.json([]);
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"));
  res.json(logs);
});

// === INTERFAZ VISUAL (basada en v2, pero conectada a logs actuales) ===
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>Monitor Zara 2.1</title>
  <meta charset="UTF-8">
  <style>
  body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f2f4f7;}
  .tabs{display:flex;background:#1c3d5a;color:white;}
  .tab{flex:1;padding:12px;text-align:center;cursor:pointer;}
  .tab.active{background:#0f2538;}
  .panel{display:flex;height:90vh;}
  .lista{width:30%;background:white;overflow-y:auto;border-right:1px solid #ccc;}
  .chat{flex:1;display:flex;flex-direction:column;}
  .mensajes{flex:1;padding:10px;overflow-y:auto;background:#eef1f4;}
  .msg{margin:8px 0;padding:8px;border-radius:8px;max-width:70%;}
  .msg-rec{background:white;align-self:flex-start;}
  .msg-env{background:#cce5ff;align-self:flex-end;}
  small{color:gray;font-size:11px;}
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
    <div class="chat"><div class="mensajes" id="mensajes"></div></div>
  </div>
  <script>
  let canal="whatsapp"; let logs=[];

  async function cargar(){
    const res=await fetch("/logs");
    logs=await res.json();
    renderLista();
  }

  function renderLista(){
    const l=document.getElementById("lista");
    l.innerHTML="";
    const porContacto={};
    logs.forEach(x=>{
      const from=x.from||"sin usuario";
      if(!porContacto[from])porContacto[from]=[];
      porContacto[from].push(x);
    });
    for(const u in porContacto){
      const div=document.createElement("div");
      div.className="contacto";
      div.style.padding="10px";
      div.style.borderBottom="1px solid #eee";
      div.innerHTML=u;
      div.onclick=()=>abrirChat(u);
      l.appendChild(div);
    }
  }

  function abrirChat(u){
    const msgs=logs.filter(x=>x.from===u);
    const m=document.getElementById("mensajes");
    m.innerHTML="";
    msgs.reverse().forEach(x=>{
      const div=document.createElement("div");
      div.className="msg "+(x.estado==="recibido"?"msg-rec":"msg-env");
      div.innerHTML='<b>'+u+'</b><br>'+x.texto+'<br><small>'+new Date(x.fecha).toLocaleString()+'</small><br>'+x.respuesta;
      m.appendChild(div);
    });
  }

  setInterval(cargar,5000);
  cargar();
  </script>
  </body></html>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("✅ Monitor Zara 2.1 visual mejorado en puerto", PORT));
