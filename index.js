import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Función: enviar mensajes
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const headers = {
    "Authorization": `Bearer ${process.env.PAGE_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };

  const body = JSON.stringify({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error al enviar mensaje:", data);
    } else {
      console.log("Mensaje enviado correctamente:", data);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

// Interpretador básico de texto
function interpretarMensaje(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("hola")) return "inicio";
  if (texto.includes("facial") || texto.includes("cara")) return "facial";
  if (texto.includes("cuerpo") || texto.includes("corporal")) return "corporal";
  if (texto.includes("abdomen") || texto.includes("grasa") || texto.includes("pierna") || texto.includes("gluteo") || texto.includes("muslo") || texto.includes("trasero")) return "zona corporal";
  if (texto.includes("precio") || texto.includes("valor")) return "consulta precio";
  if (texto.includes("agendar") || texto.includes("hora") || texto.includes("reserva")) return "agendamiento";
  return "desconocido";
}

// Respuestas clínicas
function obtenerRespuesta(tipo) {
  switch (tipo) {
    case "inicio":
      return "Hola 👋 Soy *Zara IA* de Body Elite. Te acompaño en tu evaluación estética gratuita 🌸 ¿Quieres conocer nuestros planes corporales o faciales? Responde *1* para corporales o *2* para faciales.";

    case "facial":
      return "✨ En tratamientos faciales contamos con:\n- Face Light $128.800\n- Face Smart $198.400\n- Face Antiage $281.600\n- Face Elite $358.400\nTodos incluyen limpieza, LED, radiofrecuencia y bioestimulación.\n¿Deseas que te recomiende uno según tu piel o edad?";

    case "corporal":
    case "zona corporal":
      return "💎 Los planes corporales más efectivos son:\n- Lipo Body Elite $664.000\n- Lipo Express $432.000\n- Push Up Glúteo $376.000\n- Body Fitness $360.000\nUsamos HIFU 12D, Cavitación, RF y EMS Sculptor. ¿En qué zona te gustaría enfocarte?";

    case "consulta precio":
      return "💰 Nuestros precios varían según el plan y zona corporal. Por ejemplo:\n- Lipo Body Elite $664.000\n- Face Elite $358.400\nIncluyen diagnóstico, sesiones completas y tecnología avanzada.";

    case "agendamiento":
      return "📅 Puedes agendar directamente tu evaluación gratuita en:\n👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\nO indícame si prefieres que te ayude a reservar.";

    default:
      return "No entendí tu mensaje 😅. Escribe *hola* para comenzar o *facial / corporal* según lo que quieras tratar.";
  }
}

// Webhook verificación
app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook principal
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    if (message?.text?.body && message?.from) {
      const from = message.from;
      const texto = message.text.body.trim().toLowerCase();
      console.log("Mensaje recibido:", texto);

      const interpretacion = interpretarMensaje(texto);
      const respuestaFinal = obtenerRespuesta(interpretacion);

      await sendMessage(from, respuestaFinal);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error al procesar webhook:", error);
    res.sendStatus(500);
  }
});

// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
