import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual } from './app.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/monitor', (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZARA BONITA MONITOR</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
            :root { 
                --bg: #111b21; 
                --sidebar: #202c33; 
                --header: #202c33; 
                --incoming: #202c33; 
                --outgoing: #005c4b; 
                --text: #e9edef; 
                --subtext: #8696a0; 
                --accent: #00a884; 
            }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
            
            /* Sidebar */
            .sidebar { width: 350px; background: var(--sidebar); border-right: 1px solid #333; display: flex; flex-direction: column; }
            .header { padding: 15px; background: var(--header); border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; height: 60px; }
            .brand { font-weight: 600; color: var(--text); font-size: 1.1em; letter-spacing: 1px; }
            .status-dot { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; display: inline-block; margin-right: 8px; }
            
            /* Lista de Usuarios */
            .user-list { flex: 1; overflow-y: auto; }
            .card { padding: 12px 15px; border-bottom: 1px solid #2a3942; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: background 0.2s; }
            .card:hover { background: #2a3942; }
            .card.active { background: #2a3942; border-left: 4px solid var(--accent); }
            
            .avatar { width: 45px; height: 45px; background: #667781; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2em; color: white; flex-shrink: 0; }
            .info { flex: 1; overflow: hidden; }
            .name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .name { font-weight: 600; font-size: 1em; color: var(--text); }
            .last-msg { font-size: 0.85em; color: var(--subtext); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .msg-meta { font-size: 0.75em; color: #667781; margin-left: 10px; white-space: nowrap; }
            
            /* Tags */
            .tag { font-size: 0.7em; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px; }
            .tag.CALIENTE { background: #ff0044; color: white; }
            .tag.INTERESADO { background: #ff9900; color: white; } /* NARANJA */
            .tag.NUEVO { background: var(--accent); color: white; }
            .tag.FRIO { background: #333; color: #aaa; }
            .tag.MANUAL { background: #bd00ff; color: white; }

            /* Chat Area */
            .main { flex: 1; display: flex; flex-direction: column; background: #0b141a; position: relative; }
            .chat-header { padding: 10px 20px; background: var(--header); display: flex; justify-content: space-between; align-items: center; height: 60px; border-bottom: 1px solid #333; }
            .chat-title { font-weight: 600; font-size: 1.1em; }
            
            .feed { flex: 1; padding: 20px 50px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-opacity: 0.1; }
            
            .msg { max-width: 65%; padding: 8px 12px; border-radius: 8px; font-size: 0.95em; line-height: 1.4; position: relative; word-wrap: break-word; display: flex; flex-direction: column; }
            .msg.user { align-self: flex-start; background: var(--incoming); color: var(--text); border-top-left-radius: 0; }
            .msg.assistant { align-self: flex-end; background: var(--outgoing); color: var(--text); border-top-right-radius: 0; }
            
            .msg-content { margin-bottom: 4px; }
            .msg-time { font-size: 0.7em; color: rgba(255,255,255,0.6); align-self: flex-end; margin-top: 2px; }
            
            .btn-toggle { background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 5px 15px; border-radius: 20px; cursor: pointer; font-weight: 600; }
            .btn-toggle.off { border-color: #ff0044; color: #ff0044; }

            /* Input Area */
            .input-area { padding: 15px; background: var(--header); display: flex; gap: 10px; align-items: center; }
            input { flex: 1; background: #2a3942; border: none; color: white; padding: 12px; border-radius: 8px; outline: none; }
            .btn-send { background: var(--accent); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2em; }
            
            /* Scrollbar */
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #374045; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div class="header">
                <div><span class="status-dot"></span><span class="brand">ZARA BONITA</span></div>
            </div>
            <div id="list" class="user-list"></div>
        </div>

        <div class="main">
            <div id="chatHeader" class="chat-header" style="display:none">
                <div class="chat-title" id="chatTitle">Selecciona un chat</div>
                <button id="toggleBtn" class="btn-toggle" onclick="toggle()">ZARA: ON</button>
            </div>
            <div id="feed" class="feed"></div>
            <div id="inputArea" class="input-area" style="display:none">
                <input id="manualInput" placeholder="Escribe un mensaje..." onkeypress="handleKey(event)">
                <button class="btn-send" onclick="send()">➤</button>
            </div>
        </div>

        <script>
            let users = {}; 
            let activePhone = null;

            function formatTime(ts) {
                if (!ts) return '';
                const d = new Date(ts);
                const hours = d.getHours().toString().padStart(2, '0');
                const minutes = d.getMinutes().toString().padStart(2, '0');
                const day = d.getDate().toString().padStart(2, '0');
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                
                const isToday = new Date().toDateString() === d.toDateString();
                return isToday ? \`\${hours}:\${minutes}\` : \`\${day}/\${month} \${hours}:\${minutes}\`;
            }

            function update() { 
                fetch("/api/data").then(r => r.json()).then(data => { 
                    users = data.users; 
                    renderList(); 
                    if(activePhone) renderChat(activePhone); 
                }); 
            }
            
            function renderList() { 
                const list = document.getElementById("list"); 
                const scrollPos = list.scrollTop;
                list.innerHTML = ""; 
                
                if(!users) return; 
                
                const sorted = Object.keys(users).sort((a,b) => {
                    const timeA = users[a].lastInteraction || 0;
                    const timeB = users[b].lastInteraction || 0;
                    return timeB - timeA;
                });

                sorted.forEach(phone => { 
                    const u = users[phone]; 
                    if(!u) return; 
                    
                    const history = Array.isArray(u.history) ? u.history : []; 
                    const lastMsgObj = history.length > 0 ? history[history.length-1] : { content: "Sin mensajes", timestamp: 0 };
                    const lastContent = lastMsgObj.content;
                    const lastTime = formatTime(lastMsgObj.timestamp || u.lastInteraction);
                    
                    const div = document.createElement("div"); 
                    div.className = \`card \${activePhone === phone ? "active" : ""}\`; 
                    div.onclick = () => select(phone); 
                    
                    div.innerHTML = \`
                        <div class="avatar">\${u.name ? u.name[0].toUpperCase() : "?"}</div>
                        <div class="info">
                            <div class="name-row">
                                <span class="name">\${u.name}</span>
                                <span class="msg-meta">\${lastTime}</span>
                            </div>
                            <div class="last-msg">
                                <span class="tag \${u.tag || 'NUEVO'}">\${u.tag || 'NUEVO'}</span> 
                                \${lastContent.substring(0, 35)}...
                            </div>
                        </div>
                    \`; 
                    list.appendChild(div); 
                });
                list.scrollTop = scrollPos;
            }
            
            function select(phone) { 
                activePhone = phone; 
                document.getElementById("chatHeader").style.display = "flex"; 
                document.getElementById("inputArea").style.display = "flex"; 
                document.getElementById("chatTitle").innerText = users[phone].name; 
                update();
                setTimeout(() => {
                    const feed = document.getElementById("feed");
                    feed.scrollTop = feed.scrollHeight;
                }, 100);
            }
            
            function renderChat(phone) { 
                const feed = document.getElementById("feed"); 
                const u = users[phone];
                
                const isAtBottom = feed.scrollHeight - feed.scrollTop <= feed.clientHeight + 50;

                feed.innerHTML = ""; 
                if(u && Array.isArray(u.history)) { 
                    u.history.forEach(msg => { 
                        const div = document.createElement("div"); 
                        div.className = "msg " + msg.role; 
                        const timeStr = formatTime(msg.timestamp);
                        
                        div.innerHTML = \`
                            <div class="msg-content">\${msg.content.replace(/\\n/g, '<br>')}</div>
                            <div class="msg-time">\${timeStr}</div>
                        \`; 
                        feed.appendChild(div); 
                    }); 
                } 
                
                if(isAtBottom) {
                    feed.scrollTop = feed.scrollHeight; 
                }
            }
            
            async function toggle() { 
                if(!activePhone) return; 
                const btn = document.getElementById("toggleBtn");
                if(btn.innerText.includes("ON")) {
                    btn.innerText = "ZARA: OFF";
                    btn.className = "btn-toggle off";
                } else {
                    btn.innerText = "ZARA: ON";
                    btn.className = "btn-toggle";
                }
                await fetch("/api/toggle", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ phone: activePhone }) }); 
            }
            
            async function send() { 
                const input = document.getElementById("manualInput"); 
                const text = input.value; 
                if(!text || !activePhone) return; 
                
                input.value = ""; 
                users[activePhone].history.push({role: "assistant", content: text, timestamp: Date.now()}); 
                renderChat(activePhone); 
                
                await fetch("/api/manual", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ phone: activePhone, text }) }); 
            }

            function handleKey(e) {
                if(e.key === 'Enter') send();
            }
            
            setInterval(update, 2000); 
            update();
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones() }));
app.post('/api/toggle', (req, res) => { toggleBot(req.body.phone); res.json({ success: true }); });
app.post('/api/manual', async (req, res) => { await enviarMensajeManual(req.body.phone, req.body.text); res.json({ success: true }); });
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'zara123') res.send(req.query['hub.challenge']);
    else res.sendStatus(403);
});
app.post('/webhook', async (req, res) => {
    try { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); } 
    catch (e) { console.error(e); res.sendStatus(500); }
});

app.listen(PORT, () => console.log(`🟢 ZARA BONITA LISTA en puerto ${PORT}`));
