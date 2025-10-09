import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// ✅ Token de verificación que pusiste en Meta
const VERIFY_TOKEN = "bodyelite2024";

// ✅ Token de acceso de la API de WhatsApp (desde tu app de Meta)
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// ✅ Configuración base de la API de WhatsApp Cloud
const WHATSAPP_API_URL = "https://graph.facebook.com/v19.0";

// --- ✅ Verificación del webhook (GET) ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("🟢 Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.warn("🔴 Error: Token de verificación inválido");
    res.sendStatus(403);
  }
});

// --- ✅ Recepción de mensajes (POST) ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from; // número del cliente
        const text = message.text?.body?.toLowerCase() || "";

        console.log(`💬 Mensaje recibido de ${from}: ${text}`);

        // --- 🤖 Respuesta básica ---
        let reply = "";

        if (text.includes("hola") || text.includes("buenas")) {
          reply = "👋 Hola! Soy el asistente virtual de *Body Elite*. ¿Quieres agendar una evaluación gratuita o conocer nuestros planes?";
        } else if (text.includes("agenda") || text.includes("reserva")) {
          reply = "📅 Puedes agendar directamente desde este link:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
        } else if (text.includes("plan") || text.includes("precio")) {
          reply = "💎 Nuestros planes corporales y faciales están disponibles en bodyelite.cl, o puedo ayudarte a elegir uno según tus objetivos 💆‍♀️";
        } else {
          reply = "✨ Hola! Soy el bot de *Body Elite Estética Avanzada*. Escríbeme 'planes' o 'agenda' para comenzar 💬";
        }

        await sendWhatsAppMessage(from, reply);
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

// --- ✅ Función para enviar mensajes a WhatsApp ---
async function sendWhatsAppMessage(to, message) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body: message },
  };

  const response = await fetch(`${WHATSAPP_API_URL}/1555268005502427/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error al enviar mensaje:", errorText);
  } else {
    console.log("✅ Mensaje enviado correctamente a", to);
  }
}

// --- 🚀 Servidor en Render ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
