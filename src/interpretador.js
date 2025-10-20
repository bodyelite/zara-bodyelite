import { sendMessage } from "./sendMessage.js";
import { obtenerRespuesta } from "./respuestas.js";
export async function handleIncoming(message){
  const from=message.from;
  const texto=message.text?.body||"";
  const respuesta=obtenerRespuesta(texto);
  await sendMessage(from,respuesta);
}
