import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { responses, interpretarIntencion } from "./responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
const AI_KEY = process.env.AI_KEY || null;

// --- memoria temporal (contexto corto de conversación) ---
const memoria = new Map(); // { phone: { lastIntent, lastTime } }

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

console.log("🚀 Zara IA Body Elite activa en puerto", PORT);

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

    if (body.object) {
      const msg = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (msg?.text?.body) {
        const from = msg.from;
        const text = msg.text.body.trim();
        console.log("💬 Mensaje recibido:", text);

        // --- recuperar contexto ---
        const previo = memoria.get(from);
        const ahora = Date.now();
        let intent;

        // Si el usuario responde dentro de 5 minutos, mantener contexto
        if (previo && ahora - previo.lastTime < 5 * 60 * 1000) {
          if (/^sí|dale|ok|perfecto|claro|obvio|ya|hagámoslo|dale no más/i.test(text)) {
            intent = previo.lastIntent;
            console.log("🧠 Contexto mantenido:", intent);
          }
        }

        // Si no hay contexto previo o el texto es nuevo, analizar
        if (!intent) {
          if (AI_KEY) {
            intent = await interpretarIA(text);
            console.log("🧩 Intención detectada por IA:", intent);
          } else {
            intent = interpretarIntencion(text);
            console.log("🔹 Intención local:", intent);
          }
        }

        // Guardar nuevo contexto
        memoria.set(from, { lastIntent: intent, lastTime: ahora });

        // Generar respuesta
        const respuesta = responses[intent]
          ? responses[intent]()
          : responses.fallback();

        await enviarMensaje(from, respuesta);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

// === INTERPRETACIÓN IA UNIVERSAL ===
async function interpretarIA(text) {
  try {
    const prompt = `
Eres un asistente de estética corporal llamado Zara.
Clasifica este texto en una de estas categorías:
[grasa, celulitis, flacidez, push_up, hifu, precios, agenda, evaluacion, tratamiento, saludo, otro].
Texto: "${text}". Devuelve solo la categoría.`;

    let url, headers, body;

    if (AI_KEY.startsWith("sk-")) {
      // ---- OPENAI ----
      url = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_KEY}`,
      };
      body = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
    } else if (AI_KEY.startsWith("AIza")) {
      // ---- GEMINI ----
      url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        AI_KEY;
      headers = { "Content-Type": "application/json" };
      body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
    } else {
      console.warn("⚠️ Clave AI_KEY no válida, usando motor local");
      return interpretarIntencion(text);
    }

    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    let intent;
    if (AI_KEY.startsWith("sk-")) {
      intent = data?.choices?.[0]?.message?.content?.toLowerCase()?.trim();
    } else if (AI_KEY.startsWith("AIza")) {
      intent =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.toLowerCase()
          ?.trim() || "";
    }

    intent = intent?.replace(/[^\w_]+/g, "") || "fallback";
    return intent || "fallback";
  } catch (err) {
    console.error("⚠️ Fallback a modo local, error IA:", err);
    return interpretarIntencion(text);
  }
}

// === ENVÍO DE MENSAJE ===
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
    } else {
      console.log("✅ Mensaje enviado:", message);
    }
  } catch (err) {
    console.error("❌ Error general en enviarMensaje:", err);
  }
}

// === SERVER ===
app.listen(PORT, () => {
  console.log("✅ Your service is live 🎉");
  console.log("🌐 Disponible en: https://zara-bodyelite1.onrender.com");
});
