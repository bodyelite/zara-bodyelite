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

// === FUNCIÓN ENVÍO DE MENSAJES ===
async function sendMessage(to, text) {
  const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_NUMBER_ID + "/messages";
  const data = { messaging_product: "whatsapp", to, text: { body: text } };
  try {
    await axios.post(url, data, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
  }
}

// === BASE DE RESPUESTAS ===
const respuestas = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Entiendo lo importante que es sentirte bien contigo. Puedo orientarte sobre tratamientos, aparatología o agendar tu diagnóstico gratuito. 🌸 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito con nuestro sistema IA aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  abdomen: "💬 Para la zona abdominal existen varias opciones según el tipo de grasa o flacidez que presente la piel. Los tratamientos más indicados son *Lipo Body Elite*, *Lipo Reductiva* y *Lipo Express*. \n\n🔹 *Lipo Body Elite*: HIFU 12D + cavitación + radiofrecuencia + EMS Sculptor. Trabaja grasa y músculo simultáneamente, modelando cintura y reafirmando piel.\n🔹 *Lipo Reductiva*: HIFU 12D y radiofrecuencia para reducir grasa y celulitis sin cirugía.\n🔹 *Lipo Express*: cavitación y radiofrecuencia más estimulación muscular rápida. \n\nNo duelen, se sienten cálidos o con leves contracciones. Normalmente se realizan entre 8 y 12 sesiones, 1 o 2 veces por semana. 🌿 Lo ideal es agendar una evaluación gratuita para definir el protocolo más efectivo para ti. 🗓️ 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  muslos: "🍃 Para muslos y piernas aplicamos *Lipo Focalizada Reductiva* o *Body Tensor*. \n\n🔹 *Lipo Focalizada Reductiva*: cavitación y radiofrecuencia guiadas por IA para disolver grasa y mejorar textura. \n🔹 *Body Tensor*: radiofrecuencia con LED ámbar reafirmante. \n\nSin dolor, se percibe calor leve. De 6 a 8 sesiones semanales. 🌸 Lo ideal es una evaluación gratuita para definir el mejor protocolo 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  gluteos: "🍑 Para glúteos los tratamientos más efectivos son *Push Up* y *Body Fitness*. \n\n🔹 *Push Up*: radiofrecuencia + EMS Sculptor para levantar y tonificar. \n🔹 *Body Fitness*: contracciones musculares profundas (20.000 por sesión). \n\nIndoloros, se sienten contracciones controladas. 2 sesiones por semana. 💫 Agenda una evaluación gratuita para personalizar tu plan 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  brazos: "💪 En brazos recomendamos *Body Tensor* o *Lipo Focalizada Reductiva*. \n\n🔹 *Body Tensor*: radiofrecuencia y LED ámbar para flacidez. \n🔹 *Lipo Focalizada*: cavitación + radiofrecuencia para grasa localizada. \n\nNo duele, se siente calor suave. 4 a 6 sesiones semanales. 🌼 Agenda evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  rostro: "🌸 Para rostro y papada los más recomendados son *Face Élite*, *Face Antiage* y *Full Face*. \n\n🔹 *Face Élite*: HIFU 12D + radiofrecuencia + Pink Glow. Levanta y redefine contorno facial. \n🔹 *Face Antiage*: HIFU 12D + Pink Glow regenerativo. Suaviza arrugas y mejora elasticidad. \n🔹 *Full Face*: rostro–cuello–escote con IA que calibra energía según diagnóstico. \n\nSin dolor, sensación de calor relajante. 4 a 6 sesiones. 💆‍♀️ Agenda una evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  precios: "💰 Los precios varían según diagnóstico y zona tratada, pero los planes comienzan *desde $232.000 CLP*. Lo más importante es evaluar primero tu caso para personalizar la energía y duración. 🌿 Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
};

// === DETECTOR DE EMOCIONES ===
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "insegura", "vergüenza", "bajón"];
  const frustracion = ["no puedo", "me cuesta", "frustrada", "cansada", "rendida"];
  const esperanza = ["quiero mejorar", "me gustaría", "necesito cambiar", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. En Body Elite acompañamos cada proceso con cercanía y tecnología no invasiva. ¿Quieres que te recomiende algo para empezar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar indicado. Nuestros tratamientos son sin dolor y adaptados por IA. ¿Quieres que te ayude a elegir el mejor para ti?";
  if (esperanza.some(p => text.includes(p))) return "✨ Qué bueno escuchar eso. Con tecnología y evaluación IA personalizamos tu plan para lograr resultados reales. Cuéntame qué zona te gustaría trabajar.";
  return null;
}

// === DETECTOR DE INTENCIÓN ===
function detectarIntencion(text) {
  text = text.toLowerCase().trim();

  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas")) return respuestas.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return respuestas.agendar;

  // ZONAS CORPORALES / FACIALES
  if (text.includes("abdomen") || text.includes("barriga") || text.includes("vientre"))) return respuestas.abdomen;
  if (text.includes("muslo") || text.includes("pierna"))) return respuestas.muslos;
  if (text.includes("gluteo") || text.includes("cola") || text.includes("trasero"))) return respuestas.gluteos;
  if (text.includes("brazo") || text.includes("brazos"))) return respuestas.brazos;
  if (text.includes("rostro") || text.includes("cara") || text.includes("papada") || text.includes("cuello"))) return respuestas.rostro;

  // Sinónimos para precios
  const palabrasPrecio = ["precio", "valor", "cuánto", "cuanto", "vale", "valen", "sale", "me sale", "cobran"];
  if (palabrasPrecio.some(p => text.includes(p))) return respuestas.precios;

  // Tecnología / funcionamiento
  if (text.includes("tecnolog") || text.includes("funciona") || text.includes("duel") || text.includes("sesion") || text.includes("frecuencia"))) {
    return "🤖 En Body Elite usamos tecnologías no invasivas: HIFU 12D (ultrasonido focalizado), Cavitación (rompe grasa), Radiofrecuencia (firmeza), EMS Sculptor (tonificación muscular) y Pink Glow (regeneración celular). ✨ Todas son indoloras y calibradas con IA según tu diagnóstico. Lo mejor es realizar una evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
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

// === RECEPCIÓN MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from?.trim();
    const text = message.text?.body?.toLowerCase().trim() || "";
    if (!from) return res.sendStatus(200);

    // --- Aviso al presionar link ---
    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const numero of AVISOS) {
        await sendMessage(numero, `📢 Aviso automático: ${from} hizo clic en el enlace de agenda (posible lead interesado).`);
      }
    }

    const respuesta = detectarIntencion(text);
    await sendMessage(from, respuesta || respuestas.no_entendido);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Zara operativa con comprensión reforzada y avisos activos en puerto", PORT));
