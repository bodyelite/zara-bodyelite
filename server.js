import express from "express";
import bodyParser from "body-parser";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";

const app = express();
app.use(bodyParser.json());

/* ============================================================
   VERIFICACIÓN WEBHOOK (META)
   ============================================================ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* ============================================================
   RECEPCIÓN DE MENSAJES
   Compatibilidad con formato clásico y nuevo de WhatsApp
   ============================================================ */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const msg = value?.messages?.[0];

    if (!msg) {
      console.log("No hay msg en el webhook.");
      return res.sendStatus(200);
    }

    // EXTRAER TEXTO (COMPATIBLE CON AMBOS FORMATOS)
    let texto = null;

    // Formato clásico
    if (msg?.text?.body) {
      texto = msg.text.body;
    }

    // Formato nuevo (message.text.body)
    if (!texto && msg?.message?.text?.body) {
      texto = msg.message.text.body;
    }

    // EXTRAER NÚMERO
    const usuario = msg?.from || null;

    if (!texto) {
      console.log("No se encontró texto válido en el mensaje:", JSON.stringify(msg));
      return res.sendStatus(200);
    }

    if (!usuario) {
      console.log("No se encontró número FROM:", JSON.stringify(msg));
      return res.sendStatus(200);
    }

    console.log("Mensaje recibido:", texto);
    console.log("Número:", usuario);

    // PROCESAR MENSAJE CON EL MOTOR
    const respuesta = await procesarMensaje(usuario, texto);
    console.log("Respuesta generada:", respuesta);

    if (!respuesta || typeof respuesta !== "string") {
      console.log("Respuesta inválida generada por el motor:", respuesta);
      return res.sendStatus(200);
    }

    // ENVIAR MENSAJE HACIA WHATSAPP
    await sendMessage(usuario, respuesta, "whatsapp");

    return res.sendStatus(200);

  } catch (err) {
    console.error("Error en webhook:", err);
    return res.sendStatus(500);
  }
});

/* ============================================================
   SERVIDOR ACTIVO
   ============================================================ */
app.listen(process.env.PORT || 3000, () => {
  console.log("Zara 3.0 corriendo en puerto", process.env.PORT || 3000);
});
//touch # para asegurar que git detecte el cambio
