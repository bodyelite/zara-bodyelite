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

// WEBHOOK META
app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
    else res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
    res.sendStatus(200);
    procesarEvento(req.body).catch(console.error);
});

// CHAT WEB
app.post("/webchat", async (req, res) => {
    const { message, userId } = req.body;
    const uid = userId || 'web_user';
    if (!sesionesWeb[uid]) sesionesWeb[uid] = [];
    
    registrar(uid, "Visitante Web", message, "usuario", "web");
    sesionesWeb[uid].push({ role: "user", content: message });
    
    const reply = await generarRespuestaIA(sesionesWeb[uid].slice(-10));
    sesionesWeb[uid].push({ role: "assistant", content: reply });
    
    registrar(uid, "Zara", reply, "zara", "web");
    
    const cierreFuerte = reply.toLowerCase().includes("te envío el link") || 
                         reply.toLowerCase().includes("para agendar") ||
                         reply.toLowerCase().includes("reservar tu hora");
                         
    res.json({ response: reply, button: cierreFuerte, link: NEGOCIO.agenda_link });
});

// API CHATS
app.get("/api/chats", (req, res) => res.json(leerChats()));

// API MANUAL
app.post("/api/send-manual", async (req, res) => {
    const { id, text, origen } = req.body;
    try {
        if (origen === "whatsapp") await sendMessage(id, text, "whatsapp");
        registrar(id, "Human", text, "zara", origen);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// MONITOR OMNICANAL V3 (3 CANALES)
app.get("/monitor", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Zara Monitor 360</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, system-ui, sans-serif; }
        body { display: flex; height: 100vh; background: #f0f2f5; overflow: hidden; }
        
        /* SIDEBAR */
        .sidebar { width: 380px; background: white; border-right: 1px solid #d1d7db; display: flex; flex-direction: column; }
        .sidebar-header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 16px; justify-content: space-between; border-bottom: 1px solid #d1d7db; }
        .sidebar-header h2 { font-size: 16px; color: #54656f; font-weight: bold; display: flex; align-items: center; gap: 8px; }
        
        /* FILTROS */
        .filters { padding: 10px; display: flex; gap: 8px; border-bottom: 1px solid #f0f2f5; overflow-x: auto; white-space: nowrap; }
        .filter-btn { border: none; background: #f0f2f5; padding: 6px 12px; border-radius: 16px; font-size: 13px; color: #54656f; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { background: #e9edef; }
        .filter-btn.active { background: #e7fce3; color: #008069; font-weight: bold; }
        
        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px 15px; border-bottom: 1px solid #f5f6f6; cursor: pointer; transition: 0.2s; position: relative; }
        .contact:hover { background: #f5f6f6; }
        .contact.active { background: #f0f2f5; border-left: 4px solid #00a884; }
        
        .avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 22px; color: #fff; position: relative; }
        .channel-icon { position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        
        .details { flex: 1; min-width: 0; }
        .name-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
        .name { font-size: 16px; color: #111b21; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .time { font-size: 11px; color: #667781; flex-shrink: 0; margin-left: 8px; }
        .preview { font-size: 13px; color: #667781; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        /* CHAT AREA */
        .main { flex: 1; display: flex; flex-direction: column; background: #efeae2; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); }
        .chat-header { height: 60px; background: #f0f2f5; border-bottom: 1px solid #d1d7db; display: flex; align-items: center; padding: 0 20px; font-weight: 500; color: #54656f; justify-content: space-between; }
        
        .messages { flex: 1; padding: 20px 50px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .msg { max-width: 65%; padding: 6px 10px; border-radius: 8px; font-size: 14.2px; line-height: 19px; position: relative; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
        .msg.usuario { background: white; align-self: flex-start; border-top-left-radius: 0; }
        .msg.zara { background: #d9fdd3; align-self: flex-end; border-top-right-radius: 0; }
        .msg-time { font-size: 11px; color: #667781; text-align: right; margin-top: 2px; }
        
        .input-area { height: 62px; background: #f0f2f5; padding: 10px 20px; display: flex; align-items: center; gap: 10px; border-top: 1px solid #d1d7db; }
        .input-area input { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid white; outline: none; font-size: 15px; }
        .btn-send { width: 40px; height: 40px; border: none; background: transparent; color: #54656f; font-size: 20px; cursor: pointer; }
        .btn-send:hover { color: #00a884; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
    </style>
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">
        <h2><i class="fas fa-bolt"></i> Zara Monitor</h2>
        <i class="fas fa-sync" style="cursor:pointer; color:#00a884" onclick="update()"></i>
    </div>
    
    <div class="filters">
        <button class="filter-btn active" onclick="setFilter('all')">Todos</button>
        <button class="filter-btn" onclick="setFilter('whatsapp')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
        <button class="filter-btn" onclick="setFilter('instagram')"><i class="fab fa-instagram"></i> Instagram</button>
        <button class="filter-btn" onclick="setFilter('web')"><i class="fas fa-globe"></i> Web</button>
    </div>

    <div class="contact-list" id="contact-list"></div>
</div>

<div class="main">
    <div class="chat-header" id="chat-header">
        <span>Selecciona un chat</span>
    </div>
    <div class="messages" id="box"></div>
    <div class="input-area" id="input-area" style="display:none">
        <input type="text" id="manual-msg" placeholder="Escribe un mensaje manual..." onkeydown="if(event.key==='Enter') sendManual()">
        <button class="btn-send" onclick="sendManual()"><i class="fas fa-paper-plane"></i></button>
    </div>
</div>

<script>
    let currentId = null; 
    let currentOrigin = null; 
    let allData = {};
    let activeFilter = 'all';

    async function update() {
        try {
            const res = await fetch('/api/chats'); 
            allData = await res.json(); 
            renderList();
            if (currentId && allData[currentId]) renderMessages(allData[currentId]);
        } catch(e){}
    }

    function setFilter(filter) {
        activeFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        event.target.closest('button').classList.add('active');
        renderList();
    }

    function renderList() {
        const list = document.getElementById('contact-list');
        const sortedIds = Object.keys(allData).sort((a,b) => (allData[b].mensajes.slice(-1)[0]?.timestamp||0) - (allData[a].mensajes.slice(-1)[0]?.timestamp||0));
        
        let html = '';
        sortedIds.forEach(id => {
            const chat = allData[id];
            
            // FILTRO DE CANALES
            if (activeFilter !== 'all' && chat.origen !== activeFilter) return;

            const lastMsg = chat.mensajes.slice(-1)[0] || {};
            const time = lastMsg.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
            
            // CONFIGURACION VISUAL POR CANAL
            let color = '#999'; 
            let icon = 'fa-question';
            let chIcon = 'fa-question';
            
            if (chat.origen === 'whatsapp') { 
                color = '#25D366'; icon = 'fa-whatsapp'; chIcon = 'fa-whatsapp';
            } else if (chat.origen === 'instagram') { 
                color = '#E1306C'; icon = 'fa-instagram'; chIcon = 'fa-instagram';
            } else if (chat.origen === 'web') { 
                color = '#007bff'; icon = 'fa-globe'; chIcon = 'fa-laptop'; // AZUL PARA WEB
            }

            const activeClass = id === currentId ? 'active' : '';

            html += \`<div class="contact \${activeClass}" onclick="selectChat('\${id}', '\${chat.origen}')">
                <div class="avatar" style="background:\${color}">
                    <i class="fab \${icon}"></i>
                    <div class="channel-icon" style="color:\${color}"><i class="fas \${chIcon}"></i></div>
                </div>
                <div class="details">
                    <div class="name-row">
                        <div class="name">\${chat.nombre}</div>
                        <div class="time">\${time}</div>
                    </div>
                    <div class="preview">
                        \${lastMsg.texto ? lastMsg.texto.substring(0,35)+'...' : 'Nuevo chat'}
                    </div>
                </div>
            </div>\`;
        });
        list.innerHTML = html;
    }

    function selectChat(id, origen) { 
        currentId=id; 
        currentOrigin=origen; 
        document.getElementById('input-area').style.display='flex'; 
        
        let iconHtml = '';
        if (origen==='web') iconHtml = '<i class="fas fa-globe" style="color:#007bff"></i> ';
        else if (origen==='whatsapp') iconHtml = '<i class="fab fa-whatsapp" style="color:#25D366"></i> ';
        else if (origen==='instagram') iconHtml = '<i class="fab fa-instagram" style="color:#E1306C"></i> ';

        document.getElementById('chat-header').innerHTML = \`<div>\${iconHtml} \${allData[id].nombre}</div>\`; 
        renderMessages(allData[id]); 
        renderList(); 
    }

    function renderMessages(chat) {
        const box = document.getElementById('box');
        const html = chat.mensajes.map(m => \`<div class="msg \${m.tipo}">\${m.texto.replace(/\\n/g,'<br>')}<div class="msg-time">\${new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div></div>\`).join('');
        if(box.innerHTML!==html){ box.innerHTML=html; box.scrollTop=box.scrollHeight; }
    }

    async function sendManual() {
        const input = document.getElementById('manual-msg'); const text = input.value.trim();
        if(!text||!currentId)return; input.value='';
        // Feedback visual inmediato
        const box = document.getElementById('box');
        box.innerHTML += \`<div class="msg zara" style="opacity:0.6">\${text}<div class="msg-time">Enviando...</div></div>\`;
        box.scrollTop = box.scrollHeight;
        
        await fetch('/api/send-manual', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:currentId, text, origen:currentOrigin}) });
        update();
    }
    
    setInterval(update, 2000); 
    update();
</script></body></html>`);
});

app.listen(process.env.PORT || 3000);
