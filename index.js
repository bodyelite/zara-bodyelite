import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { getResponse } from "./responses.js";
import { saveConversation } from "./conversations.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "zara_bodyelite_verify";
const PORT = process.env.PORT || 10000;

// --- Verificación Webhook ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Recepción de mensajes ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const phone_number_id = changes?.value?.metadata?.phone_number_id;

      if (message && phone_number_id) {
        const from = message.from;
        const text = message.text?.body?.toLowerCase() || "";

        console.log(`💬 Mensaje recibido: "${text}" de ${from}`);

        const reply = getResponse(text);
        saveConversation(from, text, reply);

        const url = `https://graph.facebook.com/v17.0/${phone_number_id}/messages`;
        const data = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: reply },
        };

        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(data),
        });
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error al procesar mensaje:", error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Zara bot corriendo correctamente en puerto ${PORT}`);
});
