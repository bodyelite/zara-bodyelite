import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bodyelitezara";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// Respuestas base
const respuestas = {
  saludo: "👋 Soy Zara IA, asistente virtual de *Body Elite Estética Avanzada*. Puedo orientarte con tratamientos, precios, tecnologías y resultados. ¿Qué te gustaría mejorar hoy: rostro o cuerpo?",
  fallback: "No entendí muy bien 🤔, ¿me podrías explicar un poco mejor?",
};

// Plantillas comerciales
const tratamientos = {
  lipo: {
    titulo: "💎 *Lipo Body Elite*",
    descripcion: "Combina *HIFU 12D*, *Cavitación* y *EMS Sculptor* para reducir grasa localizada y tensar la piel sin cirugía.",
    detalle:
      "🔹 El *HIFU 12D* descompone el tejido graso y estimula colágeno.\n🔹 La *Cavitación* rompe microburbujas de grasa.\n🔹 El *EMS Sculptor* tonifica el músculo.\n✨ Pacientes suelen notar menos volumen y mejor contorno desde la 3ª sesión.",
    precios:
      "• Lipo Body Elite $664.000 (10 sesiones)\n• Lipo Reductiva $480.000\n• Lipo Express $432.000",
  },
  facial: {
    titulo: "✨ *Face Elite*",
    descripcion: "Tratamiento facial con radiofrecuencia, vitaminas y HIFU facial para rejuvenecer y tensar la piel.",
    detalle:
      "Estimula la producción de colágeno, mejora la textura de la piel y reduce líneas de expresión sin bisturí.",
    precios: "• Face Elite $358.400\n• Face Antiage $281.600\n• Face Smart $198.400",
  },
};

// Procesar mensajes entrantes
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message && message.type === "text") {
      const phone = message.from;
      const texto = message.text.body.toLowerCase();
      const nombre = value.contacts?.[0]?.profile?.name?.split(" ")[0] || null;
      let respuesta = "";

      // Detectar intenciones
      if (texto.includes("hola") || texto.includes("buenas")) {
        respuesta = nombre
          ? `👋 Hola ${nombre}! ${respuestas.saludo}`
          : respuestas.saludo;
      } else if (
        texto.includes("lipo") ||
        texto.includes("grasa") ||
        texto.includes("abdomen") ||
        texto.includes("cuerpo") ||
        texto.includes("bajar")
      ) {
        const t = tratamientos.lipo;
        respuesta = `${t.titulo}\n\n${t.descripcion}\n\n${t.detalle}\n\n${t.precios}\n\n📅 Agenda tu diagnóstico gratuito y conoce la experiencia Body Elite, agenda acá 👉 *Agenda*`;
      } else if (
        texto.includes("rostro") ||
        texto.includes("cara") ||
        texto.includes("joven") ||
        texto.includes("facial")
      ) {
        const t = tratamientos.facial;
        respuesta = `${t.titulo}\n\n${t.descripcion}\n\n${t.detalle}\n\n${t.precios}\n\n📅 Agenda tu diagnóstico gratuito y vive la #ExperienciaElite 👉 *Agenda*`;
      } else {
        respuesta = respuestas.fallback;
      }

      // Enviar mensaje a WhatsApp API
      try {
        await axios.post(
          "https://graph.facebook.com/v19.0/101523683003043/messages",
          {
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: {
              body: respuesta.replace(
                "Agenda",
                "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
              ),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Mensaje enviado a", phone);
      } catch (error) {
        console.error("❌ Error enviando mensaje:", error.response?.data || error.message);
      }
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Verificación webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("🤖 Zara IA lista para responder mensajes 💬");
});
