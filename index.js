import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// === VARIABLES DE ENTORNO ===
const TOKEN = process.env.ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const RESERVO_LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// === MEMORIA TEMPORAL ===
const memoriaUsuarios = {};

// === FUNCIONES ===
async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
}

function detectarNombre(texto) {
  const match = texto.match(/(?:soy|me llamo|mi nombre es)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]+)/i);
  return match ? match[1].trim() : null;
}

function detectarIntencion(msg) {
  const texto = msg.toLowerCase();

  if (texto.includes("hola") || texto.includes("buenas") || texto.includes("zara"))
    return "saludo";

  if (
    texto.includes("rostro") ||
    texto.includes("cara") ||
    texto.includes("arruga") ||
    texto.includes("verme joven") ||
    texto.includes("flacidez facial") ||
    texto.includes("piel")
  )
    return "rostro";

  if (
    texto.includes("cuerpo") ||
    texto.includes("abdomen") ||
    texto.includes("guata") ||
    texto.includes("grasa") ||
    texto.includes("lipo") ||
    texto.includes("celulitis") ||
    texto.includes("reductor") ||
    texto.includes("tonificar")
  )
    return "cuerpo";

  if (texto.includes("hifu")) return "hifu";
  if (texto.includes("sculptor")) return "sculptor";
  if (texto.includes("cavitacion") || texto.includes("cavitación")) return "cavitacion";
  if (texto.includes("resultado") || texto.includes("experiencia")) return "resultados";
  if (texto.includes("agenda") || texto.includes("hora") || texto.includes("reserva"))
    return "agenda";

  return "noEntiende";
}

const respuestas = {
  saludo: [
    "Hola 🌸 Soy *Zara IA*, asistente virtual de Body Elite. Puedo ayudarte a elegir el mejor tratamiento según lo que quieras mejorar. ¿Qué parte te gustaría trabajar: rostro o cuerpo?"
  ],
  rostro: [
    "💆‍♀️ Para rostro tenemos varias opciones según lo que busques:\n\n• *Face Light* $128.800 → limpieza profunda + LED.\n• *Face Smart* $198.400 → mejora textura y tono.\n• *Face Antiage* $281.600 → lifting sin bisturí.\n• *Face Elite* $358.400 → protocolo completo con radiofrecuencia y HIFU facial.\n\nMuchas pacientes notan piel más firme y luminosa desde la primera sesión ✨.\n📅 Puedes agendar tu diagnóstico gratuito acá 👉 " +
      RESERVO_LINK
  ],
  cuerpo: [
    "💪 Te cuento 💙 los planes más solicitados para cuerpo son:\n\n• *Lipo Body Elite* $664.000 → HIFU 12D + Cavitación + EMS Sculptor para moldear y tonificar.\n• *Lipo Reductiva* $480.000 → ideal para celulitis y grasa localizada.\n• *Lipo Express* $432.000 → resultados más rápidos.\n\n👩‍🦰 Muchas pacientes sienten su abdomen más firme desde la 3ª sesión.\n📅 Agenda tu evaluación gratuita acá 👉 " +
      RESERVO_LINK
  ],
  hifu: [
    "💎 *HIFU 12D* trabaja con ultrasonido focalizado, reafirma la piel y reduce grasa sin cirugía. Es excelente para rostro, abdomen y piernas.\n📅 Agenda tu diagnóstico gratuito acá 👉 " +
      RESERVO_LINK
  ],
  sculptor: [
    "⚡ *EMS Sculptor* provoca contracciones musculares profundas (como 20.000 abdominales en 30 min). Perfecto para glúteos, abdomen o piernas. Mejora firmeza y tonificación 💪."
  ],
  cavitacion: [
    "💠 *Cavitación* rompe células grasas mediante ultrasonido, ayudando a eliminar grasa localizada. Se complementa con radiofrecuencia o HIFU para potenciar resultados."
  ],
  resultados: [
    "🌟 Nuestros pacientes suelen notar cambios desde la 3ª a 5ª sesión: menos volumen, piel más firme y mejor definición corporal. Resultados progresivos, sin dolor ni cirugía 💙."
  ],
  agenda: [
    "📅 Puedes agendar tu diagnóstico gratuito directamente acá 👉 " + RESERVO_LINK
  ],
  noEntiende: [
    "😅 No entendí muy bien, ¿me explicas un poquito mejor por favor?"
  ]
};

// === WEBHOOKS ===
app.get("/", (req, res) => res.send("✅ Zara IA lista y en línea."));

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const texto = message.text?.body || "";
    console.log(`💬 ${from}: ${texto}`);

    // Registrar nombre si lo dice
    const nombreDetectado = detectarNombre(texto);
    if (nombreDetectado) {
      memoriaUsuarios[from] = { nombre: nombreDetectado };
      await sendMessage(from, `Encantada ${nombreDetectado} 💙. Cuéntame, ¿te interesa mejorar rostro o cuerpo?`);
      return res.sendStatus(200);
    }

    // Si no hay nombre aún → preguntar
    if (!memoriaUsuarios[from]?.nombre) {
      await sendMessage(from, "Encantada 💙 Antes de continuar, ¿me recuerdas tu nombre?");
      return res.sendStatus(200);
    }

    // Si ya lo tiene
    const nombre = memoriaUsuarios[from].nombre;
    const intencion = detectarIntencion(texto);
    let respuesta =
      respuestas[intencion]?.[Math.floor(Math.random() * respuestas[intencion].length)] ||
      respuestas.noEntiende[0];

    // Personalizar respuesta
    if (intencion !== "noEntiende") {
      respuesta = `${nombre} 💙 ${respuesta}`;
    }

    await sendMessage(from, respuesta);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.sendStatus(500);
  }
});

// === SERVIDOR ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 Zara IA Full Conversacional v4 ejecutándose en puerto", PORT);
});
