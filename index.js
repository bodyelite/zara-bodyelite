import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "zara_bodyelite_verify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "840360109156943";

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA Body Elite lista para responder 💬");
});

// =============================
//  WEBHOOK META
// =============================
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

// =============================
//  RECEPCIÓN DE MENSAJES
// =============================
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
//  LÓGICA PRINCIPAL DE ZARA
// =============================
async function responderZara(to, texto) {
  const t = texto.toLowerCase();
  let respuesta = "";

  if (t.includes("hola") || t.includes("buenas") || t.includes("zara")) {
    respuesta = `💙 ¡Hola! Soy *Zara*, asistente virtual de *Body Elite Estética Avanzada*. 
Puedo ayudarte a conocer tratamientos, planes corporales o faciales y agendar tu diagnóstico gratuito.`;

  } else if (t.includes("lipo") || t.includes("plan corporal") || t.includes("cuerpo")) {
    respuesta = `💪 *Planes corporales más solicitados:*

• *Lipo Focalizada Reductiva* — $348.800  
• *Lipo Express* — $432.000  
• *Lipo Reductiva* — $480.000  
• *Lipo Body Elite* — $664.000  
• *Body Fitness* — $360.000  
• *Push Up* — $376.000  

¿Deseas que te recomiende el más adecuado según tu tipo de grasa?`;

  } else if (t.includes("face") || t.includes("facial") || t.includes("piel")) {
    respuesta = `💆‍♀️ *Planes faciales disponibles:*

• *Face Light* — $128.800  
• *Face Smart* — $198.400  
• *Face Antiage* — $281.600  
• *Face Elite* — $358.400  
• *Full Face* — $584.000  

✨ Todos incluyen diagnóstico facial avanzado.`;

  } else if (t.includes("agenda") || t.includes("reservar") || t.includes("diagnóstico")) {
    respuesta = `📅 Agenda tu diagnóstico gratuito aquí 👇  
👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9  
📍 *Av. Las Perdices Nº2990, Local 23, Peñalolén*`;

  } else if (t.includes("humano") || t.includes("ayuda") || t.includes("hablar")) {
    respuesta = `👩‍⚕️ Te conecto con una especialista.  
Escríbenos al WhatsApp principal 👉 https://wa.me/56983304436`;

  } else if (t.includes("fitdays") || t.includes("diagnóstico corporal")) {
    respuesta = `📊 El diagnóstico FitDays analiza peso, grasa visceral, masa muscular y edad corporal.  
¿Quieres enviarme tus resultados para recomendarte el plan más efectivo?`;

  } else {
    respuesta = `No estoy segura de entender 😅.  
Puedo ayudarte con *planes corporales, faciales o agendar tu diagnóstico gratuito*.`;
  }

  await enviarMensajeWhatsApp(to, respuesta);
}

// =============================
//  ENVÍO DE RESPUESTAS A META
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
