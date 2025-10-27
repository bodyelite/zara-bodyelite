import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_FILE = path.join(__dirname, "logs_wsp.json");

// --- API para recibir los logs desde Zara ---
app.post("/api/logs", (req, res) => {
  const data = req.body;
  let logs = [];
  if (fs.existsSync(LOGS_FILE)) {
    try { logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8")); } catch { logs = []; }
  }
  logs.unshift(data);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 200), null, 2));
  res.json({ status: "ok" });
});

// --- API para entregar logs al navegador ---
app.get("/logs", (req, res) => {
  if (!fs.existsSync(LOGS_FILE)) return res.json([]);
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"));
  res.json(logs);
});

// --- Interfaz visual ---
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Monitor Zara 2.1</title>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial; margin:0; background:#e0d5ca; }
      header { background:#036b63; color:white; padding:10px; font-weight:bold; display:flex; justify-content:space-around; }
      section { display:grid; grid-template-columns:1fr 1fr 1fr; height:90vh; }
      .panel { padding:10px; overflow:auto; }
      .msg { background:white; border-radius:10px; padding:10px; margin-bottom:8px; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
      .msg small { color:gray; font-size:11px; }
    </style>
    <script>
      async function cargar(){
        try {
          const r = await fetch('/logs');
          const data = await r.json();
          const cont = document.getElementById('wsp');
          cont.innerHTML = '';
          data.forEach(l=>{
            const fecha = l.fecha || new Date().toISOString();
            const usuario = l.from || 'sin usuario';
            const mensaje = l.texto || '';
            const resp = l.respuesta || '';
            const div = document.createElement('div');
            div.className = 'msg';
            div.innerHTML = '<small>' + new Date(fecha).toLocaleString() + ' · ' + usuario + '</small><br><b>' + mensaje + '</b><br>' + resp;
            cont.appendChild(div);
          });
        } catch(e){ console.error(e); }
      }
      setInterval(cargar,4000);
      window.onload=cargar;
    </script>
  </head>
  <body>
    <header>
      <div>WhatsApp</div>
      <div>Instagram</div>
      <div>Dashboard</div>
    </header>
    <section>
      <div class="panel" id="wsp"></div>
      <div class="panel" id="ig"><i>Próximamente</i></div>
      <div class="panel" id="dash"><i>Próximamente</i></div>
    </section>
  </body>
  </html>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("✅ Monitor Zara 2.1 escuchando en puerto", PORT));
