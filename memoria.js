import { responder, capaEmpatica, capaCuriosidad, capaInterna } from "./motor_respuesta.js";

export default async function procesarMensaje(texto) {
  try {
    const interno = await capaInterna(texto);
    if (interno) return interno;

    const base = responder(texto);
    const conEmpatia = capaEmpatica(texto, base);
    const final = await capaCuriosidad(texto, conEmpatia);

    return final || conEmpatia || base || "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar para orientarte con el tratamiento ideal.";
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Sistema en actualización, intenta nuevamente en unos segundos.";
  }
}
