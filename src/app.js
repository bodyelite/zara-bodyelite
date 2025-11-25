import { sendMessage } from "./services/meta.js";
import { generarRespuestaIA } from "./services/openai.js";

export async function procesarEvento(entry) {
  const platform = entry.changes ? "whatsapp" : "instagram";
  let senderId, text;

  if (platform === "whatsapp") {
    const msg = entry.changes[0].value.messages?.[0];
    if (!msg) return;
    senderId = msg.from;
    text = msg.text?.body;
  } else {
    const msg = entry.messaging?.[0];
    if (!msg) return;
    senderId = msg.sender.id;
    text = msg.message?.text;
  }
  if (!text) return;

  console.log(`📩 De ${senderId}: ${text}`);
  const respuesta = await generarRespuestaIA(text);
  await sendMessage(senderId, respuesta, platform);
}
