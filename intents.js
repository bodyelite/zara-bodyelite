import responses from "./responses.js";

export default function detectIntent(text) {
  const msg = text.toLowerCase();

  if (msg.includes("hola") || msg.includes("buenas"))
    return responses.saludo();
  if (msg.includes("agendar") || msg.includes("reserva"))
    return responses.agendar();
  if (msg.includes("precio") || msg.includes("$") || msg.includes("valor"))
    return responses.precios();
  if (
    msg.includes("tratamiento") ||
    msg.includes("lipo") ||
    msg.includes("face") ||
    msg.includes("grasa") ||
    msg.includes("abdomen")
  )
    return responses.tratamientos(msg);
  if (
    msg.includes("humano") ||
    msg.includes("especialista") ||
    msg.includes("ayuda")
  )
    return responses.derivar();
  if (
    msg.includes("tecnologia") ||
    msg.includes("hifu") ||
    msg.includes("sculptor") ||
    msg.includes("cavitacion")
  )
    return responses.tecnologias();
  return responses.fallback();
}
