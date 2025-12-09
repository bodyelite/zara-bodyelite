import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());

// Ruta para ver si está vivo
app.get("/", (req, res) => {
  res.send("🟢 Monitor de Zara Activo");
});

// Webhook que recibe los reportes de Zara
app.post("/webhook", (req, res) => {
  const { fecha, senderId, senderName, mensaje, tipo } = req.body;
  
  // Imprimir en el Log de Render (Esto es lo que verás en la pantalla negra)
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
app.listen(PORT, () => console.log(`📊 Monitor escuchando en puerto ${PORT}`));
