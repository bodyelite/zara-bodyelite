import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje, chats } from "./utils/memory.js";

dotenv.config();
const app = express();
const webSessions = {};

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
    next();
});

const MONITOR_HTML = `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Zara Monitor V17</title><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"><style>body{margin:0;font-family:-apple-system,system-ui,sans-serif;background:#d1d7db;display:flex;height:100vh}#app{display:flex;width:100%;max-width:1600px;background:#fff;margin:0 auto}.sidebar{width:350px;background:#fff;border-right:1px solid #e9edef;display:flex;flex-direction:column}.header{height:60px;background:#f0f2f5;padding:0 16px;display:flex;align-items:center;font-weight:bold;color:#54656f}.filters{padding:10px;display:flex;gap:5px;background:#fff;border-bottom:1px solid #f0f2f5}.filter-btn{flex:1;padding:8px;border:none;background:#f0f2f5;border-radius:20px;cursor:pointer;color:#54656f;font-weight:500}.filter-btn.active{background:#008069;color:#fff}.contact-list{flex:1;overflow-y:auto}.contact{display:flex;align-items:center;padding:12px 15px;cursor:pointer;border-bottom:1px solid #f0f2f5}.contact:hover{background:#f5f6f6}.contact.active{background:#f0f2f5}.avatar{width:45px;height:45px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;margin-right:15px;position:relative;flex-shrink:0}.icon-origin{position:absolute;bottom:-2px;right:-2px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;border:2px solid #fff}.info{flex:1;overflow:hidden}.name{font-weight:500;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.preview{font-size:13px;color:#667781;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-area{flex:1;display:flex;flex-direction:column;background:#efeae2}.chat-header{height:60px;background:#f0f2f5;padding:0 16px;display:flex;align-items:center;border-bottom:1px solid #d1d7db;font-weight:bold;color:#54656f}.messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:5px}.msg{max-width:70%;padding:8px 12px;border-radius:8px;font-size:14px;position:relative;box-shadow:0 1px 1px rgba(0,0,0,0.1);word-wrap:break-word}.msg.usuario{align-self:flex-start;background:#fff}.msg.zara{align-self:flex-end;background:#d9fdd3}.time{font-size:10px;color:#667781;text-align:right;margin-top:4px}</style></head><body><div id="app"><div class="sidebar"><div class="header">Zara Monitor V17</div><div class="filters"><button class="filter-btn active" onclick="setFilter('all')">Todos</button><button class="filter-btn" onclick="setFilter('wsp')">WSP</button><button class="filter-btn" onclick="setFilter('web')">Web</button><button class="filter-btn" onclick="setFilter('ig')">IG</button></div><div class="contact-list" id="contactList"></div></div><div class="chat-area"><div class="chat-header" id="chatHeader">Selecciona un chat</div><div class="messages" id="msgsBox"></div></div></div><script>let allChats={},currentFilter='all',selectedId=null;async function update(){try{const res=await fetch('/api/data');const newData=await res.json();if(JSON.stringify(newData)!==JSON.stringify(allChats)){allChats=newData;renderList();if(selectedId)renderChat(selectedId);}}catch(e){}}function setFilter(f){currentFilter=f;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');selectedId=null;document.getElementById('chatHeader').innerText='Selecciona un chat';document.getElementById('msgsBox').innerHTML='';renderList();}function renderList(){const list=document.getElementById('contactList');let ids=Object.keys(allChats);if(ids.length===0){list.innerHTML='<div style="padding:20px;text-align:center;color:#667781">Esperando mensajes...</div>';return;}ids.sort((a,b)=>{const mA=allChats[a].mensajes,mB=allChats[b].mensajes;if(!mA.length||!mB.length)return 0;return mB[mB.length-1].timestamp-mA[mA.length-1].timestamp;});if(currentFilter!=='all')ids=ids.filter(id=>allChats[id].origen===currentFilter);let html='';ids.forEach(id=>{const c=allChats[id];if(!c.mensajes.length)return;const last=c.mensajes[c.mensajes.length-1];let icon='fa-whatsapp',color='#25D366';if(c.origen==='web'){icon='fa-globe';color='#3498db';}if(c.origen==='ig'){icon='fa-instagram';color='#e1306c';}html+=\`<div class="contact \${id===selectedId?'active':''}" onclick="selectChat('\${id}')"><div class="avatar" style="background:\${color}">\${c.nombre[0].toUpperCase()}<div class="icon-origin" style="background:\${color}"><i class="fab \${icon}"></i></div></div><div class="info"><div class="name">\${c.nombre}</div><div class="preview">\${last.tipo==='zara'?'🤖 ':''}\${last.texto.substring(0,35)}...</div></div></div>\`;});list.innerHTML=html;}function selectChat(id){selectedId=id;renderList();renderChat(id);}function renderChat(id){const c=allChats[id];if(!c)return;document.getElementById('chatHeader').innerHTML=\`\${c.nombre} (\${c.origen.toUpperCase()})\`;const box=document.getElementById('msgsBox');let html='';c.mensajes.forEach(m=>{html+=\`<div class="msg \${m.tipo}">\${m.texto.replace(/\\n/g,'<br>')}<div class="time">\${new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div></div>\`;});if(box.innerHTML!==html){box.innerHTML=html;box.scrollTop=box.scrollHeight;}}setInterval(update,2000);update();</script></body></html>
`;

app.get("/", (req, res) => res.send("Zara V17 Running"));
app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/data", (req, res) => res.json(chats));

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    if (!value) return;
    let origen = value.messages ? "wsp" : (value.messaging ? "ig" : null);
    if (!origen) return;
    const message = value.messages ? value.messages[0] : value.messaging[0].message;
    const contact = value.contacts ? value.contacts[0] : value.messaging[0].sender;
    const userId = contact.wa_id || contact.id;
    const userName = contact.profile?.name || "Cliente Meta";
    let msgUser = message.type === "text" ? message.text.body : "[Multimedia]";
    registrarMensaje(userId, userName, msgUser, "usuario", origen);
    
    // Lógica básica WSP/IG para V17 (se expandirá luego)
    if (message.type === "text") {
       // Aquí iría la IA para WSP. Por ahora, solo registra en monitor para estabilidad.
    }
  } catch (e) { console.error(e); }
});

app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'anonimo';
        
        if (message.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/)) {
            const fono = message.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/)[0].replace(/\D/g, '');
            const alerta = `🚨 *SOLICITUD LLAMADA (WEB)* 🚨\n📞 ${fono}`;
            for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
        }

        registrarMensaje(uid, "Web", message, "usuario", "web");
        if (!webSessions[uid]) webSessions[uid] = [];
        webSessions[uid].push({ role: "user", content: message });

        const reply = await generarRespuestaIA(webSessions[uid]);
        webSessions[uid].push({ role: "assistant", content: reply });
        registrarMensaje(uid, "Web", reply, "zara", "web");

        let showButton = reply.includes("agenda") || reply.includes("enlace") || reply.includes("botón");
        res.json({ response: reply, button: showButton, link: NEGOCIO.agenda_link });
    } catch (error) {
        res.status(500).json({ response: "Error interno." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara V17 Final corriendo en puerto ${PORT}`));
