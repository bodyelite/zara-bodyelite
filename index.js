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

// ==== Archivos locales de memoria ====
const aprendizajePath = "./aprendizaje.json";
const contextoPath = "./contexto.json";

if (!fs.existsSync(aprendizajePath)) fs.writeFileSync(aprendizajePath, "[]");
if (!fs.existsSync(contextoPath)) fs.writeFileSync(contextoPath, "{}");

// ==== Cargar patrones entrenados si existen ====
if (fs.existsSync("./patrones.json")) {
  const patrones = JSON.parse(fs.readFileSync("./patrones.json", "utf8"));
  integrarPatrones(patrones);
}

// ==== WEBHOOK VERIFY ====
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

// ==== WEBHOOK RECEPCIÓN DE MENSAJES ====
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
        const text = (msg.text?.body || "").trim();

        console.log(`📩 Mensaje recibido de ${from}: "${text}"`);

        // Recuperar contexto previo
        const contexto = cargarContexto(from);
        const { intencion, confianza } = analizarIntencionDetallada(text, contexto);

        // Registrar aprendizaje
        registrarAprendizaje(text, intencion, confianza);

        // Generar respuesta con contexto
        let reply = "";
        if (responses[intencion]) {
          reply = responses[intencion](text, contexto);
        } else {
          reply = responses.fallback();
        }

        // Actualizar contexto conversacional
        guardarContexto(from, { ultimoTema: intencion, ultimoTexto: text });

        // Enviar mensaje
        await enviarMensajeWhatsApp(from, reply);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

// ==== FUNCIÓN DE ENVÍO A WHATSAPP ====
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

// ==== FUNCIÓN DE INTENCIÓN + CONTEXTO ====
function analizarIntencionDetallada(text, contexto) {
  let intencion = interpretarIntencion(text);

  // Si el mensaje es breve, intenta inferir desde el contexto
  if (
    (!intencion || intencion === "fallback") &&
    contexto.ultimoTema &&
    /cuánto|vale|precio/.test(text)
  ) {
    intencion = contexto.ultimoTema; // Ej: sigue hablando del mismo plan
  }

  let confianza = 0.7;
  if (/hola|quiero|tratamiento|agenda|diagnóstico/.test(text)) confianza = 0.9;
  if (/no entiendo|duda/.test(text)) confianza = 0.5;

  return { intencion, confianza };
}

// ==== MEMORIA LOCAL ====
function cargarContexto(id) {
  const data = JSON.parse(fs.readFileSync(contextoPath, "utf8"));
  return data[id] || {};
}

function guardarContexto(id, nuevoContexto) {
  const data = JSON.parse(fs.readFileSync(contextoPath, "utf8"));
  data[id] = nuevoContexto;
  fs.writeFileSync(contextoPath, JSON.stringify(data, null, 2));
}

// ==== APRENDIZAJE LOCAL ====
function registrarAprendizaje(texto, intencion, confianza) {
  const base = JSON.parse(fs.readFileSync(aprendizajePath, "utf8"));
  base.push({
    texto,
    intencion,
    confianza,
    fecha: new Date().toISOString(),
  });
  fs.writeFileSync(aprendizajePath, JSON.stringify(base, null, 2));
}

// ==== SERVIDOR ====
app.listen(PORT, () => {
  console.log("//////////////////////////////////////////////////////////");
  console.log(`✅ Zara IA Body Elite activa en puerto ${PORT}`);
  console.log("🧠 Nivel 3: comprensión contextual habilitada");
  console.log("//////////////////////////////////////////////////////////");
});
