import { responder } from "./motor_respuesta.js";

export default function procesarMensaje(texto) {
  return responder(texto);
}
