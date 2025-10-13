// responses.js
// Módulo de respuestas automáticas para Zara IA (Body Elite)
// Compatible con Node.js 22 y Render

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import detectarIntencion from "./intents.js"; // ✅ se usa default import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// Carga segura de knowledge.json
// ======================================================
const knowledgePath = path.join(__dirname, "knowledge.json");
let knowledge = {};
try {
  const data = fs.readFileSync(knowledgePath, "utf8");
  knowledge = JSON.parse(data);
} catch (error) {
  console.error("Error al cargar knowledge.json:", error.message);
}

// ======================================================
// Generador de respuestas y avisos
// ======================================================
export async function generarRespuesta(texto, zaraData, contextoPrevio) {
  const intencion = detectarIntencion(texto);
  let respuesta = "";

  switch (intencion) {
    case "saludo":
      respuesta = "Hola 👋, soy Zara, asistente IA de Body Elite. ¿En qué puedo ayudarte hoy?";
      break;

    case "agendar":
      respuesta =
        "✳️ Puedes agendar fácilmente tu evaluación gratuita con nuestros especialistas.\nIncluye diagnóstico con tecnología FitDays y asesoría personalizada.";
      break;

    case "tratamientos":
      respuesta =
        "Ofrecemos tratamientos corporales y faciales con tecnología avanzada. ¿Te interesa moldear el cuerpo o mejorar la piel del rostro?";
      break;

    case "promocion":
      respuesta =
        "💎 Nuestras promociones incluyen HIFU, Cavitación y Sculptor según el plan elegido. ¿Deseas conocer la promoción actual o agendar tu evaluación?";
      break;

    default:
      respuesta =
        "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe 'quiero agendar' o 'promoción' para comenzar.";
  }

  return respuesta;
}

// ======================================================
// Función auxiliar para generar timestamp Chile
// ======================================================
export function obtenerFechaChile() {
  const ahora = new Date();
  return ahora.toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
