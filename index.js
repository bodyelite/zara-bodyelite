import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

// ===== PANEL DE CONTROL =====
app.get("/panel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Zara Body Elite - Panel</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f7f9fc; color: #222; padding: 40px; }
          h1 { color: #004aad; }
          p { font-size: 15px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Zara Body Elite activa y funcionando ✅</h1>
        <p>El panel de control se conectó correctamente al servidor.</p>
      </body>
    </html>
  `);
});

// ===== SERVIDOR PRINCIPAL =====
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Zara corriendo en puerto ${PORT}`);
  console.log(`✅ Panel disponible en /panel`);
});
