import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";
import { generarRespuestaIA } from "./services/openai.js";
import { sendMessage } from "./services/meta.js";
import { NEGOCIO } from "./config/knowledge_base.js";
import { registrarMensaje, chats } from "./utils/memory.js";

dotenv.config();
const app = express();
const webSessions = {};

app.use(bodyParser.json());

// --- 1. RUTA PRINCIPAL (MONITOR WEB MEJORADO) ---
app.get("/monitor", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zara Monitor V15 | Body Elite</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
      <style>
        body { margin: 0; font-family: -apple-system, sans-serif; background: #d1d7db; display: flex; height: 100vh; }
        #app { display: flex; width: 100%; max-width: 1600px; background: white; margin: 0 auto; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .sidebar { width: 350px; background: #fff; border-right: 1px solid #e9edef; display: flex; flex-direction: column; }
        .header { height: 60px; background: #f0f2f5; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d1d7db; }
        .header h2 { font-size: 16px; color: #54656f; margin: 0; }
        .filters { padding: 10px; display: flex; gap: 5px; background: #fff; border-bottom: 1px solid #f0f2f5; }
        .filter-btn { flex: 1; padding: 6px; border: none; background: #f0f2f5; border-radius: 15px; cursor: pointer; font-size: 13px; color: #54656f; transition: 0.2s; }
        .filter-btn.active { background: #008069; color: white; font-weight: bold; }
        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #f0f2f5; transition: 0.2s; }
        .contact:hover { background: #f5f6f6; }
        .contact.active { background: #f0f2f5; }
        .avatar { width: 45px; height: 45px; background: #dfe5e7; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; margin-right: 15px; font-size: 18px; position: relative; flex-shrink: 0; }
        .icon-origin { position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 2px solid white; }
        .info { flex: 1; overflow: hidden; }
        .name { font-weight: 500; color: #111b21; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .preview { font-size: 13px; color: #667781; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-area { flex: 1; display: flex; flex-direction: column; background: #efeae2; }
        .chat-header { height: 60px; background: #f0f2f5; padding: 0 16px; display: flex; align-items: center; border-bottom: 1px solid #d1d7db; font-weight: bold; color: #54656f; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); opacity: 0.9; }
        .msg { max-width: 60%; padding: 8px 12px; border-radius: 8px; font-size: 14px; position: relative; box-shadow: 0 1px 1px rgba(0,0,0,0.1); word-wrap: break-word; }
        .msg.usuario { align-self: flex-start; background: #fff; border-top-left-radius: 0; }
        .msg.zara { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0; }
        .time { font-size: 10px; color: #667781; text-align: right; margin-top: 4px; }
        #loading, #no-chats { text-align: center; padding: 20px; color: #667781; font-size: 14px; }
      </style>
    </head>
    <body>
      <div id="app">
        <div class="sidebar">
          <div class="header"><h2><i class="fas fa-robot"></i> Zara Monitor V15</h2></div>
          <div class="filters">
            <button class="filter-btn active" onclick="setFilter('all')">Todos</button>
            <button class="filter-btn" onclick="setFilter('wsp')">WSP</button>
            <button class="filter-btn" onclick="setFilter('web')">Web</button>
            <button class="filter-btn" onclick="setFilter('ig')">IG</button>
          </div>
          <div class="contact-list" id="contactList">
            <div id="loading">Cargando chats...</div>
          </div>
        </div>
        <div class="chat-area">
          <div class="chat-header" id="chatHeader">Selecciona un chat</div>
          <div class="messages" id="msgsBox"></div>
        </div>
      </div>
      <script>
        let allChats = {};
        let currentFilter = 'all';
        let selectedId = null;

        // Función para obtener datos del servidor
        async function update() {
            try {
                // console.log('🔄 Pidiendo datos al servidor...');
                const res = await fetch('/api/data');
                const newData = await res.json();
                
                // Solo actualizamos si hay cambios reales para evitar parpadeos
                if (JSON.stringify(newData) !== JSON.stringify(allChats)) {
                    console.log('✨ Nuevos datos recibidos:', Object.keys(newData).length, 'chats.');
                    allChats = newData;
                    renderList();
                    if(selectedId) renderChat(selectedId);
                }
            } catch(e) { 
                console.error('❌ Error obteniendo datos:', e);
                document.getElementById('contactList').innerHTML = '<div id="no-chats" style="color:red">Error de conexión.</div>';
            }
        }

        // Cambiar filtro (WSP, Web, IG)
        function setFilter(f) {
            currentFilter = f;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            selectedId = null; // Reseteamos selección al cambiar filtro
            document.getElementById('chatHeader').innerText = 'Selecciona un chat';
            document.getElementById('msgsBox').innerHTML = '';
            renderList();
        }

        // Pintar la lista de contactos
        function renderList() {
            const list = document.getElementById('contactList');
            let ids = Object.keys(allChats);

            if (ids.length === 0) {
                list.innerHTML = '<div id="no-chats">No hay chats activos aún.</div>';
                return;
            }

            // Ordenar por fecha del último mensaje (más reciente primero)
            ids.sort((a,b) => {
                const mA = allChats[a].mensajes; const mB = allChats[b].mensajes;
                if (!mA.length || !mB.length) return 0;
                return mB[mB.length-1].timestamp - mA[mA.length-1].timestamp;
            });

            // Aplicar filtro
            if (currentFilter !== 'all') {
                ids = ids.filter(id => allChats[id].origen === currentFilter);
            }

            if (ids.length === 0 && currentFilter !== 'all') {
                 list.innerHTML = '<div id="no-chats">No hay chats en este filtro.</div>';
                 return;
            }


            let html = '';
            ids.forEach(id => {
                const c = allChats[id];
                if (!c.mensajes.length) return; // Saltar chats vacíos
                const last = c.mensajes[c.mensajes.length-1];
                
                let icon = 'fa-whatsapp'; let color = '#25D366';
                if(c.origen==='web') { icon = 'fa-globe'; color='#3498db'; }
                if(c.origen==='ig') { icon = 'fa-instagram'; color='#e1306c'; }

                html += \`<div class="contact \${id === selectedId ? 'active' : ''}" onclick="selectChat('\${id}')">
                    <div class="avatar" style="background:\${color}">
                        \${c.nombre[0].toUpperCase()}
                        <div class="icon-origin" style="background:\${color}"><i class="fab \${icon}"></i></div>
                    </div>
                    <div class="info">
                        <div class="name">\${c.nombre}</div>
                        <div class="preview">\${last.tipo === 'zara' ? '🤖 ' : ''}\${last.texto.substring(0,35)}...</div>
                    </div>
                </div>\`;
            });
            list.innerHTML = html;
        }

        // Seleccionar un chat
        function selectChat(id) {
            selectedId = id;
            renderList(); // Para actualizar la clase 'active'
            renderChat(id);
        }

        // Pintar los mensajes del chat seleccionado
        function renderChat(id) {
            const c = allChats[id];
            if (!c) return;
            document.getElementById('chatHeader').innerHTML = \`\${c.nombre} (\${c.origen.toUpperCase()})\`;
            const box = document.getElementById('msgsBox');
            let html = '';
            c.mensajes.forEach(m => {
                html += \`<div class="msg \${m.tipo}">
                    \${m.texto}
                    <div class="time">\${new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>\`;
            });
            
            // Solo actualizar si hay cambios para no afectar el scroll si estás leyendo
            if(box.innerHTML !== html) {
                box.innerHTML = html;
                box.scrollTop = box.scrollHeight; // Scroll al final
            }
        }

        // Actualizar cada 2 segundos
        setInterval(update, 2000);
        update(); // Primera llamada inmediata
      </script>
    </body>
    </html>
  `);
});

// --- 2. API PARA EL MONITOR (Devuelve la memoria) ---
app.get("/api/data", (req, res) => {
    res.json(chats);
});

// --- 3. WEBHOOKS DE ZARA ---
app.get("/", (req, res) => res.status(200).send("Zara V15.0 Monitor Visual Fix Running"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200);
    if (entry) procesarEvento(entry).catch(console.error);
  } catch (e) { console.error(e); res.sendStatus(200); }
});

app.post("/reservo-webhook", (req, res) => {
    const data = req.body;
    res.sendStatus(200);
    if (data) procesarReserva(data).catch(console.error);
});

// --- 4. WEBCHAT INTEGRADO AL MONITOR ---
app.post("/webchat", async (req, res) => {
    try {
        const { message, userId } = req.body;
        const uid = userId || 'anonimo_web';

        // 1. Alerta Llamada
        const telefonoMatch = message.match(/\b(?:\+?56)?\s?(?:9\s?)?\d{7,8}\b/);
        if (telefonoMatch) {
            const fono = telefonoMatch[0].replace(/\D/g, '');
            const alerta = `🚨 *SOLICITUD LLAMADA (WEB)* 🚨\n📞 ${fono}`;
            for (const n of NEGOCIO.staff_alertas) { await sendMessage(n, alerta, "whatsapp"); }
        }

        // 2. Registrar en Monitor (Memoria)
        registrarMensaje(uid, "Cliente Web", message, "usuario", "web");

        // 3. IA
        if (!webSessions[uid]) webSessions[uid] = { historial: [] };
        webSessions[uid].historial.push({ role: "user", content: message });
        if (webSessions[uid].historial.length > 12) webSessions[uid].historial = webSessions[uid].historial.slice(-12);

        let reply = await generarRespuestaIA(webSessions[uid].historial);
        webSessions[uid].historial.push({ role: "assistant", content: reply });

        // 4. Registrar Respuesta en Monitor (Memoria)
        registrarMensaje(uid, "Cliente Web", reply, "zara", "web");

        // 5. Botón
        let showButton = false;
        let buttonLink = "";
        if (reply.includes("agendamiento.reservo.cl") || (reply.toLowerCase().includes("link") && reply.toLowerCase().includes("agenda"))) {
            showButton = true;
            buttonLink = NEGOCIO.agenda_link;
            reply = reply.replace(NEGOCIO.agenda_link, "").replace("https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9", "").trim();
        }

        res.json({ response: reply, button: showButton, link: buttonLink });

    } catch (error) {
        console.error("🔥 ERROR EN WEBCHAT:", error);
        res.status(500).json({ response: "Error interno del servidor." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara + Monitor V15 corriendo en puerto ${PORT}`));
