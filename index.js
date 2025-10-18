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
  zonas: ["abdomen", "glúteos", "trasero", "piernas", "rostro", "cara", "papada", "cintura", "espalda", "brazos", "muslos"],
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
      "lipo body elite": {
        precio: 664000,
        sesiones: 12,
        descripcion: "Protocolo avanzado que combina HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor.",
        objetivo: "Reducir grasa, tonificar y reafirmar abdomen completo.",
        zona: "abdomen"
      },
      "push up": {
        precio: 376000,
        sesiones: 8,
        descripcion: "Moldea y eleva glúteos con EMS Sculptor.",
        objetivo: "Levantar y tonificar glúteos sin cirugía.",
        zona: "glúteos"
      },
      "body fitness": {
        precio: 360000,
        sesiones: 8,
        descripcion: "Tonificación muscular con EMS Sculptor + Radiofrecuencia.",
        objetivo: "Reforzar masa muscular y firmeza del cuerpo.",
        zona: "brazos, abdomen, piernas"
      },
      "body tensor": {
        precio: 232000,
        sesiones: 6,
        descripcion: "Reafirmante con Radiofrecuencia + LED Therapy.",
        objetivo: "Mejorar firmeza y textura de zonas con flacidez leve.",
        zona: "brazos, abdomen, muslos"
      }
    },
    faciales: {
      "face elite": {
        precio: 358400,
        sesiones: 10,
        descripcion: "Protocolo facial premium con HIFU, Pink Glow, Radiofrecuencia y LED Therapy.",
        objetivo: "Rejuvenecer rostro, cuello y contorno facial sin cirugía.",
        zona: "rostro"
      },
      "limpieza facial full": {
        precio: 120000,
        sesiones: 6,
        descripcion: "Limpieza profunda con extracción, vapor ozono y LED regeneradora.",
        objetivo: "Purificar y renovar la piel.",
        zona: "cara"
      },
      "rf facial": {
        precio: 60000,
        sesiones: 3,
        descripcion: "Radiofrecuencia facial para reafirmar contorno y suavizar líneas.",
        objetivo: "Reafirmar rostro y estimular colágeno.",
        zona: "cara"
      }
    }
  }
};

// ==================== DETECCIÓN DE INTENCIÓN ==================== //
function detectarIntent(texto) {
  const t = texto.toLowerCase().trim();

  if (base.saludos.some(s => t.includes(s))) return "saludo";
  if (frases.some(f => t.includes(f))) return "natural";

  const intents = {
    precio: ["cuanto vale", "precio", "valor", "costo", "cuesta", "vale"],
    sesiones: ["cuantas sesiones", "numero de sesiones", "duracion", "cuanto dura"],
    dolor: ["duele", "molesta", "doloroso"],
    resultados: ["resultado", "efecto", "cambio", "cuanto se nota"],
    reserva: ["agenda", "cita", "hora", "reservar", "evaluacion", "diagnostico"]
  };

  for (const key in intents) {
    if (intents[key].some(f => t.includes(f))) return key;
  }

  for (const zona of base.zonas) if (t.includes(zona)) return zona;
  for (const nombre in base.tratamientos.corporales) if (t.includes(nombre)) return nombre;
  for (const nombre in base.tratamientos.faciales) if (t.includes(nombre)) return nombre;
  for (const maquina in base.maquinas) if (t.includes(maquina)) return maquina;

  return "fallback";
}

// ==================== RESPUESTAS ==================== //
function generarRespuesta(intent, texto) {
  if (intent === "saludo")
    return `Hola 👋 Soy *Zara* de Body Elite.  
Estoy aquí para ayudarte a elegir el tratamiento ideal según tu objetivo.  
¿Podrías contarme qué zona deseas mejorar?`;

  if (intent === "precio" || intent === "valor" || intent === "costo")
    return `Nuestros precios varían según el tratamiento y la zona.  
Por ejemplo:
- *Lipo Body Elite* $664.000 (12 sesiones)  
- *Push Up Glúteos* $376.000 (8 sesiones)  
- *Face Elite* $358.400 (10 sesiones)  
Puedes agendar tu *evaluación sin costo* aquí 👉 ${LINK_RESERVO}`;

  if (intent === "sesiones")
    return `Cada tratamiento tiene una cantidad definida de sesiones:  
- *Lipo Body Elite*: 12  
- *Push Up*: 8  
- *Body Tensor*: 6  
- *Face Elite*: 10  
En tu *evaluación gratuita* definiremos la cantidad ideal 👉 ${LINK_RESERVO}`;

  if (intent === "dolor")
    return `Todos nuestros tratamientos son *no invasivos y sin dolor*.  
Usamos tecnología de *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor*, que generan sensación cálida o contracciones musculares suaves, sin molestias.  
Puedes venir a probarlo reservando tu cita aquí 👉 ${LINK_RESERVO}`;

  if (intent === "resultados")
    return `Los resultados comienzan a notarse desde las primeras sesiones, y se consolidan al completar el protocolo.  
Cada cuerpo responde distinto, pero las tecnologías de Body Elite ofrecen resultados clínicamente medibles.  
Agenda tu evaluación gratuita 👉 ${LINK_RESERVO}`;

  if (intent === "reserva")
    return `Perfecto 💫 Puedes agendar tu *evaluación gratuita* directamente aquí 👉 ${LINK_RESERVO}  
Solo debes seleccionar el horario que más te acomode.`;

  if (intent === "natural") {
    if (texto.includes("glute") || texto.includes("trasero"))
      return `Para glúteos te recomiendo *Push Up*, con *EMS Sculptor* para levantar y tonificar sin cirugía.  
💰 $${base.tratamientos.corporales["push up"].precio.toLocaleString("es-CL")} CLP  
📅 ${base.tratamientos.corporales["push up"].sesiones} sesiones  
Agenda tu evaluación gratuita 👉 ${LINK_RESERVO}`;

    if (texto.includes("abdomen") || texto.includes("cintura"))
      return `El plan *Lipo Body Elite* combina *HIFU 12D*, *Cavitación* y *Radiofrecuencia*.  
💰 $${base.tratamientos.corporales["lipo body elite"].precio.toLocaleString("es-CL")} CLP  
📅 ${base.tratamientos.corporales["lipo body elite"].sesiones} sesiones  
Agenda tu diagnóstico sin costo 👉 ${LINK_RESERVO}`;

    if (texto.includes("cara") || texto.includes("rostro") || texto.includes("papada"))
      return `Para rostro te recomiendo *Face Elite*, con *HIFU*, *Pink Glow* y *Radiofrecuencia*.  
💰 $${base.tratamientos.faciales["face elite"].precio.toLocaleString("es-CL")} CLP  
📅 ${base.tratamientos.faciales["face elite"].sesiones} sesiones  
Reserva tu diagnóstico facial aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.tratamientos.corporales[intent]) {
    const t = base.tratamientos.corporales[intent];
    return `💠 *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  
Agenda tu *evaluación gratuita* aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.tratamientos.faciales[intent]) {
    const t = base.tratamientos.faciales[intent];
    return `✨ *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  
Reserva tu *diagnóstico facial sin costo* aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.maquinas[intent])
    return `⚙️ *${intent.toUpperCase()}*\n${base.maquinas[intent]}\n\n¿Quieres saber qué plan incluye esta tecnología? 👉 ${LINK_RESERVO}`;

  if (base.zonas.includes(intent))
    return `Para ${intent} usamos combinaciones de *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor*.  
Permiten reducir grasa, reafirmar y tonificar.  
Agenda tu *evaluación sin costo* 👉 ${LINK_RESERVO}`;

  return `Puedo contarte más sobre nuestros tratamientos corporales y faciales.  
¿Tu objetivo es *reducir grasa*, *reafirmar piel* o *rejuvenecer rostro*?  
Reserva tu diagnóstico gratuito 👉 ${LINK_RESERVO}`;
}

// ==================== PROCESADOR ==================== //
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

async function procesarMensaje(numero, texto) {
  const intent = detectarIntent(texto);
  const respuesta = generarRespuesta(intent, texto);
  await enviarMensaje(numero, respuesta);
}

// ==================== WEBHOOKS META ==================== //
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

app.get("/", (req, res) => res.send("✅ Zara Body Elite v4 activa con comprensión avanzada y Reservo."));
app.listen(PORT, () => console.log(`✅ Zara Body Elite activa en puerto ${PORT}`));

// === Integración del módulo clínico ===
import { generarRespuestaClinica } from './motor_clinico.js';
console.log("✅ motor_clinico.js activo e integrado correctamente");
// ======================================
