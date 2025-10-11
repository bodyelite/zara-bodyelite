import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// VARIABLES DE ENTORNO
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// --- 1. MEMORIA SIMPLE DE CONTEXTO ---
let userContext = {}; // { phone: { lastTopic: "lipo" } }

// --- 2. VERIFICACIÓN DE WEBHOOK ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- 3. RECEPCIÓN DE MENSAJES ---
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const msgBody = message.text?.body?.toLowerCase() || "";

      console.log(`💬 ${from}: ${msgBody}`);

      const reply = getSmartResponse(from, msgBody);
      await sendMessage(from, reply);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Error en webhook:", e);
    res.sendStatus(500);
  }
});

// --- 4. INTELIGENCIA DE RESPUESTA ---
function getSmartResponse(user, text) {
  text = text.toLowerCase();
  if (!userContext[user]) userContext[user] = { lastTopic: null };

  // Si el usuario sigue con un tema anterior
  const last = userContext[user].lastTopic;

  // 1️⃣ DETECTAR NUEVOS TEMAS
  if (text.includes("lipo") || text.includes("grasa") || text.includes("reductiva")) {
    userContext[user].lastTopic = "lipo";
    return `💎 Nuestro tratamiento *Lipo Body Elite* combina *HIFU 12D, Cavitación y EMS Sculptor* para eliminar grasa localizada y tonificar. 
Pack 10 sesiones: *$664.000 CLP* con diagnóstico gratuito.
Si buscas algo más económico, también tenemos *Lipo Reductiva* ($480.000) y *Lipo Express* ($432.000).`;

  } else if (text.includes("botox") || text.includes("arrugas") || text.includes("antiage")) {
    userContext[user].lastTopic = "botox";
    return `💉 El tratamiento *Facial Antiage* incluye *toxina botulínica + radiofrecuencia* para rejuvenecer y reafirmar la piel. 
El valor depende del área tratada, pero parte en *$281.600 CLP*. Incluye evaluación facial gratuita.`;

  } else if (text.includes("face") || text.includes("rostro") || text.includes("cara")) {
    userContext[user].lastTopic = "face";
    return `🌸 Tenemos varios planes faciales:
- *Face Smart* $198.400 (rejuvenecimiento)
- *Face Elite* $358.400 (lifting HIFU)
- *Full Face* $584.000 (resultado integral)
Todos incluyen diagnóstico facial inicial gratuito.`;

  } else if (text.includes("flacidez") || text.includes("tonificar") || text.includes("glúteos")) {
    userContext[user].lastTopic = "body";
    return `🍑 El plan *Body Fitness* o *Push Up* usa *EMS Sculptor + RF corporal* para tonificar y levantar glúteos. 
Precios desde *$360.000 CLP* el pack.`;

  } else if (text.includes("agenda") || text.includes("reservar") || text.includes("hora")) {
    userContext[user].lastTopic = "agenda";
    return `🗓 Podés agendar directamente aquí:  
👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  } else if (text.includes("ubicación") || text.includes("donde") || text.includes("dirección")) {
    return `📍 Estamos en *Av. Las Perdices 2990, Local 23, Peñalolén*.  
Horario: Lunes a Viernes 9:30–20:00, Sábado 9:30–13:00.`;

  }

  // 2️⃣ SI SIGUE CONVERSANDO SOBRE UN TEMA
  if (last === "lipo" && text.includes("barato")) {
    return `✨ Si buscás algo más económico, te recomiendo la *Lipo Reductiva* ($480.000) o *Lipo Express* ($432.000), con resultados en menos sesiones.`;
  }

  if (last === "botox" && text.includes("precio")) {
    return `💉 El *Face Antiage* parte en *$281.600 CLP* e incluye limpieza, toxina y radiofrecuencia.`;
  }

  if (last === "face" && text.includes("cuál recomiendas")) {
    return `🤍 Si querés resultados visibles sin tiempo de recuperación, el *Face Elite* es ideal. Si es tu primera vez, el *Face Smart* es más accesible.`;
  }

  // 3️⃣ RESPUESTA GENERAL
  return `👋 Soy *Zara IA*, asistente de *Body Elite*. Puedo ayudarte con tratamientos, precios o agendamiento.  
¿Qué te gustaría mejorar hoy: *rostro* o *cuerpo*?`;
}

// --- 5. ENVÍO DE MENSAJES ---
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("❌ Error enviando mensaje:", err);
  } else {
    console.log(`✅ Mensaje enviado a ${to}`);
  }
}

// --- 6. INICIO SERVIDOR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
  console.log("✅ Zara IA lista con inteligencia conversacional 💬");
});
