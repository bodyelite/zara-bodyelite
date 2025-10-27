import express from "express";
import { leerLogs } from "./ia_logs.js";

const app = express();
const PORT = process.env.MONITOR_PORT || 3001;

app.get("/", (req, res) => {
  const { wsp, ig, res: reservas, leads } = leerLogs();
  const all = [...wsp, ...ig, ...reservas];
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const defInicio = ayer.toISOString().split("T")[0];
  const defFin = hoy.toISOString().split("T")[0];

  const agrupar = (arr) => {
    const mapa = {};
    arr.forEach((m) => {
      if (!mapa[m.phone]) mapa[m.phone] = [];
      mapa[m.phone].push(m);
    });
    return Object.entries(mapa)
      .map(([phone, msgs]) => ({
        phone,
        ultimo: msgs[msgs.length - 1].texto,
        hora: new Date(msgs[msgs.length - 1].fecha).toLocaleTimeString("es-CL"),
        estado: msgs[msgs.length - 1].estado,
        mensajes: msgs,
      }))
      .reverse();
  };

  const wspChats = agrupar(wsp);
  const igChats = agrupar(ig);

  const color = (estado) =>
    estado === "azul"
      ? "#007bff"
      : estado === "rojo"
      ? "#dc3545"
      : estado === "amarillo"
      ? "#ffc107"
      : estado === "verde"
      ? "#28a745"
      : "#ccc";

  const renderContactos = (lista, tipo) =>
    lista
      .map(
        (c) => `
      <div class="contacto" onclick="abrirChat('${tipo}','${c.phone}')">
        <div class="circulo" style="background:${color(c.estado)}"></div>
        <div class="info">
          <div class="nombre">${c.phone}</div>
          <div class="mensaje">${c.ultimo.slice(0, 30)}</div>
        </div>
        <div class="hora">${c.hora}</div>
      </div>`
      )
      .join("");

  res.send(`
  <html><head><meta charset="utf-8"/>
  <title>Monitor Zara 2.1</title>
  <style>
    body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;color:#1c3d5a;}
    header{background:#1c3d5a;color:white;text-align:center;padding:10px;font-size:20px;font-weight:bold;}
    nav{display:flex;justify-content:center;background:#d4af37;}
    nav button{background:none;border:none;padding:12px 20px;font-size:16px;color:#1c3d5a;font-weight:bold;cursor:pointer;}
    nav button.active{background:#1c3d5a;color:white;}
    section{display:none;}
    section.active{display:flex;height:80vh;}
    .panel-izq{width:30%;border-right:1px solid #ccc;overflow-y:auto;background:#fff;}
    .panel-der{flex:1;display:flex;flex-direction:column;background:#f9f9f9;}
    .contacto{display:flex;align-items:center;padding:10px;border-bottom:1px solid #eee;cursor:pointer;}
    .contacto:hover{background:#f1f1f1;}
    .circulo{width:12px;height:12px;border-radius:50%;margin-right:10px;}
    .info{flex:1;}
    .nombre{font-weight:bold;color:#1c3d5a;}
    .mensaje{font-size:12px;color:#555;}
    .hora{font-size:11px;color:#999;}
    .chat-box{flex:1;padding:15px;overflow-y:auto;}
    .msg-block{margin-bottom:10px;}
    .msg{padding:10px 15px;border-radius:20px;max-width:70%;margin:5px 0;}
    .in{background:#e9ecef;align-self:flex-start;}
    .out{background:#d1e7dd;margin-left:auto;color:#155724;}
    .dashboard{max-width:900px;margin:auto;width:100%;}
    .filters{display:flex;justify-content:center;gap:10px;margin-bottom:10px;}
    .filters input{padding:5px;border:1px solid #ccc;border-radius:5px;}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
    .card{border-radius:10px;padding:20px;text-align:center;color:white;font-weight:bold;cursor:pointer;}
    .azul{background:#007bff;} .rojo{background:#dc3545;}
    .amarillo{background:#ffc107;color:#333;} .verde{background:#28a745;}
    table{width:100%;border-collapse:collapse;margin-top:10px;display:none;}
    th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:13px;}
    .show{display:table;}
    .download{margin-top:10px;padding:8px 15px;background:#1c3d5a;color:white;border:none;border-radius:5px;cursor:pointer;}
    footer{text-align:center;color:#555;margin:10px;font-size:12px;}
  </style>
  <script>
    const chats={wsp:${JSON.stringify(wspChats)},ig:${JSON.stringify(igChats)},all:${JSON.stringify(all)}};
    function showTab(tab){
      document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      document.querySelector('#'+tab).classList.add('active');
      document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
      document.getElementById('btn-'+tab).classList.add('active');
    }
    function abrirChat(tipo,phone){
      const conv=chats[tipo].find(c=>c.phone===phone);
      if(!conv)return;
      const box=document.getElementById('chat-'+tipo);
      box.innerHTML=conv.mensajes.map(m=>\`<div class="msg-block"><div class="msg in">\${m.texto}</div><div class="msg out">\${m.respuesta||"(sin respuesta)"} </div></div>\`).join("");
    }
    function filtrar(){
      const ini=new Date(document.getElementById('inicio').value);
      const fin=new Date(document.getElementById('fin').value);
      fin.setHours(23,59,59,999);
      const registros=chats.all.filter(r=>new Date(r.fecha)>=ini && new Date(r.fecha)<=fin);
      const estados={azul:[],rojo:[],amarillo:[],verde:[]};
      registros.forEach(r=>{if(estados[r.estado])estados[r.estado].push(r);});
      const total=registros.length||1;
      ['azul','rojo','amarillo','verde'].forEach(e=>{
        const arr=estados[e];
        const pct=((arr.length/total)*100).toFixed(1);
        document.getElementById(e+'-card').innerHTML=\`\${arr.length}<br><span style="font-size:12px;">\${pct}%</span>\`;
        const tbody=document.getElementById(e+'-body');
        tbody.innerHTML=arr.map(a=>\`<tr><td>\${a.phone||'sin número'}</td><td>\${new Date(a.fecha).toLocaleString('es-CL')}</td></tr>\`).join('');
      });
    }
    function toggleTable(id){document.getElementById(id).classList.toggle('show');}
    function descargarExcel(){
      const ini=document.getElementById('inicio').value;
      const fin=document.getElementById('fin').value;
      let csv='Estado,Teléfono,Fecha\\n';
      chats.all.forEach(r=>{
        const f=new Date(r.fecha);
        if(f>=new Date(ini)&&f<=new Date(fin))
          csv+=\`\${r.estado},\${r.phone||''},\${f.toLocaleString('es-CL')}\\n\`;
      });
      const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const link=document.createElement('a');
      link.href=URL.createObjectURL(blob);
      link.download='leads_zara_'+ini+'_a_'+fin+'.csv';
      link.click();
    }
    setTimeout(()=>location.reload(),10000);
  </script>
  </head><body onload="filtrar()">
  <header>📲 Monitor Zara 2.1</header>
  <nav>
    <button id="btn-whatsapp" class="active" onclick="showTab('whatsapp')">WhatsApp</button>
    <button id="btn-instagram" onclick="showTab('instagram')">Instagram</button>
    <button id="btn-dashboard" onclick="showTab('dashboard')">Dashboard</button>
  </nav>

  <section id="whatsapp" class="active">
    <div class="panel-izq">${renderContactos(wspChats,"wsp")}</div>
    <div class="panel-der"><div class="chat-box" id="chat-wsp"><p>Selecciona un contacto</p></div></div>
  </section>

  <section id="instagram">
    <div class="panel-izq">${renderContactos(igChats,"ig")}</div>
    <div class="panel-der"><div class="chat-box" id="chat-ig"><p>Selecciona un contacto</p></div></div>
  </section>

  <section id="dashboard">
    <div class="dashboard">
      <div class="filters">
        <label>Inicio: <input type="date" id="inicio" value="${defInicio}" onchange="filtrar()"></label>
        <label>Fin: <input type="date" id="fin" value="${defFin}" onchange="filtrar()"></label>
        <button class="download" onclick="descargarExcel()">Descargar Excel</button>
      </div>
      <div class="stats">
        <div id="azul-card" class="card azul" onclick="toggleTable('azul-tabla')"></div>
        <div id="rojo-card" class="card rojo" onclick="toggleTable('rojo-tabla')"></div>
        <div id="amarillo-card" class="card amarillo" onclick="toggleTable('amarillo-tabla')"></div>
        <div id="verde-card" class="card verde" onclick="toggleTable('verde-tabla')"></div>
      </div>
      <table id="azul-tabla"><thead><tr><th>Teléfono</th><th>Fecha Estado Azul</th></tr></thead><tbody id="azul-body"></tbody></table>
      <table id="rojo-tabla"><thead><tr><th>Teléfono</th><th>Fecha Estado Rojo</th></tr></thead><tbody id="rojo-body"></tbody></table>
      <table id="amarillo-tabla"><thead><tr><th>Teléfono</th><th>Fecha Estado Amarillo</th></tr></thead><tbody id="amarillo-body"></tbody></table>
      <table id="verde-tabla"><thead><tr><th>Teléfono</th><th>Fecha Estado Verde</th></tr></thead><tbody id="verde-body"></tbody></table>
    </div>
  </section>

  <footer>Actualiza automáticamente cada 10 segundos</footer>
  </body></html>`);
});

app.listen(PORT,()=>console.log("🟢 Monitor Zara 2.1 integrado con Dashboard activo en http://localhost:"+PORT));
