import express from "express";
import http from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(express.static("public"));

let chats = []; // mensajes recibidos wsp/ig

// === WEBHOOK WHATSAPP / INSTAGRAM ===
app.post("/webhook", async (req, res) => {
  const data = req.body.entry?.[0]?.changes?.[0]?.value;
  if (!data) return res.sendStatus(200);

  const msg = data.messages?.[0];
  if (msg && msg.from && msg.text) {
    const origen = data.messaging_product === "instagram" ? "IG" : "WSP";
    const nuevo = {
      id: msg.id,
      from: msg.from,
      text: msg.text.body,
      origen,
      timestamp: new Date().toISOString(),
      status: "nuevo"
    };
    chats.unshift(nuevo);
    io.emit("nuevoMensaje", nuevo);
  }
  res.sendStatus(200);
});

// === DASHBOARD SIMPLE ===
app.get("/estadisticas", (req, res) => {
  const total = chats.length;
  const nuevos = chats.filter(c => c.status === "nuevo").length;
  const intencion = chats.filter(c => c.status === "intencion").length;
  const sinAgendar = chats.filter(c => c.status === "sinAgendar").length;
  const agendados = chats.filter(c => c.status === "agendado").length;
  res.json({ total, nuevos, intencion, sinAgendar, agendados });
});

// === FRONTEND LAYOUT WSP ===
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Zara Monitor</title>
<script src="/socket.io/socket.io.js"></script>
<style>
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#ece5dd;}
#contenedor{display:flex;height:100vh;}
#contactos{width:30%;background:#fff;border-right:1px solid #ccc;overflow-y:auto;}
#chat{flex:1;display:flex;flex-direction:column;background:#e5ddd5;}
#mensajes{flex:1;overflow-y:auto;padding:20px;}
#tabs{display:flex;background:#128C7E;color:white;}
.tab{flex:1;text-align:center;padding:10px;cursor:pointer;}
.tab.activa{background:#075E54;}
.mensaje{margin:10px 0;}
.msg-from{font-weight:bold;}
.estado{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px;}
.azul{background:#34b7f1;}
.rojo{background:#f44336;}
.amarillo{background:#ffeb3b;}
.verde{background:#4caf50;}
</style>
</head>
<body>
<div id="tabs">
  <div class="tab activa" data-origen="WSP">WhatsApp</div>
  <div class="tab" data-origen="IG">Instagram</div>
  <div class="tab" data-origen="DASH">Dashboard</div>
</div>
<div id="contenedor">
  <div id="contactos"></div>
  <div id="chat">
    <div id="mensajes"></div>
  </div>
</div>
<script>
const socket = io();
let chats = [];
let origenActual = "WSP";

function renderContactos(){
  const cDiv = document.getElementById("contactos");
  cDiv.innerHTML = "";
  const filtrados = chats.filter(c=>c.origen===origenActual);
  filtrados.forEach(c=>{
    const color = c.status==="nuevo"?"azul":c.status==="sinAgendar"?"rojo":c.status==="intencion"?"amarillo":"verde";
    cDiv.innerHTML += '<div class="contacto" onclick="mostrarChat(\\''+c.from+'\\')"><span class="estado '+color+'"></span>'+c.from+'</div>';
  });
}

function mostrarChat(num){
  const msgs = chats.filter(c=>c.from===num);
  const mDiv = document.getElementById("mensajes");
  mDiv.innerHTML = msgs.map(m=>'<div class="mensaje"><span class="msg-from">'+m.from+':</span> '+m.text+'</div>').join("");
}

socket.on("nuevoMensaje", m=>{
  chats.unshift(m);
  renderContactos();
});

document.querySelectorAll(".tab").forEach(t=>{
  t.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("activa"));
    t.classList.add("activa");
    origenActual=t.dataset.origen;
    if(origenActual==="DASH"){
      fetch("/estadisticas").then(r=>r.json()).then(d=>{
        document.getElementById("contactos").innerHTML="<h3>Dashboard</h3><p>Total: "+d.total+"</p><p>Nuevos: "+d.nuevos+"</p><p>Intención: "+d.intencion+"</p><p>Sin agendar: "+d.sinAgendar+"</p><p>Agendados: "+d.agendados+"</p>";
        document.getElementById("mensajes").innerHTML="";
      });
    }else{
      renderContactos();
      document.getElementById("mensajes").innerHTML="";
    }
  };
});
</script>
</body>
</html>`);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, ()=>console.log("Monitor en puerto", PORT));
