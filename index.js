import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Cargar conocimiento local
const conocimiento = JSON.parse(fs.readFileSync("./base_conocimiento.json", "utf8"));

// Variables de entorno
const TOKEN = process.env.WHATSAPP_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_ID = process.env.PHONE_ID;
const AI_ENDPOINT = process.env.AI_ENDPOINT || "";

// Función generadora de respuesta
async function generarRespuestaZara(mensaje) {
  const msg = mensaje.toLowerCase().trim();

  // 1️⃣ Interacciones básicas
  if (msg.match(/hola|buenas|saludo/)) return conocimiento.mensajes.saludo;
  if (msg.match(/ayuda|info|tratamiento|precio/)) return conocimiento.mensajes.ayuda;

  // 2️⃣ Datos de la clínica
  if (msg.match(/ubicacion|donde|direccion/)) return conocimiento.mensajes.ubicacion;
  if (msg.match(/hora|horario|abren|cierran/)) return conocimiento.clinica.horario;
  if (msg.match(/contacto|telefono|whatsapp/)) return `📞 Puedes escribirnos al ${conocimiento.clinica.contacto}`;
  if (msg.match(/reserva|agendar|agenda|cita/)) return conocimiento.mensajes.reserva;

  // 3️⃣ Coincidencias exactas con planes
  for (const [nombre, plan] of Object.entries(conocimiento.planes)) {
    if (msg.includes(nombre.split(" ")[0]) || msg.includes(nombre.split(" ")[1])) {
      return `💎 *${nombre.toUpperCase()}*\n${plan.descripcion}\n💰 Valor: $${plan.precio.toLocaleString("es-CL")} CLP\n✨ ${plan.beneficios}`;
    }
  }

  // 4️⃣ Temas generales
  if (msg.match(/grasa|abdomen|reducir|bajar|moldear|cintura|lipo/))
    return `🔥 Nuestro tratamiento *Lipo Body Elite* combina HIFU 12D, Cavitación y EMS Sculptor para reducción y tonificación. Incluye diagnóstico gratuito.`;

  if (msg.match(/flacidez|firmeza|tonificar|musculo/))
    return `💪 Podrías evaluar *Body Tensor* o *Body Fitness*, ambos con tecnología Sculptor para mejorar firmeza y tono muscular. ¿Quieres que te explique la diferencia?`;

  if (msg.match(/rostro|cara|arrugas|rejuvenecer|piel|facial/))
    return `✨ Te recomiendo *Face Elite* o *Face Light*, según tus objetivos. Ambas mejoran colágeno y textura de piel con Pink Glow y Radiofrecuencia.`;

  // 5️⃣ Conexión IA externa
  if (AI_ENDPOINT) {
    try {
      const aiResponse = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: msg })
      });
      const data = await aiResponse.json();
      if (data && data.reply) return data.reply;
    } catch (e) {
      console.error("Error consultando IA externa:", e);
    }
  }

  // 6️⃣ Fallback
  return conocimiento.mensajes.error;
}

// ✅ Verificación Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  res.sendStatus(403);
});

// 📩 Recepción de mensajes
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages) {
      const msgBody = messages[0].text?.body;
      const from = messages[0].from;
      console.log(`📩 Mensaje recibido de ${from}: ${msgBody}`);
      const respuesta = await generarRespuestaZara(msgBody);
      await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: respuesta }
        })
      });
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
