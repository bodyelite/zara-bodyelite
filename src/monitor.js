import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// --- MEMORIA DE CHATS (Agrupada por número) ---
// Estructura: { "569...": { nombre: "Juan", mensajes: [ {texto, tipo, hora} ] } }
const chats = {};

// 1. FRONTEND: Interfaz estilo WhatsApp Web
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zara Monitor | CRM</title>
      <style>
        /* RESET */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { background-color: #d1d7db; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }

        /* LAYOUT PRINCIPAL */
        #app { display: flex; width: 100%; height: 100%; max-width: 1600px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
        
        /* --- SIDEBAR (IZQUIERDA) --- */
        .sidebar { width: 350px; display: flex; flex-direction: column; border-right: 1px solid #e9edef; background: white; }
        
        .header { height: 60px; background: #f0f2f5; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #e9edef; flex-shrink: 0; }
        .header h2 { font-size: 16px; color: #54656f; }

        .contact-list { flex: 1; overflow-y: auto; }
        
        .contact-card { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0f2f5; transition: 0.2s; height: 72px; }
        .contact-card:hover { background-color: #f5f6f6; }
        .contact-card.active { background-color: #f0f2f5; }
        
        .avatar { width: 49px; height: 49px; background: #dfe5e7; border-radius: 50%; margin-right: 15px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        
        .info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
        .row-top { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .name { font-size: 17px; color: #111b21; font-weight: 400; }
        .time { font-size: 12px; color: #667781; }
        
        .preview { font-size: 14px; color: #667781; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* --- CHAT AREA (DERECHA) --- */
        .chat-area { flex: 1; display: flex; flex-direction: column; background-color: #efeae2; background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"); position: relative; }
        
        .chat-header { height: 60px; background: #f0f2f5; padding: 0 16px; display: flex; align-items: center; border-bottom: 1px solid #d1d7db; z-index: 10; }
        .chat-header-info { display: flex; flex-direction: column; }
        .chat-header-name { font-size: 16px; color: #111b21; font-weight: 500; }
        
        .messages { flex: 1; padding: 20px 60px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
        
        /* BURBUJAS */
        .msg { max-width: 65%; padding: 6px 7px 8px 9px; border-radius: 7.5px; font-size: 14.2px; line-height: 19px; position: relative; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); margin-bottom: 8px; word-wrap: break-word; }
        
        .msg.usuario { align-self: flex-start; background: #ffffff; border-top-left-radius: 0; }
        .msg.zara { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0; }
        .msg.sistema { align-self: center; background: #fff5c4; font-size: 12.5px; text-align: center; border-radius: 8px; color: #555; box-shadow: none; max-width: 80%; }

        .msg-meta { display: flex; justify-content: flex-end; font-size: 11px; color: #667781; margin-top: 4px; margin-left: 10px; }

        /* ESTADO VACÍO */
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #667781; background: #f0f2f5; border-bottom: 6px solid #25d366; text-align: center; padding: 20px; }
        .empty-state h1 { font-weight: 300; color: #41525d; margin-bottom: 10px; }
      </style>
    </head>
    <body>

      <div id="app">
        <div class="sidebar">
          <div class="header">
            <h2>Chats Activos</h2>
          </div>
          <div class="contact-list" id="contactList"></div>
        </div>

        <div class="chat-area" id="chatWindow">
          <div class="empty-state">
            <h1>Zara Monitor Web</h1>
            <p>Selecciona un chat para ver el historial en tiempo real.</p>
          </div>
        </div>
      </div>

      <script>
        let selectedChatId = null;
        let chatData = {};

        // Función Principal: Obtener datos
        async function fetchChats() {
          try {
            const res = await fetch('/api/chats');
            chatData = await res.json();
            renderSidebar();
            if (selectedChatId) renderMessages(selectedChatId);
          } catch (e) { console.error("Error polling:", e); }
        }

        // Renderizar Lista de Contactos
        function renderSidebar() {
          const list = document.getElementById('contactList');
          // Ordenar: Los que tienen mensajes más recientes primero
          const ids = Object.keys(chatData).sort((a, b) => {
             const lastA = chatData[a].mensajes[chatData[a].mensajes.length-1].timestamp;
             const lastB = chatData[b].mensajes[chatData[b].mensajes.length-1].timestamp;
             return lastB - lastA;
          });

          let html = "";
          ids.forEach(id => {
            const chat = chatData[id];
            const lastMsg = chat.mensajes[chat.mensajes.length - 1];
            const activeClass = id === selectedChatId ? 'active' : '';
            const previewText = lastMsg.texto.length > 35 ? lastMsg.texto.substring(0, 35) + '...' : lastMsg.texto;
            const time = new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            html += \`
              <div class="contact-card \${activeClass}" onclick="selectChat('\${id}')">
                <div class="avatar" style="background-color: \${getColor(id)}">\${chat.nombre[0].toUpperCase()}</div>
                <div class="info">
                  <div class="row-top">
                    <span class="name">\${chat.nombre}</span>
                    <span class="time">\${time}</span>
                  </div>
                  <div class="preview">\${previewText}</div>
                </div>
              </div>
            \`;
          });
          
          // Solo actualizamos si hay cambios para evitar parpadeo feo, 
          // pero para simplicidad en este código reemplazamos si no estamos haciendo scroll/click activo.
          // En este monitor simple, reemplazamos el HTML interno.
          if (list.innerHTML !== html && !document.querySelector('.contact-card:active')) {
             list.innerHTML = html;
          } else if (list.innerHTML === "") {
             list.innerHTML = html; 
          }
        }

        // Seleccionar un chat
        function selectChat(id) {
          selectedChatId = id;
          renderSidebar(); // Para marcar el activo
          
          const chat = chatData[id];
          const container = document.getElementById('chatWindow');
          
          // Construir Header y Caja de Mensajes
          container.innerHTML = \`
            <div class="chat-header">
              <div class="avatar" style="width: 40px; height: 40px; background-color: \${getColor(id)}; margin-right: 15px; font-size:16px;">\${chat.nombre[0]}</div>
              <div class="chat-header-info">
                <span class="chat-header-name">\${chat.nombre}</span>
                <span style="font-size:12px; color:#667781;">\${id}</span>
              </div>
            </div>
            <div class="messages" id="msgsBox"></div>
          \`;
          
          renderMessages(id);
        }

        // Renderizar Mensajes del Chat Activo
        function renderMessages(id) {
          const box = document.getElementById('msgsBox');
          if (!box) return;

          const msgs = chatData[id].mensajes;
          let html = "";
          
          msgs.forEach(m => {
            const time = new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            // Convertir saltos de línea a <br>
            const text = m.texto.replace(/\\n/g, '<br>');
            
            html += \`
              <div class="msg \${m.tipo}">
                \${text}
                <div class="msg-meta">\${time}</div>
              </div>
            \`;
          });

          // Solo actualizamos si hay contenido nuevo
          if (box.innerHTML !== html) {
            box.innerHTML = html;
            box.scrollTop = box.scrollHeight; // Auto-scroll al final
          }
        }

        function getColor(str) {
          const colors = ['#00a884', '#34b7f1', '#655eb5', '#e542a3', '#ff8f33'];
          let hash = 0;
          for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
          return colors[Math.abs(hash) % colors.length];
        }

        // Actualizar cada 2 segundos
        setInterval(fetchChats, 2000);
        fetchChats();
      </script>
    </body>
    </html>
  `);
});

// 2. BACKEND: API de Datos
app.get("/api/chats", (req, res) => {
  res.json(chats);
});

// 3. BACKEND: Webhook (Recibir de Zara)
app.post("/webhook", (req, res) => {
  const { senderId, senderName, mensaje, tipo } = req.body;
  
  // Si es el primer mensaje de este número, creamos la entrada
  if (!chats[senderId]) {
    chats[senderId] = {
      nombre: senderName || "Desconocido",
      mensajes: []
    };
  }

  // Agregamos el mensaje al historial de ese número
  chats[senderId].mensajes.push({
    texto: mensaje,
    tipo: tipo, // 'usuario', 'zara', 'sistema'
    timestamp: Date.now()
  });

  // Limitar historial por usuario (últimos 50) para no saturar memoria
  if (chats[senderId].mensajes.length > 50) {
    chats[senderId].mensajes.shift();
  }

  console.log(`📝 [Monitor] Nuevo mensaje para ${senderId} de ${tipo}`);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`📊 Monitor WhatsApp Style (Sidebar) en puerto ${PORT}`));
