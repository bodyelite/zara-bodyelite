import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import procesarMensaje from "./memoria.js";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* === WEBHOOK WHATSAPP CLOUD API === */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages && messages[0]) {
      const mensaje = messages[0].text?.body || "";
      const from = messages[0].from;
      const respuesta = await procesarMensaje(mensaje);
      await fetch(`https://graph.facebook.com/v19.0/${process.env.PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.ZARA_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: respuesta }
        })
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook WhatsApp:", e);
    res.sendStatus(500);
  }
});

/* === VERIFICACIÓN META === */
app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN || "ZARA_TOKEN";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

/* === WEBHOOK INSTAGRAM DM === */
app.post("/igwebhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const sender = messaging?.sender?.id;
    const mensaje = messaging?.message?.text || "";
    if (mensaje && sender) {
      const respuesta = await procesarMensaje(mensaje);
      await fetch(`https://graph.facebook.com/v19.0/${sender}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.ZARA_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_type: "RESPONSE",
          recipient: { id: sender },
          message: { text: respuesta }
        })
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook Instagram:", e);
    res.sendStatus(500);
  }
});

/* === LOGS === */
app.get("/logs", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "logs_wsp.json"), "utf8");
    res.type("text").send(data);
  } catch {
    res.type("text").send("Sin registros");
  }
});

/* === SERVIDOR === */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Zara 2.1 operativo en puerto ${PORT}`));
