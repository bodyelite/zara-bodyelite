import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const AVISOS = ["+56912345678", "+56987654321"]; // números internos de aviso

// === FUNCIÓN ENVÍO DE MENSAJES ===
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

// === RESPUESTAS ===
const responses = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  agendar: "📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // === PLANES FACIALES ===
  face_elite: "👑 *Face Élite* ($358.400). HIFU 12D intensivo + radiofrecuencia + Pink Glow. Rejuvenece rostro, cuello y papada. Corrige flacidez, redefine contornos y mejora textura global.",
  face_antiage: "💫 *Face Antiage* ($281.600). HIFU 12D + radiofrecuencia + Pink Glow. Rejuvenece rostro y reduce arrugas sin cirugía.",
  face_smart: "🌸 *Face Smart* ($198.400). Limpieza, radiofrecuencia y Pink Glow. Hidrata, reafirma y mejora tono.",
  face_light: "✨ *Face Light* ($128.800). Limpieza + LED rojo. Ideal para piel joven o primeros signos de envejecimiento.",
  full_face: "🌟 *Full Face* ($584.000). HIFU 12D + radiofrecuencia + Pink Glow + LED. Rejuvenecimiento total rostro, cuello y escote.",

  // === PLANES CORPORALES ===
  lipo_focalizada: "🔥 *Lipo Focalizada Reductiva* ($348.800). Cavitación + radiofrecuencia. Reduce grasa localizada en abdomen, cintura o muslos.",
  lipo_express: "⚡ *Lipo Express* ($432.000). Cavitación + radiofrecuencia + EMS Sculptor. Reduce volumen y tonifica músculos. Ideal si hay más de 6 kg extra.",
  lipo_reductiva: "💥 *Lipo Reductiva* ($480.000). HIFU 12D + cavitación + radiofrecuencia. Reduce grasa, celulitis y mejora contorno corporal.",
  lipo_body_elite: "🏆 *Lipo Body Elite* ($664.000). HIFU 12D + cavitación + radiofrecuencia + EMS Sculptor. Reduce grasa y tonifica músculos en abdomen, flancos y glúteos.",
  body_tensor: "💪 *Body Tensor* ($232.000). Radiofrecuencia + LED ámbar. Reafirma piel flácida en brazos, abdomen o piernas.",
  body_fitness: "🏋️ *Body Fitness* ($360.000). EMS Sculptor: contracciones musculares profundas. Fortalece abdomen, glúteos o piernas.",
  push_up: "🍑 *Push Up* ($376.000). EMS Sculptor + radiofrecuencia. Eleva y tonifica glúteos sin cirugía. Efecto lifting natural.",

  // === DIFERENCIAS ===
  diferencias: {
    face_elite_vs_antiage: "💡 *Face Élite* actúa más profundo y trata cuello/papada. *Face Antiage* se centra en firmeza y regeneración superficial.",
    lipo_body_elite_vs_reductiva: "💡 *Lipo Body Elite* trabaja grasa y músculo con EMS Sculptor. *Lipo Reductiva* solo grasa y contorno."
  }
};

// === DETECTOR DE INTENCIÓN ===
function detectarIntencion(text) {
  text = text.toLowerCase();

  // saludos y agendamiento
  if (text.includes("hola") || text.includes("buenas")) return responses.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return responses.agendar;

  // --- FACIALES
  if (text.includes("arrugas") || text.includes("flacidez cara") || text.includes("papada")) return responses.face_antiage;
  if (text.includes("contorno") || text.includes("rejuvenecer")) return responses.face_elite;
  if (text.includes("limpieza")) return responses.face_light;

  // --- CORPORALES SEGÚN ZONA
  if (text.includes("muslo") || text.includes("pierna")) return responses.lipo_focalizada;
  if (text.includes("abdomen") || text.includes("barriga") || text.includes("estómago")) return responses.lipo_body_elite;
  if (text.includes("cintura") || text.includes("flanco")) return responses.lipo_reductiva;
  if (text.includes("glúteo") || text.includes("trasero")) return responses.push_up;
  if (text.includes("brazos") || text.includes("brazo")) return responses.body_tensor;
  if (text.includes("celulitis")) return responses.lipo_reductiva;
  if (text.includes("flacidez")) return responses.body_tensor;
  if (text.includes("tonificar") || text.includes("músculo")) return responses.body_fitness;
  if (text.includes("grasa localizada") || text.includes("grasa") || text.includes("reducir")) return responses.lipo_express;

  // diferencias
  if (text.includes("diferencia") || text.includes("distinto")) {
    if (text.includes("face elite") && text.includes("antiage")) return responses.diferencias.face_elite_vs_antiage;
    if (text.includes("lipo body elite") && text.includes("reductiva")) return responses.diferencias.lipo_body_elite_vs_reductiva;
  }

  // precios
  if (text.includes("precio") || text.includes("valor"))
    return "💰 Los precios dependen del plan elegido. Puedo explicarte el tratamiento o agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  return responses.no_entendido;
}

// === VERIFICACIÓN META ===
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

    if (!from) {
      console.error("⚠️ No se recibió número del remitente.");
      return res.sendStatus(200);
    }

    // Aviso cuando clickea agenda
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
app.listen(PORT, () => console.log("✅ Zara operativa en puerto", PORT));
