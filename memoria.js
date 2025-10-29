import { responderExtendido, respuestaEmpatica, responderDetalle, responderCuriosidad, responderInterno } from "./motor_respuesta.js";

export default async function procesarMensaje(texto) {
  const interno = await responderInterno(texto);
  if (interno) return interno;

  const base = responderExtendido(texto);
  const conEmpatia = respuestaEmpatica(texto, base);
  const conDetalle = await responderDetalle(texto, conEmpatia);
  return responderCuriosidad(texto, conDetalle);
}
