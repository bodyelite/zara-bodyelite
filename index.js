import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

async function sendMessage(to, text) {
  try {
    const url = "https://graph.facebook.com/v18.0/" + PHONE_NUMBER_ID + "/messages";
    const headers = {
      "Authorization": "Bearer " + PAGE_ACCESS_TOKEN,
      "Content-Type": "application/json"
    };
    const body = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    };
    const res = await axios.post(url, body, { headers });
    console.log("Mensaje enviado correctamente:", res.data);
  } catch (err) {
    console.error("Error al enviar mensaje:", err.response?.data || err.message);
  }
}

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body?.toLowerCase();

    if (from && text) {
      console.log("Mensaje recibido:", text);
      let respuesta = "No entendi tu mensaje. Por favor reformulalo.";

      if (text.includes("hola")) {
        respuesta = "Hola, soy Zara IA de Body Elite. Te acompano en tu evaluacion gratuita. Escribe 1 para planes corporales o 2 para faciales.";
      } else if (text === "1") {
        respuesta = "Planes corporales: Lipo Body Elite, Body Fitness, Push Up, Body Tensor. Incluyen HIFU, EMS y Radiofrecuencia.";
      } else if (text === "2") {
        respuesta = "Planes faciales: Face Smart, Face Antiage, Face Elite. Incluyen Pink Glow, LED Therapy y Radiofrecuencia facial.";
      } else if (text.includes("precio")) {
        respuesta = "Lipo Body Elite 664000 CLP. Face Elite 358400 CLP. Agenda gratis aqui: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";
      }

      await sendMessage(from, respuesta);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Error procesando mensaje:", err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});

