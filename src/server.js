import express from "express";
import bodyParser from "body-parser";
import { procesarEvento, procesarReserva, getSesiones } from "./app.js"; 
import { conectarCliente } from "./utils/stream.js";

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(bodyParser.json());

// --- MONITOR VISUAL (RESTAURADO) ---
const MONITOR_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZARA MONITOR PRO</title>
    <style>
        :root { --bg: #000; --sidebar: #111; --text: #fff; --accent: #00ff88; --hover: #222; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); display: flex; height: 100vh; overflow: hidden; }
        
        .sidebar { width: 350px; background: var(--sidebar); border-right: 1px solid #333; display: flex; flex-direction: column; }
        .header { padding: 15px; background: #000; border-bottom: 2px solid var(--accent); font-weight: 900; font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; }
        .status-dot { width: 10px; height: 10px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); }
        
        .user-list { flex: 1; overflow-y: auto; }
        .card { padding: 15px; border-bottom: 1px solid #222; display: flex; gap: 10px; cursor: pointer; transition: 0.2s; }
        .card:hover { background: var(--hover); }
        .card.active { background: #1a1a1a; border-left: 4px solid var(--accent); }
        
        .avatar { width: 45px; height: 45px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; flex-shrink: 0; }
        .info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
        .name { font-weight: 700; font-size: 1rem; margin-bottom: 2px; }
        .details { font-size: 0.8rem; color: #888; display: flex; gap: 5px; align-items: center; }
        .preview { font-size: 0.85rem; color: #666; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .main { flex: 1; display: flex; flex-direction: column; background: #050505; }
        .chat-header { padding: 15px; border-bottom: 1px solid #333; font-weight: bold; color: var(--accent); font-size: 1.1rem; }
        .feed { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        
        .msg { max-width: 75%; padding: 10px 14px; border-radius: 12px; font-size: 0.95rem; line-height: 1.4; }
        .msg.user { align-self: flex-start; background: #222; color: #ddd; border-bottom-left-radius: 2px; }
        .msg.bot { align-self: flex-end; background: #003322; color: #fff; border: 1px solid #005533; border-bottom-right-radius: 2px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="header">ZARA LIVE <div class="status-dot"></div></div>
        <div class="user-list" id="list"></div>
    </div>
    <div class="main">
        <div class="chat-header" id="chatTitle">Esperando actividad...</div>
        <div class="feed" id="feed"></div>
    </div>
    <script>
        const list = document.getElementById('list');
        const feed = document.getElementById('feed');
        const chatTitle = document.getElementById('chatTitle');
        let users = {};
        let activeId = null;

        // Cargar historial inicial
        fetch('/api/history').then(res => res.json()).then(data => {
            Object.keys(data).forEach(id => {
                const hist = data[id];
                if(hist.length > 0) {
                    let name = "Cliente";
                    const match = hist[0].content.match(/\\[Cliente: (.*?)\\]/);
                    if(match) name = match[1];
                    
                    // Procesar historial completo
                    const cleanHist = hist.map(m => ({ 
                        role: m.role === 'assistant' ? 'bot' : 'user', 
                        txt: m.content.replace(/\\[Cliente: .*?\\] /, '')
                    }));

                    // Inicializar usuario
                    users[id] = { name: name, phone: id, history: cleanHist };
                    createCard(users[id], cleanHist[cleanHist.length-1].txt);
                }
            });
        });

        const evtSource = new EventSource("/monitor-stream");
        evtSource.onmessage = (e) => {
            const d = JSON.parse(e.data);
            if (d.tipo === "MENSAJE" || d.tipo === "RESPUESTA_ZARA") update(d);
            else if (d.tipo === "RESERVA") alert("💰 NUEVA RESERVA: " + d.nombre);
        };

        function update(d) {
            const id = d.telefono;
            // Si es mensaje nuevo, crear usuario si no existe
            if (!users[id]) {
                users[id] = { name: d.nombre || 'Cliente', phone: id, history: [] };
                createCard(users[id], "...");
            }
            
            const txt = d.tipo === "RESPUESTA_ZARA" ? d.texto : d.mensaje;
            const role = d.tipo === "RESPUESTA_ZARA" ? 'bot' : 'user';
            
            // Evitar duplicados si es restauración
            if(!d.restore) {
                users[id].history.push({ role, txt });
                if (activeId === id) renderBubble({ role, txt });
                
                // Actualizar card y mover al inicio
                const card = document.getElementById('c-' + id);
                if(card) {
                    card.querySelector('.preview').innerText = (role === 'bot' ? "🤖 " : "") + txt;
                    list.prepend(card);
                }
            }
        }

        function createCard(u, previewTxt) {
            if(document.getElementById('c-' + u.phone)) return;
            const div = document.createElement('div');
            div.className = 'card';
            div.id = 'c-' + u.phone;
            div.onclick = () => select(u.phone);
            div.innerHTML = \`
                <div class="avatar">\${u.name.charAt(0)}</div>
                <div class="info">
                    <div class="name">\${u.name}</div>
                    <div class="details">+\${u.phone}</div>
                    <div class="preview">\${previewTxt}</div>
                </div>\`;
            list.prepend(div);
        }

        function select(id) {
            activeId = id;
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            document.getElementById('c-' + id).classList.add('active');
            chatTitle.innerText = users[id].name;
            feed.innerHTML = '';
            users[id].history.forEach(m => renderBubble(m));
            feed.scrollTop = feed.scrollHeight;
        }

        function renderBubble(m) {
            const d = document.createElement('div');
            d.className = 'msg ' + m.role;
            d.innerText = m.txt;
            feed.appendChild(d);
            feed.scrollTop = feed.scrollHeight;
        }
    </script>
</body>
</html>
`;

app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/history", (req, res) => res.json(getSesiones()));
app.get("/monitor-stream", (req, res) => conectarCliente(req, res));
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});
app.post("/webhook", async (req, res) => {
  try { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});
app.post("/reservo-webhook", async (req, res) => {
  try { await procesarReserva(req.body); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});

app.listen(PORT, () => {
    console.log(\`🟢 ZARA 6.0 LIVE en puerto \${PORT}\`);
    console.log(\`📊 MONITOR: https://zara-bodyelite-1.onrender.com/monitor\`);
});
