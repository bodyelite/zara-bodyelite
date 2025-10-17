import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const AVISOS = ["+56983300262", "+56931720760", "+56937648536"];

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

// === RESPUESTAS ===
const respuestas = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Puedo ayudarte a conocer nuestros tratamientos corporales y faciales, resolver dudas o agendar tu diagnóstico gratuito. 🌸 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito con nuestro sistema IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // CORPORAL
  abdomen: "💬 En la zona abdominal se puede trabajar grasa localizada, flacidez o tonicidad muscular. Los planes recomendados son *Lipo Body Elite*, *Lipo Reductiva* o *Lipo Express*. \n\n🔹 *Lipo Body Elite*: protocolo integral con HIFU 12D, cavitación, radiofrecuencia y EMS Sculptor. Reafirma piel, reduce grasa y tonifica músculo en la misma sesión. IA ajusta energía según diagnóstico.\n🔹 *Lipo Reductiva*: combina HIFU 12D y radiofrecuencia profunda para reducir volumen y mejorar firmeza sin cirugía.\n🔹 *Lipo Express*: sesiones más rápidas de cavitación + RF + EMS focalizada. Ideal si hay poco tiempo o grasa leve. \n\nNo duele; puede sentirse calor o contracción leve. 8 a 12 sesiones, 1 o 2 por semana. 🌿 Te recomiendo una evaluación gratuita para definir el mejor plan 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  muslos: "🍃 Para muslos y piernas trabajamos con *Lipo Focalizada Reductiva* o *Body Tensor*, según si hay grasa o flacidez predominante.\n\n🔹 *Lipo Focalizada Reductiva*: cavitación y radiofrecuencia guiadas por IA para disolver grasa localizada y mejorar textura.\n🔹 *Body Tensor*: radiofrecuencia + LED ámbar que estimula colágeno y elastina. \n\nIndoloros; se siente calor leve y relajante. 6 a 8 sesiones. 🌸 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  gluteos: "🍑 En glúteos aplicamos *Push Up* y *Body Fitness* según necesidad.\n\n🔹 *Push Up*: radiofrecuencia + EMS Sculptor que levanta, tonifica y mejora textura cutánea.\n🔹 *Body Fitness*: sesiones intensas de contracciones musculares (20 000 en 30 min). Aumenta tono y firmeza.\n\nSin dolor, solo sensación de contracción profunda. 2 sesiones por semana. 💫 Agenda evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  brazos: "💪 Para brazos usamos *Body Tensor* o *Lipo Focalizada Reductiva* según si buscas firmeza o reducción.\n\n🔹 *Body Tensor*: radiofrecuencia + LED ámbar para flacidez. Mejora firmeza desde la primera sesión.\n🔹 *Lipo Focalizada*: cavitación + RF que elimina grasa localizada posterior. \n\nTratamientos cómodos y sin dolor. 4 a 6 sesiones. 🌼 Agenda diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // FACIAL
  rostro: "🌸 En rostro y cuello trabajamos *Face Elite*, *Face Antiage*, *Full Face*, *Pink Glow* y *Toxina Botulínica* (Botox). \n\n🔹 *Face Elite*: HIFU 12D + RF + Pink Glow. Levanta, redefine contornos y mejora textura.\n🔹 *Face Antiage*: RF + HIFU + Pink Glow regenerativo. Disminuye arrugas y líneas finas.\n🔹 *Full Face*: rostro, cuello y escote con calibración IA según densidad tisular.\n🔹 *Pink Glow*: coctel de péptidos, ácido hialurónico y antioxidantes para luminosidad y firmeza inmediata.\n🔹 *Toxina Botulínica* (Botox): relaja músculos faciales para suavizar líneas de expresión sin alterar gestos naturales. Efecto visible a los 5 días. \n\nTodos son indoloros. De 4 a 6 sesiones, o aplicación única en el caso de Botox. 💆‍♀️ Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  precios: "💰 Los precios dependen del diagnóstico y zona, pero los planes comienzan *desde $232.000 CLP*. La IA ajusta sesiones y energía según tu caso. 🌿 Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
};

// === DETECTOR DE EMOCIÓN ===
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "vergüenza", "bajón", "insegura"];
  const frustracion = ["no puedo", "me cuesta", "frustrada", "rendida", "agotada"];
  const esperanza = ["quiero mejorar", "necesito cambiar", "me gustaría", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. En Body Elite acompañamos cada proceso con empatía y tecnología sin dolor. ¿Quieres que te recomiende algo para comenzar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar correcto. Nuestros tratamientos son seguros y personalizados con IA. ¿Te cuento cuál sería ideal para ti?";
  if (esperanza.some(p => text.includes(p))) return "✨ Me alegra escuchar eso. Personalizamos cada plan con inteligencia artificial y seguimiento clínico. Cuéntame qué zona te gustaría trabajar.";
  return null;
}

// === DETECTOR DE INTENCIÓN ===
function detectarIntencion(text) {
  text = text.toLowerCase().trim();

  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas")) return respuestas.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return respuestas.agendar;

  // ZONAS
  if (text.includes("abdomen") || text.includes("barriga") || text.includes("vientre")) return respuestas.abdomen;
  if (text.includes("muslo") || text.includes("pierna")) return respuestas.muslos;
  if (text.includes("gluteo") || text.includes("cola") || text.includes("trasero")) return respuestas.gluteos;
  if (text.includes("brazo") || text.includes("brazos")) return respuestas.brazos;
  if (text.includes("cara") || text.includes("rostro") || text.includes("papada") || text.includes("cuello") || text.includes("botox") || text.includes("toxina")) return respuestas.rostro;

  // Precios y modismos
  const frasesPrecio = ["precio", "valor", "cuánto", "cuanto", "vale", "valen", "sale", "me sale", "cobran", "cuánto vale", "cuánto valen", "qué cuesta", "qué sale"];
  if (frasesPrecio.some(p => text.includes(p))) return respuestas.precios;

  // Tecnología / sensaciones
  if (text.includes("tecnolog") || text.includes("funciona") || text.includes("duel") || text.includes("sesion") || text.includes("frecuencia") || text.includes("cómo es") || text.includes("que usan"))) {
    return "🤖 En Body Elite usamos tecnologías no invasivas: *HIFU 12D* (ultrasonido focalizado), *Cavitación* (rompe adipocitos), *Radiofrecuencia* (estimula colágeno), *EMS Sculptor* (contracción muscular profunda), *Pink Glow* (bioestimulante) y *Toxina Botulínica* para expresión facial controlada. Todos son sin dolor y guiados por IA según tu diagnóstico. 🗓️ Agenda evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
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

    // Aviso interno si hace clic en link
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
app.listen(PORT, () => console.log("✅ Zara operativa con comprensión ampliada y avisos activos en puerto", PORT));
