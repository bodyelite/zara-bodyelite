import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());

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
          const r = await fetch('https://zara-bodyelite-1.onrender.com/logs');
          const texto = await r.text();
          const limpio = texto.replace(/^Impresión con formato estilístico/, '').trim();
          const data = JSON.parse(limpio);
          const cont = document.getElementById('wsp');
          cont.innerHTML = '';
          data.forEach(l=>{
            const fecha = l.timestamp || l.fecha || new Date().toISOString();
            const usuario = l.usuario || l.from || 'sin usuario';
            const mensaje = l.mensaje || l.texto || '';
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Monitor Zara 2.1 conectado a logs en tiempo real de BodyElite"));
