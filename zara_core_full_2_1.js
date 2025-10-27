import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import fs from "fs";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

const LOG_WSP = "logs_wsp.json";
const LOG_IG = "logs_ig.json";

// --- Respuestas automáticas básicas ---
const respuestas = {
  hola: "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar hoy?",
  facial: "💆‍♀️ Tratamientos faciales con HIFU, RF y Pink Glow. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  corporal: "🔥 Tratamientos corporales HIFU 12D + Cavitación + RF + EMS Sculptor. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
  desconocido: "✨ Puedo orientarte con una evaluación gratuita asistida con IA 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
};

// --- Enviar mensaje por WhatsApp ---
async function enviarMensaje(to, body) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
  };
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body }
  };
  await fetch(url, { method: "POST", headers, body: JSON.stringify(data) });
}

// --- Webhook de Meta ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg || !msg.from || !msg.text) return res.sendStatus(200);

    const canal = req.body.entry?.[0]?.id?.includes("instagram") ? "ig" : "wsp";
    const phone = msg.from;
    const texto = msg.text.body.toLowerCase().trim();

    let respuesta =
      texto.includes("hola") || texto.includes("buenas")
        ? respuestas.hola
        : texto.includes("cara") || texto.includes("facial")
        ? respuestas.facial
        : texto.includes("abdomen") || texto.includes("grasa") || texto.includes("corporal")
        ? respuestas.corporal
        : respuestas.desconocido;

    const log = {
      fecha: new Date().toISOString(),
      canal,
      phone,
      texto,
      respuesta,
      estado: "rojo"
    };
    fs.appendFileSync(canal === "ig" ? LOG_IG : LOG_WSP, JSON.stringify(log) + ",\n");
    await enviarMensaje(phone, respuesta);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error webhook:", e);
    res.sendStatus(500);
  }
});

// --- Endpoint para reservas confirmadas ---
app.post("/webhook/reserva_confirmada", (req, res) => {
  try {
    const phone = req.body.phone || "desconocido";
    const log = {
      fecha: new Date().toISOString(),
      canal: "reservo",
      phone,
      estado: "verde"
    };
    fs.appendFileSync(LOG_WSP, JSON.stringify(log) + ",\n");
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// --- Endpoint de logs para el monitor ---
app.get("/logs", (req, res) => {
  try {
    const wsp = fs.existsSync(LOG_WSP) ? fs.readFileSync(LOG_WSP, "utf8") : "[]";
    const ig = fs.existsSync(LOG_IG) ? fs.readFileSync(LOG_IG, "utf8") : "[]";
    const data = `[${wsp}${ig}]`.replace(/,\n$/, "]");
    res.json(JSON.parse(data));
  } catch {
    res.json([]);
  }
});

// --- Inicio ---
app.listen(PORT, () => console.log("✅ Zara 2.1 activo en puerto", PORT));
