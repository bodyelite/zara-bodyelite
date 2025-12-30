import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { procesarEvento, getSesiones, toggleBot, enviarMensajeManual } from './app.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/monitor', (req, res) => {
    let html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '<title>ZARA 7.1 DIAGNOSTIC</title>';
    html += '<style>';
    html += ':root { --bg: #000000; --sidebar: #0a0a0a; --text: #ffffff; --accent: #00ff88; --hot: #ff0044; --medium: #ffcc00; --cold: #00ccff; --bot: #005c4b; }';
    html += '* { box-sizing: border-box; } body { margin: 0; font-family: sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }';
    html += '.sidebar { width: 360px; background: var(--sidebar); border-right: 1px solid #222; display: flex; flex-direction: column; }';
    html += '.header { padding: 15px; border-bottom: 2px solid var(--accent); background: #000; display: flex; justify-content: space-between; align-items: center; }';
    html += '.brand { font-weight: 900; color: var(--accent); font-size: 1.2em; }';
    html += '.btn-csv { background: #333; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8em; }';
    html += '.card { padding: 15px; border-bottom: 1px solid #1a1a1a; cursor: pointer; display: flex; gap: 10px; align-items: center; position: relative; }';
    html += '.card:hover { background: #111; } .card.active { background: #161616; border-left: 4px solid var(--accent); }';
    html += '.avatar { width: 40px; height: 40px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }';
    html += '.info { flex: 1; overflow: hidden; } .name { font-weight: bold; display: flex; justify-content: space-between; }';
    html += '.tag { font-size: 0.7em; padding: 2px 6px; border-radius: 4px; color: #000; font-weight: bold; }';
    html += '.tag.CALIENTE { background: var(--hot); color: white; } .tag.TIBIO { background: var(--medium); } .tag.FRIO { background: var(--cold); } .tag.NUEVO { background: #666; color: white; } .tag.ANTIGUO { background: #444; color: #aaa; }';
    html += '.last-msg { font-size: 0.8em; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 5px; }';
    html += '.main { flex: 1; display: flex; flex-direction: column; background: #000; }';
    html += '.chat-head { padding: 10px 20px; background: #0a0a0a; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; height: 60px; }';
    html += '.controls { display: flex; gap: 10px; }';
    html += '.btn-strat { background: #bd00ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; }';
    html += '.btn-toggle { background: var(--accent); border: none; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; }';
    html += '.btn-toggle.off { background: var(--hot); color: white; }';
    html += '.feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }';
    html += '.msg { max-width: 75%; padding: 10px 15px; border-radius: 10px; font-size: 0.9em; }';
    html += '.msg.user { align-self: flex-start; background: #222; } .msg.assistant { align-self: flex-end; background: var(--bot); }';
    html += '.input-area { padding: 15px; background: #0a0a0a; display: flex; gap: 10px; border-top: 1px solid #222; }';
    html += 'input { flex: 1; background: #1a1a1a; border: 1px solid #333; color: white; padding: 10px; border-radius: 5px; }';
    html += '</style></head><body>';
    
    html += '<div class="sidebar">';
    html += '<div class="header"><span class="brand">ZARA 7.1</span><button class="btn-csv" onclick="alert(\'Descarga CSV Próximamente\')">📥 CSV</button></div>';
    html += '<div style="flex:1; overflow-y:auto" id="list"></div></div>';
    
    html += '<div class="main"><div class="chat-head" id="chatHead" style="display:none">';
    html += '<div id="chatTitle">Chat</div>';
    html += '<div class="controls"><button class="btn-strat">🟣 ESTRATEGIA</button><button id="toggleBtn" class="btn-toggle" onclick="toggle()">ZARA: ON</button></div></div>';
    html += '<div class="feed" id="feed"></div><div class="input-area" id="inputArea" style="display:none"><input id="manualInput" placeholder="Escribir..."><button class="btn-toggle" onclick="send()">➤</button></div></div>';

    html += '<script>';
    html += 'let users = {}; let activePhone = null;';
    html += 'function update() { fetch("/api/data").then(r => r.json()).then(data => { users = data.users; renderList(); if(activePhone) renderChat(activePhone); }).catch(e => console.error(e)); }';
    
    // RENDERIZADOR A PRUEBA DE FALLOS
    html += 'function renderList() { const list = document.getElementById("list"); list.innerHTML = ""; ';
    html += 'if(!users || Object.keys(users).length === 0) { list.innerHTML = "<div style=\'padding:20px; color:#666\'>Sin datos...</div>"; return; }';
    html += 'Object.keys(users).forEach(phone => { const u = users[phone]; if(!u) return; ';
    html += 'const history = Array.isArray(u.history) ? u.history : []; ';
    html += 'const lastMsg = history.length > 0 ? history[history.length-1].content : "Sin mensajes"; ';
    html += 'const tagClass = u.tag || "NUEVO"; ';
    html += 'const div = document.createElement("div"); div.className = `card ${activePhone === phone ? "active" : ""}`; div.onclick = () => select(phone); ';
    html += 'div.innerHTML = `<div class="avatar">${(u.name && u.name[0]) ? u.name[0] : "?"}</div><div class="info"><div class="name"><span>${u.name || "Cliente"}</span><span class="tag ${tagClass}">${u.tag || "?"}</span></div><div class="last-msg">${lastMsg.substring(0,30)}...</div></div>`; list.prepend(div); }); }';
    
    html += 'function select(phone) { activePhone = phone; document.getElementById("chatHead").style.display = "flex"; document.getElementById("inputArea").style.display = "flex"; document.getElementById("chatTitle").innerText = users[phone].name; const btn = document.getElementById("toggleBtn"); const isOn = users[phone].botOn !== false; btn.className = isOn ? "btn-toggle" : "btn-toggle off"; btn.innerText = isOn ? "ZARA: ON" : "ZARA: OFF"; renderChat(phone); renderList(); }';
    html += 'function renderChat(phone) { const feed = document.getElementById("feed"); feed.innerHTML = ""; if(users[phone] && Array.isArray(users[phone].history)) { users[phone].history.forEach(msg => { const div = document.createElement("div"); div.className = "msg " + msg.role; div.innerHTML = msg.content; feed.appendChild(div); }); } feed.scrollTop = feed.scrollHeight; }';
    html += 'async function toggle() { if(!activePhone) return; await fetch("/api/toggle", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ phone: activePhone }) }); update(); }';
    html += 'async function send() { const input = document.getElementById("manualInput"); const text = input.value; if(!text || !activePhone) return; input.value = ""; users[activePhone].history.push({role: "assistant", content: text}); renderChat(activePhone); await fetch("/api/manual", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ phone: activePhone, text }) }); }';
    html += 'setInterval(update, 2000); update();';
    html += '</script></body></html>';

    res.send(html);
});

app.get('/api/data', (req, res) => res.json({ users: getSesiones(), token: !!PAGE_ACCESS_TOKEN }));
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

app.listen(PORT, () => console.log(`🟢 ZARA 7.1 DIAGNOSTIC en puerto ${PORT}`));
