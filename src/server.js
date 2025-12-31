import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, enviarMensajeManual, ejecutarEstrategia, updateTagManual } from './app.js';
const app = express(); app.use(express.json()); app.use(cors());
app.get('/monitor', (req, res) => {
res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZARA</title>
<style>
:root{--bg:#0b141a;--sb:#111b21;--ac:#00a884;--ht:#e91e63;--it:#ff9800;--fr:#667781;--au:#a855f7;}
body{margin:0;font-family:sans-serif;background:var(--bg);color:#e9edef;display:flex;height:100vh;overflow:hidden;}
.sl{width:300px;background:var(--sb);border-right:1px solid #222d34;display:flex;flex-direction:column;flex-shrink:0;}
.mc{flex:1;display:flex;flex-direction:column;background:var(--bg);min-width:0;}
.sr{width:180px;background:var(--sb);border-left:1px solid #222d34;padding:15px;display:flex;flex-direction:column;gap:10px;flex-shrink:0;}
.ch{padding:10px 20px;background:#202c33;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a3942;}
#fd{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.cd{padding:12px;border-bottom:1px solid #222d34;cursor:pointer;}
.cd.active{background:#2a3942;border-left:4px solid var(--ac);}
.msg{max-width:80%;padding:10px;border-radius:8px;font-size:0.9em;box-shadow:0 1px 1px #0002;}
.msg.bot{align-self:flex-end;background:#005c4b;}
.msg.user{align-self:flex-start;background:#202c33;}
.msg.auto{background:var(--au)!important;border-bottom:2px solid #fff5;}
.btn{padding:10px;border:none;border-radius:5px;color:#fff;font-weight:bold;cursor:pointer;font-size:0.75em;}
.ib{padding:15px;background:#202c33;display:flex;gap:10px;}
#m{flex:1;background:#2a3942;border:none;padding:10px;border-radius:5px;color:#fff;outline:none;}
@media(max-width:900px){body{flex-direction:column;}.sl{width:100%;height:35vh;}.sr{display:none;}.mc{height:65vh;}}
</style></head>
<body>
<div class="sl"><div style="padding:15px;font-weight:bold;color:var(--ac);text-align:center">ZARA DASHBOARD</div><div id="list"></div></div>
<div class="mc">
<div class="ch" id="h" style="display:none"><b id="n" style="color:var(--ac)"></b>
<select id="s" onchange="st()" style="background:#2a3942;color:#fff;border:1px solid #444;padding:4px;border-radius:4px">
<option value="NUEVO">NUEVO</option><option value="HOT">HOT 🔥</option><option value="INTERESADO">INTERESADO 🔸</option><option value="FRIO">FRIO ❄️</option><option value="APAGADO">APAGADO 🗑️</option>
</select></div>
<div id="fd"></div>
<div class="ib" id="i" style="display:none"><input id="m" placeholder="Mensaje..." onkeypress="if(event.key==='Enter')sd()"></div>
</div>
<div class="sr"><button class="btn" style="background:var(--ht)" onclick="rn('HOT')">ESTRATEGIA HOT 🔥</button><button class="btn" style="background:#444" onclick="location.reload()">REFRESCAR</button></div>
<script>
let ap=null;const f=(ts)=>new Date(ts).toLocaleString('es-CL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
async function st(){await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,tag:document.getElementById("s").value})});up();}
async function rn(t){if(!confirm("¿Lanzar?"))return;await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})});up();}
function up(){fetch("/api/data").then(r=>r.json()).then(d=>{
const l=document.getElementById("list");l.innerHTML="";const us=d.users||{};
Object.keys(us).sort((a,b)=>(us[b].lastInteraction||0)-(us[a].lastInteraction||0)).forEach(p=>{
const u=us[p];l.innerHTML+='<div class="cd '+(ap===p?'active':'')+'" onclick="sl(\\\\''+p+'\\\\')"><div style="display:flex;justify-content:space-between"><b>'+u.name+'</b><small>'+new Date(u.lastInteraction).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</small></div><div style="font-size:0.7em;opacity:0.6">'+f(u.lastInteraction)+' | '+u.tag+'</div></div>';
});
if(ap&&us[ap]){document.getElementById("n").innerText=us[ap].name;document.getElementById("s").value=us[ap].tag;rd(us[ap]);}
});}
function sl(p){ap=p;document.getElementById("i").style.display="flex";document.getElementById("h").style.display="flex";up();}
function rd(u){const f=document.getElementById("fd");f.innerHTML=u.history.map(m=>'<div class="msg '+(m.role==='assistant'?'bot':'user')+(m.content.includes("[AUTO]")?' auto':'')+'"><div>'+m.content.replace("[AUTO] ","")+'</div><div style="font-size:0.6em;opacity:0.5;text-align:right;margin-top:4px">'+new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</div></div>').join("");f.scrollTop=f.scrollHeight;}
async function sd(){const v=document.getElementById("m");if(!v.value)return;await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:v.value})});v.value="";up();}
setInterval(up,5000);up();
</script></body></html>`);
});
app.get('/api/data',(req,res)=>res.json({users:getSesiones()}));
app.post('/api/tag',(req,res)=>res.json({success:updateTagManual(req.body.phone,req.body.tag)}));
app.post('/api/estrat',async(req,res)=>{await ejecutarEstrategia(req.body.tag);res.json({success:true});});
app.post('/api/manual',async(req,res)=>{await enviarMensajeManual(req.body.phone,req.body.text);res.json({success:true});});
app.post('/webhook',async(req,res)=>{await procesarEvento(req.body.entry?.[0]);res.sendStatus(200);});
app.listen(process.env.PORT||3000);
