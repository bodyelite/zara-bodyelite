import { generarRespuesta } from "./respuestas.js";

export async function procesarMensaje(texto, contextoPrevio = null, usuario = null) {
  const msg = texto.toLowerCase().trim();

  if (["hola", "buenas", "saludos"].some(p => msg.includes(p))) {
    return "👋 Hola, soy Zara IA de Body Elite. ¿Qué zona te gustaría mejorar?";
  }

  const respuesta = generarRespuesta(msg);
  if (respuesta) return respuesta;

  return "✨ Soy Zara IA de Body Elite. Puedo orientarte sobre tratamientos faciales o corporales. Cuéntame qué zona te gustaría trabajar.";
}
