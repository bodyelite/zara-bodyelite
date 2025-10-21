import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import intents from "./intents.js";

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body?.toLowerCase().trim();
    if (!text) return res.sendStatus(200);

    console.log("📩 Mensaje recibido:", text);

    // --- RECONOCIMIENTO AVANZADO ---
    const clean = (s) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .trim();

    const userText = clean(text);
    let bestMatch = null;
    let bestScore = 0;

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const candidate = clean(pattern);
        const words = candidate.split(" ");
        const hits = words.filter((w) => userText.includes(w)).length;
        const score = hits / words.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = intent;
        }
      }
    }

    let responseText;
    if (bestMatch && bestScore >= 0.4) {
      console.log(`🎯 Intención detectada (${bestScore.toFixed(2)}): ${bestMatch.tag}`);
      responseText = bestMatch.response;
    } else {
      console.log(`❌ Frase desconocida: ${text}`);
      responseText =
        "No entendí tu mensaje. Escribe *hola* para comenzar o indica si te interesa un tratamiento *facial* o *corporal* 🌸";
    }

    const token = process.env.PAGE_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: responseText },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Respuesta enviada a", from);
    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Error:", e.response?.data || e.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
