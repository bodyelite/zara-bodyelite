import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import procesarMensaje from "./memoria.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let contextoPrevio = {};
let nombresUsuarios = {};

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (message && message.text && message.from) {
      const phone = message.from;
      const texto = message.text.body.toLowerCase().trim();
      console.log("📩 Mensaje recibido:", texto);

      // Detectar nombre si el usuario lo menciona
      if (texto.startsWith("soy ") || texto.startsWith("me llamo ")) {
        const nombre = texto.replace("soy", "").replace("me llamo", "").trim();
        nombresUsuarios[phone] = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        await enviarMensaje(phone, `Encantada, ${nombresUsuarios[phone]} 🌸 ¿Qué zona de tu cuerpo te gustaría trabajar?`);
        return res.sendStatus(200);
      }

      const anterior = contextoPrevio[phone] || null;
      const respuesta = procesarMensaje(texto, anterior, nombresUsuarios[phone]);
      contextoPrevio[phone] = texto;

      const mensajeEnviar =
        respuesta && respuesta.trim() !== ""
          ? respuesta
          : "💬 No logré entenderte bien, pero nuestras profesionales podrán orientarte con una evaluación gratuita asistida con IA. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

      await enviarMensaje(phone, mensajeEnviar);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error general en webhook:", error);
    res.sendStatus(500);
  }
});

async function enviarMensaje(to, text) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
  };
  const body = {
    messaging_product: "whatsapp",
    to,
    text: { body: text },
  };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ Error API WhatsApp:", errorData);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Zara v27_clinical ejecutándose en puerto ${PORT}`);
  console.log("🤖 Asistente IA lista para responder clínicamente con empatía.");
});
