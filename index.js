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

// ===== FUNCIÓN ENVÍO =====
async function sendMessage(to, text) {
  const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_NUMBER_ID + "/messages";
  const data = { messaging_product: "whatsapp", to, text: { body: text } };
  try {
    await axios.post(url, data, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
  }
}

// ===== RESPUESTAS =====
const respuestas = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Puedo ayudarte a conocer nuestros tratamientos corporales y faciales, resolver dudas o agendar tu diagnóstico gratuito. 🌸 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito con nuestro sistema IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  abdomen: "💬 En la zona abdominal tratamos grasa localizada y flacidez. Los planes recomendados son *Lipo Body Elite*, *Lipo Reductiva* y *Lipo Express*.\n\n🔹 *Lipo Body Elite*: combina HIFU 12D, cavitación, radiofrecuencia y EMS Sculptor. Reduce grasa, tonifica y reafirma. \n🔹 *Lipo Reductiva*: HIFU 12D + RF profunda, ideal para celulitis y piel suelta. \n🔹 *Lipo Express*: sesiones rápidas para grasa leve o mantenimiento. \n\nSin dolor, sensación tibia o contracciones suaves. 8–12 sesiones, 1–2 veces por semana. 🌿 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  muslos: "🍃 En muslos y piernas trabajamos *Lipo Focalizada Reductiva* o *Body Tensor*, según si predomina grasa o flacidez.\n\n🔹 *Lipo Focalizada*: cavitación + radiofrecuencia guiadas por IA que reducen grasa localizada, mejoran textura y celulitis. \n🔹 *Body Tensor*: radiofrecuencia con LED ámbar para estimular colágeno y tensar piel. \n\nTratamientos sin dolor. Se siente calor moderado, 6 a 8 sesiones semanales. 🌸 Agenda evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  gluteos: "🍑 Para glúteos aplicamos *Push Up* y *Body Fitness*.\n\n🔹 *Push Up*: radiofrecuencia + EMS Sculptor que levanta y mejora textura cutánea. \n🔹 *Body Fitness*: contracciones musculares profundas (más de 20.000 en 30 min) para firmeza y tonificación. \n\nSin dolor, solo contracción controlada. 2 sesiones por semana. 💫 Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  brazos: "💪 En brazos usamos *Body Tensor* o *Lipo Focalizada Reductiva* según si hay flacidez o grasa localizada. \n\n🔹 *Body Tensor*: radiofrecuencia + LED ámbar reafirmante. \n🔹 *Lipo Focalizada*: cavitación + RF para eliminar grasa del tríceps posterior. \n\nSin dolor, calor leve. 4–6 sesiones. 🌼 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  rostro: "🌸 En rostro y cuello trabajamos *Face Elite*, *Face Antiage*, *Full Face*, *Pink Glow* y *Toxina Botulínica (Botox)*.\n\n🔹 *Face Elite*: HIFU 12D + RF + Pink Glow. Levanta, redefine y mejora textura. \n🔹 *Face Antiage*: RF + HIFU + Pink Glow regenerativo. Suaviza arrugas y líneas. \n🔹 *Full Face*: rostro–cuello–escote calibrado con IA. \n🔹 *Pink Glow*: coctel de péptidos y ácido hialurónico para luminosidad inmediata. \n🔹 *Botox*: relaja músculos faciales para suavizar expresión sin alterar gestos. \n\nTodos sin dolor. 4–6 sesiones o aplicación única. 💆‍♀️ Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  flacidez: "🌿 La *flacidez corporal o facial* se trata con *Body Tensor*, *Face Antiage* o *Face Elite*, según la zona. \n\nEstas combinan radiofrecuencia, LED ámbar y HIFU 12D para estimular colágeno y elastina, reafirmando la piel sin dolor. \n\n8–12 sesiones, sensación de calor agradable. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  precios: "💰 Los precios varían según diagnóstico y zona, pero los planes comienzan *desde $232.000 CLP*. 🌸 Lo ideal es una evaluación para definir energía, sesiones y plan óptimo. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
};

// ===== EMOCIONES =====
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "vergüenza", "bajón", "insegura"];
  const frustracion = ["no puedo", "me cuesta", "frustrada", "rendida", "agotada"];
  const esperanza = ["quiero mejorar", "necesito cambiar", "me gustaría", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. En Body Elite acompañamos cada proceso con empatía y tecnología sin dolor. ¿Te gustaría que te recomiende algo para comenzar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar correcto. Nuestros tratamientos son personalizados por IA y no invasivos. ¿Quieres que te recomiende uno?";
  if (esperanza.some(p => text.includes(p))) return "✨ Me alegra escucharlo. Personalizamos cada plan con IA y seguimiento clínico. Cuéntame qué zona te gustaría trabajar.";
  return null;
}

// ===== INTENCIÓN =====
function detectarIntencion(text) {
  text = text.toLowerCase().trim();
  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas")) return respuestas.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return respuestas.agendar;

  if (text.includes("abdomen") || text.includes("barriga") || text.includes("vientre") || text.includes("cintura")) return respuestas.abdomen;
  if (text.includes("muslo") || text.includes("muslos") || text.includes("pierna") || text.includes("piernas")) return respuestas.muslos;
  if (text.includes("gluteo") || text.includes("glúteo") || text.includes("cola") || text.includes("trasero")) return respuestas.gluteos;
  if (text.includes("brazo") || text.includes("brazos")) return respuestas.brazos;
  if (text.includes("cara") || text.includes("rostro") || text.includes("papada") || text.includes("cuello") || text.includes("botox") || text.includes("toxina")) return respuestas.rostro;
  if (text.includes("flacidez") || text.includes("piel suelta") || text.includes("colgando")) return respuestas.flacidez;

  const frasesPrecio = ["precio", "valor", "cuanto", "vale", "valen", "sale", "me sale", "cobran", "cuanto vale", "cuanto valen", "que cuesta", "que sale"];
  if (frasesPrecio.some(p => text.includes(p))) return respuestas.precios;

  if (text.includes("tecnolog") || text.includes("funciona") || text.includes("duel") || text.includes("sesion") || text.includes("frecuencia") || text.includes("como es") || text.includes("que usan")) {
    return "🤖 En Body Elite usamos HIFU 12D, Cavitación, Radiofrecuencia, EMS Sculptor, Pink Glow y Toxina Botulínica. ✨ Todos son sin dolor y calibrados con IA. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return respuestas.no_entendido;
}

// ===== WEBHOOK META =====
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// ===== MENSAJES =====
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from?.trim();
    const text = message.text?.body?.toLowerCase().trim() || "";
    if (!from) return res.sendStatus(200);

    // Aviso a recepción
    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const numero of AVISOS) {
        await sendMessage(numero, `📢 Aviso automático: ${from} hizo clic en el enlace de agenda (lead interesado).`);
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
app.listen(PORT, () => console.log("✅ Zara operativa con comprensión mejorada y avisos activos en puerto", PORT));
