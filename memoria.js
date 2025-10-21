import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import intents from "./intents.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoriaPath = path.join(__dirname, "contexto_memoria.json");

// --- Carga inicial de memoria ---
let contexto = {};
try {
  const data = fs.readFileSync(memoriaPath, "utf8");
  contexto = JSON.parse(data);
  console.log("🧠 Memoria cargada:", Object.keys(contexto).length, "categorías");
} catch {
  console.warn("⚠️ No se pudo cargar contexto_memoria.json, iniciando vacío");
  contexto = {};
}

// --- Limpieza de texto ---
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9áéíóúñü\s]/gi, "")
    .trim();
}

// --- Detección de intención (usa intents.js y memoria extendida) ---
function detectarIntencion(texto) {
  texto = normalizar(texto);
  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (texto.includes(normalizar(pattern))) return intent.tag;
    }
  }
  // Buscar también en la memoria extendida
  for (const categoria in contexto) {
    if (contexto[categoria].some((f) => texto.includes(normalizar(f)))) {
      return categoria;
    }
  }
  return "desconocido";
}

// --- Generación de respuesta ---
export async function procesarMensaje(textoUsuario) {
  const intencion = detectarIntencion(textoUsuario);
  console.log("🎯 Intención detectada:", intencion);

  switch (intencion) {
    case "saludo":
      return "🌸 Hola, soy *Zara IA* de Body Elite. Te acompaño en tu evaluación estética gratuita ✨ ¿Te gustaría conocer los tratamientos *corporales o faciales*?";

    case "facial":
      return "✨ Nuestros tratamientos faciales mejoran textura, firmeza y luminosidad. Incluyen *Limpieza Facial*, *Face Smart*, *Face Antiage* y *Face Elite*. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "corporal":
      return "🔥 Nuestro tratamiento *Lipo Body Elite* reduce grasa localizada con *HIFU 12D, Cavitación y EMS Sculptor*. Sin bisturí ni dolor. Resultados visibles desde la primera sesión. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "precios":
      return "💰 Los valores varían según tu diagnóstico, pero por ejemplo: *Lipo Body Elite $664.000* y *Face Elite $358.400*. Todos incluyen evaluación gratuita. Reserva aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "dolor":
      return "💆‍♀️ Tranquila, todos los tratamientos Body Elite son *sin dolor ni bisturí*. Utilizamos tecnología HIFU 12D, Cavitación y EMS Sculptor que actúan de forma precisa y segura 💫";

    case "botox":
      return "💉 Trabajamos con *tecnología no invasiva*, como Radiofrecuencia, HIFU y LED Therapy, que logran resultados similares al botox sin agujas. Ideal para rejuvenecer naturalmente 🌟";

    case "flacidez":
      return "💪 Para tratar la flacidez recomendamos *Body Tensor* o *Face Antiage*. Ambos combinan Radiofrecuencia y estimulación EMS para tonificar piel y músculo. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "sesiones":
      return "📅 Los planes incluyen entre *6 y 12 sesiones* según diagnóstico facial o corporal. Cada sesión dura entre *30 y 50 minutos*. Incluye control y seguimiento 💆‍♀️";

    case "agendar":
      return "📲 Puedes reservar directamente tu evaluación gratuita en el siguiente enlace 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

    case "agradecimiento":
      return "💛 Gracias por confiar en Body Elite. Recuerda que tu primera evaluación es gratuita. Te esperamos para acompañarte en este proceso de cambio ✨";

    default:
      return "No entendí tu mensaje. Escribe *hola* para comenzar o indica si te interesa un tratamiento *facial o corporal* 🌸";
  }
}
