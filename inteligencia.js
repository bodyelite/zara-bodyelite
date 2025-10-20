import { frases } from "./respuestas.js";

async function analizarMensaje(texto) {
  const entrada = texto.toLowerCase();
  for (const f of frases) {
    if (entrada.includes(f.patron)) return f.respuesta;
  }
  return "No entendi tu mensaje. Puedes escribir 1 para planes corporales o 2 para faciales.";
}

export { analizarMensaje };
