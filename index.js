import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// Ruta de verificación Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado correctamente.");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      if (message && message.text) {
        const from = message.from;
        const userText = message.text.body.toLowerCase();
        console.log(`Mensaje recibido: ${userText} desde ${from}`);

        const respuesta = obtenerRespuesta(userText);
        await enviarMensaje(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error al procesar mensaje:", error);
    res.sendStatus(500);
  }
});

// Lógica de respuestas base
function obtenerRespuesta(texto) {
  if (texto.includes("hola") || texto.includes("buenas")) {
    return "Hola 👋 Soy Zara IA de Body Elite. ¿Quieres agendar tu evaluación gratuita? 💆‍♀️✨";
  } else if (texto.includes("precio") || texto.includes("valor")) {
    return "Nuestros planes corporales y faciales parten desde $120.000. ¿Te gustaría que te recomiende el ideal según tu objetivo?";
  } else if (texto.includes("agenda") || texto.includes("evaluación")) {
    return "Puedes agendar directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }
  return "Soy Zara IA 🤖, tu asistente de Body Elite. Puedo ayudarte con planes, precios o agendamientos. ¿Qué deseas consultar?";
}

// Función para enviar mensaje vía Meta API
async function enviarMensaje(destinatario, texto) {
  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: destinatario,
      type: "text",
      text: { body: texto },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error enviando mensaje:", data);
    } else {
      console.log("Mensaje enviado correctamente:", data);
    }
  } catch (error) {
    console.error("Error general al enviar mensaje:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Servidor Zara IA ejecutándose en puerto ${PORT}`);
});
