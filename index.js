import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import { responses, interpretarIntencion, integrarPatrones } from "./responses.js";
import { entrenar, cargarPatrones } from "./entrenador.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
const AI_KEY = process.env.AI_KEY || null;

// === memoria de conversación (por usuario) ===
const memoria = new Map();
const logFile = "./aprendizaje.json";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

console.log("🚀 Zara IA Body Elite activa en puerto", PORT);

// === cargar patrones aprendidos y entrenar ===
const patrones = cargarPatrones();
integrarPatrones(patrones);
entrenar();

// === ROOT ===
app.get("/", (req, res) => {
  res.status(200).send("Zara IA Body Elite en línea ✅");
});

// === VERIFY META ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === MAIN HANDLER ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (!body.object) return res.sendStatus(404);

    const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg?.text?.body) return res.sendStatus(200);

    const from = msg.from;
    const text = msg.text.body.trim().toLowerCase();
    console.log("💬 Mensaje recibido:", text);

    const previo = memoria.get(from);
    const ahora = Date.now();
    let intent, topic;

    // === reglas contextuales ===
    const afirmativo = /^(sí|ok|dale|perfecto|claro|ya|me interesa|quiero|sí quiero|si quiero|de una)/i;
    const precio = /(cu[aá]nto|vale|precio|cuesta|oferta)/i;
    const agenda = /(agenda|reserv|hora|cita|evaluaci)/i;
    const queincluye = /(qué incluye|que incluye|en qué consiste|cómo funciona|como es)/i;

    if (previo && ahora - previo.lastTime < 5 * 60 * 1000) {
      if (afirmativo.test(text)) {
        intent = previo.lastIntent;
        topic = previo.lastTopic;
      } else if (precio.test(text)) {
        intent = "precioEspecifico";
        topic = previo?.lastTopic;
      } else if (agenda.test(text)) {
        intent = "agenda";
      } else if (queincluye.test(text)) {
        intent = "descripcion";
        topic = previo?.lastTopic;
      }
    }

    // === interpretación general ===
    if (!intent) {
      if (AI_KEY) intent = await interpretarIA(text);
      else intent = interpretarIntencion(text);
    }

    // === detectar tema específico ===
    if (/push ?up/.test(text)) topic = "pushup";
    else if (/lipo/.test(text)) topic = "lipo";
    else if (/fitness/.test(text)) topic = "fitness";
    else if (/face/.test(text)) topic = "face";
    else if (/celulit/.test(text)) topic = "celulitis";
    else if (/hifu/.test(text)) topic = "hifu";

    memoria.set(from, { lastIntent: intent, lastTopic: topic, lastTime: ahora });

    // === generar respuesta ===
    let respuesta;
    if (intent === "precioEspecifico" && topic) respuesta = responses.precioEspecifico(topic);
    else if (intent === "descripcion" && topic) respuesta = responses.descripcion(topic);
    else if (responses[intent]) respuesta = responses[intent](topic);
    else {
      respuesta = responses.fallback();
      registrarAprendizaje(text, previo?.lastIntent, previo?.lastTopic);
    }

    await enviarMensaje(from, respuesta);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

// === IA OPCIONAL ===
async function interpretarIA(text) {
  try {
    const prompt = `
Clasifica el texto del usuario en una categoría:
[celulitis, flacidez, grasa, pushup, fitness, face, hifu, precios, agenda, evaluacion, descripcion, saludo, otro].
Texto: "${text}"`;

    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_KEY}`,
    };
    const body = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();
    const intent =
      data?.choices?.[0]?.message?.content?.toLowerCase()?.trim() || "otro";
    return intent;
  } catch (err) {
    console.error("⚠️ Error IA, fallback local:", err);
    return interpretarIntencion(text);
  }
}

// === ENVÍO DE MENSAJES ===
async function enviarMensaje(to, message) {
  try {
    const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Error enviando mensaje:", err);
    } else console.log("✅ Mensaje enviado:", message);
  } catch (err) {
    console.error("❌ Error general en enviarMensaje:", err);
  }
}

// === APRENDIZAJE LEVE ===
function registrarAprendizaje(texto, contexto, tema) {
  try {
    const registro = {
      texto,
      contexto: contexto || "sin_contexto",
      tema: tema || "desconocido",
      fecha: new Date().toISOString(),
    };
    let data = [];
    if (fs.existsSync(logFile))
      data = JSON.parse(fs.readFileSync(logFile, "utf8"));
    data.push(registro);
    fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
    console.log("🧠 Aprendizaje registrado:", texto);
  } catch (err) {
    console.error("⚠️ No se pudo guardar aprendizaje:", err);
  }
}

app.listen(PORT, () => {
  console.log("✅ Your service is live 🎉");
  console.log("🌐 Disponible en: https://zara-bodyelite1.onrender.com");
});
