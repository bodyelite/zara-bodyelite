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
const contextoUsuarios = {}; // guarda último tema hablado

async function sendMessage(to, text) {
  const url = "https://graph.facebook.com/v17.0/" + process.env.PHONE_NUMBER_ID + "/messages";
  const data = { messaging_product: "whatsapp", to, text: { body: text } };
  try {
    await axios.post(url, data, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
    });
    console.log("📩 Enviado a", to, ":", text.slice(0, 60));
  } catch (err) {
    console.error("❌ Error al enviar:", err.response?.data || err.message);
  }
}

// ===== RESPUESTAS CLÍNICAS =====
const explicaciones = {
  botox: "💉 *Toxina Botulínica (Botox)*: relaja los músculos faciales responsables de las líneas de expresión. Se aplica en zonas como frente, entrecejo y patas de gallo. Resultado visible desde el 3° día, duración 4–6 meses. No cambia la expresión natural y no duele gracias al microdosificador.",
  pinkglow: "🌸 *Pink Glow*: coctel de péptidos, vitaminas y ácido hialurónico. Regenera células, hidrata y mejora la luminosidad del rostro. Se aplica con mesoterapia superficial. Ideal para piel opaca o con manchas. No deja marcas ni requiere reposo.",
  fullface: "✨ *Full Face*: protocolo integral rostro–cuello–escote calibrado con IA. Combina HIFU 12D, radiofrecuencia y Pink Glow según la densidad de tu piel. Redefine contornos, tensa la piel y mejora textura global. 8–12 sesiones según diagnóstico.",
  hifu: "🔹 *HIFU 12D*: ultrasonido focalizado que actúa en capas profundas (fascia SMAS y grasa subcutánea). Reafirma sin cirugía y estimula colágeno tipo I y III.",
  cavitacion: "🔹 *Cavitación*: ondas de presión que rompen adipocitos. Se usa en abdomen, cintura y muslos. Sensación tibia, sin dolor, reduce volumen y mejora contorno.",
  radiofrecuencia: "🔹 *Radiofrecuencia*: calor endógeno que estimula colágeno y elastina. Mejora firmeza, textura y luminosidad. Aplicable en rostro y cuerpo.",
  ems: "🔹 *EMS Sculptor*: genera contracciones musculares supramáximas (más de 20 000 por sesión) que fortalecen y definen músculo, especialmente abdomen y glúteos."
};

// ===== RESPUESTAS BASE =====
const respuestas = {
  saludo: "👋 ¡Hola! Soy Zara, asistente virtual de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, resolver tus dudas y ayudarte a elegir el plan ideal para ti.",
  agendar: "📅 Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  no_entendido: "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito 🗓️ Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
};

// ===== INTENCIÓN Y CONTEXTO =====
function detectarIntencion(text, from, esPrimerMensaje) {
  text = text.toLowerCase();

  // saludo
  if (text.includes("hola") || text.includes("buenas")) {
    return esPrimerMensaje ? respuestas.saludo : `${respuestas.saludo}\n\n${respuestas.agendar}`;
  }

  // recordar contexto
  const previo = contextoUsuarios[from];

  // detección por tema
  if (text.includes("botox")) {
    contextoUsuarios[from] = "botox";
    return explicaciones.botox + "\n\n¿Quieres que te indique si es adecuado para ti?";
  }
  if (text.includes("pink") || text.includes("glow") || text.includes("pinkglow")) {
    contextoUsuarios[from] = "pinkglow";
    return explicaciones.pinkglow;
  }
  if (text.includes("full face") || text.includes("fullface")) {
    contextoUsuarios[from] = "fullface";
    return explicaciones.fullface;
  }
  if (text.includes("hifu")) return explicaciones.hifu;
  if (text.includes("cavitacion")) return explicaciones.cavitacion;
  if (text.includes("radiofrecuencia")) return explicaciones.radiofrecuencia;
  if (text.includes("ems") || text.includes("sculptor")) return explicaciones.ems;

  // razonamiento sobre algo mencionado
  if (text.includes("qué es") || text.includes("que es") || text.includes("solo") || text.includes("cuál es la diferencia")) {
    if (previo && explicaciones[previo]) {
      return "Claro 😊 " + explicaciones[previo];
    }
  }

  // precios
  const frasesPrecio = ["precio", "valor", "vale", "cuanto", "cost"];
  if (frasesPrecio.some(p => text.includes(p)))
    return "💰 Los planes varían según diagnóstico y zona, pero comienzan *desde $232.000 CLP*. Lo ideal es realizar una evaluación gratuita.";

  // default
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
    const text = message.text?.body?.trim() || "";
    if (!from) return res.sendStatus(200);

    const esPrimerMensaje = !primerosMensajes.has(from);
    if (esPrimerMensaje) primerosMensajes.add(from);

    // Aviso si clic link agenda
    if (text.includes("https://agendamiento.reservo.cl")) {
      for (const numero of AVISOS) {
        await sendMessage(numero, `📢 Aviso automático: ${from} hizo clic en el enlace de agenda (lead interesado).`);
      }
      console.log("📞 Aviso interno enviado por clic de agenda");
    }

    const respuesta = detectarIntencion(text, from, esPrimerMensaje);
    await sendMessage(from, respuesta);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando mensaje:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("✅ Zara operativa con razonamiento clínico, avisos activos y log visible en puerto", PORT)
);
