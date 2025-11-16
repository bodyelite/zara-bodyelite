// ============================================================
// server.js – EntryPoint Único Zara 2.1 (WhatsApp + IG Dev Mode)
// ============================================================

import express from "express";
import fetch from "node-fetch";

// Motor + Memoria
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { leerMemoria, guardarMemoria } from "./memoria.js";

// Envíos
import { sendMessage } from "./sendMessage.js";
import { sendInteractive } from "./sendInteractive.js";

const app = express();
app.use(express.json());

// ENV obligatorios
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const IG_USER_ID = process.env.IG_USER_ID;

// Tu número personal (IG modo desarrollo)
const OWNER = "+56937648536";  


// ============================================================
// VERIFICACIÓN WEBHOOK
// ============================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});


// ============================================================
// RECEPCIÓN DE MENSAJES META (WhatsApp + Instagram)
// ============================================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const changes = entry.changes?.[0];
    const value = changes?.value;

    // Determinar canal
    const isInstagram = String(entry.id) === String(IG_USER_ID);
    const platform = isInstagram ? "instagram" : "whatsapp";

    // Detectar mensaje entrante
    const msg =
      value?.messages?.[0] ||
      value?.messaging?.[0]?.message;

    if (!msg) return res.sendStatus(200);

    // Remitente
    const from = msg.from || msg.sender?.id;

    // Texto
    const text =
      msg.text?.body ||
      msg.message?.text?.body ||
      msg.message?.text ||
      msg.text ||
      "";

    console.log("\n=== MENSAJE ENTRANTE ===");
    console.log("PLATAFORMA:", platform);
    console.log("DE:", from);
    console.log("TEXTO:", text);


    // ============================================================
    // IG MODO DESARROLLO → solo responde al propietario
    // ============================================================
    if (platform === "instagram" && `+${from}` !== OWNER) {
      console.log("IG dev mode activo → mensaje ignorado.");
      return res.sendStatus(200);
    }


    // ============================================================
    // LEER MEMORIA
    // ============================================================
    const mem = leerMemoria(from);


    // ============================================================
    // PROCESAR MENSAJE (motor v3 actualizado)
    // ============================================================
    const respuesta = await procesarMensaje(from, text, mem);


    // ============================================================
    // GUARDAR MEMORIA
    // ============================================================
    if (respuesta.estadoNuevo) {
      guardarMemoria(from, respuesta.estadoNuevo);
    }


    // ============================================================
    // ENVIAR RESPUESTA
    // ============================================================
    if (respuesta.tipo === "boton") {
      console.log("→ Enviando BOTÓN interactivo…");
      await sendInteractive(from, respuesta, platform);
    } else {
      console.log("→ Enviando TEXTO…");
      await sendMessage(from, respuesta.texto, platform);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("ERROR WEBHOOK:", err);
    return res.sendStatus(500);
  }
});


// ============================================================
// INICIAR SERVIDOR
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Zara 2.1 corriendo en puerto:", PORT);
});
