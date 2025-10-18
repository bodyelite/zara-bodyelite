import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ==================== CONFIGURACIÓN ==================== //
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
const MEMORIA_FILE = "./contexto_memoria.json";
const LINK_RESERVO = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// ==================== MEMORIA ==================== //
let memoria = {};
try {
  memoria = fs.existsSync(MEMORIA_FILE)
    ? JSON.parse(fs.readFileSync(MEMORIA_FILE, "utf8"))
    : { ejemplos: [] };
} catch {
  memoria = { ejemplos: [] };
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
}

// ==================== BASE DE CONOCIMIENTOS ==================== //
const base = {
  saludos: ["hola", "buenas", "holaa", "ola", "hey", "buen día", "buenas tardes"],
  zonas: ["abdomen", "glúteos", "piernas", "rostro", "cara", "papada", "cintura", "espalda", "brazos", "muslos"],
  maquinas: {
    "hifu 12d": "Ultrasonido focalizado que actúa en la grasa subcutánea y la fascia SMAS, reafirma y reduce volumen.",
    cavitacion: "Ondas ultrasónicas que rompen adipocitos, facilitando la eliminación de grasa localizada.",
    radiofrecuencia: "Calor interno que estimula colágeno y elastina, mejora firmeza y textura.",
    "ems sculptor": "Contracciones musculares intensas (20.000 en 30 minutos) para tonificar y aumentar masa muscular.",
    "pink glow": "Coctel de péptidos y antioxidantes inyectables que regeneran, iluminan y revitalizan la piel.",
    "led therapy": "Luz azul antibacteriana, roja regeneradora y ámbar estimulante; mejora textura y recuperación."
  },
  tratamientos: {
    corporales: {
      "lipo focalizada reductiva": {
        precio: 348800,
        sesiones: 6,
        descripcion: "Reduce grasa localizada en zonas pequeñas como abdomen bajo o flancos. Combina Cavitación, Radiofrecuencia y drenaje.",
        objetivo: "Modelar contorno corporal, disminuir centímetros y mejorar aspecto de la piel."
      },
      "lipo express": {
        precio: 432000,
        sesiones: 8,
        descripcion: "Protocolo acelerado reductor para grasa moderada. Incluye HIFU 12D + Cavitación + EMS Sculptor.",
        objetivo: "Resultados rápidos en cintura, abdomen o muslos en pocas sesiones."
      },
      "lipo reductiva": {
        precio: 480000,
        sesiones: 10,
        descripcion: "Plan integral para reducción y tonificación corporal. Usa Cavitación, Radiofrecuencia y EMS Sculptor.",
        objetivo: "Mejorar textura, reducir grasa y reafirmar simultáneamente."
      },
      "lipo body elite": {
        precio: 664000,
        sesiones: 12,
        descripcion: "Nuestro protocolo más avanzado. HIFU 12D + Cavitación + Radiofrecuencia + EMS Sculptor.",
        objetivo: "Remodelar abdomen completo, reducir grasa y tonificar en profundidad. Ideal tras cambios de peso o post parto."
      },
      "body tensor": {
        precio: 232000,
        sesiones: 6,
        descripcion: "Tratamiento reafirmante para flacidez leve. Usa Radiofrecuencia y LED Therapy.",
        objetivo: "Mejorar firmeza de brazos, abdomen o muslos sin aumentar volumen."
      },
      "body fitness": {
        precio: 360000,
        sesiones: 8,
        descripcion: "Tonificación avanzada con EMS Sculptor + Radiofrecuencia.",
        objetivo: "Aumentar tono muscular y mejorar apariencia firme del cuerpo."
      },
      "push up": {
        precio: 376000,
        sesiones: 8,
        descripcion: "Moldea y eleva glúteos con contracciones musculares intensas mediante EMS Sculptor.",
        objetivo: "Lograr mayor firmeza y volumen natural sin inyecciones."
      }
    },
    faciales: {
      "limpieza facial full": {
        precio: 120000,
        sesiones: 6,
        descripcion: "Limpieza profunda con extracción, vapor ozono, LED y activos antioxidantes.",
        objetivo: "Purificar, equilibrar y mejorar luminosidad de la piel."
      },
      "rf facial": {
        precio: 60000,
        sesiones: 3,
        descripcion: "Radiofrecuencia facial para mejorar textura y firmeza.",
        objetivo: "Reafirmar contorno facial y suavizar líneas de expresión."
      },
      "face light": {
        precio: 128800,
        sesiones: 6,
        descripcion: "Tratamiento iluminador con LED Therapy y antioxidantes.",
        objetivo: "Dar brillo, hidratación y aspecto saludable a la piel."
      },
      "face smart": {
        precio: 198400,
        sesiones: 8,
        descripcion: "Combinación de limpieza, radiofrecuencia y LED Therapy.",
        objetivo: "Renovar textura, mejorar tono y firmeza."
      },
      "face inicia": {
        precio: 270400,
        sesiones: 8,
        descripcion: "Rejuvenecimiento facial personalizado con HIFU focal y activos reafirmantes.",
        objetivo: "Estimular colágeno y prevenir signos de envejecimiento."
      },
      "face antiage": {
        precio: 281600,
        sesiones: 8,
        descripcion: "Tratamiento lifting sin cirugía con HIFU y Radiofrecuencia avanzada.",
        objetivo: "Reducir arrugas, flacidez y redefinir contorno facial."
      },
      "face elite": {
        precio: 358400,
        sesiones: 10,
        descripcion: "Protocolo premium con HIFU, Pink Glow, Radiofrecuencia y LED Therapy.",
        objetivo: "Rejuvenecer rostro y cuello, mejorar textura y elasticidad."
      },
      "full face": {
        precio: 584000,
        sesiones: 12,
        descripcion: "Lifting facial completo sin cirugía, actúa en todas las capas de la piel.",
        objetivo: "Resultados visibles desde la primera sesión."
      }
    }
  }
};

// ==================== FUNCIONES ==================== //
async function enviarMensaje(numero, texto) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  try {
    await axios.post(url, {
      messaging_product: "whatsapp",
      to: numero,
      text: { body: texto }
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
      }
    });
    console.log(`✅ Mensaje enviado a ${numero}`);
  } catch (err) {
    console.error("❌ Error al enviar mensaje:", err.response?.data || err.message);
  }
}

function detectarIntent(texto) {
  const t = texto.toLowerCase().trim();

  if (base.saludos.some(s => t.includes(s))) return "saludo";

  for (const zona of base.zonas) if (t.includes(zona)) return zona;

  for (const nombre in base.tratamientos.corporales)
    if (t.includes(nombre)) return nombre;

  for (const nombre in base.tratamientos.faciales)
    if (t.includes(nombre)) return nombre;

  for (const maquina in base.maquinas)
    if (t.includes(maquina)) return maquina;

  return "fallback";
}

function generarRespuesta(intent) {
  if (intent === "saludo") {
    return `Hola 👋 Soy *Zara* de Body Elite.  
Estoy aquí para ayudarte a elegir el tratamiento ideal según tu objetivo.  
¿Podrías contarme qué zona deseas mejorar?`;
  }

  if (base.tratamientos.corporales[intent]) {
    const t = base.tratamientos.corporales[intent];
    return `💠 *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  

Te recomiendo agendar una *evaluación gratuita* para definir tu protocolo personalizado 👉 ${LINK_RESERVO}`;
  }

  if (base.tratamientos.faciales[intent]) {
    const t = base.tratamientos.faciales[intent];
    return `✨ *${intent.toUpperCase()}*\n${t.descripcion}\n\n🔬 *Objetivo:* ${t.objetivo}\n📅 *${t.sesiones} sesiones*  
💰 *Precio:* $${t.precio.toLocaleString("es-CL")} CLP  

Puedes reservar tu *diagnóstico facial sin costo* aquí 👉 ${LINK_RESERVO}`;
  }

  if (base.maquinas[intent]) {
    return `⚙️ *${intent.toUpperCase()}*\n${base.maquinas[intent]}\n\nEsta tecnología se utiliza dentro de nuestros protocolos clínicos.  
¿Te gustaría que te indique qué plan incluye ${intent}?`;
  }

  if (base.zonas.includes(intent)) {
    return `Para ${intent} trabajamos con combinaciones personalizadas de *HIFU 12D*, *Cavitación*, *Radiofrecuencia* y *EMS Sculptor*.  
Esto permite reducir grasa, reafirmar y tonificar.  
Puedes agendar una *evaluación sin costo* para diagnóstico corporal 👉 ${LINK_RESERVO}`;
  }

  return `Puedo contarte más sobre nuestros tratamientos corporales y faciales.  
¿Cuál es tu objetivo principal: *reducir grasa*, *reafirmar piel* o *rejuvenecer rostro*?  
Agenda tu diagnóstico aquí 👉 ${LINK_RESERVO}`;
}

// ==================== PROCESADOR ==================== //
async function procesarMensaje(numero, texto) {
  const intent = detectarIntent(texto);
  const respuesta = generarRespuesta(intent);
  await enviarMensaje(numero, respuesta);
}

// ==================== WEBHOOKS ==================== //
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

app.get("/", (req, res) => res.send("Zara Body Elite activa con conocimiento clínico y reservas."));

app.listen(PORT, () => console.log(`✅ Zara Body Elite activa en puerto ${PORT}`));
