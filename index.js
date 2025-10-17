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
  saludo: "👋 ¡Hola! Soy Zara, asistente de Body Elite. Entiendo lo importante que es sentirte bien con tu cuerpo. Puedo ayudarte a conocer tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  agendar: "📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",

  // === TRATAMIENTOS CON DETALLES ===
  face_elite: "👑 *Face Élite* ($358.400). Es un tratamiento facial avanzado que combina HIFU 12D, radiofrecuencia y Pink Glow. Actúa en capas profundas (SMAS) para tensar y rejuvenecer rostro, cuello y papada. 💆‍♀️ No duele, solo se siente un calor suave. Requiere entre 3 y 6 sesiones, con resultados visibles desde la primera. Ideal para flacidez, papada y contorno facial.",

  face_antiage: "💫 *Face Antiage* ($281.600). Trabaja firmeza y arrugas finas combinando HIFU 12D, radiofrecuencia y Pink Glow regenerativo. Estimula colágeno y mejora textura sin agujas ni dolor. ✨ Se realizan entre 4 y 6 sesiones, con efecto lifting progresivo.",

  face_smart: "🌸 *Face Smart* ($198.400). Limpieza profunda, radiofrecuencia y Pink Glow. Mejora hidratación, firmeza y luminosidad. Ideal para piel cansada o con fatiga. 🔹 Es totalmente indoloro, se siente tibio y relajante. 4 sesiones promedio.",

  face_light: "✨ *Face Light* ($128.800). Limpieza facial y luz LED roja regeneradora. Aporta brillo y uniformidad. 💆 Ideal para piel joven o primeras líneas. 3 a 4 sesiones, sin molestias.",

  full_face: "🌟 *Full Face* ($584.000). Tratamiento integral rostro–cuello–escote con HIFU 12D, radiofrecuencia, Pink Glow y LED terapia. Corrige flacidez, textura y tono. Resultados visibles desde la primera sesión. 🔸 Recomendado una vez al mes.",

  lipo_focalizada: "🔥 *Lipo Focalizada Reductiva* ($348.800). Cavitación y radiofrecuencia que rompen grasa localizada y mejoran firmeza. Ideal para abdomen, cintura o muslos. 💥 No duele, se siente calor moderado. 6 a 8 sesiones según zona.",

  lipo_express: "⚡ *Lipo Express* ($432.000). Cavitación, radiofrecuencia y EMS Sculptor. Reduce grasa, define y tonifica músculos. Perfecto si hay más de 6 kg de exceso o flacidez post dieta. 💪 No invasivo, sensación de calor y contracciones musculares controladas. 8 sesiones promedio.",

  lipo_reductiva: "💥 *Lipo Reductiva* ($480.000). HIFU 12D + cavitación + radiofrecuencia. Disminuye grasa, mejora celulitis y contorno corporal. 💫 Sin cirugía, sin dolor, sin recuperación. 6 sesiones promedio con resultados medibles.",

  lipo_body_elite: "🏆 *Lipo Body Elite* ($664.000). Es nuestro protocolo más completo: HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor. Reduce grasa, reafirma piel y tonifica músculo en abdomen, flancos y glúteos. 🔥 12 sesiones programadas. Sensación tibia y contracciones musculares leves. Resultados visibles desde la 2ª sesión.",

  body_tensor: "💪 *Body Tensor* ($232.000). Radiofrecuencia + LED ámbar. Reafirma y mejora elasticidad en brazos, abdomen o piernas. 🌼 No duele y se realiza en 4 a 6 sesiones. Ideal post baja de peso o flacidez leve.",

  body_fitness: "🏋️ *Body Fitness* ($360.000). EMS Sculptor de alta potencia. Estimula 20.000 contracciones musculares por sesión, fortaleciendo y tonificando. Perfecto para abdomen, glúteos o piernas. 🔹 Se siente contracción intensa pero controlada. 6 sesiones promedio.",

  push_up: "🍑 *Push Up* ($376.000). Eleva y tonifica glúteos sin cirugía. Usa EMS Sculptor y radiofrecuencia para firmeza y volumen natural. 💫 Indoloro y seguro. Resultados visibles en 4 a 6 sesiones.",

  diferencias: {
    face_elite_vs_antiage: "💡 *Face Élite* actúa en capas más profundas y trata cuello/papada. *Face Antiage* se centra en regenerar y tensar superficie facial.",
    lipo_body_elite_vs_reductiva: "💡 *Lipo Body Elite* trabaja grasa y músculo con EMS Sculptor. *Lipo Reductiva* solo grasa y contorno."
  }
};

// === DETECCIÓN DE INTENCIÓN ===
function detectarIntencion(text) {
  text = text.toLowerCase();

  // saludos
  if (text.includes("hola") || text.includes("buenas")) return responses.saludo;
  if (text.includes("agenda") || text.includes("agendar")) return responses.agendar;

  // --- FACIALES
  if (text.includes("arrugas") || text.includes("papada") || text.includes("flacidez cara")) return responses.face_antiage;
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
  if (text.includes("grasa localizada") || text.includes("grasa")) return responses.lipo_express;

  // --- DIFERENCIAS
  if (text.includes("diferencia") || text.includes("distinto")) {
    if (text.includes("face elite") && text.includes("antiage")) return responses.diferencias.face_elite_vs_antiage;
    if (text.includes("lipo body elite") && text.includes("reductiva")) return responses.diferencias.lipo_body_elite_vs_reductiva;
  }

  // --- CONSULTAS DE EXPLICACIÓN
  if (text.includes("consiste") || text.includes("duel") || text.includes("sesion") || text.includes("cómo funciona")) {
    return "💬 Todos nuestros tratamientos son no invasivos y sin dolor. Combinan aparatología avanzada (HIFU 12D, radiofrecuencia, cavitación, EMS Sculptor y Pink Glow) para reducir grasa, reafirmar y regenerar la piel. Los resultados son progresivos desde la primera sesión y personalizados según diagnóstico. 🗓️ Puedes agendar una evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
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
