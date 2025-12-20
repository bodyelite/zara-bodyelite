import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { procesarEvento } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { leerChats, registrar } from "./utils/memory.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/negocio.js";

dotenv.config();
const app = express();
const sesionesWeb = {};
app.use(cors());
app.use(bodyParser.json());

// WEBHOOKS
app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
        console.log("✅ WEBHOOK VERIFICADO POR META");
        res.send(req.query["hub.challenge"]);
    } else {
        console.error("❌ ERROR VERIFICACION WEBHOOK");
        res.sendStatus(403);
    }
});

app.post("/webhook", (req, res) => {
    res.sendStatus(200);
    procesarEvento(req.body).catch(console.error);
});

// WEBCHAT
app.post("/webchat", async (req, res) => {
    const { message, userId } = req.body;
    const uid = userId || 'web_user';
    console.log(`💻 [WEBCHAT] De ${uid}: ${message}`);
    
    try {
        if (!sesionesWeb[uid]) sesionesWeb[uid] = [];
        
        // Registrar usuario
        registrar(uid, "Visitante Web", message, "usuario", "web");
        sesionesWeb[uid].push({ role: "user", content: message });
        
        // IA
        const reply = await generarRespuestaIA(sesionesWeb[uid].slice(-10));
        console.log(`🤖 [WEBCHAT] Respuesta: ${reply}`);
        
        // Registrar IA
        sesionesWeb[uid].push({ role: "assistant", content: reply });
        registrar(uid, "Zara", reply, "zara", "web");
        
        const mostrar = reply.toLowerCase().includes("agendar") || reply.toLowerCase().includes("link");
        res.json({ response: reply, button: mostrar, link: NEGOCIO.agenda_link });
    } catch (e) {
        console.error("❌ ERROR WEBCHAT:", e);
        res.status(500).json({ error: "Error interno" });
    }
});

// API
app.get("/api/chats", (req, res) => {
    const chats = leerChats();
    // console.log("📂 [API] Leyendo chats. Total:", Object.keys(chats).length);
    res.json(chats);
});

app.post("/api/send-manual", async (req, res) => {
    const { id, text, origen } = req.body;
    console.log(`👨‍💻 [MANUAL] A ${id} (${origen}): ${text}`);
    try {
        if (origen === "whatsapp") await sendMessage(id, text, "whatsapp");
        registrar(id, "Human", text, "zara", origen);
        res.json({ success: true });
    } catch (e) { 
        console.error("❌ ERROR ENVIO MANUAL:", e);
        res.status(500).json({ error: e.message }); 
    }
});

// MONITOR V1800
app.get("/monitor", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Zara CRM Pro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { display: flex; height: 100vh; background: #f0f2f5; overflow: hidden; }
        .sidebar { width: 380px; background: white; border-right: 1px solid #d1d7db; display: flex; flex-direction: column; }
        .sidebar-header { padding: 15px; background: #f0f2f5; border-bottom: 1px solid #ddd; }
        .tabs { display: flex; gap: 8px; margin-top: 10px; }
        .tab { flex: 1; padding: 10px; border: none; background: #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: bold; color: #555; }
        .tab:hover { background: #d0d0d0; }
        .tab.all.active { background: #333; color: white; }
        .tab.wsp.active { background: #25D366; color: white; }
        .tab.ig.active { background: #E1306C; color: white; }
        .tab.web.active { background: #007bff; color: white; }
        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #f5f6f6; cursor: pointer; }
        .contact:hover { background: #f5f6f6; }
        .contact.active { background: #e9edef; border-left: 5px solid #00a884; }
        .avatar { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; color: white; font-size: 20px; position: relative; }
        .details { flex: 1; min-width: 0; }
        .name { font-weight: 600; font-size: 14px; color: #111; }
        .preview { font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .main { flex: 1; display: flex; flex-direction: column; background: #efeae2; }
        .chat-header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid #ddd; font-weight: bold; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .msg { max-width: 70%; padding: 8px 12px; border-radius: 8px; font-size: 14px; position: relative; }
        .msg.usuario { background: white; align-self: flex-start; }
        .msg.zara { background: #d9fdd3; align-self: flex-end; }
        .input-area { padding: 10px; background: #f0f2f5; display: flex; gap: 10px; }
        .input-area input { flex: 1; padding: 10px; border-radius: 20px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h3>Zara CRM</h3>
            <div class="tabs">
                <button class="tab all active" onclick="filter('all', this)">TODOS</button>
                <button class="tab wsp" onclick="filter('whatsapp', this)">WSP</button>
                <button class="tab ig" onclick="filter('instagram', this)">IG</button>
                <button class="tab web" onclick="filter('web', this)">WEB</button>
            </div>
        </div>
        <div class="contact-list" id="list"></div>
    </div>
    <div class="main">
        <div class="chat-header" id="header">Selecciona un chat</div>
        <div class="messages" id="box"></div>
        <div class="input-area" id="input-area" style="display:none">
            <input type="text" id="msg-input" placeholder="Escribe..." onkeydown="if(event.key==='Enter') send()">
            <button onclick="send()">Enviar</button>
        </div>
    </div>
<script>
    let data = {}; let curId = null; let curOrigin = null; let curFilter = 'all';
    async function load() {
        try {
            const r = await fetch('/api/chats'); data = await r.json(); renderList();
            if(curId && data[curId]) renderChat(curId);
        } catch(e){}
    }
    function filter(type, btn) {
        curFilter = type;
        document.querySelectorAll('.tab').forEach(t => t.className = 'tab ' + t.classList[1]);
        btn.classList.add('active'); renderList();
    }
    function renderList() {
        const list = document.getElementById('list');
        const sorted = Object.keys(data).sort((a,b) => (data[b].mensajes.slice(-1)[0]?.timestamp||0) - (data[a].mensajes.slice(-1)[0]?.timestamp||0));
        let html = '';
        sorted.forEach(id => {
            const c = data[id];
            let org = (c.origen||'web').toLowerCase();
            if(org.includes('wsp')) org='whatsapp'; if(org.includes('ig')) org='instagram';
            
            if(curFilter!=='all' && org!==curFilter) return;
            
            let bg='#007bff'; let ico='fa-globe';
            if(org==='whatsapp'){ bg='#25D366'; ico='fa-whatsapp'; }
            if(org==='instagram'){ bg='#E1306C'; ico='fa-instagram'; }
            
            html += \`<div class="contact \${curId===id?'active':''}" onclick="openChat('\${id}', '\${org}')">
                <div class="avatar" style="background:\${bg}"><i class="fab \${ico}"></i></div>
                <div class="details"><div class="name">\${c.nombre}</div><div class="preview">\${c.mensajes.slice(-1)[0]?.texto.substring(0,30)||''}</div></div>
            </div>\`;
        });
        list.innerHTML=html;
    }
    function openChat(id, org) { curId=id; curOrigin=org; document.getElementById('header').innerText=data[id].nombre; document.getElementById('input-area').style.display='flex'; renderChat(id); renderList(); }
    function renderChat(id) {
        const box=document.getElementById('box');
        const html=data[id].mensajes.map(m=>\`<div class="msg \${m.tipo}">\${m.texto}</div>\`).join('');
        if(box.innerHTML!==html){ box.innerHTML=html; box.scrollTop=box.scrollHeight; }
    }
    async function send(){
        const i=document.getElementById('msg-input'); const t=i.value; if(!t)return; i.value='';
        await fetch('/api/send-manual', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:curId, text:t, origen:curOrigin})});
        load();
    }
    setInterval(load, 2000); load();
</script></body></html>`);
});

app.listen(process.env.PORT || 3000, () => console.log("🚀 Zara V1800 (LOGS ACTIVOS)"));
