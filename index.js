const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "zara_bodyelite_verify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "840360109156943"; // Tu número verificado en Meta

// Servidor activo
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA Body Elite lista para responder 💬");
});

// =============================
//  WEBHOOK PARA META
// =============================

// ✅ Verificación inicial del webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Error de verificación");
  }
});

// 📩 Recepción de mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (text && from) {
      console.log(`📩 Mensaje recibido de ${from}: "${text}"`);
      await responderZara(from, text);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err);
    res.sendStatus(500);
  }
});

// =============================
//  ZARA BODY ELITE IA
// =============================

async function responderZara(to, texto) {
  const t = texto.toLowerCase();
  let respuesta = "";

  // SALUDO BASE
  if (t.includes("hola") || t.includes("buenas") || t.includes("zara")) {
    respuesta = `¡Hola! 💙 Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*.
Puedo ayudarte a conocer tratamientos, planes corporales o faciales, y agendar tu diagnóstico gratuito.`;

  // PLANES CORPORALES
  } else if (t.includes("lipo") || t.includes("plan corporal") || t.includes("cuerpo")) {
    respuesta = `💪 *Planes corporales más solicitados*:

• *Lipo Focalizada Reductiva* — $348.800  
• *Lipo Express* — $432.000  
• *Lipo Reductiva* — $480.000  
• *Lipo Body Elite* — $664.000  
• *Body Fitness* — $360.000  
• *Push Up* — $376.000  

Cada uno combina *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor*.  
¿Deseas que te recomiende el más adecuado según tus medidas o tipo de grasa?`;

  // PLANES FACIALES
  } else if (t.includes("face") || t.includes("facial") || t.includes("piel") || t.includes("cara")) {
    respuesta = `💆‍♀️ *Planes faciales disponibles:*

• *Face Light* — $128.800  
• *Face Smart* — $198.400  
• *Face Antiage* — $281.600  
• *Face Elite* — $358.400  
• *Full Face* — $584.000  

✨ Todos los tratamientos incluyen diagnóstico facial avanzado.  
¿Quieres que te recomiende uno según tu tipo de piel o edad?`;

  // AGENDA
  } else if (t.includes("agenda") || t.includes("reservar") || t.includes("diagnóstico")) {
    respuesta = `📅 Perfecto. Puedes agendar directamente tu diagnóstico gratuito aquí:
👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9  
📍 *Body Elite Estética Avanzada*  
Av. Las Perdices Nº2990, Local 23, Peñalolén.`;

  // HUMANO / CONTACTO DIRECTO
  } else if (t.includes("humano") || t.includes("ayuda") || t.includes("hablar")) {
    respuesta = `Te conecto con una de nuestras especialistas 👩‍⚕️💬  
Escríbenos al WhatsApp principal 👉 https://wa.me/56983304436`;

  // FITDAYS / DIAGNÓSTICO PERSONALIZADO
  } else if (t.includes("fitdays") || t.includes("diagnóstico corporal") || t.includes("medidas")) {
    respuesta = `📊 El diagnóstico FitDays analiza peso, grasa visceral, masa muscular y edad corporal.  
Con esos datos puedo recomendarte el *plan más efectivo* según tu composición corporal.  
¿Quieres enviarme tus resultados o foto del escáner FitDays?`;

  // OTROS CASOS / RESPUESTA GENERAL
  } else {
    respuesta = `No estoy segura de entender 😅.  
Puedo ayudarte con *planes corporales, faciales, diagnóstico FitDays o agendar tu hora.*  
¿Qué deseas hacer ahora?`;
  }

  await enviarMensajeWhatsApp(to, respuesta);
}

// =============================
//  API DE META - ENVÍO DE RESPUESTAS
// =============================

async function enviarMensajeWhatsApp(to, body) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
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
