import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// === CARGA MEMORIA ===
const archivoMemoria = "./contexto_memoria.json";
let memoria = [];
try {
  const data = fs.readFileSync(archivoMemoria, "utf8");
  memoria = JSON.parse(data);
  console.log("🧠 Memoria cargada correctamente:", memoria.length, "frases");
} catch {
  console.log("⚠️ No se pudo cargar memoria, se usará vacía.");
  memoria = [];
}

// === FUNCIÓN DE BÚSQUEDA ===
function buscarRespuesta(texto) {
  texto = texto.toLowerCase();
  for (const item of memoria) {
    for (const patron of item.patrones) {
      if (texto.includes(patron.toLowerCase())) {
        return item.respuesta;
      }
    }
  }
  return null;
}

// === FUNCIÓN DE ENVÍO ===
async function sendMessage(numero, mensaje) {
  try {
    if (!mensaje || mensaje.trim() === "") {
      mensaje =
        "🤍 No comprendí tu mensaje, pero nuestras profesionales podrán orientarte en una evaluación gratuita. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: "whatsapp",
      to: numero,
      type: "text",
      text: { body: mensaje },
    };

    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!r.ok) {
      const e = await r.text();
      console.error("❌ Error API WhatsApp:", e);
    } else {
      console.log("✅ Respuesta enviada a", numero);
    }
  } catch (error) {
    console.error("💥 Error en sendMessage:", error.message);
  }
}

// === WEBHOOK ===
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const texto = message.text?.body?.toLowerCase().trim() || "";
    console.log("📩 Mensaje recibido:", texto);

    let respuesta = buscarRespuesta(texto);
    if (!respuesta || respuesta.trim() === "") {
      respuesta =
        "🤍 No comprendí tu mensaje, pero nuestras profesionales podrán orientarte en una evaluación gratuita. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    }

    console.log("💬 Respuesta:", respuesta);
    await sendMessage(from, respuesta);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error.message);
    res.sendStatus(500);
  }
});

// === VERIFICACIÓN ===
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Zara IA activa en puerto", process.env.PORT || 3000);
});
