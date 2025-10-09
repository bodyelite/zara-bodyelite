import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import schedule from "node-schedule";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PHONE_ID = process.env.META_PHONE_ID;

const tratamientos = JSON.parse(fs.readFileSync("./data/tratamientos.json"));
const citasPendientes = new Map();

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

async function sendMessage(to, body) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body }
    },
    { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
  );
}

function detectarIntencion(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("agendar") || msg.includes("reserva")) return "agendar";
  if (msg.includes("precio") || msg.includes("valor")) return "precio";
  if (msg.includes("ubicación") || msg.includes("donde")) return "ubicacion";
  if (msg.includes("horario")) return "horario";
  if (msg.includes("cintura") || msg.includes("abdomen") || msg.includes("grasa")) return "reductivo";
  if (msg.includes("flacidez") || msg.includes("tonificar")) return "tonificacion";
  if (msg.includes("facial") || msg.includes("cara")) return "facial";
  return "tratamiento";
}

function buscarTratamiento(text) {
  const all = { ...tratamientos.corporales, ...tratamientos.faciales };
  const key = Object.keys(all).find(k => text.includes(k.split(" ")[0]));
  return key ? all[key] : null;
}

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(404);

    const from = msg.from;
    const text = msg.text?.body?.toLowerCase() || "";
    const intencion = detectarIntencion(text);

    let reply = "Hola 👋 soy Zara, asistente con IA de Body Elite. ¿En qué puedo ayudarte hoy?";

    switch (intencion) {
      case "precio":
        reply = "💰 Ejemplo de precios:\n• Lipo Body Elite $664.000\n• Face Elite $358.400\n• Push Up $376.000\n¿Quieres saber más sobre alguno?";
        break;
      case "ubicacion":
        reply = "📍 Estamos en Av. Las Perdices Nº2990, Local 23, Peñalolén.\nhttps://maps.app.goo.gl/Bx3r9zFj5oGp8NND7";
        break;
      case "horario":
        reply = "🕐 Lunes a Viernes 9:30–20:00, Sábado 9:30–13:00.";
        break;
      case "reductivo":
        reply = "Para cintura o abdomen recomiendo:\n💠 Lipo Body Elite (HIFU 12D + RF + EMS Sculptor)\n⚡ Lipo Express (reducción rápida).\nAgenda tu evaluación:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
        break;
      case "tonificacion":
        reply = "🍑 Push Up (EMS Sculptor + RF) para glúteos.\n🏋️ Body Fitness (reafirmación muscular).";
        break;
      case "facial":
        reply = "🌸 Face Elite (HIFU + RF + Pink Glow)\n🫧 Limpieza Facial Full (6 sesiones).";
        break;
      case "agendar":
        reply = "🗓️ Puedes agendar en el siguiente enlace:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nIndícame tu *nombre completo* para registrar la cita.";
        citasPendientes.set(from, { estado: "pendiente", fecha: new Date() });
        break;
      default: {
        const data = buscarTratamiento(text);
        if (data) reply = `✨ ${data.descripcion}\nTecnologías: ${data.tecnologias.join(", ")}\nValor: $${data.precio.toLocaleString("es-CL")} CLP.`;
        else reply = "Puedo ayudarte con información sobre tratamientos, precios o para agendar tu evaluación gratuita.";
      }
    }

    if (citasPendientes.has(from) && text.includes("nombre")) {
      reply = "✅ Tu cita fue registrada. Te esperamos en Body Elite ✨\n📍 Av. Las Perdices Nº2990, Local 23, Peñalolén.\nRecibirás un recordatorio antes de tu hora.";
      const cita = citasPendientes.get(from);
      cita.estado = "confirmada";
      citasPendientes.set(from, cita);
      const fecha = new Date(Date.now() + 4 * 3600 * 1000);
      schedule.scheduleJob(fecha, () => sendMessage(from, "⏰ Recordatorio: tu cita en Body Elite es hoy. Te esperamos ✨"));
    }

    await sendMessage(from, reply);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Zara activo localmente, puerto " + PORT));
