import { responder, capaEmpatica, capaCuriosidad, capaInterna } from "./motor_respuesta.js";

export default async function procesarMensaje(texto) {
  try {
    const interno = await capaInterna(texto);
    if (interno) return interno;

    const base = responder(texto);
    const conEmpatia = capaEmpatica(texto, base);
    return await capaCuriosidad(texto, conEmpatia);
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Sistema en actualización, intenta nuevamente en unos segundos.";
  }
}
