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

// === BASE DE RESPUESTAS ===
const responses = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Entiendo lo importante que es sentirte bien contigo. Puedo ayudarte a conocer tratamientos, precios o agendar tu diagnóstico gratuito. 🌸 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito con nuestro sistema IA aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // === TRATAMIENTOS (más cercanos, con beneficios IA) ===
  face_elite: "👑 *Face Élite* ($358.400). Un tratamiento facial de precisión con IA que combina HIFU 12D, radiofrecuencia y Pink Glow. Trabaja en capas profundas (SMAS) para redefinir contornos y mejorar firmeza. 💆‍♀️ No duele, solo sientes calor leve. 4 a 6 sesiones según diagnóstico. Nuestra IA analiza tu piel para ajustar intensidad y profundidad. ✨ Ideal si buscas levantar, tonificar y rejuvenecer sin cirugía.",

  face_antiage: "💫 *Face Antiage* ($281.600). Combina HIFU 12D, radiofrecuencia y Pink Glow regenerativo. Rejuvenece la piel desde el interior, mejora textura y elasticidad. Nuestra IA ajusta la energía según tu tipo de piel, logrando resultados naturales. 🌷 Sin dolor, sin tiempo de recuperación. 4 a 6 sesiones recomendadas.",

  face_light: "🌸 *Face Light* ($128.800). Limpieza facial con luz LED inteligente roja y amarilla, que estimula colágeno y uniforma tono. Ideal para piel joven o primeros signos de fatiga. 💆‍♀️ Relajante e indoloro, 3 a 4 sesiones.",

  face_smart: "🌿 *Face Smart* ($198.400). Combina limpieza profunda, radiofrecuencia y Pink Glow. Aumenta hidratación y firmeza. Nuestra IA regula temperatura y energía para mayor seguridad. 🔹 Indoloro, se recomienda en piel cansada o deshidratada. 4 sesiones promedio.",

  full_face: "🌟 *Full Face* ($584.000). Protocolo integral rostro–cuello–escote con HIFU 12D, radiofrecuencia y Pink Glow. La IA adapta parámetros según tu diagnóstico facial digital, maximizando resultados. 💫 6 sesiones, resultados desde la primera.",

  lipo_focalizada: "🔥 *Lipo Focalizada Reductiva* ($348.800). Cavitación y radiofrecuencia guiadas por IA. Rompe grasa localizada y reafirma piel. 💪 No invasiva, sin dolor. 6 a 8 sesiones. La IA ajusta profundidad y energía según densidad grasa detectada.",

  lipo_express: "⚡ *Lipo Express* ($432.000). Cavitación + radiofrecuencia + EMS Sculptor. La IA mide progresos y ajusta intensidad muscular. Reduce grasa, tonifica y mejora flacidez. 💥 Ideal si hay más de 6 kg de exceso o post parto. 8 sesiones promedio.",

  lipo_reductiva: "💥 *Lipo Reductiva* ($480.000). HIFU 12D + cavitación + radiofrecuencia. Reestructura tejido adiposo y mejora celulitis. La IA controla temperatura para máxima seguridad. 💫 Sin cirugía, sin dolor, visible desde la 2ª sesión.",

  lipo_body_elite: "🏆 *Lipo Body Elite* ($664.000). Nuestro tratamiento estrella integral con IA. Combina HIFU 12D, cavitación, radiofrecuencia y EMS Sculptor. Reduce grasa, tonifica músculo y mejora textura de piel. 🔥 12 sesiones, resultados clínicos visibles. Nuestra IA analiza tu progreso para ajustar cada fase.",

  body_tensor: "💪 *Body Tensor* ($232.000). Radiofrecuencia + LED ámbar inteligente. Reafirma y mejora elasticidad cutánea en brazos, abdomen o piernas. 🌼 IA regula calor según la zona tratada. Indoloro. 4 a 6 sesiones.",

  body_fitness: "🏋️ *Body Fitness* ($360.000). EMS Sculptor con control IA. Simula 20.000 contracciones musculares en 30 minutos. Mejora fuerza y tono en abdomen, glúteos y piernas. 💥 Sin dolor, sensación de contracción intensa pero segura. 6 sesiones promedio.",

  push_up: "🍑 *Push Up* ($376.000). Reafirma y eleva glúteos con EMS Sculptor y radiofrecuencia. La IA adapta la potencia al tipo muscular. Resultados naturales y progresivos. 💫 Indoloro, visible desde la 3ª sesión.",

  diferencias: {
    face_elite_vs_antiage: "💡 *Face Élite* actúa más profundo (SMAS) y trata cuello/papada. *Face Antiage* regenera superficie y firmeza media. Ambos usan IA para ajustar energía y profundidad.",
    lipo_body_elite_vs_reductiva: "💡 *Lipo Body Elite* trabaja grasa y músculo con EMS Sculptor e IA. *Lipo Reductiva* se enfoca solo en grasa y contorno."
  }
};

// === DETECTOR DE EMOCIONES ===
function detectarEmocion(text) {
  const tristeza = ["triste", "pena", "mal", "bajón", "insegura", "vergüenza"];
  const frustracion = ["no puedo", "me cuesta", "no logro", "cansada", "frustrada"];
  const esperanza = ["quiero mejorar", "me gustaría", "necesito cambiar", "quiero sentirme mejor"];
  if (tristeza.some(p => text.includes(p))) return "💛 Entiendo cómo te sientes. Muchas personas llegan con esa misma sensación y logran cambiarla. En Body Elite te acompañamos paso a paso, con tecnología y contención humana. 💫 Cuéntame, ¿te gustaría que te recomiende algo suave para comenzar?";
  if (frustracion.some(p => text.includes(p))) return "🤍 No te preocupes, estás en el lugar correcto. Todo lo que hacemos en Body Elite es sin dolor y con resultados reales. Nuestra IA ajusta la intensidad para tu cuerpo y comodidad. ¿Quieres que te diga cuál sería el mejor punto de partida?";
  if (esperanza.some(p => text.includes(p))) return "✨ Me alegra escucharte con esa motivación. Con nuestros tratamientos guiados por IA podemos crear un plan a tu medida. Cuéntame qué zona quieres trabajar y te explico la mejor opción.";
  return null;
}

// === DETECTOR PRINCIPAL ===
function detectarIntencion(text) {
  text = text.toLowerCase();

  const emocion = detectarEmocion(text);
  if (emocion) return emocion;

  if (text.includes("hola") || text.includes("buenas")) return responses.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return responses.agendar;

  // Faciales
  if (text.includes("arrugas") || text.includes("papada") || text.includes("flacidez cara")) return responses.face_antiage;
  if (text.includes("contorno") || text.includes("rejuvenecer")) return responses.face_elite;
  if (text.includes("limpieza")) return responses.face_light;

  // Corporales
  if (text.includes("muslo") || text.includes("pierna")) return responses.lipo_focalizada;
  if (text.includes("abdomen") || text.includes("barriga") || text.includes("estómago")) return responses.lipo_body_elite;
  if (text.includes("cintura") || text.includes("flanco")) return responses.lipo_reductiva;
  if (text.includes("glúteo") || text.includes("trasero")) return responses.push_up;
  if (text.includes("brazos") || text.includes("brazo")) return responses.body_tensor;
  if (text.includes("celulitis")) return responses.lipo_reductiva;
  if (text.includes("flacidez")) return responses.body_tensor;
  if (text.includes("tonificar") || text.includes("músculo")) return responses.body_fitness;
  if (text.includes("grasa localizada") || text.includes("grasa")) return responses.lipo_express;

  // Diferencias
  if (text.includes("diferencia") || text.includes("distinto")) {
    if (text.includes("face elite") && text.includes("antiage")) return responses.diferencias.face_elite_vs_antiage;
    if (text.includes("lipo body elite") && text.includes("reductiva")) return responses.diferencias.lipo_body_elite_vs_reductiva;
  }

  // Consultas generales
  if (text.includes("consiste") || text.includes("duel") || text.includes("sesion") || text.includes("cómo funciona") || text.includes("tecnolog")) {
    return "💬 Todos nuestros tratamientos combinan tecnologías como HIFU 12D, radiofrecuencia, cavitación, EMS Sculptor y Pink Glow, controladas por inteligencia artificial para máxima precisión y seguridad. 🌿 Son indoloros, personalizados y con resultados visibles desde la primera sesión. 🗓️ Puedes agendar tu diagnóstico aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (text.includes("precio") || text.includes("valor"))
    return "💰 Los precios dependen del plan elegido. Puedo explicarte el tratamiento que te interese o agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  return responses.no_entendido;
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

    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const numero of AVISOS) {
        await sendMessage(numero, `📢 Aviso: ${from} hizo clic en el enlace de agenda.`);
      }
    }

    const respuesta = detectarIntencion(text);
    await sendMessage(from, respuesta || responses.no_entendido);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error al procesar mensaje:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Zara operativa con IA emocional en puerto", PORT));
