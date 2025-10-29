import { responderExtendido, respuestaEmpatica, responderDetalle, responderCuriosidad, responderInterno } from "./motor_respuesta.js";

export default async function procesarMensaje(texto) {
  try {
    // modo interno primero
    const interno = await responderInterno(texto);
    if (interno) return interno;

    // flujo normal asegurando siempre retorno
    const base = responderExtendido(texto) || "";
    const conEmpatia = respuestaEmpatica(texto, base) || base;
    const conDetalle = (await responderDetalle(texto, conEmpatia)) || conEmpatia;
    const final = (await responderCuriosidad(texto, conDetalle)) || conDetalle;

    // retorno seguro
    if (final.trim() === "") return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar para orientarte con el tratamiento ideal.";
    return final;
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Estoy actualizando mis módulos internos. Intenta nuevamente en unos segundos.";
  }
}
