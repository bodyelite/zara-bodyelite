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

// --- Enviar mensaje por WhatsApp ---
async function enviarMensaje(to, body) {
  try {
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
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(data) });
    if (!res.ok) console.error("Error al enviar mensaje:", await res.text());
  } catch (err) {
    console.error("Fallo envío:", err);
  }
}

// --- Webhook Meta ---
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

    const from = msg.from;
    const texto = msg.text.body.toLowerCase().trim();

    let respuesta = "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar hoy?";
    if (texto.includes("abdomen")) respuesta = "🔥 Tratamiento corporal Body Elite, ideal para abdomen y flancos. Agenda tu evaluación 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
    else if (texto.includes("cara") || texto.includes("rostro")) respuesta = "💆‍♀️ Tratamiento facial avanzado con HIFU 12D y Pink Glow. Reserva aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    const log = {
      fecha: new Date().toISOString(),
      canal: "wsp",
      from,
      texto,
      respuesta,
      status: "nuevo"
    };
    fs.appendFileSync(LOG_WSP, JSON.stringify(log) + ",\n");
    await enviarMensaje(from, respuesta);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error webhook:", e);
    res.sendStatus(500);
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

app.listen(PORT, () => console.log("✅ Zara IA 2.1 activa en puerto", PORT));
