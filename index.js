import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.ZARA_TOKEN;
const PORT = process.env.PORT || 10000;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const msg = message.text?.body?.toLowerCase() || "";

    let respuesta = "Hola 👋 Soy Zara de Body Elite. ¿Podrías contarme qué zona deseas tratar?";
    if (msg.includes("precio") || msg.includes("valor") || msg.includes("cuesta"))
      respuesta = "Nuestros planes van desde $120.000 en facial y $348.800 en corporal. ¿Quieres que te detalle según tu zona?";
    else if (msg.includes("lipo"))
      respuesta = "La Lipo Body Elite combina HIFU 12D, Cavitación, RF y EMS. Resultados visibles en pocas sesiones 🔥";
    else if (msg.includes("push up"))
      respuesta = "El plan Push Up de glúteos tonifica y eleva sin cirugía, con EMS Sculptor + Radiofrecuencia 🍑";
    else if (msg.includes("agenda") || msg.includes("reserva"))
      respuesta = "Puedes agendar directamente aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    await axios.post(
      \`https://graph.facebook.com/v17.0/\${process.env.PHONE_ID}/messages\`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: respuesta },
      },
      { headers: { Authorization: \`Bearer \${process.env.ACCESS_TOKEN}\` } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook:", err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(\`✅ Zara Body Elite activa en puerto \${PORT}\`));
