import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());

// Memoria: Guardamos los últimos 50 eventos
const historial = [];

app.get("/", (req, res) => {
  const html = `
    <html>
      <head>
        <title>Monitor Zara - Vista WhatsApp</title>
        <meta http-equiv="refresh" content="5">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            background-color: #EFEAE2; /* Fondo Beige WhatsApp */
            background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"); /* Trama opcional */
            background-blend-mode: overlay;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0; padding: 20px;
          }
          .container { 
            max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 8px; 
            background-color: transparent;
          }
          h1 { 
            text-align: center; color: #555; font-size: 1.2rem; margin-bottom: 20px; 
            background: white; padding: 10px; border-radius: 20px; width: fit-content; margin: 0 auto 20px auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          /* FILAS */
          .row { display: flex; width: 100%; margin-bottom: 2px; }
          
          /* BURBUJA GENERAL */
          .bubble {
            padding: 6px 7px 8px 9px;
            border-radius: 7.5px;
            max-width: 65%;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
            font-size: 14.2px;
            line-height: 19px;
            position: relative;
            word-wrap: break-word;
          }
          
          .meta {
            font-size: 11px;
            margin-bottom: 2px;
            display: block;
            font-weight: 500;
            opacity: 0.6;
          }

          /* --- ESTILOS DE CHAT --- */
          
          /* CLIENTE (Blanco, Izquierda) */
          .row.usuario { justify-content: flex-start; }
          .row.usuario .bubble { 
            background-color: #FFFFFF; 
            color: #111;
            border-top-left-radius: 0;
          }
          .row.usuario .meta { color: #1f7cff; } /* Nombre en azulito */

          /* ZARA (Verde Claro, Derecha) */
          .row.zara { justify-content: flex-end; }
          .row.zara .bubble { 
            background-color: #D9FDD3; /* Verde WhatsApp exacto */
            color: #111;
            border-top-right-radius: 0;
          }
          .row.zara .meta { text-align: right; color: #008000; }

          /* SISTEMA (Amarillo, Centro - Alertas) */
          .row.sistema { justify-content: center; margin: 10px 0; }
          .row.sistema .bubble { 
            background-color: #FFF5C4; 
            font-size: 12.5px; 
            text-align: center;
            border-radius: 8px;
            color: #555;
            max-width: 90%;
            box-shadow: none;
            border: 1px solid #e0c880;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>👁️ Monitor En Vivo</h1>
          
          ${historial.map(log => `
            <div class="row ${log.tipo}">
              <div class="bubble">
                <span class="meta">${log.senderName || 'Desconocido'} • ${log.fecha.split(',')[1]}</span>
                ${log.mensaje.replace(/\n/g, '<br>')}
              </div>
            </div>
          `).join('')}
          
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

app.post("/webhook", (req, res) => {
  const { fecha, senderId, senderName, mensaje, tipo } = req.body;
  
  // Guardamos al principio (Lo nuevo arriba)
  historial.unshift({ fecha, senderId, senderName, mensaje, tipo });
  
  if (historial.length > 50) historial.pop();

  // Logs técnicos en consola
  if (tipo === "sistema") console.log(`🚨 [SISTEMA] ${mensaje}`);
  else if (tipo === "usuario") console.log(`👤 [CLIENTE] ${senderName}: ${mensaje}`);
  else console.log(`🤖 [ZARA] Respondió a ${senderId}`);
  
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`📊 Monitor WhatsApp Visual escuchando en puerto ${PORT}`));
