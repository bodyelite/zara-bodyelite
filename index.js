import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import inteligencia from "./src/inteligencia.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text && message.from) {
      const texto = message.text.body.toLowerCase();
      const posible = inteligencia.analizarMensaje(texto);
      const from = message.from;

      if (posible) {
        await sendMessage(from, posible);
      } else {
        await sendMessage(from, "Hola 👋 Soy Zara IA de Body Elite. Te acompaño en tu evaluación estética gratuita 🌸 ¿Quieres conocer nuestros planes corporales o faciales? 👉 Responde 1 para corporales o 2 para faciales.");
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

async function sendMessage(to, texto) {
  try {
    const respuesta = {
      messaging_product: "whatsapp",
      to,
      text: { body: texto }
    };

    await fetch("https://graph.facebook.com/v18.0/" + process.env.PHONE_NUMBER_ID + "/messages", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.ZARA_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(respuesta)
    });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}

app.listen(3000, () => console.log("✅ Servidor Zara Body Elite en puerto 3000"));
