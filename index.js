import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
const MEMORIA_FILE = "./contexto_memoria.json";
const FRASES_FILE = "./frases.json";

// ==================== CARGA DE MEMORIA ==================== //
let memoria = {};
try {
  memoria = fs.existsSync(MEMORIA_FILE)
    ? JSON.parse(fs.readFileSync(MEMORIA_FILE, "utf8"))
    : { ejemplos: [] };
} catch {
  memoria = { ejemplos: [] };
}

// ==================== CARGA DE FRASES ==================== //
let frases = [];
try {
  frases = fs.existsSync(FRASES_FILE)
    ? JSON.parse(fs.readFileSync(FRASES_FILE, "utf8"))
    : [];
  console.log(`📘 ${frases.length} frases cargadas para reconocimiento natural.`);
} catch {
  console.log("⚠️ No se pudo cargar frases.json, continuando sin bloque semántico.");
}

// ==================== BASE CLÍNICA ==================== //
const base = {
  saludos: ["hola", "buenas", "holaa", "ola", "hey", "buen día", "buenas tardes"],
  zonas: ["abdomen", "glúteos", "piernas", "rostro", "cara", "papada", "cintura", "espalda", "brazos", "muslos", "trasero"],
  maquinas: {
    "hifu 12d": "Ultrasonido focalizado que actúa en la grasa subcutánea y fascia SMAS, reafirma y reduce volumen.",
    cavitacion: "Ondas ultrasónicas que rompen adipocitos y ayudan a eliminar grasa localizada.",
    radiofrecuencia: "Calor interno que estimula colágeno y elastina, mejora firmeza y textura.",
    "ems sculptor": "Contracciones musculares intensas (20.000 en 30 min) para tonificar y aumentar masa muscular.",
    "pink glow": "Coctel de péptidos y antioxidantes inyectables que regeneran, iluminan y revitalizan la piel.",
    "led therapy": "Luz azul antibacteriana, roja regeneradora y ámbar estimulante; mejora textura y recuperación."
  },
  tratamientos: {
    corporales: {
      "push up": {
        precio: 376000,
        sesiones: 8,
        descripcion: "Moldea y eleva glúteos con contracciones musculares intensas mediante EMS Sculptor.",
        objetivo: "Levantar y tonificar glúteos sin cirugía ni inyectables."
      },
      "lipo body elite": {
        precio: 664000,
        sesiones: 12,
        descripcion: "Protocolo avanzado que combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor.",
        objetivo: "Reducir grasa, tonificar y reafirmar abdomen completo con resultados clínicos visibles."
      },
      "body fitness": {
        precio: 360000,
        sesiones: 8,
        descripcion: "Tonificación muscular avanzada con EMS Sculptor + Radiofrecuencia.",
        objetivo: "Reforzar masa muscular y firmeza del cuerpo."
      },
      "body tensor": {
        precio: 232000,
        sesiones: 6,
        descripcion: "Tratamiento reafirmante con Radiofrecuencia + LED Therapy.",
        objetivo: "Reafirmar zonas con flacidez leve como brazos, abdomen o muslos."
      }
    },
    faciales: {
      "limpieza facial full": {
        precio: 120000,
        sesiones: 6,
        descripcion: "Limpieza profunda con extracción, vapor ozono y LED regeneradora.",
        objetivo: "Purificar y renovar la piel, ideal previo a otros tratamientos."
      },
      "face elite": {
        precio: 358400,
        sesiones: 10,
        descripcion: "Protocolo facial premium con HIFU, Pink Glow, Radiofrecuencia y LED Therapy.",
        objetivo: "Rejuvenecer rostro, cuello y contorno facial sin cirugía."
      },
      "rf facial": {
        precio: 60000,
        sesiones: 3,
        descripcion: "Radiofrecuencia facial que mejora textura y firmeza.",
        objetivo: "Reafirmar y suavizar líneas de expresión."
      }
    }
  }
};

// ==================== FUNCIONES ==================== //
async function enviarMensaje(numero, texto) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  try {
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: numero,
        text: { body: texto }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
        }
      }
    );
    console.log(`✅ Mensaje enviado a ${numero}`);
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
  }
}

function detectarIntent(texto) {
  const t = texto.toLowerCase().trim();

  if (base.saludos.some(s => t.includes(s))) return "saludo";

  // reconocimiento de frases naturales
  if (frases.some(f => t.includes(f))) return "natural";

  for (const zona of base.zonas) if (t.includes(zona)) return zona;
  for (const nombre in base.tratamientos.corporales) if (t.includes(nombre)) return nombre;
  for (const nombre in base.tratamientos.faciales) if (t.includes(nombre)) return nombre;
  for (const maquina in base.maquinas) if (t.includes(maquina)) return maquina;

  return "fallback";
}

function generarRespuesta(intent, texto) {
  if (intent === "saludo")
    return `Hola 👋 Soy *Zara* de Body Elite.  
Estoy aquí para ayudarte a elegir el tratamiento ideal según tu objetivo.  
¿Podrías contarme qué zona deseas mejorar?`;

  if (intent === "natural") {
    if (texto.includes("trasero") || texto.includes("glute") || texto.includes("pompis"))
      return `Para glúteos te recomiendo nuestro plan *Push Up*, diseñado para levantar y tonificar con *EMS Sculptor*.  
Incluye ${base.tratamientos.corporales["push up"].sesiones} sesiones por $${base.tratamientos.corporales["push up"].precio.toLocaleString("es-CL")} CLP.  
Puedes agendar una *evaluación gratuita* aquí 👉 ${LINK_RESERVO}`;

    if (texto.includes("abdomen") || texto.includes("cintura"))
      return `El tratamiento *Lipo Body Elite* combina HIFU 12D, Cavitación y EMS Sculptor para reducir grasa y tonificar el abdomen.  
💰 $${base.tratamientos.corporales["lipo body elite"].precio.toLocaleString("es-CL")} CLP  
📅 ${base.tratamientos.corporales["lipo body elite"].sesiones} sesiones  
Reserva tu diagnóstico aquí 👉 ${LINK_RESERVO}`;

    if (texto.includes("cara") || texto.includes("rostro") || texto.includes("papada"))
      return `Para rejuvenecer rostro o papada tenemos *Face Elite*, con HIFU focal, Pink Glow y Radiofrecuencia.  
💰 $${base.tratamientos.faciales["face elite"].precio.toLocaleString("es-CL")} CLP  
📅 ${base.tratamientos.faciales["face elite"].sesiones} sesiones  
Puedes reservar tu diagnóstico facial aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.tratamientos.corporales[intent]) {
    const t = base.tratamientos.corporales[intent];
    return `💠 *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  

Agenda tu *evaluación sin costo* aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.tratamientos.faciales[intent]) {
    const t = base.tratamientos.faciales[intent];
    return `✨ *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  

Agenda tu *diagnóstico facial gratuito* aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.maquinas[intent])
    return `⚙️ *${intent.toUpperCase()}*\n${base.maquinas[intent]}\n\nForma parte de nuestros protocolos clínicos.  
¿Te gustaría saber qué plan incluye ${intent}?`;

  if (base.zonas.includes(intent))
    return `Para ${intent} trabajamos con combinaciones de *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor*.  
Permite reducir grasa, reafirmar y tonificar.  
Agenda tu *evaluación corporal gratuita* 👉 ${LINK_RESERVO}`;

  return `Puedo contarte más sobre nuestros tratamientos corporales y faciales.  
¿Cuál es tu objetivo principal: *reducir grasa*, *reafirmar piel* o *rejuvenecer rostro*?  
Reserva tu diagnóstico 👉 ${LINK_RESERVO}`;
}

// ==================== PROCESADOR ==================== //
async function procesarMensaje(numero, texto) {
  const intent = detectarIntent(texto);
  const respuesta = generarRespuesta(intent, texto);
  await enviarMensaje(numero, respuesta);
}

// ==================== WEBHOOK META ==================== //
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (entry) {
    const from = entry.from;
    const text = entry.text?.body || "";
    console.log(`📩 Mensaje recibido de ${from}: ${text}`);
    await procesarMensaje(from, text);
  }
  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("Zara Body Elite v3 activa con base clínica y frases naturales."));
app.listen(PORT, () => console.log(`✅ Zara Body Elite activa en puerto ${PORT}`));
