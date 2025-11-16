import express from "express";
import fetch from "node-fetch";

import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const IG_USER_ID = process.env.IG_USER_ID;

/* ============================================================
   VERIFICACIÓN WEBHOOK
============================================================ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* ============================================================
   RECEPCIÓN DE MENSAJES
============================================================ */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const changes = entry.changes?.[0];
    const webhook = changes?.value;

    // Detectar canal según ID de la entrada
    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    // Mensaje entrante (WhatsApp / IG)
    const msgObj =
      webhook?.messages?.[0] ||
      webhook?.messaging?.[0]?.message;

    if (!msgObj) return res.sendStatus(200);

    const from = msgObj.from || msgObj.sender?.id;
    const text =
      msgObj.text?.body ||
      msgObj.message?.text ||
      msgObj.message?.text?.body ||
      "";

    console.log("\n=== MENSAJE ENTRANTE ===");
    console.log("PLATAFORMA:", platform);
    console.log("DE:", from);
    console.log("TEXTO:", text);

    // El motor v3 maneja la memoria internamente y devuelve un STRING
    const respuesta = await procesarMensaje(from, text);

    if (!respuesta || typeof respuesta !== "string") {
      console.error("Respuesta inválida del motor:", respuesta);
      return res.sendStatus(200);
    }

    console.log("→ Enviando TEXTO…");
    await sendMessage(from, respuesta);

    return res.sendStatus(200);
  } catch (err) {
    console.error("ERROR WEBHOOK:", err);
    return res.sendStatus(500);
  }
});

/* ============================================================
   INICIO SERVIDOR
============================================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Zara corriendo en puerto:", PORT);
});
