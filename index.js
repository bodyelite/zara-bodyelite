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
  saludo: "👋 ¡Hola! Soy Zara, asistente virtual de Body Elite. Estoy aquí para orientarte sobre tratamientos corporales y faciales, resolver tus dudas y ayudarte a elegir el plan ideal para ti.",

  agendar: "📅 Puedes agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  abdomen: "💬 En abdomen tratamos grasa localizada y flacidez. Recomendamos *Lipo Body Elite*, *Lipo Reductiva* o *Lipo Express*.\n\n🔹 *Lipo Body Elite*: HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor para reducir grasa y tonificar.\n🔹 *Lipo Reductiva*: HIFU 12D + RF profunda, ideal para celulitis y piel suelta.\n🔹 *Lipo Express*: sesiones rápidas con cavitación + RF + EMS focalizada.\n\nSin dolor, con resultados visibles desde la 3.ª sesión. 🌿 Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  muslos: "🍃 En muslos y piernas trabajamos *Lipo Focalizada Reductiva* y *Body Tensor*, según si predomina grasa o flacidez.\n\n🔹 *Lipo Focalizada*: cavitación + radiofrecuencia + IA para grasa localizada y celulitis.\n🔹 *Body Tensor*: RF + LED ámbar para estimular colágeno y tensar piel.\n\nSin dolor. 6 a 8 sesiones semanales. 🌸 Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  gluteos: "🍑 En glúteos aplicamos *Push Up* y *Body Fitness*.\n\n🔹 *Push Up*: radiofrecuencia + EMS Sculptor para elevar y reafirmar.\n🔹 *Body Fitness*: contracciones supramáximas (> 20.000/30 min) para tonificar.\n\n2 sesiones por semana. 💫 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  rostro: "🌸 En rostro y cuello trabajamos *Face Elite*, *Face Antiage*, *Full Face*, *Pink Glow* y *Toxina Botulínica (Botox)*.\n\n🔹 *Face Elite*: HIFU 12D + RF + Pink Glow.\n🔹 *Face Antiage*: RF + HIFU + coctel regenerativo.\n🔹 *Full Face*: rostro–cuello–escote calibrado por IA.\n🔹 *Pink Glow*: péptidos + ácido hialurónico para luminosidad.\n🔹 *Botox*: relaja músculos sin cambiar gestos.\n\nSin dolor. 💆‍♀️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  flacidez: "🌿 La *flacidez corporal o facial* se trata con *Body Tensor*, *Face Antiage* o *Face Elite*, según la zona. \n\nEstas combinan radiofrecuencia, LED ámbar y HIFU 12D para estimular colágeno y elastina, reafirmando sin dolor. 🌼 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  precios: "💰 Los precios varían según diagnóstico y zona, pero los planes comienzan *desde $232.000 CLP*. 🌸 Agenda tu evaluación aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
};

// ===== EMOCIONES =====
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "vergüenza", "bajón", "insegura"];
  const frustracion = ["no puedo", "me cuesta", "frustrada", "rendida", "agotada"];
  const esperanza = ["quiero mejorar", "necesito cambiar", "me gustaría", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. En Body Elite acompañamos cada proceso con empatía y tecnología sin dolor. ¿Te gustaría que te recomiende algo para comenzar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar correcto. Nuestros tratamientos son personalizados con IA y sin dolor. ¿Quieres que te recomiende uno?";
  if (esperanza.some(p => text.includes(p))) return "✨ Me alegra escucharlo. Personalizamos cada plan con IA y seguimiento clínico. Cuéntame qué zona te gustaría trabajar.";
  return null;
}

// ===== INTENCIÓN =====
function detectarIntencion(text, esPrimerMensaje = false) {
  text = text.toLowerCase().trim();
  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas"))
    return esPrimerMensaje ? respuestas.saludo : `${respuestas.saludo}\n\n${respuestas.agendar}`;

  if (text.includes("agenda") || text.includes("agendar")) return respuestas.agendar;

  if (text.includes("abdomen") || text.includes("barriga") || text.includes("vientre") || text.includes("cintura"))
    return respuestas.abdomen;
  if (text.includes("muslo") || text.includes("pierna")) return respuestas.muslos;
  if (text.includes("gluteo") || text.includes("glúteo") || text.includes("cola")) return respuestas.gluteos;
  if (text.includes("brazo") || text.includes("brazos")) return respuestas.gluteos;
  if (text.includes("cara") || text.includes("rostro") || text.includes("papada") || text.includes("botox"))
    return respuestas.rostro;
  if (text.includes("flacidez") || text.includes("piel suelta") || text.includes("colgando"))
    return respuestas.flacidez;

  const frasesPrecio = ["precio", "valor", "cuanto", "vale", "valen", "sale", "cobran", "cuesta"];
  if (frasesPrecio.some(p => text.includes(p))) return respuestas.precios;

  if (text.includes("tecnolog") || text.includes("funciona") || text.includes("duel") || text.includes("sesion") || text.includes("frecuencia") || text.includes("como es") || text.includes("que usan"))
    return "🤖 En Body Elite usamos HIFU 12D, Cavitación, Radiofrecuencia, EMS Sculptor, Pink Glow y Toxina Botulínica. Todos sin dolor y calibrados con IA.";

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
const primerosMensajes = new Set();

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from?.trim();
    const text = message.text?.body?.toLowerCase().trim() || "";
    if (!from) return res.sendStatus(200);

    // Detectar si es primer mensaje del número
    const esPrimerMensaje = !primerosMensajes.has(from);
    if (esPrimerMensaje) primerosMensajes.add(from);

    // Aviso interno si el usuario hace clic en link de agenda
    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const numero of AVISOS) {
        await sendMessage(numero, `📢 Aviso automático: ${from} hizo clic en el enlace de agenda (lead interesado).`);
      }
    }

    const respuesta = detectarIntencion(text, esPrimerMensaje);
    await sendMessage(from, respuesta || respuestas.no_entendido);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Zara operativa con aviso interno y saludo sin agenda en puerto", PORT));
