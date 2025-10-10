import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// VARIABLES DE ENTORNO
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// --- 1. VERIFICACIÓN DEL WEBHOOK ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Error verificando webhook");
    res.sendStatus(403);
  }
});

// --- 2. PROCESAMIENTO DE MENSAJES ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const msgBody = message.text?.body?.toLowerCase() || "";

      console.log(`📩 Mensaje recibido de ${from}: ${msgBody}`);

      // Determinar respuesta
      const reply = getZaraResponse(msgBody);

      // Enviar mensaje de respuesta
      await sendMessage(from, reply);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
});

// --- 3. FUNCIÓN DE RESPUESTAS INTELIGENTES ---
function getZaraResponse(text) {
  text = text.toLowerCase();

  // 🔹 Palabras clave: LIPO / GRASA / REDUCTIVA
  if (text.includes("lipo") || text.includes("grasa") || text.includes("reductiva")) {
    return `💎 Nuestro tratamiento *Lipo Body Elite* combina *HIFU 12D, Cavitación* y *EMS Sculptor* para reducir grasa localizada y tonificar. 
El pack de 10 sesiones tiene un valor de $664.000 CLP e incluye diagnóstico gratuito.`;

  // 🔹 Palabras clave: BÓTOX / ARRUGAS / ROSTRO
  } else if (text.includes("botox") || text.includes("arrugas") || text.includes("facial")) {
    return `💉 Nuestro tratamiento *Facial Antiage* incluye *toxina botulínica + radiofrecuencia* para reafirmar y rejuvenecer el rostro. 
Incluye evaluación facial gratuita.`;

  // 🔹 Palabras clave: ROSTRO / FACE / LUMINOSIDAD
  } else if (text.includes("rostro") || text.includes("cara") || text.includes("face")) {
    return `🌸 Tenemos planes faciales según tus objetivos:
- *Face Smart*: rejuvenecimiento completo $198.400 CLP  
- *Face Elite*: lifting avanzado con HIFU $358.400 CLP  
Todos incluyen diagnóstico facial inicial.`;

  // 🔹 Palabras clave: AGENDA / RESERVA / HORA
  } else if (text.includes("agenda") || text.includes("reservar") || text.includes("hora") || text.includes("disponibilidad")) {
    return `🗓 Puedes agendar directamente aquí:  
👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  // 🔹 Palabras clave: UBICACIÓN / DIRECCIÓN
  } else if (text.includes("ubicación") || text.includes("donde") || text.includes("dirección")) {
    return `📍 Estamos en *Av. Las Perdices 2990, Local 23, Peñalolén.*  
Horario: Lunes a Viernes 9:30–20:00, Sábado 9:30–13:00.`;

  // 🔹 Default / Sin coincidencias
  } else {
    return `👋 Soy *Zara IA*, asistente de *Body Elite*. Puedo ayudarte con tratamientos, precios o agendamiento.  
¿Qué te gustaría mejorar hoy: *rostro* o *cuerpo*?`;
  }
}

// --- 4. FUNCIÓN PARA ENVIAR MENSAJES ---
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Error enviando mensaje:", errorData);
  } else {
    console.log(`✅ Mensaje enviado a ${to}`);
  }
}

// --- 5. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
  console.log("✅ Zara IA lista para responder mensajes 💬");
});
