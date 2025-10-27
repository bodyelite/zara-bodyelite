import { generarRespuesta } from "./respuestas.js";
import { generarRespuestaAvanzada } from "./respuestas_inteligentes.js";
import { expandirTexto } from "./diccionario_expandido.js";

export async function procesarMensaje(texto, contextoPrevio = null, usuario = null) {
  const msg = expandirTexto(texto.toLowerCase().trim());

  if (["hola", "buenas", "saludos"].some(p => msg.includes(p))) {
    return "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar?";
  }

  const respuesta = generarRespuestaAvanzada(msg) || generarRespuesta(msg);
  if (respuesta) return respuesta;

  return "✨ Soy Zara IA de Body Elite. Puedo orientarte sobre tratamientos faciales o corporales. Cuéntame qué zona te gustaría trabajar.";
}
