// index.js — Zara IA Body Elite v7 (Render 2025-10-11)
// Versión completa con IA comercial + clínica + conexión Meta

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "zara_bodyelite_verify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "253931404461638"; // ID del número conectado a Meta
const PORT = process.env.PORT || 10000;

// === VERIFICACIÓN DEL WEBHOOK ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Verificación fallida");
    res.sendStatus(403);
  }
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";

      console.log(`💬 Mensaje recibido de ${from}: "${text}"`);

      const response = zaraResponder(text);
      await sendMessage(from, response);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando el webhook:", error);
    res.sendStatus(500);
  }
});

// === FUNCIÓN: LÓGICA COMPLETA DE ZARA BODY ELITE ===
function zaraResponder(msg) {
  let response = "";

  // ---- 1️⃣ SALUDO Y PRESENTACIÓN ----
  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("zara")) {
    response =
      "👋 ¡Hola! Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*. 💙✨\n\n" +
      "Puedo ayudarte con:\n" +
      "▫️ Diagnóstico corporal o facial gratuito 🧠\n" +
      "▫️ Planes y precios 💰\n" +
      "▫️ Agendar tu cita 📅\n\n" +
      "¿Qué te gustaría conocer primero?";
  }

  // ---- 2️⃣ PLANES CORPORALES ----
  else if (
    msg.includes("lipo") ||
    msg.includes("abdomen") ||
    msg.includes("grasa") ||
    msg.includes("cintura") ||
    msg.includes("celulitis") ||
    msg.includes("flacidez") ||
    msg.includes("glúteo") ||
    msg.includes("pierna") ||
    msg.includes("cuerpo")
  ) {
    response =
      "💎 *Planes Corporales Body Elite:*\n\n" +
      "• *Lipo Body Elite* — $664.000 (10 sesiones)\n" +
      "• *Lipo Reductiva* — $480.000\n" +
      "• *Lipo Express* — $432.000\n" +
      "• *Body Fitness* — $360.000\n" +
      "• *Push Up* — $376.000\n\n" +
      "Todos combinan *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor*, sin bisturí ni dolor 💪\n\n" +
      "✨ Agenda tu diagnóstico gratuito aquí:\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // ---- 3️⃣ PLANES FACIALES ----
  else if (
    msg.includes("face") ||
    msg.includes("facial") ||
    msg.includes("piel") ||
    msg.includes("rostro") ||
    msg.includes("acné") ||
    msg.includes("manchas") ||
    msg.includes("rejuvenec") ||
    msg.includes("arrugas")
  ) {
    response =
      "🌸 *Planes Faciales Body Elite:*\n\n" +
      "• *Face Light* — $128.800\n" +
      "• *Face Smart* — $198.400\n" +
      "• *Face Inicia* — $270.400\n" +
      "• *Face Antiage* — $281.600\n" +
      "• *Face Elite* — $358.400\n" +
      "• *Full Face* — $584.000\n\n" +
      "✨ Incluyen limpieza profunda, radiofrecuencia y activos dermoestéticos premium.\n\n" +
      "📍 Av. Las Perdices Nº2990, Local 23, Peñalolén.\n🕘 Lun–Vie 9:30–20:00 | Sáb 9:30–13:00";
  }

  // ---- 4️⃣ DIAGNÓSTICO / FITDAYS ----
  else if (
    msg.includes("diagnóstico") ||
    msg.includes("evaluación") ||
    msg.includes("fitdays") ||
    msg.includes("imc") ||
    msg.includes("masa") ||
    msg.includes("edad corporal")
  ) {
    response =
      "🩺 *Diagnóstico corporal inteligente FitDays + Body Elite*\n\n" +
      "Solo necesito tu foto del análisis FitDays o tus datos de:\n" +
      "• Peso actual\n" +
      "• IMC\n" +
      "• % Grasa corporal\n" +
      "• Masa muscular\n\n" +
      "Con eso te puedo indicar tu plan más adecuado 💪";
  }

  // ---- 5️⃣ AGENDAMIENTO ----
  else if (
    msg.includes("agendar") ||
    msg.includes("hora") ||
    msg.includes("reserva") ||
    msg.includes("agenda") ||
    msg.includes("cita")
  ) {
    response =
      "📅 Puedes agendar directamente en nuestro sistema seguro:\n" +
      "👉 *Agenda Body Elite:*\n" +
      "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n" +
      "O dime el día y hora que te acomoda y lo gestiono por ti 💙";
  }

  // ---- 6️⃣ CONTACTO HUMANO ----
  else if (
    msg.includes("humano") ||
    msg.includes("asesora") ||
    msg.includes("persona") ||
    msg.includes("contacto") ||
    msg.includes("llámenme")
  ) {
    response =
      "Te conectaré con una asesora humana 💬\n" +
      "👉 [Abrir chat con asesora](https://wa.me/56983300262)";
  }

  // ---- 7️⃣ FALLBACK ----
  else {
    response =
      "💬 No estoy segura de haber entendido bien 😅. ¿Podrías explicarlo un poco mejor?\n\n" +
      "Puedo ayudarte a:\n" +
      "▫️ Agendar tu evaluación gratuita 📅\n" +
      "▫️ Explicarte tratamientos y precios 💰\n" +
      "▫️ O derivarte a una asesora humana 💙";
  }

  return response;
}

// === FUNCIÓN: ENVÍO DE MENSAJES ===
async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Mensaje enviado a ${to}`);
  } catch (error) {
    console.error("⚠️ Error enviando mensaje:", error.response?.data || error.message);
  }
}

// === INICIO DE SERVIDOR ===
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA Body Elite lista y escuchando mensajes...");
});
