import express from "express";
const router = express.Router();

// --- Verificación del webhook IG ---
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook Instagram verificado");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Fallo de verificación IG");
    return res.sendStatus(403);
  }
});

// --- Recepción de mensajes IG ---
router.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Evento recibido IG:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (e) {
    console.error("Error procesando evento IG:", e);
    res.sendStatus(500);
  }
});

export default router;
