import express from "express";
import bodyParser from "body-parser";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { sendMessage } from "./sendMessage.js";

const app = express();
app.use(bodyParser.json());

/* ============================================================
   VERIFICACIÓN WEBHOOK META
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

    let texto = null;

    // WhatsApp formato estándar
    if (msg?.text?.body) texto = msg.text.body;

    // Fallback (algunos mensajes de plantillas entran diferente)
    if (!texto && msg?.message?.text?.body) texto = msg.message.text.body;

    const usuario = msg?.from || null;

    if (!texto) {
      console.log("No se encontró texto válido:", JSON.stringify(msg));
      return res.sendStatus(200);
    }

    if (!usuario) {
      console.log("No se encontró número FROM:", JSON.stringify(msg));
      return res.sendStatus(200);
    }

    console.log("📩 MENSAJE RECIBIDO:", texto);
    console.log("📞 NÚMERO:", usuario);

    /* Ejecutar motor Zara */
    const respuesta = await procesarMensaje(usuario, texto);
    console.log("🤖 RESPUESTA GENERADA:", respuesta);

    // Validar respuesta
    if (!respuesta || typeof respuesta !== "string") {
      console.log("⚠️ Respuesta inválida generada por el motor:", respuesta);
      return res.sendStatus(200);
    }

    /* Enviar respuesta a WhatsApp */
    await sendMessage(usuario, respuesta);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ ERROR EN WEBHOOK:", err);
    return res.sendStatus(500);
  }
});

/* ============================================================
   LEVANTAR SERVIDOR
   ============================================================ */
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Zara JC Premium corriendo en puerto", process.env.PORT || 3000);
});
