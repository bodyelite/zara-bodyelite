import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const conversaciones = {};

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zara Monitor</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { height: 100vh; display: flex; background-color: #d1d7db; overflow: hidden; }
        #app { display: flex; width: 100%; height: 100%; max-width: 1600px; margin: 0 auto; background: white; }
        .sidebar { width: 30%; min-width: 300px; display: flex; flex-direction: column; border-right: 1px solid #e9edef; background: white; }
        .sidebar-header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #e9edef; font-weight:bold; color:#54656f; }
        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0f2f5; }
        .contact:hover { background-color: #f5f6f6; }
        .contact.active { background-color: #f0f2f5; }
        .avatar { width: 45px; height: 45px; background: #dfe5e7; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-weight:bold; color:white; }
        .info { flex: 1; overflow: hidden; }
        .name { font-size: 16px; color: #111b21; margin-bottom: 3px; }
        .preview { font-size: 13px; color: #667781; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-area { flex: 1; display: flex; flex-direction: column; background-color: #efeae2; }
        .chat-header { height: 60px; background: #f0f2f5; padding: 0 16px; display: flex; align-items: center; border-bottom: 1px solid #e9edef; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; }
        .msg { max-width: 65%; padding: 8px 12px; border-radius: 7.5px; font-size: 14.2px; line-height: 19px; position: relative; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
        .msg-in { align-self: flex-start; background: #ffffff; border-top-left-radius: 0; }
        .msg-out { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0; }
        .msg-sys { align-self: center; background: #fff5c4; font-size: 12px; text-align: center; border-radius: 8px; color: #555; padding: 5px; max-width: 90%; }
        .msg-meta { font-size: 10px; text-align: right; color: #667781; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div id="app">
        <div class="sidebar">
          <div class="sidebar-header">Chats Activos</div>
          <div class="contact-list" id="contactList"></div>
        </div>
        <div class="chat-area" id="chatArea">
          <div class="chat-header" id="chatHeader" style="display:none;"></div>
          <div class="messages" id="msgContainer">
             <div style="text-align:center; margin-top:50px; color:#667781;">Selecciona un chat</div>
          </div>
        </div>
      </div>
      <script>
        let currentChatId = null;
        async function update() {
          try {
            const res = await fetch('/api/data');
            const data = await res.json();
            renderContacts(data);
            if (currentChatId && data[currentChatId]) renderMessages(data[currentChatId]);
          } catch (e) {}
        }
        function renderContacts(data) {
          const list = document.getElementById('contactList');
          let html = "";
          const sortedIds = Object.keys(data).sort((a,b) => {
             const lastA = data[a].mensajes[data[a].mensajes.length-1].timestamp;
             const lastB = data[b].mensajes[data[b].mensajes.length-1].timestamp;
             return lastB - lastA;
          });
          sortedIds.forEach(id => {
            const chat = data[id];
            const lastMsg = chat.mensajes[chat.mensajes.length-1];
            html += `<div class="contact" onclick="selectChat('${id}')">
                <div class="avatar" style="background:#00a884">${chat.nombre[0]}</div>
                <div class="info"><div class="name">${chat.nombre}</div><div class="preview">${lastMsg.texto}</div></div>
              </div>`;
          });
          if(list.innerHTML !== html) list.innerHTML = html;
        }
        function selectChat(id) {
          currentChatId = id;
          document.getElementById('chatHeader').style.display = 'flex';
          document.getElementById('chatHeader').innerHTML = `<b>Chat con ${id}</b>`;
          update();
        }
        function renderMessages(chatData) {
            const container = document.getElementById('msgContainer');
            let html = "";
            chatData.mensajes.forEach(m => {
                let cls = m.tipo==='zara'?'msg-out':(m.tipo==='sistema'?'msg-sys':'msg-in');
                html += `<div class="msg ${cls}">${m.texto}<div class="msg-meta">${new Date(m.timestamp).toLocaleTimeString()}</div></div>`;
            });
            if(container.innerHTML !== html) { container.innerHTML = html; container.scrollTop = container.scrollHeight; }
        }
        setInterval(update, 3000);
      </script>
    </body>
    </html>
  `);
});

app.get("/api/data", (req, res) => res.json(conversaciones));

app.post("/webhook", (req, res) => {
  const { senderId, senderName, mensaje, tipo } = req.body;
  if (!conversaciones[senderId]) conversiones[senderId] = { nombre: senderName || senderId, mensajes: [] };
  conversaciones[senderId].mensajes.push({ texto: mensaje, tipo, timestamp: Date.now() });
  if (conversaciones[senderId].mensajes.length > 50) conversiones[senderId].mensajes.shift();
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Monitor listening ${PORT}`));
