import express from "express";
import fetch from "node-fetch";
import { procesarMensaje } from "./motor_respuesta_v3.js";
import { leerMemoria, guardarMemoria } from "./memoria.js";
import { sendMessage } from "./sendMessage.js";        // ✔ FIX
import { sendInteractive } from "./sendInteractive.js"; // ✔ FIX

const app = express();
app.use(express.json());

// ======================================================
// 🔐 TOKENS
// ======================================================
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const IG_USER_ID = process.env.IG_USER_ID;

// ======================================================
// 🧩 VERIFICACIÓN DEL WEBHOOK (Meta exige esto)
// ======================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente.");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ======================================================
// 📩 PROCESAR MENSAJES DE META (WSP + IG)
// ======================================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    if (!entry) return res.sendStatus(200);

    const isIG = String(entry.id) === String(IG_USER_ID);
    const platform = isIG ? "instagram" : "whatsapp";

    console.log("\n════════════════════════════");
    console.log("📩 NUEVO MENSAJE");
    console.log("➡ Plataforma:", platform);
    console.log("════════════════════════════");

    // ======================================================
    // 📌 WhatsApp
    // ======================================================
    if (!isIG) {
      const change = entry.changes?.[0];
      const msg = change?.value?.messages?.[0];

      if (!msg) return res.sendStatus(200);

      const from = msg.from;
      const texto = msg.text?.body || "";

      console.log("👤 De:", from);
      console.log("💬 Texto:", texto);

      const memoria = leerMemoria(from);
      const respuesta = await procesarMensaje(from, texto, memoria);

      if (respuesta.estadoNuevo) guardarMemoria(from, respuesta.estadoNuevo);

      if (respuesta.tipo === "boton") {
        await sendInteractive(from, respuesta, "whatsapp");
      } else {
        await sendMessage(from, respuesta.texto, "whatsapp");
      }

      return res.sendStatus(200);
    }

    // ======================================================
    // 📌 Instagram
    // ======================================================
    const igChange = entry.changes?.[0];
    const messaging = igChange?.value?.messaging?.[0];

    if (!messaging) return res.sendStatus(200);

    const from = messaging.sender?.id;
    const texto = messaging.message?.text || "";

    console.log("👤 IG From:", from);
    console.log("💬 Texto IG:", texto);

    if (!from || !texto) return res.sendStatus(200);

    const memoria = leerMemoria(from);
    const respuesta = await procesarMensaje(from, texto, memoria);

    if (respuesta.estadoNuevo) guardarMemoria(from, respuesta.estadoNuevo);

    if (respuesta.tipo === "boton") {
      await sendInteractive(from, respuesta, "instagram");
    } else {
      await sendMessage(from, respuesta.texto, "instagram");
    }

    return res.sendStatus(200);

  } catch (e) {
    console.error("❌ ERROR GENERAL DEL WEBHOOK:", e);
    return res.sendStatus(500);
  }
});

// ======================================================
// 🚀 INICIAR SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("==============================================");
  console.log(`🚀 Zara 2.1 corriendo correctamente en puerto ${PORT}`);
  console.log("==============================================");
});
