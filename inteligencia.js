import { frases } from "./respuestas.js";
async function analizarMensaje(texto) {
const entrada = texto.toLowerCase();
for (const f of frases) {
if (entrada.includes(f.patron)) return f.respuesta;
}
return "No entendi tu mensaje. Por favor reformulalo.";
}
export { analizarMensaje };
