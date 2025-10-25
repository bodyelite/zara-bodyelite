import express from "express";
import bodyParser from "body-parser";
import { responderZara } from "./zara_core.js";
import { registrarDesdeWebhook } from "../registrarRemitente.js";

const router = express.Router();
router.use(bodyParser.json());

// Endpoint de recepción de mensajes reales desde Meta (Webhook)
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return res.sendStatus(200);

    const phone = entry.from; // número real del remitente
    const texto = entry.text?.body || "";
    const canal = "WSP";

    const respuesta = responderZara(texto, canal);

    registrarDesdeWebhook({
      channel: "whatsapp",
      from: phone,
      text: { body: texto },
      respuesta
    });

    console.log(`💬 Mensaje real recibido de ${phone}: ${texto}`);
    console.log(`🤖 Respuesta generada: ${respuesta}`);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando webhook:", err.message);
    res.sendStatus(500);
  }
});

export default router;
