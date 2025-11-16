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

/* ============================================================
   WEBHOOK VERIFICATION
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
   HANDLE MESSAGES
============================================================ */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const changes = entry.changes?.[0];
    const data = changes?.value;

    // DETECTAR CANAL
    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    // MENSAJE ENTRANTE
    const msg =
      data?.messages?.[0] ||
      data?.messaging?.[0]?.message;

    if (!msg) return res.sendStatus(200);

    const from = msg.from || msg.sender?.id;
    const text =
      msg.text?.body ||
      msg.message?.text ||
      msg.message?.text?.body ||
      "";

    console.log("\n=== MENSAJE ENTRANTE ===");
    console.log("PLATAFORMA:", platform);
    console.log("DE:", from);
    console.log("TEXTO:", text);

    // LEER MEMORIA ACTUAL
    const memoriaUsuario = leerMemoria(from);

    // PROCESAR MENSAJE (MOTOR v3 devuelve OBJETO)
    const respuesta = await procesarMensaje(from, text, memoriaUsuario);

    console.log("→ Respuesta del motor:", respuesta);

    if (!respuesta || typeof respuesta !== "object") {
      console.error("Respuesta inválida del motor:", respuesta);
      return res.sendStatus(200);
    }

    // GUARDAR MEMORIA
    if (respuesta.estadoNuevo) guardarMemoria(from, respuesta.estadoNuevo);

    // ENVIAR RESPUESTA
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

/* ============================================================
   START SERVER
============================================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Zara corriendo en puerto:", PORT);
});
