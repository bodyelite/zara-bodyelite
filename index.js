import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// --- IG WEBHOOK VERIFY ---
app.get("/ig/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ IG Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verificación fallida");
    res.sendStatus(403);
  }
});

// --- IG MENSAJES ---
app.post("/ig/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    if (changes?.value?.messages) {
      const msg = changes.value.messages[0];
      const from = msg.from;
      const text = msg.text?.body || "";
      console.log("📩 Mensaje IG recibido:", text, "de", from);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error procesando webhook IG:", e);
    res.sendStatus(500);
  }
});

// --- INICIO ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Zara 2.1 corriendo en puerto ${PORT}`);
});

export default app;
