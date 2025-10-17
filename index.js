import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const AVISOS = ["+56912345678", "+56987654321"]; // números de aviso interno

// --- FUNCIONES ---
async function sendMessage(to, text) {
  const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_NUMBER_ID + "/messages";
  const data = { messaging_product: "whatsapp", to, text: { body: text } };
  try {
    await axios.post(url, data, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error al enviar mensaje:", err.response?.data || err.message);
  }
}

// --- RESPUESTAS ---
const responses = {
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Puedo ayudarte a conocer nuestros tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  agendar: "📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // === FACIALES ===
  limpieza_facial_full: "💧 *Limpieza Facial Full* ($120.000 / 6 sesiones). Elimina impurezas, células muertas y puntos negros. Mejora textura, luminosidad y absorción de productos. Usa ultrasonido, vapor ozono, extracción y mascarilla hidratante. Ideal para piel grasa, mixta o con tendencia acneica. Zonas: rostro completo.",
  rf_facial: "⚡ *Radiofrecuencia Facial* ($60.000 / 3 sesiones). Estimula colágeno I y III mediante calor profundo. Reafirma la piel, reduce líneas finas y mejora elasticidad sin cirugía. Tecnología: radiofrecuencia multipolar. Zonas: rostro, cuello, papada.",
  face_light: "✨ *Face Light* ($128.800). Limpieza, radiofrecuencia y LED rojo. Mejora textura, luminosidad y tono. Ideal para piel joven o primeros signos de envejecimiento.",
  face_smart: "🌸 *Face Smart* ($198.400). Limpieza profunda, radiofrecuencia y Pink Glow. Hidrata, reafirma y uniforma el tono. Ideal para pieles deshidratadas o con fatiga.",
  face_inicia: "🌿 *Face Inicia* ($270.400). Combina HIFU 12D + radiofrecuencia + Pink Glow. Activa colágeno y mejora firmeza. Ideal para arrugas incipientes o flacidez leve.",
  face_antiage: "💫 *Face Antiage* ($281.600). HIFU 12D + radiofrecuencia + Pink Glow. Rejuvenece rostro, reduce arrugas y redefine contornos. Ideal desde los 35 años.",
  face_elite: "👑 *Face Élite* ($358.400). Plan premium con HIFU 12D intensivo, radiofrecuencia y Pink Glow avanzado. Corrige flacidez, redefine contornos y mejora textura global.",
  full_face: "🌟 *Full Face* ($584.000). Integral rostro-cuello-escote. HIFU 12D, radiofrecuencia, Pink Glow y LED. Rejuvenecimiento total sin cirugía.",

  // === CORPORALES ===
  lipo_focalizada_reductiva: "🔥 *Lipo Focalizada Reductiva* ($348.800). Cavitación + radiofrecuencia. Disminuye grasa localizada y moldea abdomen, cintura o muslos.",
  lipo_express: "⚡ *Lipo Express* ($432.000). Cavitación + radiofrecuencia + EMS Sculptor. Reduce volumen y tonifica músculo. Ideal para exceso >6 kg o flacidez post dieta.",
  lipo_reductiva: "💥 *Lipo Reductiva* ($480.000). HIFU 12D + cavitación + radiofrecuencia. Reduce grasa, mejora celulitis y define contornos.",
  lipo_body_elite: "🏆 *Lipo Body Elite* ($664.000). HIFU 12D + cavitación + radiofrecuencia + EMS Sculptor. Reducción grasa + tonificación muscular en 12 semanas.",
  body_tensor: "💪 *Body Tensor* ($232.000). Radiofrecuencia + LED ámbar. Reafirma y mejora elasticidad en brazos, abdomen o muslos.",
  body_fitness: "🏋️ *Body Fitness* ($360.000). EMS Sculptor: 20.000 contracciones/30 min. Fortalece abdomen, glúteos o piernas. Mejora tono muscular.",
  push_up: "🍑 *Push Up* ($376.000). EMS Sculptor + radiofrecuencia. Eleva y tonifica glúteos sin cirugía. Efecto lifting natural.",

  // === DIFERENCIAS ===
  diferencias: {
    face_elite_vs_antiage: "💡 *Face Élite* trabaja más profundo (HIFU 12D intensivo, rostro y cuello). *Face Antiage* se enfoca en firmeza y regeneración celular superficial.",
    lipo_body_elite_vs_reductiva: "💡 *Lipo Body Elite* incluye EMS Sculptor, actúa sobre grasa y músculo. *Lipo Reductiva* solo trabaja reducción grasa y contorno."
  }
};

// --- INTENTS ---
function detectarIntencion(text) {
  text = text.toLowerCase();

  if (text.includes("hola") || text.includes("buenas")) return responses.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return responses.agendar;

  const mapa = {
    "limpieza facial": responses.limpieza_facial_full,
    "radiofrecuencia": responses.rf_facial,
    "face light": responses.face_light,
    "face smart": responses.face_smart,
    "face inicia": responses.face_inicia,
    "face antiage": responses.face_antiage,
    "face elite": responses.face_elite,
    "full face": responses.full_face,
    "lipo focalizada": responses.lipo_focalizada_reductiva,
    "lipo express": responses.lipo_express,
    "lipo reductiva": responses.lipo_reductiva,
    "lipo body elite": responses.lipo_body_elite,
    "body tensor": responses.body_tensor,
    "body fitness": responses.body_fitness,
    "push up": responses.push_up
  };

  for (const clave in mapa) {
    if (text.includes(clave)) return mapa[clave];
  }

  if ((text.includes("qué es") || text.includes("que es"))) {
    for (const clave in mapa) {
      if (text.includes(clave)) return mapa[clave];
    }
  }

  if (text.includes("diferencia") || text.includes("distinto")) {
    if (text.includes("face elite") && text.includes("antiage"))
      return responses.diferencias.face_elite_vs_antiage;
    if (text.includes("lipo body elite") && text.includes("reductiva"))
      return responses.diferencias.lipo_body_elite_vs_reductiva;
  }

  if (text.includes("precio") || text.includes("valor"))
    return "💰 Los precios dependen del plan. Puedo explicarte el tratamiento que te interese o agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  return responses.no_entendido;
}

// --- WEBHOOK META ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

// --- RECEPCIÓN MENSAJES ---
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const message = entry?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body?.toLowerCase() || "";

  // Aviso al detectar clic de agenda
  if (text.includes("https://agendamiento.reservo.cl")) {
    for (const numero of AVISOS) {
      await sendMessage(numero, `📢 Aviso: ${from} hizo clic en el enlace de agenda.`);
    }
  }

  const respuesta = detectarIntencion(text);
  await sendMessage(from, respuesta);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Zara operativa en puerto", PORT));
