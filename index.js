import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// --- CONFIGURACIÓN PRINCIPAL ---
const VERIFY_TOKEN = "zara_bodyelite_verify";
const WHATSAPP_TOKEN = "EAAUydX2y57wBPqTsqUaN8MuF7Hmk8Dt7vYmVqedN1Hfzrn3nsPpmUnOjtgRgwmkGpEEbWHCaiMEfnSa6ZAHuZAZBhzclxHpPISlq2nq3hZAg3wLdgN1P1eTyTptsy06arN8ptVt1DYQZBv0vy495ZCZB7kAQlnxo1L8r6A397ZCZAZCBF8ROizi4gbfPBA6x8M9Gve3Bq9os4fBoGmkjvuIAFWxq3iQs5fiZAE3SUSa7aMZD";
const PHONE_NUMBER_ID = "84036109156943";

// --- WEBHOOK DE VERIFICACIÓN (GET) ---
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

// --- RECEPCIÓN DE MENSAJES (POST) ---
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text) {
      const from = message.from;
      const userMsg = message.text.body.toLowerCase().trim();
      console.log(`💬 Mensaje recibido de ${from}: "${userMsg}"`);

      const reply = await generarRespuestaZara(userMsg);
      await enviarMensajeWhatsApp(from, reply);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en recepción de mensaje:", err);
    res.sendStatus(500);
  }
});

// --- FUNCIÓN: ENVÍO DE RESPUESTAS ---
async function enviarMensajeWhatsApp(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Respuesta enviada correctamente");
  } catch (error) {
    console.error("⚠️ Error enviando mensaje:", error.response?.data || error.message);
  }
}

// --- FUNCIÓN: LÓGICA DE RESPUESTA DE ZARA ---
async function generarRespuestaZara(msg) {
  // === SALUDO ===
  if (["hola", "buenas", "holaa", "hola zara"].includes(msg))
    return "👋 Hola, soy Zara — asistente virtual de *Body Elite Estética Avanzada*. ¿En qué puedo ayudarte hoy?";

  // === PLANES CORPORALES ===
  if (msg.includes("lipo") || msg.includes("cintura") || msg.includes("abdomen"))
    return `💆‍♀️ Tenemos varios planes corporales para moldear y reducir contorno:
• *Lipo Body Elite* – $664.000 (10 sesiones)
• *Lipo Reductiva* – $480.000 (8 sesiones)
• *Lipo Express* – $432.000 (6 sesiones)
✨ Todos combinan HIFU 12D + Radiofrecuencia + EMS Sculptor según diagnóstico.
📅 Puedes agendar tu evaluación gratuita aquí:
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  // === PLANES FACIALES ===
  if (msg.includes("facial") || msg.includes("rostro") || msg.includes("cara"))
    return `✨ Estos son nuestros planes faciales más consultados:
• *Face Elite* $358.400  
• *Face Antiage* $281.600  
• *Face Smart* $198.400  
• *Limpieza Facial Full* $120.000  
Todos incluyen protocolos personalizados según tu tipo de piel.`;

  // === TONIFICACIÓN / ESCULTOR ===
  if (msg.includes("gluteo") || msg.includes("sculptor") || msg.includes("tonificar"))
    return `🍑 Nuestro plan *Push Up* ($376.000) combina EMS Sculptor + Radiofrecuencia para levantar y tonificar glúteos desde la 1ª sesión.`;

  // === CONTACTO / AGENDAMIENTO ===
  if (msg.includes("agenda") || msg.includes("reserva") || msg.includes("hora"))
    return `📅 Puedes agendar directamente tu cita aquí:
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9  
📍 Body Elite – Av. Las Perdices 2990 Local 23 Peñalolén  
🕓 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00`;

  // === AYUDA GENERAL ===
  return `💙 Soy *Zara IA Body Elite*. Puedo ayudarte a conocer nuestros planes corporales, faciales o agendar tu diagnóstico gratuito.  
Escríbeme por ejemplo:  
👉 "planes corporales"  
👉 "tratamientos faciales"  
👉 "quiero agendar"`;
}

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
  console.log("🤖 Zara IA Body Elite lista y escuchando mensajes...");
});
