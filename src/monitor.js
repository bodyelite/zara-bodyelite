import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// --- MEMORIA ESTRUCTURADA (AGRUPADA POR CLIENTE) ---
// Formato: { "56912345678": { nombre: "Juan", mensajes: [...] } }
const conversaciones = {};

// RUTA VISUAL (EL APP WEB)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zara Monitor | WhatsApp Web Style</title>
      <style>
        /* RESET & BASE */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { height: 100vh; display: flex; background-color: #d1d7db; overflow: hidden; }

        /* LAYOUT */
        #app { display: flex; width: 100%; height: 100%; max-width: 1600px; margin: 0 auto; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        
        /* SIDEBAR (IZQUIERDA) */
        .sidebar { width: 30%; min-width: 300px; display: flex; flex-direction: column; border-right: 1px solid #e9edef; background: white; }
        .sidebar-header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #e9edef; }
        .sidebar-header h2 { font-size: 16px; color: #54656f; }
        
        .contact-list { flex: 1; overflow-y: auto; }
        .contact { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0f2f5; transition: 0.2s; }
        .contact:hover { background-color: #f5f6f6; }
        .contact.active { background-color: #f0f2f5; }
        
        .avatar { width: 49px; height: 49px; background: #dfe5e7; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff; }
        .info { flex: 1; overflow: hidden; }
        .name { font-size: 16px; color: #111b21; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .preview { font-size: 13px; color: #667781; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .time { font-size: 12px; color: #667781; margin-left: 10px; }

        /* CHAT AREA (DERECHA) */
        .chat-area { flex: 1; display: flex; flex-direction: column; background-color: #efeae2; background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"); position: relative; }
        
        /* Header del Chat */
        .chat-header { height: 60px; background: #f0f2f5; padding: 0 16px; display: flex; align-items: center; border-bottom: 1px solid #e9edef; z-index: 10; }
        .chat-header .name { font-weight: bold; font-size: 16px; }

        /* Mensajes */
        .messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        
        /* Burbujas */
        .msg { max-width: 65%; padding: 6px 7px 8px 9px; border-radius: 7.5px; font-size: 14.2px; line-height: 19px; position: relative; word-wrap: break-word; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); margin-bottom: 4px; }
        
        .msg-in { align-self: flex-start; background: #ffffff; border-top-left-radius: 0; }
        .msg-out { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0; }
        .msg-sys { align-self: center; background: #fff5c4; font-size: 12px; text-align: center; border-radius: 8px; color: #555; padding: 5px 12px; box-shadow: none; margin: 10px 0; max-width: 90%; }

        .msg-meta { display: flex; justify-content: flex-end; font-size: 11px; color: #667781; margin-top: 2px; margin-left: 10px; }

        /* Empty State */
        .no-chat { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #667781; background: #f0f2f5; border-bottom: 6px solid #25d366; }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        ::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); }
      </style>
    </head>
    <body>

      <div id="app">
        <div class="sidebar">
          <div class="sidebar-header">
            <h2>Chats Activos</h2>
          </div>
          <div class="contact-list" id="contactList">
            </div>
        </div>

        <div class="chat-area" id="chatArea">
          <div class="no-chat">
            <h2>Zara Monitor 5.0</h2>
            <p>Selecciona un chat para ver la conversación en tiempo real.</p>
          </div>
        </div>
      </div>

      <script>
        let currentChatId = null;
        let lastDataHash = "";

        // Función principal de actualización
        async function update() {
          try {
            const res = await fetch('/api/data');
            const data = await res.json();
            const dataHash = JSON.stringify(data); // Detección simple de cambios
            
            // Renderizamos lista de contactos
            renderContacts(data);
            
            // Si hay un chat abierto, actualizamos sus mensajes
            if (currentChatId && data[currentChatId]) {
                renderMessages(data[currentChatId]);
            }
          } catch (e) { console.error("Error update:", e); }
        }

        function renderContacts(data) {
          const list = document.getElementById('contactList');
          // Ordenar por mensaje más reciente
          const sortedIds = Object.keys(data).sort((a, b) => {
             const lastA = data[a].mensajes[data[a].mensajes.length-1].timestamp;
             const lastB = data[b].mensajes[data[b].mensajes.length-1].timestamp;
             return lastB - lastA;
          });

          // Solo reconstruir si cambió algo para no perder scroll o clicks
          // (Simplificación: reconstruimos la lista interna pero mantenemos estado visual)
          let html = "";
          sortedIds.forEach(id => {
            const chat = data[id];
            const lastMsg = chat.mensajes[chat.mensajes.length - 1];
            const activeClass = id === currentChatId ? 'active' : '';
            
            html += \`
              <div class="contact \${activeClass}" onclick="selectChat('\${id}')">
                <div class="avatar" style="background-color: \${getColor(id)}">\${chat.nombre[0]}</div>
                <div class="info">
                  <div style="display:flex; justify-content:space-between;">
                    <div class="name">\${chat.nombre}</div>
                    <div class="time">\${formatTime(lastMsg.timestamp)}</div>
                  </div>
                  <div class="preview">\${lastMsg.texto}</div>
                </div>
              </div>
            \`;
          });
          
          // Truco para no reemplazar todo si no es necesario (evita parpadeo)
          if(list.innerHTML !== html) list.innerHTML = html;
        }

        function selectChat(id) {
          currentChatId = id;
          // Forzar update inmediato visual
          update(); 
          // Construir estructura del chat si no existe
          const chatArea = document.getElementById('chatArea');
          chatArea.innerHTML = \`
            <div class="chat-header">
               <div class="avatar" style="background-color: \${getColor(id)}">\${id[0]}</div>
               <div class="name">Chat con \${id}</div>
            </div>
            <div class="messages" id="msgContainer"></div>
          \`;
        }

        function renderMessages(chatData) {
            const container = document.getElementById('msgContainer');
            if(!container) return;

            let html = "";
            chatData.mensajes.forEach(m => {
                let cssClass = 'msg-in'; // Usuario
                if (m.tipo === 'zara') cssClass = 'msg-out';
                if (m.tipo === 'sistema') cssClass = 'msg-sys';

                html += \`
                    <div class="msg \${cssClass}">
                        \${m.texto.replace(/\\n/g, '<br>')}
                        <div class="msg-meta">\${formatTime(m.timestamp)}</div>
                    </div>
                \`;
            });

            // Solo actualizar si hay mensajes nuevos para mantener scroll
            if(container.innerHTML !== html) {
                container.innerHTML = html;
                container.scrollTop = container.scrollHeight; // Auto-scroll al fondo
            }
        }

        // Utilidades
        function formatTime(ts) {
            const d = new Date(ts);
            return d.getHours() + ':' + (d.getMinutes()<10?'0':'') + d.getMinutes();
        }
        function getColor(id) {
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8'];
            return colors[id.length % colors.length];
        }

        // Loop infinito
        setInterval(update, 3000);
        update(); // Primera carga
      </script>
    </body>
    </html>
  `);
});

// API DE DATOS (PARA QUE EL FRONTEND LOS LEA)
app.get("/api/data", (req, res) => {
    res.json(conversaciones);
});

// WEBHOOK DE RECEPCIÓN
app.post("/webhook", (req, res) => {
  const { senderId, senderName, mensaje, tipo } = req.body;
  
  // Si no existe el chat, crearlo
  if (!conversaciones[senderId]) {
      conversaciones[senderId] = {
          nombre: senderName || senderId,
          mensajes: []
      };
  }

  // Agregar mensaje
  conversaciones[senderId].mensajes.push({
      texto: mensaje,
      tipo: tipo, // 'usuario', 'zara', 'sistema'
      timestamp: Date.now()
  });

  // Limitar historial por chat (últimos 50)
  if (conversaciones[senderId].mensajes.length > 50) {
      conversaciones[senderId].mensajes.shift();
  }

  // Log técnico
  console.log(`📝 Monitor recibió: ${tipo} de ${senderName}`);
  
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`📊 Monitor WhatsApp App (Grouped) en puerto ${PORT}`));
