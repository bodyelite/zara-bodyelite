import express from "express";
import fetch from "node-fetch";

import { procesarMensaje } from "./motor_respuesta_v3.js";
import { leerMemoria, guardarMemoria } from "./memoria.js";
import { sendMessage } from "./sendMessage.js";
import { sendInteractive } from "./sendInteractive.js";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

// --------------------------------------
// VERIFICACIÓN WEBHOOK
// --------------------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// --------------------------------------
// NORMALIZAR TEXTO
// --------------------------------------
function extraerTexto(msg) {
  try {
    return (
      msg.text?.body ||
      msg.message?.text?.body ||
      msg.message?.text ||
      msg.message?.body ||
      msg.body ||
      ""
    ).toString().trim();
  } catch {
    return "";
  }
}

// --------------------------------------
// MANEJO DE MENSAJES
// --------------------------------------
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    const msg =
      entry.changes?.[0]?.value?.messages?.[0] ||
      entry.changes?.[0]?.value?.messaging?.[0]?.message;

    if (!msg) return res.sendStatus(200);

    const from = msg.from || msg.sender?.id;
    const texto = extraerTexto(msg);
    const memoria = leerMemoria(from);

    const respuesta = await procesarMensaje(from, texto, memoria);

    if (respuesta.estadoNuevo) guardarMemoria(from, respuesta.estadoNuevo);

    if (respuesta.tipo === "boton") {
      await sendInteractive(from, respuesta, platform);
    } else {
      await sendMessage(from, respuesta.texto, platform);
    }

    return res.sendStatus(200);
  } catch (e) {
    console.error("ERROR WEBHOOK:", e);
    return res.sendStatus(500);
  }
});

// --------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Zara lista en puerto:", PORT));
