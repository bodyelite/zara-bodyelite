import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// ==============================
// 🔧 CONFIGURACIÓN BASE
// ==============================
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PORT = process.env.PORT || 10000;

// ==============================
// 🧠 DATOS COMERCIALES Y CLÍNICOS
// ==============================
const NEGOCIO = process.env.NEGOCIO || "Body Elite Estética Avanzada";
const UBICACION = process.env.UBICACION;
const HORARIO = process.env.HORARIO;
const RESERVO_URL = process.env.RESERVO_URL;
const WSP_DIRECTO = process.env.WSP_DIRECTO;
const CONTACTO_HUMANO = process.env.CONTACTO_HUMANO;
const CONTACTO_NOMBRE = process.env.CONTACTO_NOMBRE;
const CONTACTO_ROL = process.env.CONTACTO_ROL;

const PLANES_FACIALES = process.env.PLANES_FACIALES?.split(";") || [];
const PLANES_CORPORALES = process.env.PLANES_CORPORALES?.split(";") || [];

const ZARA_DERIVA_PALABRAS = process.env.ZARA_DERIVA_PALABRAS?.split(",") || [];
const ZARA_CONFIRMA_PALABRAS = process.env.ZARA_CONFIRMA_PALABRAS?.split(",") || [];

let memoriaUsuarios = {}; // memoria temporal por número

// ==============================
// 🧩 VERIFICACIÓN WEBHOOK META
// ==============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente con Meta");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Error de verificación");
  }
});

// ==============================
// 📩 RECEPCIÓN DE MENSAJES WHATSAPP
// ==============================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    if (message && message.type === "text") {
      const from = message.from;
      const text = message.text.body.trim().toLowerCase();
      if (!memoriaUsuarios[from]) memoriaUsuarios[from] = { nombre: null };

      const usuario = memoriaUsuarios[from];
      let respuesta = "";

      // === DERIVACIÓN HUMANA ===
      if (ZARA_DERIVA_PALABRAS.some(p => text.includes(p.trim()))) {
        respuesta = `🤝 Te conecto con *${CONTACTO_NOMBRE}*, ${CONTACTO_ROL}. Escríbele directamente aquí:\n👉 ${WSP_DIRECTO}`;
        await enviarMensaje(from, respuesta);
        return res.sendStatus(200);
      }

      // === NOMBRE DEL CLIENTE ===
      if (!usuario.nombre) {
        if (text.startsWith("soy ") || text.startsWith("me llamo ")) {
          usuario.nombre = text.replace("soy ", "").replace("me llamo ", "").trim();
          respuesta = `Encantada, ${usuario.nombre} 💙 ¿qué área te gustaría mejorar? (por ejemplo: *abdomen*, *rostro*, *glúteos*, *flacidez*)`;
          await enviarMensaje(from, respuesta);
          return res.sendStatus(200);
        } else {
          respuesta = "¿Podrías contarme tu nombre para personalizar tu diagnóstico gratuito? 💙";
          await enviarMensaje(from, respuesta);
          return res.sendStatus(200);
        }
      }

      // === RECOMENDACIONES ===
      if (["rostro", "facial", "cara"].some(p => text.includes(p))) {
        respuesta = `✨ ${usuario.nombre}, te recomiendo nuestras opciones faciales:\n${listarPlanes(PLANES_FACIALES)}\n\nPodés agendar aquí:\n🗓️ ${RESERVO_URL}`;
      } else if (["abdomen", "cuerpo", "celulitis", "glúteo", "flacidez"].some(p => text.includes(p))) {
        respuesta = `💪 ${usuario.nombre}, estos planes corporales son ideales para ti:\n${listarPlanes(PLANES_CORPORALES)}\n\nAgenda tu evaluación gratuita:\n🗓️ ${RESERVO_URL}`;
      } else if (["agenda", "reserva", "evaluación"].some(p => text.includes(p))) {
        respuesta = `📅 ${usuario.nombre}, puedes agendar tu evaluación gratuita aquí:\n${RESERVO_URL}`;
      } else {
        respuesta = `Soy Zara 💙 asistente virtual de ${NEGOCIO}. Puedo contarte sobre tratamientos, precios o ayudarte a agendar tu diagnóstico gratuito.`;
      }

      await enviarMensaje(from, respuesta);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error procesando mensaje:", err.message);
    res.sendStatus(500);
  }
});

// === Envío de mensajes ===
async function enviarMensaje(to, body) {
  try {
    await axios.post(
      "https://graph.facebook.com/v19.0/105928049208947/messages",
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      },
      { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
    );
  } catch (err) {
    console.error("Error enviando mensaje:", err.response?.data || err.message);
  }
}

// === Listar planes ===
function listarPlanes(planes) {
  return planes
    .map(p => {
      const [nombre, precio] = p.split("|");
      const precioFmt = parseInt(precio).toLocaleString("es-CL");
      return `• *${nombre}* — $${precioFmt} CLP`;
    })
    .join("\n");
}

// === Servidor ===
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT} — Zara IA lista 💙`));
