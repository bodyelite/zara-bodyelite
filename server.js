import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000;
const BOT_URL = "https://zara-bodyelite-1.onrender.com"; // bot principal que genera los mensajes

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(bodyParser.json());
let chats = [];

// === Obtener logs del bot Zara IA ===
async function obtenerLogs() {
  try {
    const res = await fetch(`${BOT_URL}/logs`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// === Refresco cada 10 segundos ===
setInterval(async () => {
  chats = await obtenerLogs();
  io.emit("updateChats", chats);
}, 10000);

// === Interfaz Web ===
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/>
<title>Monitor Zara 2.1 Conectado al Bot</title>
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
</style></head>
<body>
<div id="tabs">
  <div class="tab activa" data-origen="WSP">WhatsApp</div>
  <div class="tab" data-origen="IG">Instagram</div>
  <div class="tab" data-origen="DASH">Dashboard</div>
</div>
<div id="contenedor">
  <div id="contactos"></div>
  <div id="chat"><div id="mensajes"></div></div>
</div>
<script>
const socket = io();
let chats = [];
let origenActual = "WSP";

function renderContactos(){
  const cDiv=document.getElementById("contactos");
  cDiv.innerHTML="";
  const filtrados=chats.filter(c=>c.origen===origenActual);
  filtrados.forEach(c=>{
    const color=c.status==="nuevo"?"azul":c.status==="sinAgendar"?"rojo":c.status==="intencion"?"amarillo":"verde";
    cDiv.innerHTML+='<div class="contacto" onclick="mostrarChat(\\''+c.from+'\\')"><span class="estado '+color+'"></span>'+c.from+'</div>';
  });
}
function mostrarChat(num){
  const msgs=chats.filter(c=>c.from===num);
  const mDiv=document.getElementById("mensajes");
  mDiv.innerHTML=msgs.map(m=>'<div class="mensaje"><span class="msg-from">'+m.from+':</span> '+m.text+'</div>').join("");
}
socket.on("updateChats",data=>{chats=data;renderContactos();});
document.querySelectorAll(".tab").forEach(t=>{
  t.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("activa"));
    t.classList.add("activa");
    origenActual=t.dataset.origen;
    renderContactos();
    document.getElementById("mensajes").innerHTML="";
  };
});
</script></body></html>`);
});

server.listen(PORT,()=>console.log("✅ Monitor Zara 2.1 conectado al bot en",BOT_URL,"puerto",PORT));
