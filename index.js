import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const AVISOS = ["+56912345678", "+56987654321"];

// === ENVÍO DE MENSAJES ===
async function sendMessage(to, text) {
  const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_NUMBER_ID + "/messages";
  const data = { messaging_product: "whatsapp", to, text: { body: text } };
  try {
    await axios.post(url, data, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Error al enviar mensaje:", err.response?.data || err.message);
  }
}

// === RESPUESTAS BASE ===
const respuestas = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Entiendo lo importante que es sentirte bien contigo. Puedo orientarte con tratamientos, tecnologías o agendar tu diagnóstico gratuito. 🌸 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // === PLANES SEGÚN ZONA ===
  abdomen: "💬 Para la zona abdominal existen varias opciones según el tipo de grasa o flacidez que presente la piel. Los tratamientos más indicados son *Lipo Body Elite*, *Lipo Reductiva* y *Lipo Express*. \n\n🔹 *Lipo Body Elite* combina HIFU 12D, cavitación, radiofrecuencia y EMS Sculptor. Trabaja grasa y músculo simultáneamente, moldeando cintura y tensando piel. \n🔹 *Lipo Reductiva* utiliza HIFU 12D y radiofrecuencia para reducir grasa y celulitis sin cirugía. \n🔹 *Lipo Express* integra cavitación, radiofrecuencia y estimulación muscular rápida para definir la zona.\n\nNo duelen, se sienten cálidos o con leves contracciones. Normalmente se realizan entre 8 y 12 sesiones, 1 a 2 veces por semana. 🌿 Lo ideal es realizar una evaluación gratuita para analizar tu tipo de tejido y definir el protocolo más efectivo para ti. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  muslos: "🍃 Para muslos y piernas podemos aplicar *Lipo Focalizada Reductiva* o *Body Tensor*, según el diagnóstico. \n\n🔹 *Lipo Focalizada Reductiva*: cavitación y radiofrecuencia controladas por IA que disuelven grasa localizada y mejoran la textura de la piel. \n🔹 *Body Tensor*: radiofrecuencia con luz LED ámbar que reafirma y mejora elasticidad. \n\nSon indoloros, se sienten cálidos, y se recomiendan entre 6 y 8 sesiones con frecuencia semanal. 🌸 Lo mejor es agendar una evaluación gratuita para determinar qué combinación es ideal para ti. 🗓️ 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  gluteos: "🍑 Para glúteos te recomiendo el plan *Push Up* o *Body Fitness*. \n\n🔹 *Push Up*: combina radiofrecuencia y EMS Sculptor para levantar y tonificar. \n🔹 *Body Fitness*: sesiones de contracción muscular profunda (20 000 en 30 min). \n\nAmbos tratamientos son indoloros, con sensación de contracción intensa y segura. Frecuencia: 2 sesiones semanales. 🌷 Agenda una evaluación gratuita para medir firmeza y definir tu plan personalizado 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  brazos: "💪 En brazos recomendamos *Body Tensor* o *Lipo Focalizada Reductiva*. \n\n🔹 *Body Tensor*: radiofrecuencia y LED ámbar para flacidez y firmeza. \n🔹 *Lipo Focalizada*: cavitación y radiofrecuencia para reducir grasa localizada en la parte posterior. \n\nNo duele, solo se percibe calor suave. Se realizan 4 a 6 sesiones semanales. 🌼 Lo ideal es agendar una evaluación gratuita para analizar tu tono muscular y tipo de piel 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  rostro: "🌸 Para rostro y papada los tratamientos más efectivos son *Face Élite*, *Face Antiage* y *Full Face*. \n\n🔹 *Face Élite*: combina HIFU 12D, radiofrecuencia y Pink Glow, actuando en profundidad para levantar y reafirmar contornos. \n🔹 *Face Antiage*: radiofrecuencia + HIFU 12D + Pink Glow regenerativo para suavizar arrugas. \n🔹 *Full Face*: trabajo integral rostro–cuello–escote con IA que ajusta energía según diagnóstico. \n\nSon relajantes, sin dolor. Entre 4 y 6 sesiones según objetivo. 💆‍♀️ Te recomiendo agendar una evaluación gratuita para revisar firmeza y textura de tu piel 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
};

// === DETECCIÓN DE EMOCIÓN ===
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "insegura", "vergüenza", "bajón"];
  const frustracion = ["no puedo", "me cuesta", "frustrada", "agotada", "rendida"];
  const esperanza = ["quiero mejorar", "necesito cambiar", "me gustaría", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. En Body Elite muchas personas comenzaron igual y hoy se sienten más seguras. Estoy para acompañarte y guiarte paso a paso. ¿Quieres que te recomiende algo para comenzar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar correcto. Nuestros tratamientos son sin dolor y con resultados reales. Usamos IA que adapta cada sesión a tu cuerpo. ¿Te gustaría que te explique cuál sería el mejor punto de inicio?";
  if (esperanza.some(p => text.includes(p))) return "✨ Me alegra escuchar eso. Con tecnología avanzada e inteligencia artificial, personalizamos cada plan según tu cuerpo. Cuéntame qué zona te gustaría trabajar y te explico cómo lo hacemos.";
  return null;
}

// === DETECCIÓN DE INTENCIÓN ===
function detectarIntencion(text) {
  text = text.toLowerCase();

  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas")) return respuestas.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return respuestas.agendar;

  // ZONAS CORPORALES / FACIALES
  if (text.includes("abdomen") || text.includes("barriga") || text.includes("vientre")) return respuestas.abdomen;
  if (text.includes("muslo") || text.includes("pierna")) return respuestas.muslos;
  if (text.includes("gluteo") || text.includes("trasero") || text.includes("cola")) return respuestas.gluteos;
  if (text.includes("brazo") || text.includes("brazos")) return respuestas.brazos;
  if (text.includes("cara") || text.includes("rostro") || text.includes("papada") || text.includes("cuello")) return respuestas.rostro;

  // Solicitud de precios
  if (text.includes("precio") || text.includes("valor") || text.includes("cuánto")) {
    return "💰 Los precios varían según el diagnóstico y la zona a tratar, pero los planes comienzan *desde $232.000 CLP*. Lo más importante es evaluar primero tu caso para personalizar la energía y duración. 🌿 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Explicaciones técnicas
  if (text.includes("tecnolog") || text.includes("cómo funciona") || text.includes("duel") || text.includes("sesion") || text.includes("frecuencia")) {
    return "🤖 En Body Elite usamos tecnologías no invasivas: HIFU 12D (ultrasonido focalizado para grasa profunda), Cavitación (rompe adipocitos), Radiofrecuencia (estimula colágeno y firmeza), EMS Sculptor (contracciones musculares), y Pink Glow (péptidos regenerativos). 💆‍♀️ Todos los tratamientos son sin dolor y se personalizan mediante inteligencia artificial que calibra energía y frecuencia según tu diagnóstico. 🗓️ Puedes agendar tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return respuestas.no_entendido;
}

// === WEBHOOK META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from?.trim();
    const text = message.text?.body?.toLowerCase().trim() || "";
    if (!from) return res.sendStatus(200);

    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const n of AVISOS) await sendMessage(n, `📢 Aviso: ${from} hizo clic en el enlace de agenda.`);
    }

    const respuesta = detectarIntencion(text);
    await sendMessage(from, respuesta || respuestas.no_entendido);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error al procesar mensaje:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Zara operativa con comprensión por zona y empatía en puerto", PORT));
