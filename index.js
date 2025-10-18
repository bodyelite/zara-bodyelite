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

// ==================== MEMORIA ==================== //
let memoria = {};
try {
  if (fs.existsSync(MEMORIA_FILE)) {
    memoria = JSON.parse(fs.readFileSync(MEMORIA_FILE, "utf8"));
  } else {
    memoria = { ejemplos: [] };
    fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
  }
} catch {
  memoria = { ejemplos: [] };
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
}

// ==================== BASE DE CONOCIMIENTOS ==================== //
const base = {
  saludos: ["hola", "buenas", "holaa", "ola", "hey", "buen día", "buenas tardes"],
  zonas: ["abdomen", "glúteos", "piernas", "rostro", "cara", "papada", "cintura", "espalda", "brazos", "muslos"],
  tratamientos: {
    corporales: {
      "lipo focalizada reductiva": {
        precio: 348800,
        descripcion: "Reduce grasa localizada mediante Cavitación, Radiofrecuencia y HIFU 12D."
      },
      "lipo express": {
        precio: 432000,
        descripcion: "Tratamiento rápido y potente con Cavitación + HIFU + EMS Sculptor para resultados visibles en menos tiempo."
      },
      "lipo reductiva": {
        precio: 480000,
        descripcion: "Plan integral reductor y tonificador para abdomen, cintura y espalda."
      },
      "lipo body elite": {
        precio: 664000,
        descripcion: "Protocolo avanzado con HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Ideal para modelar abdomen completo."
      },
      "body tensor": {
        precio: 232000,
        descripcion: "Enfocado en reafirmar piel con flacidez leve. Radiofrecuencia + LED Therapy."
      },
      "body fitness": {
        precio: 360000,
        descripcion: "Aumenta tono y masa muscular con EMS Sculptor y radiofrecuencia tensora."
      },
      "push up": {
        precio: 376000,
        descripcion: "Levanta y moldea glúteos con contracciones musculares intensas (EMS Sculptor)."
      }
    },
    faciales: {
      "limpieza facial full": {
        precio: 120000,
        descripcion: "Limpieza profunda con extracción, vapor ozono, mascarilla LED y activos regeneradores."
      },
      "rf facial": {
        precio: 60000,
        descripcion: "Radiofrecuencia facial que mejora textura, firmeza y estimula colágeno."
      },
      "face light": {
        precio: 128800,
        descripcion: "Ilumina y revitaliza piel cansada con LED Therapy y activos antioxidantes."
      },
      "face smart": {
        precio: 198400,
        descripcion: "Combina limpieza, radiofrecuencia y LED Therapy para piel saludable y firme."
      },
      "face inicia": {
        precio: 270400,
        descripcion: "Rejuvenecimiento facial con protocolos personalizados según diagnóstico."
      },
      "face antiage": {
        precio: 281600,
        descripcion: "Disminuye arrugas y flacidez con HIFU focal y activos reafirmantes."
      },
      "face elite": {
        precio: 358400,
        descripcion: "Protocolo facial premium: HIFU + Pink Glow + LED Therapy + RF avanzada."
      },
      "full face": {
        precio: 584000,
        descripcion: "Tratamiento facial integral para lifting completo sin cirugía."
      }
    }
  },
  fallback: "¿Podrías contarme qué zona deseas tratar?"
};

// ==================== FUNCIONES ==================== //
async function enviarMensaje(numero, texto) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: numero,
    text: { body: texto }
  };
  try {
    await axios.post(url, data, {
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

  const similitud = memoria.ejemplos.find(e => t.includes(e.texto.toLowerCase()));
  if (similitud) return similitud.intent;

  return "fallback";
}

function generarRespuesta(intent) {
  if (intent === "saludo") {
    return "Hola 👋 Soy Zara de Body Elite. ¿Podrías contarme qué zona deseas tratar?";
  }

  if (base.tratamientos.corporales[intent]) {
    const t = base.tratamientos.corporales[intent];
    return `💠 *${intent.toUpperCase()}*\n${t.descripcion}\n\n💰 Precio: $${t.precio.toLocaleString("es-CL")} CLP\n\n¿Deseas que te cuente cuántas sesiones incluye y cómo agendar?`;
  }

  if (base.tratamientos.faciales[intent]) {
    const t = base.tratamientos.faciales[intent];
    return `✨ *${intent.toUpperCase()}*\n${t.descripcion}\n\n💰 Precio: $${t.precio.toLocaleString("es-CL")} CLP\n\n¿Quieres que te ayude a coordinar tu diagnóstico facial gratuito?`;
  }

  if (base.zonas.includes(intent)) {
    if (["abdomen", "cintura", "espalda"].includes(intent))
      return "Para esa zona te recomiendo nuestro plan *Lipo Body Elite*, ideal para modelar y reducir grasa localizada con HIFU 12D + Cavitación + EMS Sculptor.";
    if (["glúteos", "piernas"].includes(intent))
      return "Para esa zona te recomiendo el plan *Push Up* o *Body Fitness*, ambos con EMS Sculptor para tonificar y levantar.";
    if (["rostro", "cara", "papada"].includes(intent))
      return "En tratamientos faciales puedes elegir entre *Face Elite* o *Full Face*, ambos con HIFU focal y radiofrecuencia avanzada.";
  }

  return base.fallback;
}

function guardarAprendizaje(texto, respuesta) {
  try {
    const nuevo = { texto, intent: "personalizado", respuesta };
    memoria.ejemplos.push(nuevo);
    fs.writeFileSync(MEMORIA_FILE, JSON.stringify(memoria, null, 2));
    console.log("🧠 Nuevo aprendizaje guardado.");
  } catch (e) {
    console.error("⚠️ Error al guardar aprendizaje:", e.message);
  }
}

async function procesarMensaje(numero, texto) {
  const intent = detectarIntent(texto);
  const respuesta = generarRespuesta(intent);
  if (intent === "fallback") guardarAprendizaje(texto, respuesta);
  await enviarMensaje(numero, respuesta);
}

// ==================== WEBHOOK META ==================== //
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
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

app.get("/", (req, res) => {
  res.send("Zara Body Elite activa y aprendiendo.");
});

// ==================== SERVIDOR ==================== //
app.listen(PORT, () => {
  console.log(`✅ Zara Body Elite activa en puerto ${PORT}`);
});
