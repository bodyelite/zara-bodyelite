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
<style>body{background:#000;color:#fff;font-family:sans-serif}</style></head>
<body><h1>ZARA MONITOR ACTIVO</h1><p>Si ves esto, el server está vivo.</p></body></html>
`;

app.get("/monitor", (req, res) => res.send(MONITOR_HTML)); // TEST RUTA
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
app.listen(PORT, () => console.log(`🟢 ZARA 6.0 LIVE ${PORT}`));
