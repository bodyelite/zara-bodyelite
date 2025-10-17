import express from "express";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ Zara Body Elite activa y funcionando");
});

// Ruta /panel
app.get("/panel", (req, res) => {
  try {
    const filePath = "./conversaciones.json";
    if (!fs.existsSync(filePath)) {
      return res.send("<h2>No hay conversaciones registradas aún.</h2>");
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Panel Zara Body Elite</title>
      <style>
        body {font-family: Arial; background: #fafafa; padding: 20px;}
        h1 {color: #003366;}
        .msg {background: #fff; margin: 10px 0; padding: 10px; border-radius: 6px; box-shadow: 0 0 4px #ccc;}
        .numero {font-weight: bold;}
        .fecha {font-size: 12px; color: #888;}
      </style>
    </head>
    <body>
      <h1>Conversaciones Zara Body Elite</h1>
      ${data.map(m => `
        <div class="msg">
          <div class="numero">${m.numero}</div>
          <div>${m.mensaje}</div>
          <div class="fecha">${m.fecha}</div>
        </div>
      `).join("")}
    </body>
    </html>`;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error leyendo conversaciones: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zara corriendo en puerto ${PORT}`);
});
