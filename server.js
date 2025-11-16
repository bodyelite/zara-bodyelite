// ============================================================
// server.js – Zara 2.1 (final y estable)
// Compatible con motor_respuesta_v3.js (que devuelve OBJETOS)
// WhatsApp + Instagram – Meta Graph v19.0
// ============================================================

import express from "express";
import fetch from "node-fetch";

import { procesarMensaje } from "./motor_respuesta_v3.js";
import { leerMemoria, guardarMemoria } from "./memoria.js";
import { sendMessage } from "./sendMessage.js";
import { sendInteractive } from "./sendInteractive.js";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const IG_USER_ID = process.env.IG_USER_ID;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

function normalizarTexto(msg) {
  let text = "";

  try {
    if (msg.text?.body) text = msg.text.body;
    else if (msg.message?.text?.body) text = msg.message.text.body;
    else if (msg.message?.text) text = msg.message.text;
    else if (msg.message?.body) text = msg.message.body;
    else if (msg.body) text = msg.body;
    else text = "";

    text = String(text || "").trim();
  } catch {
    text = "";
  }

  return text;
}

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const changes = entry.changes?.[0];
    const data = changes?.value;

    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    const msg = data?.messages?.[0] ||
                data?.messaging?.[0]?.message;

    if (!msg) return res.sendStatus(200);

    const from = msg.from || msg.sender?.id;
    const text = normalizarTexto(msg);

    console.log("\n=== MENSAJE ENTRANTE ===");
    console.log("PLATAFORMA:", platform);
    console.log("DE:", from);
    console.log("TEXTO:", text);

    const memoriaUsuario = leerMemoria(from);
    const respuesta = await procesarMensaje(from, text, memoriaUsuario);

    console.log("→ Respuesta del motor:", respuesta);

    if (!respuesta || typeof respuesta !== "object") {
      console.error("Respuesta inválida del motor:", respuesta);
      return res.sendStatus(200);
    }

    if (respuesta.estadoNuevo) guardarMemoria(from, respuesta.estadoNuevo);

    if (respuesta.tipo === "boton") {
      await sendInteractive(from, respuesta, platform);
    } else {
      await sendMessage(from, respuesta.texto, platform);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("ERROR WEBHOOK:", err);
    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Zara corriendo en puerto:", PORT);
});
