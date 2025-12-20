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
    if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
    else res.sendStatus(403);
});
app.post("/webhook", (req, res) => {
    res.sendStatus(200);
    procesarEvento(req.body).catch(console.error);
});

// WEBCHAT
app.post("/webchat", async (req, res) => {
    const { message, userId } = req.body;
    const uid = userId || 'web_user';
    if (!sesionesWeb[uid]) sesionesWeb[uid] = [];
    
    registrar(uid, "Visitante Web", message, "usuario", "web");
    sesionesWeb[uid].push({ role: "user", content: message });
    
    const reply = await generarRespuestaIA(sesionesWeb[uid].slice(-10));
    sesionesWeb[uid].push({ role: "assistant", content: reply });
    
    registrar(uid, "Zara", reply, "zara", "web");
    
    const mostrar = reply.toLowerCase().includes("agendar") || reply.toLowerCase().includes("link");
    res.json({ response: reply, button: mostrar, link: NEGOCIO.agenda_link });
});

// API
app.get("/api/chats", (req, res) => res.json(leerChats()));
app.post("/api/send-manual", async (req, res) => {
    const { id, text, origen } = req.body;
    try {
        if (origen === "whatsapp") await sendMessage(id, text, "whatsapp");
        registrar(id, "Human", text, "zara", origen);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// MONITOR V1400 (FILTROS ARREGLADOS + ICONOS CLASICOS)
app.get("/monitor", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Zara CRM Elite</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, system-ui, sans-serif; }
        body { display: flex; height: 100vh; background: #f0f2f5; overflow: hidden; }
        
        /* SIDEBAR */
        .sidebar { width: 380px; background: white; border-right: 1px solid #d1d7db; display: flex; flex-direction: column; }
        .sidebar-header { padding: 15px; background: #f0f2f5; border-bottom: 1px solid #ddd; }
        .sidebar-header h3 { margin: 0 0 10px 0; color: #54656f; font-size: 18px; display: flex; align-items: center; gap: 8px; }
        
        /* TABS DE FILTRO */
        .tabs { display: flex; gap: 8px; }
        .tab { flex: 1; padding: 8px; border: none; background: #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 700; color: #555; transition: 0.2s; text-transform: uppercase; }
        .tab:hover { background: #d0d0d0; }
        
        /* COLORES ACTIVOS POR CANAL */
        .tab.all.active { background: #333; color: white; }
        .tab.wsp.active { background: #25D366; color: white; }
        .tab.ig.active { background: #E1306C; color: white; }
        .tab.web.active { background: #007bff; color: white; }

        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px 15px; border-bottom: 1px solid #f5f6f6; cursor: pointer; transition: 0.2s; }
        .contact:hover { background: #f5f6f6; }
        .contact.active { background: #e9edef; border-left: 4px solid #00a884; }
        
        /* AVATARS E ICONOS */
        .avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 24px; color: white; position: relative; }
        .badge { position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        
        .details { flex: 1; min-width: 0; }
        .name { font-weight: 600; font-size: 15px; color: #111; margin-bottom: 3px; }
        .preview { font-size: 13px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .meta-info { display: flex; justify-content: space-between; align-items: baseline; }
        .time { font-size: 11px; color: #999; }

        /* AREA DE CHAT */
        .main { flex: 1; display: flex; flex-direction: column; background: #efeae2; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); }
        .chat-header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 20px; font-weight: bold; color: #54656f; border-bottom: 1px solid #ddd; gap: 10px; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .msg { max-width: 70%; padding: 8px 12px; border-radius: 8px; font-size: 14px; position: relative; box-shadow: 0 1px 1px rgba(0,0,0,0.1); }
        .msg.usuario { background: white; align-self: flex-start; border-top-left-radius: 0; }
        .msg.zara { background: #d9fdd3; align-self: flex-end; border-top-right-radius: 0; }
        .msg-time { font-size: 10px; text-align: right; color: #777; margin-top: 4px; }

        .input-area { padding: 10px; background: #f0f2f5; display: flex; gap: 10px; border-top: 1px solid #ddd; }
        .input-area input { flex: 1; padding: 12px; border-radius: 20px; border: 1px solid #ddd; outline: none; font-size: 15px; }
        .send-btn { width: 45px; height: 45px; border-radius: 50%; border: none; background: #00a884; color: white; cursor: pointer; font-size: 18px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h3><i class="fas fa-bolt"></i> Zara CRM</h3>
            <div class="tabs">
                <button class="tab all active" onclick="filter('all', this)">Todos</button>
                <button class="tab wsp" onclick="filter('whatsapp', this)">WSP</button>
                <button class="tab ig" onclick="filter('instagram', this)">IG</button>
                <button class="tab web" onclick="filter('web', this)">WEB</button>
            </div>
        </div>
        <div class="contact-list" id="list"></div>
    </div>
    <div class="main">
        <div class="chat-header" id="header">
            <span>Selecciona un chat</span>
        </div>
        <div class="messages" id="box"></div>
        <div class="input-area" id="input-area" style="display:none">
            <input type="text" id="msg-input" placeholder="Escribe un mensaje..." onkeydown="if(event.key==='Enter') send()">
            <button class="send-btn" onclick="send()"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
<script>
    let data = {}; 
    let curId = null; 
    let curOrigin = null; 
    let curFilter = 'all';

    async function load() {
        try {
            const r = await fetch('/api/chats'); 
            data = await r.json(); 
            renderList();
            if(curId && data[curId]) renderChat(curId);
        } catch(e){}
    }

    function filter(type, btn) {
        curFilter = type;
        // Resetear clases activas
        document.querySelectorAll('.tab').forEach(t => t.className = 'tab ' + t.classList[1]); 
        // Activar botón actual
        btn.classList.add('active');
        renderList();
    }

    function renderList() {
        const list = document.getElementById('list');
        const sorted = Object.keys(data).sort((a,b) => (data[b].mensajes.slice(-1)[0]?.timestamp||0) - (data[a].mensajes.slice(-1)[0]?.timestamp||0));
        let html = '';
        
        sorted.forEach(id => {
            const c = data[id];
            
            // FILTRO ESTRICTO
            if (curFilter !== 'all' && c.origen !== curFilter) return;
            
            // CONFIGURACION DE ICONOS Y COLORES
            let color = '#777'; 
            let mainIcon = 'fa-user';
            let badgeIcon = 'fa-user';

            if(c.origen === 'whatsapp') { 
                color = '#25D366'; 
                mainIcon = 'fa-whatsapp'; 
                badgeIcon = 'fa-whatsapp';
            } else if(c.origen === 'instagram') { 
                color = '#E1306C'; 
                mainIcon = 'fa-instagram'; 
                badgeIcon = 'fa-instagram';
            } else if(c.origen === 'web') { 
                color = '#007bff'; 
                mainIcon = 'fa-globe'; 
                badgeIcon = 'fa-globe';
            }

            const last = c.mensajes.slice(-1)[0] || {};
            const time = last.timestamp ? new Date(last.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '';

            html += \`<div class="contact \${curId===id?'active':''}" onclick="openChat('\${id}', '\${c.origen}')">
                <div class="avatar" style="background:\${color}">
                    <i class="fab \${mainIcon}"></i> <div class="badge" style="color:\${color}">
                        <i class="fas \${badgeIcon}" style="font-size:10px"></i>
                    </div>
                </div>
                <div class="details">
                    <div class="meta-info">
                        <div class="name">\${c.nombre}</div>
                        <div class="time">\${time}</div>
                    </div>
                    <div class="preview">\${last.texto ? last.texto.substring(0,35)+'...' : ''}</div>
                </div>
            </div>\`;
        });
        list.innerHTML = html;
    }

    function openChat(id, origin) {
        curId = id; 
        curOrigin = origin;
        
        let headerIcon = '';
        if(origin === 'whatsapp') headerIcon = '<i class="fab fa-whatsapp" style="color:#25D366; font-size:24px"></i>';
        else if(origin === 'instagram') headerIcon = '<i class="fab fa-instagram" style="color:#E1306C; font-size:24px"></i>';
        else if(origin === 'web') headerIcon = '<i class="fas fa-globe" style="color:#007bff; font-size:24px"></i>';

        document.getElementById('header').innerHTML = \`\${headerIcon} \${data[id].nombre}\`;
        document.getElementById('input-area').style.display = 'flex';
        renderChat(id);
        renderList();
    }

    function renderChat(id) {
        const box = document.getElementById('box');
        const msgs = data[id].mensajes;
        const html = msgs.map(m => \`
            <div class="msg \${m.tipo}">
                \${m.texto.replace(/\\n/g,'<br>')}
                <div class="msg-time">\${new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
            </div>
        \`).join('');
        
        if(box.innerHTML !== html) { 
            box.innerHTML = html; 
            box.scrollTop = box.scrollHeight; 
        }
    }

    async function send() {
        const inp = document.getElementById('msg-input'); 
        const txt = inp.value.trim();
        if(!txt || !curId) return;
        
        inp.value = '';
        // Optimistic UI update
        const box = document.getElementById('box');
        box.innerHTML += \`<div class="msg zara" style="opacity:0.6">\${txt} <small>...</small></div>\`;
        box.scrollTop = box.scrollHeight;

        await fetch('/api/send-manual', { 
            method:'POST', 
            headers:{'Content-Type':'application/json'}, 
            body:JSON.stringify({id:curId, text:txt, origen:curOrigin})
        });
        load();
    }

    setInterval(load, 2000); 
    load();
</script></body></html>`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Zara V1400 (Filtros & Iconos OK) Online");
});
