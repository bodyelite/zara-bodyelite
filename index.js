import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const token = process.env.PAGE_ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
    const data = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message }
    };
    const response = await axios.post(url, data, { headers });
    console.log("Mensaje enviado:", response.data);
  } catch (error) {
    console.error("Error al enviar mensaje:", error.response?.data || error.message);
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
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body?.toLowerCase();

      if (from && text) {
        console.log("Mensaje recibido:", text);
        let respuesta = "No entendí tu mensaje 🤖. ¿Podrías reformularlo?";

        if (text.includes("hola")) {
          respuesta = "Hola 👋 Soy Zara IA de Body Elite.
Te acompaño en tu evaluación estética gratuita 🌸
¿Quieres conocer nuestros planes corporales o faciales?
👉 Responde 1 para corporales o 2 para faciales.";
        } else if (text === "1") {
          respuesta = "✨ Planes Corporales Body Elite ✨
Lipo Body Elite • Body Fitness • Push Up • Body Tensor.
Incluyen HIFU, EMS y Radiofrecuencia.
¿Deseas conocer precios o agendar?";
        } else if (text === "2") {
          respuesta = "🌸 Planes Faciales Body Elite 🌸
Face Smart • Face Antiage • Face Elite.
Incluyen Pink Glow, LED Therapy y Radiofrecuencia.
¿Deseas conocer precios o agendar?";
        } else if (text.includes("precio")) {
          respuesta = "💠 Lipo Body Elite $664.000
💠 Face Elite $358.400
Puedes agendar tu evaluación gratuita aquí:
🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";
        }

        await sendMessage(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
