import express from "express";
import fetch from "node-fetch";

// Importar motor y memoria
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { guardarMemoria, leerMemoria } from "./memoria.js";

// Envíos
import { sendMessage } from "./sendMessage.js";
import { sendInteractive } from "./sendInteractive.js";

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

    // Detectar canal
    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    // Detectar mensaje entrante
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

    /* ============================================================
       1) LEER MEMORIA DEL CONTACTO
    ============================================================ */
    const memoriaUsuario = leerMemoria(from);

    /* ============================================================
       2) PROCESAR MENSAJE (motor_respuesta_v3)
    ============================================================ */
    const respuesta = await procesarMensaje(text, memoriaUsuario);

    /* Respuesta esperada del motor:
       {
         texto: "...",
         tipo: "texto" | "boton",
         intentosAgenda: 1 | 2 | 3 | 4,
         urlAgenda: "https://agendamiento.reservo.cl/...",
       }
    */

    /* ============================================================
       3) GUARDAR NUEVO ESTADO EN MEMORIA
    ============================================================ */
    guardarMemoria(from, respuesta.estadoNuevo);

    /* ============================================================
       4) ENVIAR RESPUESTA
    ============================================================ */
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

/* ============================================================
   INICIO SERVIDOR
============================================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Zara corriendo en puerto:", PORT);
});
