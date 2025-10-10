import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const FILE_PATH = "./conversaciones.json";

// Cargar memoria persistente
let conversaciones = {};
if (fs.existsSync(FILE_PATH)) {
  try {
    conversaciones = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    console.log("🧠 Memoria cargada desde disco.");
  } catch (e) {
    console.error("⚠️ Error al cargar conversaciones:", e.message);
  }
}

// Guardar en disco
function guardarConversaciones() {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(conversaciones, null, 2));
  } catch (e) {
    console.error("⚠️ Error al guardar conversaciones:", e.message);
  }
}

// === ENTRENAMIENTO DE ZARA ===
function generarRespuestaZara(texto, historial = []) {
  const msg = texto.toLowerCase();
  const ultimoTema = historial.slice(-1)[0]?.tema || null;
  let respuesta = "";

  if (msg.includes("hola") || msg.includes("buenas")) {
    respuesta =
      "👋 ¡Hola! Soy Zara, asistente virtual de Body Elite Estética Avanzada. ¿Deseas conocer nuestros tratamientos corporales o faciales?";
  } else if (msg.includes("lipo")) {
    respuesta =
      "💎 Nuestro tratamiento *Lipo Body Elite* combina HIFU 12D, Cavitación y EMS Sculptor. El pack de 10 sesiones tiene un valor de $664 000 CLP e incluye diagnóstico gratuito.";
    historial.push({ tema: "lipo" });
  } else if (msg.includes("botox") || msg.includes("antiage") || msg.includes("facial")) {
    respuesta =
      "💆‍♀️ Para rejuvenecimiento facial te recomiendo el plan *FACE ELITE*, que combina Pink Glow, RF Fraccional y HIFU focal. Valor $358 400 CLP (6 sesiones).";
    historial.push({ tema: "facial" });
  } else if (msg.includes("fitness") || msg.includes("sculptor")) {
    respuesta =
      "💪 El plan *BODY FITNESS* utiliza EMS Sculptor para tonificar abdomen, glúteos y piernas. Equivale a 20 000 contracciones por sesión. Pack 8 sesiones $360 000 CLP.";
    historial.push({ tema: "fitness" });
  } else if (msg.includes("celulitis") || msg.includes("flacidez")) {
    respuesta =
      "✨ El *BODY TENSOR* es ideal para tratar flacidez y celulitis con Radiofrecuencia y Prosculpt. Incluye 8 sesiones por $232 000 CLP.";
    historial.push({ tema: "tensor" });
  } else if (msg.includes("precio") || msg.includes("valor")) {
    if (ultimoTema === "lipo") respuesta = "💰 El plan *Lipo Body Elite* cuesta $664 000 CLP (10 sesiones).";
    else if (ultimoTema === "facial") respuesta = "💰 El plan *FACE ELITE* tiene un valor de $358 400 CLP (6 sesiones).";
    else if (ultimoTema === "fitness") respuesta = "💰 El plan *BODY FITNESS* tiene un valor de $360 000 CLP (8 sesiones).";
    else if (ultimoTema === "tensor") respuesta = "💰 El plan *BODY TENSOR* tiene un valor de $232 000 CLP (8 sesiones).";
    else respuesta = "💰 Los precios varían según el plan. ¿Buscas facial o corporal?";
  } else if (msg.includes("agenda") || msg.includes("diagnóstico")) {
    if (ultimoTema)
      respuesta = `📅 Perfecto, puedo ayudarte a agendar tu diagnóstico gratuito para el plan ${ultimoTema.toUpperCase()}.`;
    respuesta +=
      "\nReserva directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  } else if (msg.includes("humano") || msg.includes("asesora") || msg.includes("persona")) {
    respuesta =
      "Te conectaré con una asesora 💬 👉 [Abrir chat con asesora](https://wa.me/56983300262)";
  } else if (msg.includes("ubicación") || msg.includes("dirección")) {
    respuesta =
      "📍 Estamos en *Av. Las Perdices Nº2990, Local 23, Peñalolén*. Horarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.";
  } else {
    respuesta =
      "💫 Soy Zara IA, asistente de Body Elite. Puedo ayudarte con tratamientos, precios o agendamiento. ¿Qué te gustaría mejorar hoy: rostro o cuerpo?";
  }

  return { respuesta, historial };
}

// === VERIFICACIÓN WEBHOOK ===
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

// === RECEPCIÓN DE MENSAJES ===
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;
    if (!text) return res.sendStatus(200);

    console.log(`💬 Mensaje de ${from}: ${text}`);
    const historial = conversaciones[from] || [];
    const { respuesta, historial: nuevoHistorial } = generarRespuestaZara(text, historial);
    conversaciones[from] = nuevoHistorial;
    guardarConversaciones();

    await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: respuesta },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`🤖 Zara → ${from}: ${respuesta}`);
    res.sendStatus(200);
  } catch (error) {
    console.error("🚨 Error en webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// === SERVIDOR ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
