import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";
import { responses, interpretarIntencion, integrarPatrones } from "./responses.js";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PORT = process.env.PORT || 10000;

// === Archivo de aprendizaje local ===
const aprendizajePath = "./aprendizaje.json";
if (!fs.existsSync(aprendizajePath)) fs.writeFileSync(aprendizajePath, "[]");

// === Cargar patrones entrenados si existen ===
if (fs.existsSync("./patrones.json")) {
  const patrones = JSON.parse(fs.readFileSync("./patrones.json", "utf8"));
  integrarPatrones(patrones);
}

// === WEBHOOK VERIFY ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// === WEBHOOK RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages.length > 0) {
        const msg = messages[0];
        const from = msg.from;
        const text = msg.text?.body || "";

        console.log(`📩 Mensaje recibido: "${text}" de ${from}`);

        // === Análisis semántico ===
        const { intencion, confianza } = analizarIntencionDetallada(text);
        console.log(`🎯 Intención: ${intencion} (confianza ${confianza})`);

        // Registrar aprendizaje
        registrarAprendizaje(text, intencion, confianza);

        // Generar respuesta
        let reply = "";
        if (responses[intencion]) {
          reply = responses[intencion](intencion);
        } else {
          reply = responses.fallback();
        }

        // Enviar respuesta
        await enviarMensajeWhatsApp(from, reply);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

// === FUNCIÓN DE ENVÍO A WHATSAPP ===
async function enviarMensajeWhatsApp(to, text) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) console.error("❌ Error al enviar mensaje:", data);
  else console.log("✅ Mensaje enviado correctamente");
}

// === APRENDIZAJE LOCAL CON PRECISIÓN ===
function registrarAprendizaje(texto, intencion, confianza) {
  const base = JSON.parse(fs.readFileSync(aprendizajePath, "utf8"));
  base.push({
    texto,
    intencion,
    confianza,
    fecha: new Date().toISOString(),
  });
  fs.writeFileSync(aprendizajePath, JSON.stringify(base, null, 2));
  console.log(`🧠 Aprendizaje registrado: ${texto} (${intencion}, ${confianza})`);
}

// === EXTENSIÓN PARA GUARDAR DETALLE SEMÁNTICO ===
function analizarIntencionDetallada(text) {
  try {
    // Reutiliza la función de responses.js
    const intencion = interpretarIntencion(text);

    // Evaluar confianza semántica (estimada por similitud interna)
    const palabras = text.split(/\s+/);
    let confianza = 0.6;

    if (palabras.length < 3) confianza = 0.7;
    if (/hola|precio|lipo|push|face|hifu|fitness/.test(text)) confianza = 0.9;
    if (/no entiendo|duda|explica/.test(text)) confianza = 0.5;

    return { intencion, confianza };
  } catch {
    return { intencion: "fallback", confianza: 0.0 };
  }
}

// === SERVIDOR ACTIVO ===
app.listen(PORT, () => {
  console.log("//////////////////////////////////////////////////////////");
  console.log(`✅ Zara IA Body Elite activa en puerto ${PORT}`);
  console.log(`🌐 Servicio en Render con comprensión semántica`);
  console.log("//////////////////////////////////////////////////////////");
});
