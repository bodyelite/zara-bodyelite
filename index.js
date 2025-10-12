// === Zara IA Body Elite ===
// Integración oficial con Meta WhatsApp Cloud API
// Autor: JC | Fecha: Octubre 2025

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// 🔐 Token extendido (válido 60 días)
const WHATSAPP_TOKEN = "EAAUydX2y57wBPoPahaD8YwZBP92Cos5Qp1AmMV2yym8ZAbjE1BmjpBkvidN5VVaUSBKsSPTjR5Khmxh24HAZBHAGEVzRLQTt8lRyhTWlZCDjQHeaNuyIq1T33tZB6EUJrnsZCcOzQEZB7zxUZCcEdIrXG9pnZAPwpfIyWy6HKLMZAKZAscFZB5GswRZAUMoUJIgZDZD";

// 📞 ID del número conectado a la API de WhatsApp
const PHONE_NUMBER_ID = "84036109156943"; // Body Elite WhatsApp Cloud API

// =======================
// 🔍 VERIFICACIÓN WEBHOOK
// =======================
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "zara_bodyelite_verify";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Error de verificación de webhook");
    res.sendStatus(403);
  }
});

// =======================
// 💬 RECEPCIÓN DE MENSAJES
// =======================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!message) return res.sendStatus(200);

      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";
      console.log(`💬 Mensaje recibido de ${from}: "${text}"`);

      let responseText = "";

      // === 🧠 Lógica de respuesta de Zara ===
      if (text.includes("hola") || text.includes("buenas")) {
        responseText =
          "👋 ¡Hola! Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*.\n¿Quieres conocer nuestros planes *corporales* o *faciales*?";
      } else if (
        text.includes("lipo") ||
        text.includes("grasa") ||
        text.includes("abdomen") ||
        text.includes("cintura") ||
        text.includes("reductiva")
      ) {
        responseText =
          "🔥 *Tratamientos corporales reductivos Body Elite:*\n\n• Lipo Body Elite — $664.000 (10 sesiones)\n• Lipo Reductiva — $480.000\n• Lipo Express — $432.000\n\n✨ Resultados desde la 3ª sesión.\nReserva tu diagnóstico aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      } else if (
        text.includes("face") ||
        text.includes("facial") ||
        text.includes("piel") ||
        text.includes("rostro")
      ) {
        responseText =
          "💆‍♀️ *Tratamientos faciales disponibles:*\n\n• Face Smart — $198.400\n• Face Antiage — $281.600\n• Full Face — $584.000\n\n✨ Incluyen limpieza profunda, radiofrecuencia y luz LED avanzada.";
      } else if (text.includes("agendar") || text.includes("reserva")) {
        responseText =
          "📅 Puedes agendar tu hora directamente aquí 👇\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\nO dime el día y hora que prefieres 🧡";
      } else if (text.includes("promocion") || text.includes("gratis")) {
        responseText =
          "🎁 Este mes Body Elite tiene *HIFU facial gratis* al contratar tu plan corporal.\n\nConsulta disponibilidad escribiendo *agendar* o visita:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      } else {
        responseText =
          "🤖 No estoy segura de haber entendido. Puedes escribir:\n👉 *Lipo* para conocer planes corporales\n👉 *Face* para faciales\n👉 *Agendar* para reservar tu diagnóstico gratuito";
      }

      // === 📨 Enviar respuesta al usuario ===
      await axios.post(
        `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: responseText },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Mensaje enviado correctamente ✔️");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(
      "⚠️ Error enviando mensaje:",
      error.response?.data || error.message
    );
    res.sendStatus(500);
  }
});

// =======================
// 🚀 SERVIDOR ACTIVO
// =======================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("💬 Zara IA Body Elite lista y escuchando mensajes...");
  console.log(
    "🌐 Disponible en https://zara-bodyelite1.onrender.com"
  );
});
