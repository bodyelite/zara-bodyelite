// index.js — Zara IA Body Elite (versión completa)
// ================================================

import express from "express";
import axios from "axios";
import fs from "fs";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "zara_bodyelite_verify";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ================================================
// Cargar base de conocimiento local (entrenamiento Zara IA)
let conocimiento = {};
try {
  const data = fs.readFileSync("base_conocimiento.json", "utf8");
  conocimiento = JSON.parse(data);
  console.log("✅ Base de conocimiento cargada correctamente.");
} catch (error) {
  console.error("⚠️ No se pudo cargar base_conocimiento.json:", error.message);
}

// ================================================
// Enviar mensaje a WhatsApp (API Meta)
async function sendMessage(phoneNumberId, to, text) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Mensaje enviado a ${to}:`, response.data);
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error.response?.data || error.message);
  }
}

// ================================================
// Determinar respuesta desde conocimiento
function obtenerRespuesta(mensaje) {
  const texto = mensaje.toLowerCase();

  // Palabras clave y respuestas del entrenamiento
  const claves = Object.keys(conocimiento);
  for (const clave of claves) {
    if (texto.includes(clave.toLowerCase())) {
      return conocimiento[clave];
    }
  }

  // Respuesta por defecto (fallback)
  return "Soy Zara IA, asistente de Body Elite. Puedo ayudarte con tratamientos, precios o agendamiento. ¿Qué te gustaría mejorar hoy: rostro o cuerpo?";
}

// ================================================
// Webhook para verificación inicial (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    return res.status(200).send(challenge);
  } else {
    console.error("❌ Fallo verificación de webhook.");
    return res.sendStatus(403);
  }
});

// ================================================
// Recepción de mensajes desde Meta (POST)
app.post("/webhook", async (req, res) => {
  try {
    if (req.body.object) {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.text && message.from) {
        const from = message.from;
        const textoUsuario = message.text.body;
        console.log(`💬 Mensaje recibido de ${from}: ${textoUsuario}`);

        const respuesta = obtenerRespuesta(textoUsuario);
        await sendMessage(PHONE_NUMBER_ID, from, respuesta);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error.message);
    res.sendStatus(500);
  }
});

// ================================================
// Puerto y arranque del servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
  console.log("Zara IA lista para responder mensajes 💬");
});
