// ==========================
// 🤖 ZARA IA BODY ELITE vFinal
// ==========================

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// ==========================
// 🔐 CONFIGURACIÓN PRINCIPAL
// ==========================

const TOKEN = "EAAUydX2y57wBPoPahaD8YwZBP92Cos5Qp1AmMV2yym8ZAbjE1BmjpBkvidN5VVaUSBKsSPTjR5Khmxh24HAZBHAGEVzRLQTt8lRyhTWlZCDjQHeaNuyIq1T33tZB6EUJrnsZCcOzQEZB7zxUZCcEdIrXG9pnZAPwpfIyWy6HKLMZAKZAscFZB5GswRZAUMoUJIgZDZD";

// ⚠️ ESTE ES EL ID CORRECTO Y ACTIVO
const PHONE_NUMBER_ID = "805241145778395";

const VERIFY_TOKEN = "zara_bodyelite_verify";

// ==========================
// 🧠 FUNCIONALIDAD DE ZARA
// ==========================

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";

      console.log(`💬 Mensaje recibido de ${from}: "${text}"`);

      let reply = "✨ Hola, soy Zara, asistente virtual de Body Elite. ¿Cómo puedo ayudarte hoy?";

      if (text.includes("hola")) {
        reply = "👋 ¡Hola! Soy Zara de Body Elite 💙. ¿Quieres conocer nuestros tratamientos faciales o corporales?";
      } else if (text.includes("lipo") || text.includes("grasa") || text.includes("cintura")) {
        reply = "🔥 Nuestro tratamiento *Lipo Body Elite* combina HIFU 12D, Cavitación y EMSculptor. Resultados visibles desde la 3ª sesión.\n\n💰 Planes:\n• Lipo Body Elite: $664.000 (10 sesiones)\n• Lipo Reductiva: $480.000\n• Lipo Express: $432.000\n\n✨ Agenda tu diagnóstico gratuito acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      } else if (text.includes("face") || text.includes("facial")) {
        reply = "💆‍♀️ Tenemos planes faciales con tecnología avanzada:\n• Face Elite $358.400\n• Face Smart $198.400\n• Face Light $128.800\n\n✨ Todos incluyen diagnóstico facial gratuito y protocolo personalizado. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
      } else if (text.includes("agenda") || text.includes("reservar") || text.includes("diagnóstico")) {
        reply = "📅 ¡Perfecto! Puedes agendar tu diagnóstico gratuito directamente aquí 👇\n\n🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\nO si prefieres, dime el día y hora que te acomoda 💬";
      } else if (text.includes("gracias")) {
        reply = "💙 ¡Gracias a ti! Recuerda que en Body Elite te ayudamos a alcanzar tus objetivos sin cirugía y con tecnología avanzada ✨";
      } else {
        reply = "✨ Soy Zara, asistente de Body Elite 💙.\nPuedo darte información sobre tratamientos *faciales*, *corporales*, o ayudarte a *agendar* tu diagnóstico gratuito. ¿Qué prefieres?";
      }

      try {
        await axios.post(
          `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: reply },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        console.log("✅ Mensaje enviado correctamente ✔️");
      } catch (error) {
        console.error("⚠️ Error enviando mensaje:", error.response?.data || error.message);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ==========================
// 🚀 SERVIDOR
// ==========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA Body Elite lista y escuchando mensajes...");
  console.log("///////////////////////////////////////////////");
  console.log(`🌐 Disponible en: https://zara-bodyelite1.onrender.com`);
  console.log("///////////////////////////////////////////////");
});
