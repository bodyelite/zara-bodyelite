import fs from 'fs';

// 1. Asegurar carpetas
if (!fs.existsSync('data')) fs.mkdirSync('data');

// 2. CÓDIGO DEL CEREBRO (APP.JS) - Maneja fotos, on/off y humano
const appCode = `import fs from 'fs';
import path from 'path';
import { enviarMensaje } from './whatsapp.js';
import { pensar } from './brain.js';
const FILE = path.join(process.cwd(), 'data', 'sesiones.json');
const STAFF = ["56983300262", "56955145504", "56937648536"];
let sesiones = {}; let botStatus = {};
try { const d = JSON.parse(fs.readFileSync(FILE, 'utf8')); sesiones = d.sesiones||{}; botStatus = d.botStatus||{}; } catch (e) {}
function guardar() { fs.writeFileSync(FILE, JSON.stringify({ sesiones, botStatus })); }
export function getSesiones() { return sesiones; }
export function getBotStatus() { return botStatus; }
export function updateTagManual(p, t) { if(sesiones[p]){ sesiones[p].tag = t; guardar(); return true; } return false; }
export function toggleBot(p) { botStatus[p] = !botStatus[p]; guardar(); return botStatus[p]; }
export async function enviarMensajeManual(p, t) {
    if (!sesiones[p]) sesiones[p] = { name: "Cliente", history: [], phone: p };
    botStatus[p] = false; 
    sesiones[p].history.push({ role: "assistant", content: t, timestamp: Date.now(), source: 'manual' });
    sesiones[p].lastInteraction = Date.now(); guardar();
    await enviarMensaje(p, t);
}
export async function procesarEvento(ev) {
    const v = ev.changes?.[0]?.value; const m = v?.messages?.[0]; if (!m) return;
    const p = m.from; const n = v.contacts?.[0]?.profile?.name || "Cliente";
    if (!sesiones[p]) sesiones[p] = { name: n, history: [], phone: p, tag: "NUEVO" };
    let txt = m.text?.body || "";
    if (m.type === 'image') txt = "[FOTO] " + (m.image.caption || "Imagen recibida");
    sesiones[p].history.push({ role: "user", content: txt, timestamp: Date.now() });
    sesiones[p].lastInteraction = Date.now();
    if (botStatus[p] !== false) {
        const pSys = { role: "system", content: "Eres Zara. Cliente: "+sesiones[p].name };
        const r = await pensar([pSys, ...sesiones[p].history], sesiones[p].name);
        sesiones[p].history.push({ role: "assistant", content: r, timestamp: Date.now(), source: 'bot' });
        await enviarMensaje(p, r);
    }
    guardar();
}
export async function ejecutarEstrategia(tag) {
    for (const p of Object.keys(sesiones).filter(k => sesiones[k].tag === tag)) {
        const u = sesiones[p];
        const r = await pensar([{ role: "user", content: "Re-engancha a "+u.name }], u.name);
        u.history.push({ role: "assistant", content: "🧪 [ESTRATEGIA]: "+r, timestamp: Date.now(), source: 'bot' });
        guardar(); await enviarMensaje(p, r);
    }
}`;

// 3. CÓDIGO DEL MONITOR (SERVER.JS) - Dashboard 8.0 PRO
const serverCode = `import express from 'express';
import cors from 'cors';
import { procesarEvento, getSesiones, getBotStatus, enviarMensajeManual, ejecutarEstrategia, updateTagManual, toggleBot } from './app.js';
const app = express(); app.use(express.json()); app.use(cors());
app.get('/monitor', (req, res) => {
res.send(\`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZARA 8.0</title>
<style>
:root{--bg:#0b141a;--sb:#111b21;--ac:#00a884;--ht:#e91e63;--it:#ff9800;--fr:#667781;--mn:#3b82f6;}
body{margin:0;font-family:sans-serif;background:var(--bg);color:#e9edef;display:flex;height:100vh;overflow:hidden;}
.sl{width:300px;background:var(--sb);border-right:1px solid #222d34;display:flex;flex-direction:column;flex-shrink:0;}
.mc{flex:1;display:flex;flex-direction:column;background:var(--bg);min-width:0;}
.sr{width:200px;background:var(--sb);border-left:1px solid #222d34;padding:15px;display:flex;flex-direction:column;gap:10px;flex-shrink:0;}
.ch{padding:10px 20px;background:#202c33;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a3942;}
#fd{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.cd{padding:12px;border-bottom:1px solid #222d34;cursor:pointer;}
.cd.active{background:#2a3942;border-left:4px solid var(--ac);}
.msg{max-width:80%;padding:10px;border-radius:8px;font-size:0.9em;margin-bottom:5px;}
.msg.bot{align-self:flex-end;background:#005c4b;}
.msg.user{align-self:flex-start;background:#202c33;}
.msg.manual{align-self:flex-end;background:var(--mn);border:1px solid #fff5;}
.btn{padding:10px;border:none;border-radius:5px;color:#fff;font-weight:bold;cursor:pointer;font-size:0.75em;width:100%;}
.ib{padding:15px;background:#202c33;display:flex;gap:10px;}
#m{flex:1;background:#2a3942;border:none;padding:10px;border-radius:5px;color:#fff;outline:none;}
.mod{position:fixed;top:10%;left:10%;width:80%;height:80%;background:#202c33;display:none;padding:30px;border-radius:10px;z-index:100;box-shadow:0 0 50px #000;}
@media(max-width:900px){body{flex-direction:column;}.sl{width:100%;height:35vh;}.sr{display:none;}.mc{height:65vh;}}
</style></head>
<body>
<div class="sl"><div style="padding:15px;font-weight:bold;color:var(--ac);text-align:center">ZARA DASHBOARD</div><div id="list"></div></div>
<div class="mc">
<div class="ch" id="h" style="display:none"><div><b id="n" style="color:var(--ac)"></b> <small id="p" style="color:#8696a0"></small></div>
<div style="display:flex;gap:8px"><button id="bt" class="btn" style="width:auto" onclick="tg()"></button>
<select id="ts" onchange="st()" style="background:#2a3942;color:#fff;border:1px solid #444;border-radius:4px"><option value="NUEVO">NUEVO</option><option value="HOT">HOT 🔥</option><option value="INTERESADO">INTERESADO 🔸</option><option value="FRIO">FRIO ❄️</option><option value="APAGADO">APAGADO 🗑️</option></select></div></div>
<div id="fd"></div>
<div class="ib" id="i" style="display:none"><input id="m" placeholder="Respuesta..." onkeypress="if(event.key==='Enter')sd()"></div>
</div>
<div class="sr"><button class="btn" style="background:var(--ht)" onclick="rn('HOT')">CIERRE HOT 🔥</button><button class="btn" style="background:var(--it)" onclick="rn('INTERESADO')">IMPULSAR INT 🔸</button><button class="btn" style="background:var(--mn)" onclick="op()">VER FUNNEL 📊</button><button class="btn" style="background:#444;margin-top:10px" onclick="location.reload()">REFRESCAR</button></div>
<div id="rp" class="mod"><h2>Funnel de Ventas</h2><div id="fn" style="display:flex;gap:10px;margin-top:20px;text-align:center"></div><button class="btn" style="background:var(--ht);margin-top:40px" onclick="document.getElementById('rp').style.display='none'">CERRAR</button></div>
<script>
let ap=null;const f=(t)=>new Date(t).toLocaleString('es-CL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
async function tg(){await fetch("/api/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap})});up();}
async function st(){await fetch("/api/tag",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,tag:document.getElementById("ts").value})});up();}
async function rn(t){if(!confirm("Lanzar estrategia?"))return;await fetch("/api/estrat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tag:t})});up();}
function op(){fetch("/api/data").then(r=>r.json()).then(d=>{const c={NUEVO:0,INTERESADO:0,HOT:0};Object.values(d.users).forEach(u=>{if(c[u.tag]!==undefined)c[u.tag]++});document.getElementById("fn").innerHTML=\`<div style="flex:1;background:var(--ac);padding:15px;border-radius:8px">NUEVOS<br><h1 style="margin:0">\${c.NUEVO}</h1></div><div style="flex:1;background:var(--it);padding:15px;border-radius:8px">INT<br><h1 style="margin:0">\${c.INTERESADO}</h1></div><div style="flex:1;background:var(--ht);padding:15px;border-radius:8px">HOT<br><h1 style="margin:0">\${c.HOT}</h1></div>\`;document.getElementById("rp").style.display='block';});}
function up(){fetch("/api/data").then(r=>r.json()).then(d=>{const l=document.getElementById("list");l.innerHTML="";const us=d.users||{};const st=d.botStatus||{};Object.keys(us).sort((a,b)=>us[b].lastInteraction-us[a].lastInteraction).forEach(p=>{const u=us[p];l.innerHTML+='<div class="cd '+(ap===p?'active':'')+'" onclick="sl(\\''+p+'\\')"><b>'+u.name+'</b><br><small>'+f(u.lastInteraction)+' | '+u.tag+'</small></div>';});if(ap&&us[ap]){document.getElementById("n").innerText=us[ap].name;document.getElementById("p").innerText=ap;document.getElementById("ts").value=us[ap].tag;const b=document.getElementById("bt");b.innerText=st[ap]===false?'OFF ❌':'ON ✅';b.style.background=st[ap]===false?'var(--ht)':'var(--ac)';rd(us[ap]);}});}
function sl(p){ap=p;document.getElementById("h").style.display="flex";document.getElementById("i").style.display="flex";up();}
function rd(u){const d=document.getElementById("fd");d.innerHTML=u.history.map(m=>'<div class="msg '+(m.role==='user'?'user':(m.source==='manual'?'manual':'bot'))+'"><div>'+m.content+'</div><div style="font-size:0.6em;opacity:0.5;text-align:right">'+f(m.timestamp)+'</div></div>').join("");d.scrollTop=d.scrollHeight;}
async function sd(){const v=document.getElementById("m");if(!v.value)return;await fetch("/api/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:ap,text:v.value})});v.value="";up();}
setInterval(up,5000);up();
</script></body></html>\`);
});
app.get('/api/data',(req,res)=>res.json({users:getSesiones(),botStatus:getBotStatus()}));
app.post('/api/tag',(req,res)=>res.json({success:updateTagManual(req.body.phone,req.body.tag)}));
app.post('/api/toggle',(req,res)=>res.json({status:toggleBot(req.body.phone)}));
app.post('/api/estrat',async(req,res)=>{await ejecutarEstrategia(req.body.tag);res.json({success:true});});
app.post('/api/manual',async(req,res)=>{await enviarMensajeManual(req.body.phone,req.body.text);res.json({success:true});});
app.post('/webhook',async(req,res)=>{await procesarEvento(req.body.entry?.[0]);res.sendStatus(200);});
app.listen(process.env.PORT||3000);`;

// 4. Escribir archivos
fs.writeFileSync('src/app.js', appCode);
fs.writeFileSync('src/server.js', serverCode);
console.log("✅ SISTEMA RECONSTRUIDO CORRECTAMENTE.");
