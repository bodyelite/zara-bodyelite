import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🌐 Configuración general
const PORT = process.env.PORT || 10000;
const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// 🧠 Memoria base de Zara (respuestas aprendidas)
const respuestasZara = [
  {
    patrones: ["hola", "buenas", "qué tal", "buen día"],
    respuesta: "¡Hola! Soy Zara, la asistente de Body Elite 💙 ¿Te gustaría agendar tu diagnóstico gratuito o saber más sobre nuestros tratamientos?"
  },
  {
    patrones: ["agenda", "reservar", "cita", "hora"],
    respuesta: `Puedes agendar directamente tu hora aquí 👉 ${RESERVO_LINK}`
  },
  {
    patrones: ["tratamientos", "planes", "precios"],
    respuesta: "Ofrecemos planes corporales y faciales personalizados como Lipo Body Elite, Lipo Express, Push Up y Face Elite. ¿Quieres que te ayude a elegir el mejor para ti?"
  },
  {
    patrones: ["dónde están", "ubicación", "dirección"],
    respuesta: "Estamos en Av. Las Perdices Nº 2990, Local 23, Peñalolén. Te esperamos de lunes a viernes 9:30 a 20:00 y sábado 9:30 a 13:00 🕐"
  },
  {
    patrones: ["contacto", "whatsapp", "hablar", "número"],
    respuesta: "Puedes escribirnos directamente por WhatsApp haciendo clic en el botón de nuestra página o en el link de Reservo 📲"
  },
  {
    patrones: ["gracias", "perfecto", "ok"],
    respuesta: "¡Con gusto 💙! ¿Quieres que te ayude a agendar tu evaluación o te cuento más sobre un tratamiento?"
  },
  {
    patrones: ["hifu", "sculptor", "radiofrecuencia", "cavitación"],
    respuesta: "Usamos tecnología avanzada como HIFU 12D, EMS Sculptor y Radiofrecuencia para modelar, tonificar y reafirmar sin bisturí. Resultados visibles desde las primeras sesiones ✨"
  }
];

// 🎯 Función de respuesta automática
function obtenerRespuesta(mensaje) {
  mensaje = mensaje.toLowerCase();
  for (const item of respuestasZara) {
    if (item.patrones.some(p => mensaje.includes(p))) {
      return item.respuesta;
    }
  }
  return "No entendí muy bien 🤔 ¿Podrías explicarlo un poco mejor? Puedo ayudarte a agendar, mostrarte precios o contarte sobre nuestros tratamientos.";
}

// 📩 Endpoint principal para interacción
app.post("/zara", async (req, res) => {
  try {
    const { mensaje } = req.body;
    console.log("📩 Mensaje recibido:", mensaje);

    const respuesta = obtenerRespuesta(mensaje);
    res.json({ respuesta });
  } catch (error) {
    console.error("❌ Error al procesar mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🌍 Página de prueba (opcional)
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family:sans-serif; text-align:center; margin-top:50px;">
      <h2>🤖 Zara IA - Body Elite</h2>
      <p>Asistente conversacional activo y listo para recibir mensajes.</p>
      <a href="${RESERVO_LINK}" target="_blank" style="color:#007bff;">Agendar en Reservo</a>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log(`🤖 Zara IA lista para responder mensajes 💬`);
});
