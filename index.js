import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userContext = {};

// ================= WEBHOOK =================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

// ================= MENSAJES =================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (
      body.object &&
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;
      const text = msg.text?.body?.toLowerCase() || "";
      console.log(`💬 ${from}: ${text}`);

      const reply = getZaraResponse(from, text);
      await sendMessage(from, reply);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});

// ================= RESPUESTA PRINCIPAL =================
function getZaraResponse(user, text) {
  text = text.toLowerCase();
  if (!userContext[user]) userContext[user] = { lastTopic: null };
  const last = userContext[user].lastTopic;

  // ----- Intenciones corporales -----
  if (
    /lipo|grasa|bajar panza|abdomen|cintura|flancos|reductiva|celulitis|cavitacion/.test(
      text
    )
  ) {
    userContext[user].lastTopic = "lipo";
    return `💎 *Lipo Body Elite* combina *HIFU 12D, Cavitación y EMS Sculptor* para reducir grasa localizada y tensar la piel sin cirugía.  
El *HIFU 12D* envía microondas que descomponen el tejido graso y estimulan colágeno; la *Cavitación* rompe microburbujas de grasa y el *EMS* tonifica el músculo.  
👩‍🦰 Pacientes suelen notar menos volumen y mejor contorno desde la 3ª sesión.  
Opciones:  
- *Lipo Body Elite* $664 000 CLP (10 sesiones)  
- *Lipo Reductiva* $480 000 CLP  
- *Lipo Express* $432 000 CLP  
✨ Agenda tu diagnóstico gratuito y conoce la experiencia Body Elite, agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  } else if (/flacidez|tonificar|gluteos|piernas|brazos|marcar/.test(text)) {
    userContext[user].lastTopic = "body";
    return `🍑 Para tonificar y levantar, usamos *EMS Sculptor + Radiofrecuencia Corporal*.  
Estas tecnologías estimulan contracciones musculares profundas y calientan el tejido para reafirmar.  
Planes populares:  
- *Body Fitness* $360 000 CLP  
- *Push Up Glúteos* $376 000 CLP  
👩‍🦰 Pacientes comentan sentir la zona más firme y elevada desde las primeras sesiones.  
✨ Agenda tu diagnóstico gratuito y conoce la experiencia Body Elite, agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  // ----- Intenciones faciales -----
  } else if (/cara|rostro|facial|arrugas|botox|antiage|papada|piel/.test(text)) {
    userContext[user].lastTopic = "face";
    return `🌸 Para rostro ofrecemos distintas combinaciones según tu objetivo:  
- *Face Smart* $198 400 CLP → rejuvenecimiento con limpieza + RF  
- *Face Elite* $358 400 CLP → lifting HIFU con Pink Glow  
- *Full Face* $584 000 CLP → resultado integral  
El *HIFU facial* estimula colágeno y la *radiofrecuencia* mejora firmeza.  
👩‍🦰 Pacientes notan piel más tersa y luminosa desde la primera sesión.  
✨ Agenda tu diagnóstico gratuito y conoce la experiencia Body Elite, agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  // ----- Preguntas de ubicación / contacto -----
  } else if (/ubicacion|direccion|donde|mapa/.test(text)) {
    return `📍 *Av. Las Perdices 2990, Local 23 – Peñalolén*  
🕒 Lunes a Viernes 9:30 – 20:00 | Sábado 9:30 – 13:00  
📲 WhatsApp de asesora humana: https://wa.me/56983300262`;

  // ----- Preguntas de agenda -----
  } else if (/agenda|reserva|hora|cita/.test(text)) {
    return `🗓️ Agenda acá 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9  
Podés elegir día y horario directo desde tu teléfono.`;

  // ----- Seguimiento de tema anterior -----
  } else if (last === "lipo" && /barato|alternativa|precio/.test(text)) {
    return `✨ Si buscas algo más accesible, te recomiendo *Lipo Express* ($432 000) o *Lipo Reductiva* ($480 000).  
Ambas usan Cavitación + RF con resultados en menos sesiones.`;

  } else if (last === "face" && /cual recomiendas|mejor/.test(text)) {
    return `🤍 Si querés efecto visible sin tiempo de recuperación, el *Face Elite* es ideal.  
Si es tu primera vez, *Face Smart* es más suave y accesible.`;

  // ----- Preguntas generales -----
  } else if (/cuanto dura|sesion|efecto|resultado/.test(text)) {
    return `⌛ Cada sesión dura entre 45 y 60 minutos según el área.  
Los resultados comienzan a notarse a partir de la 2ª o 3ª sesión y se potencian con buena hidratación y constancia.`;

  } else if (/maquina|aparato|tecnologia/.test(text)) {
    return `⚙️ Usamos aparatología HIFU 12D, Cavitación, Radiofrecuencia Multipolar, EMS Sculptor y Pink Glow.  
Todas están certificadas y actúan sobre grasa, piel y músculo para modelar sin cirugía.`;

  } else if (/gracias|ok|perfecto|listo/.test(text)) {
    return `💙 Gracias a ti por escribir. Si quieres, puedes *agenda acá* para tu diagnóstico gratuito ✨  
https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;

  // ----- Fallback -----
  } else {
    return `👋 Soy Zara IA, asistente virtual de *Body Elite Estética Avanzada*.  
Puedo orientarte en tratamientos, precios, tecnologías y resultados.  
¿Qué te gustaría mejorar hoy: rostro o cuerpo?`;
  }
}

// ================= ENVÍO DE MENSAJES =================
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Error enviando mensaje:", err);
    } else console.log(`✅ Mensaje enviado a ${to}`);
  } catch (err) {
    console.error("❌ Error general enviando mensaje:", err);
  }
}

// ================= SERVIDOR =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto", PORT);
  console.log("✅ Zara IA lista con conocimiento clínico y conversacional 💬");
});
