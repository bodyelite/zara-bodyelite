// responses.js
// Módulo de respuestas automáticas para Zara IA
// Incluye reconocimiento de intención "agendar" y texto con botón

import { detectarIntencion } from "./intents.js";
import knowledge from "./knowledge.json" assert { type: "json" };

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
        "💎 Nuestras promociones incluyen HIFU, Cavitación, y Sculptor según el plan elegido. ¿Deseas conocer la promoción actual o agendar tu evaluación?";
      break;

    default:
      respuesta =
        "Puedo ayudarte con tratamientos, precios o agendar tu diagnóstico gratuito. Escribe 'quiero agendar' o 'promoción' para comenzar.";
  }

  return respuesta;
}
