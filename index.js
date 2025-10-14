import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import generarRespuesta from "./responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// -------------------------
// Función para enviar mensaje
// -------------------------
async function enviarMensaje(texto, numero) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to: numero,
    text: { body: texto },
  };

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!respuesta.ok) {
      console.error("Error al enviar mensaje:", await respuesta.text());
    } else {
      console.log(`✅ Mensaje enviado correctamente a ${numero}`);
    }
  } catch (error) {
    console.error("❌ Error en enviarMensaje:", error);
  }
}

// -------------------------
// Webhook de verificación
// -------------------------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// -------------------------
// Webhook de mensajes
// -------------------------
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value?.messages?.[0];
    if (change && change.from && change.text?.body) {
      const from = change.from;
      const mensaje = change.text.body.toLowerCase().trim();
      console.log(`💬 Mensaje recibido de ${from}: ${mensaje}`);

      // -------------------------
      // Lógica de respuesta de Zara
      // -------------------------
      let respuesta = generarRespuesta(mensaje);

      // Si el mensaje contiene "quiero agendar"
      if (mensaje.includes("quiero agendar")) {
        respuesta =
          "📅 Puedes agendar fácilmente tu evaluación gratuita con nuestros especialistas. Incluye diagnóstico FitDays y asesoría personalizada.\n\n📍 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\n\n✨ Al agendar, uno de nuestros especialistas te confirmará por WhatsApp.";

        await enviarMensaje(respuesta, from);

        // Aviso interno simultáneo a los tres números
        const aviso = `🔔 Nuevo interesado en agendar evaluación gratuita.\n📱 Número: ${from}\n🕒 ${new Date().toLocaleString("es-CL")}`;
        const recepcion = ["56983300262", "56931720760", "56937648536"];
        for (const numero of recepcion) {
          await enviarMensaje(aviso, numero);
        }

        console.log("📨 Avisos internos enviados correctamente.");
      } else {
        // Respuesta general según conocimiento clínico
        await enviarMensaje(respuesta, from);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// -------------------------
// Servidor
// -------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Zara IA ejecutándose en puerto ${PORT}`);
});
