import { responderExtendido } from "./motor_respuesta.js";

export default function procesarMensaje(texto) {
  try {
    const respuesta = responderExtendido(texto);
    if (!respuesta || respuesta.trim() === "") {
      return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar para orientarte con el tratamiento ideal.";
    }
    return respuesta;
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Sistema en actualización, intenta nuevamente en unos segundos.";
  }
}
