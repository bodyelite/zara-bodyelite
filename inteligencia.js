import { frases } from "./respuestas.js";

async function analizarMensaje(texto) {
  const entrada = texto.toLowerCase();
  for (const f of frases) {
    if (entrada.includes(f.patron)) {
      return f.respuesta;
    }
  }
  return "No entendí tu mensaje 🤖. ¿Podrías reformularlo?";
}

export { analizarMensaje };
