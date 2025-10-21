import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import memoria from "./memoria.js";

const app = express();
app.use(bodyParser.json());

// --- Verificación de webhook Meta ---
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  if (req.query["hub.verify_token"] === verifyToken)
    return res.status(200).send(req.query["hub.challenge"]);
  res.sendStatus(403);
});

// --- Recepción y procesamiento de mensajes ---
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry || !entry.from || !entry.text?.body) return res.sendStatus(200);

    const from = entry.from;
    const textoUsuario = entry.text.body.toLowerCase().trim();
    console.log("📩 Mensaje recibido:", textoUsuario);

    // Procesa el mensaje con el módulo de memoria (inteligencia)
    const respuesta = await memoria.buscarRespuesta(textoUsuario);

    const token = process.env.PAGE_ACCESS_TOKEN;
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: respuesta },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Respuesta enviada a", from);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
