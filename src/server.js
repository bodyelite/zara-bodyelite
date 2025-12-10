import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento, procesarReserva } from "./app.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).send("Zara Body Elite IA 5.3 Active"));

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    res.sendStatus(200);
    if (entry) procesarEvento(entry).catch(err => console.error("Meta Error:", err));
  } catch (e) { console.error(e); res.sendStatus(200); }
});

app.post("/reservowebhook", (req, res) => {
  try {
    const data = req.body;
    res.sendStatus(200);
    if (data) procesarReserva(data).catch(err => console.error("Reservo Error:", err));
  } catch (e) { console.error("Server Reservo Error:", e); res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zara Server Port ${PORT}`));
