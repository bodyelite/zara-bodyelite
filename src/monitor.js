import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());

// Memoria temporal para guardar los últimos 50 mensajes
const historial = [];

// RUTA VISUAL (La página web)
app.get("/", (req, res) => {
  const html = `
    <html>
      <head>
        <title>Monitor Zara 5.0</title>
        <meta http-equiv="refresh" content="5"> <style>
          body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          h1 { text-align: center; color: #333; }
          .card { border-bottom: 1px solid #eee; padding: 10px 0; }
          .meta { font-size: 0.8em; color: #888; margin-bottom: 5px; }
          .mensaje { padding: 10px; border-radius: 8px; display: inline-block; max-width: 80%;"> }
          
          .usuario { text-align: left; }
          .usuario .mensaje { background: #e1ffc7; color: #000; }
          
          .zara { text-align: right; }
          .zara .mensaje { background: #d9fdd3; border: 1px solid #25d366; color: #000; }
          
          .sistema { text-align: center; font-style: italic; color: #555; }
          .sistema .mensaje { background: #ffe4ba; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>👁️ Monitor de Zara (En Vivo)</h1>
          <p style="text-align:center">Mostrando los últimos ${historial.length} eventos</p>
          <hr>
          ${historial.map(log => `
            <div class="card ${log.tipo}">
              <div class="meta">${log.fecha} - ${log.senderName} (${log.senderId})</div>
              <div class="mensaje">${log.mensaje}</div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

// RUTA WEBHOOK (Recibe los datos)
app.post("/webhook", (req, res) => {
  const { fecha, senderId, senderName, mensaje, tipo } = req.body;
  
  // 1. Guardar en memoria para la web (ponemos el nuevo al principio)
  historial.unshift({ fecha, senderId, senderName, mensaje, tipo });
  
  // Limitar a 50 mensajes para no llenar la memoria
  if (historial.length > 50) historial.pop();

  // 2. Imprimir en consola (para los logs negros de Render)
  if (tipo === "sistema") {
      console.log(`🚨 [SISTEMA] ${mensaje}`);
  } else if (tipo === "usuario") {
      console.log(`👤 [CLIENTE] ${senderName} (${senderId}): ${mensaje}`);
  } else {
      console.log(`🤖 [ZARA] Le dijo a ${senderId}: ${mensaje}`);
  }
  
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`📊 Monitor Visual escuchando en puerto ${PORT}`));
