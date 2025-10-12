import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";
import { responses, interpretarIntencion, obtenerDominio } from "./responses.js";

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PORT = process.env.PORT || 10000;

// === CONTEXTO LOCAL ===
const contextoPath = "./contexto.json";
if (!fs.existsSync(contextoPath)) fs.writeFileSync(contextoPath, "{}");

// === WEBHOOK VERIFY ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado con Meta");
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

// === WEBHOOK RECEPCIÓN ===
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const msg = entry?.changes?.[0]?.value?.messages?.[0];
      if (!msg?.text?.body) return res.sendStatus(200);

      const from = msg.from;
      const text = msg.text.body.trim().toLowerCase();
      console.log(`📩 ${from}: "${text}"`);

      // Cargar contexto anterior
      const contexto = cargarContexto(from);
      const ahora = Date.now();
      const diferencia = contexto.timestamp ? ahora - contexto.timestamp : Infinity;
      if (diferencia > 30 * 60 * 1000) {
        contexto.dominio = null;
        contexto.ultimaIntencion = null;
      }

      // === Interpretar texto ===
      let intencion = interpretarIntencion(text);
      let dominio = obtenerDominio(text) || contexto.dominio || "general";

      // === Reacciones cortas (sí / no / resultados / precio / descripción) ===
      if (/^s[ií]$|claro|ok|dale/.test(text)) {
        intencion = contexto.ultimaIntencion || "descripcion";
      } else if (/no|ninguno/.test(text)) {
        intencion = "rechazo";
      } else if (/resultad/.test(text)) {
        intencion = "resultados";
      }

      // === Si habla de precio o descripción, mantener dominio ===
      if (/cu[aá]nto|vale|precio/.test(text)) intencion = "precio";
      if (/qué hace|en qué consiste|como funciona|cómo funciona/.test(text))
        intencion = "descripcion";
      if (/duele|dolor|molesta|seguro/.test(text)) intencion = "sensacion";

      // === Actualizar contexto ===
      guardarContexto(from, {
        dominio,
        ultimaIntencion: intencion,
        timestamp: ahora,
      });

      // === Generar respuesta ===
      const reply = responses.generar(dominio, intencion, contexto.ultimaIntencion);
      await enviarMensajeWhatsApp(from, reply);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error webhook:", err);
    res.sendStatus(500);
  }
});

// === ENVÍO WHATSAPP ===
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
  if (!res.ok) console.error("❌ Error al enviar:", data);
  else console.log("✅ Respuesta enviada:", text);
}

// === CONTEXTO LOCAL ===
function cargarContexto(id) {
  const data = JSON.parse(fs.readFileSync(contextoPath, "utf8"));
  return data[id] || {};
}
function guardarContexto(id, info) {
  const data = JSON.parse(fs.readFileSync(contextoPath, "utf8"));
  data[id] = info;
  fs.writeFileSync(contextoPath, JSON.stringify(data, null, 2));
}

// === SERVIDOR ===
app.listen(PORT, () => {
  console.log("//////////////////////////////////////////////////////////");
  console.log(`✅ Zara IA Body Elite activa en puerto ${PORT}`);
  console.log("🧠 Nivel 4.0: comprensión contextual y memoria dinámica");
  console.log("//////////////////////////////////////////////////////////");
});
