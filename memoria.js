import { responder, respuestaEmpatica, responderCuriosidad, responderInterno } from "./motor_respuesta.js";

export default async function procesarMensaje(texto) {
  try {
    const interno = await responderInterno(texto);
    if (interno) return interno;

    const base = responder(texto);
    const conEmpatia = respuestaEmpatica(texto, base);
    return responderCuriosidad(texto, conEmpatia);
  } catch (e) {
    console.error("Error procesando mensaje:", e);
    return "⚠️ Sistema en actualización, intenta nuevamente en unos segundos.";
  }
}
