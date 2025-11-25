import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { procesarEvento } from "./app.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  if (req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else { res.sendStatus(403); }
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (entry) await procesarEvento(entry);
    res.sendStatus(200);
  } catch (e) { console.error(e); res.sendStatus(500); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Zara activa en puerto ${PORT}`));
