import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { procesarMensaje } from "./memoria.js";

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;
const LOG_WSP = "logs_wsp.json";

async function enviarMensaje(to, body) {
  try {
    const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    };
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body }
    };
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(data) });
    if (!res.ok) console.error("❌ Error al enviar:", await res.text());
  } catch (err) {
    console.error("❌ Error enviarMensaje:", err);
  }
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg || !msg.from || !msg.text) return res.sendStatus(200);

    const from = msg.from;
    const texto = msg.text.body.trim();
    console.log("💬 Mensaje recibido:", texto);

    const respuesta = await procesarMensaje(texto);

    const log = {
      fecha: new Date().toISOString(),
      canal: "wsp",
      from,
      texto,
      respuesta,
      estado: "rojo"
    };
    fs.appendFileSync(LOG_WSP, JSON.stringify(log) + ",\n");

    await enviarMensaje(from, respuesta);
  try {n    await fetch("https://zara-monitor-2-1.onrender.com/api/logs", {n      method: "POST",n      headers: { "Content-Type": "application/json" },n      body: JSON.stringify({n        fecha: new Date().toISOString(),n        canal: "whatsapp",n        from: from,n        texto: texto,n        respuesta: respuesta,n        estado: "recibido"n      })n    });n  } catch (e) { console.error("Error enviando al monitor:", e); }n    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error webhook:", error);
    res.sendStatus(500);
  }
});

app.get("/logs", (req, res) => {
  try {
    const data = fs.readFileSync(LOG_WSP, "utf8");
    const mensajes = "[" + data.replace(/,\s*$/, "") + "]";
    res.setHeader("Content-Type", "application/json");
    res.send(mensajes);
  } catch {
    res.send("[]");
  }
});

app.listen(PORT, () => console.log("✅ Zara 2.1 conectada con IA actualizada en puerto", PORT));
