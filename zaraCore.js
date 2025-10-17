import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

/* ----------------------- CONFIGURACIÓN ----------------------- */
const AVISOS_NUMEROS = [
  "56976992187", // recepción
  "56999999999", // administración
  "56988888888"  // dirección
];

const RESERVO_URL = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* ---------------------- ENVÍO DE MENSAJES ---------------------- */
async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log(`📤 Mensaje enviado a ${to}:`, data);
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error.message);
  }
}

/* ---------------------- COMPRENSIÓN DE TEXTO ---------------------- */
function interpretarMensaje(texto) {
  const t = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const saludo = /(hola|buenas|qué tal|ola|holi)/i;
  const gracias = /(gracias|thank)/i;
  const zonas = /(abdomen|cintura|muslos|gluteo|trasero|piernas|rollitos|papada|brazos)/i;
  const facial = /(arrugas|flacidez|manchas|piel|rostro|cara|poros)/i;
  const tratamientos = /(pink|hifu|radiofrecuencia|rf|cavitacion|sculptor|push|body|lipo|face)/i;

  if (saludo.test(t))
    return "👋 Hola soy Zara, asistente IA de Body Elite. Puedo orientarte sobre tratamientos corporales y faciales, o ayudarte a agendar tu diagnóstico gratuito asistido por IA 💫. ¿Qué zona te gustaría mejorar?";

  if (gracias.test(t))
    return "✨ Encantada de ayudarte. Recuerda que puedes agendar tu diagnóstico gratuito aquí 👉 " + RESERVO_URL;

  if (zonas.test(t))
    return "💡 Entiendo perfectamente. En Body Elite tratamos esa zona con Cavitación, Radiofrecuencia y HIFU 12D. Reducimos grasa, mejoramos firmeza y textura. Nuestro sistema IA te ayuda a definir el plan ideal. ¿Quieres agendar tu evaluación gratuita? 👉 " + RESERVO_URL;

  if (facial.test(t))
    return "🌸 Podemos ayudarte con tratamientos faciales de última generación: HIFU 12D, Radiofrecuencia y Pink Glow. Trabajamos firmeza, textura e hidratación con resultados reales. Agenda tu diagnóstico gratuito aquí 👉 " + RESERVO_URL;

  if (tratamientos.test(t))
    return "🔍 Ese tratamiento combina tecnología avanzada sin cirugía. Te permite resultados visibles en pocas sesiones. Agenda tu diagnóstico gratuito para definir el plan ideal 👉 " + RESERVO_URL;

  return "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito asistido por IA 💆‍♀️. Agenda aquí 👉 " + RESERVO_URL;
}

/* ---------------------- WEBHOOK DE WHATSAPP ---------------------- */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (!messages) return res.sendStatus(200);

    const msg = messages[0];
    const texto = msg.text?.body || "";
    const numero = msg.from;

    const respuesta = interpretarMensaje(texto);
    await sendMessage(numero, respuesta);

    console.log(`💬 Usuario (${numero}): ${texto}`);
    console.log(`🤖 Zara: ${respuesta}`);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error procesando webhook:", err.message);
    res.sendStatus(500);
  }
});

/* ---------------------- WEBHOOK DE RESERVO ---------------------- */
app.post("/webhook/reserva", async (req, res) => {
  try {
    const { nombre, telefono, fecha, hora, tratamiento } = req.body;
    if (!nombre || !telefono || !fecha || !hora || !tratamiento)
      return res.status(400).json({ error: "datos incompletos" });

    const mensaje = `📢 *Nueva cita registrada en Reservo*\n👤 ${nombre}\n📞 ${telefono}\n🗓 ${fecha} a las ${hora}\n💆 Tratamiento: ${tratamiento}\n\nVerificar en panel de Reservo.`;

    for (const n of AVISOS_NUMEROS) await sendMessage(n, mensaje);

    console.log("✅ Avisos internos enviados:", mensaje);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Error en webhook reserva:", err.message);
    res.status(500).json({ error: "fallo interno" });
  }
});

/* ---------------------- PUERTO RENDER ---------------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ZaraCore activo en puerto ${PORT}`));
