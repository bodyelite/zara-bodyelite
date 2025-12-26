import express from "express";
import bodyParser from "body-parser";
import { procesarEvento, procesarReserva, getSesiones } from "./app.js"; 
import { conectarCliente } from "./utils/stream.js";

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(bodyParser.json());

const MONITOR_HTML = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ZARA MONITOR</title>
<style>
body{background:#0a0a0a;color:#fff;font-family:sans-serif;margin:0;display:flex;height:100vh}
#feed{flex:1;padding:20px;overflow-y:auto} .msg{padding:10px;margin:5px;background:#222;border-radius:5px}
</style></head>
<body><div id="feed"><h1>MONITOR ACTIVO 🟢</h1>Esperando mensajes...</div>
<script>
const feed=document.getElementById('feed');
const evt=new EventSource("/monitor-stream");
evt.onmessage=e=>{
    const d=JSON.parse(e.data);
    const div=document.createElement('div');
    div.className='msg';
    div.innerHTML=\`<b>\${d.nombre}:</b> \${d.mensaje||d.texto}\`;
    feed.prepend(div);
};
</script></body></html>
`;

app.get("/monitor", (req, res) => res.send(MONITOR_HTML));
app.get("/api/history", (req, res) => res.json(getSesiones()));
app.get("/monitor-stream", (req, res) => conectarCliente(req, res));
app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === VERIFY_TOKEN) res.send(req.query["hub.challenge"]);
  else res.sendStatus(403);
});
app.post("/webhook", async (req, res) => {
  try { await procesarEvento(req.body.entry?.[0]); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});
app.post("/reservo-webhook", async (req, res) => {
  try { await procesarReserva(req.body); res.sendStatus(200); } catch (e) { res.sendStatus(500); }
});

app.listen(PORT, () => {
    console.log(`🟢 ZARA 6.0 LIVE en puerto ${PORT}`);
    console.log(`📊 MONITOR: https://zara-bodyelite-1.onrender.com/monitor`);
});
