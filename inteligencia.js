import fs from "fs";
import respuestas from "./respuestas.js";

const archivoMemoria = "./contexto_memoria.json";

function leerMemoria() {
  try {
    const data = fs.readFileSync(archivoMemoria, "utf8");
    return JSON.parse(data);
  } catch {
    return { contexto: [] };
  }
}

function guardarMemoria(memoria) {
  fs.writeFileSync(archivoMemoria, JSON.stringify(memoria, null, 2));
}

async function analizarMensaje(texto) {
  const memoria = leerMemoria();
  const frases = respuestas.frases;

  if (!Array.isArray(frases)) return "Error interno: estructura de respuestas inválida.";

  const encontrado = frases.find((f) =>
    texto.toLowerCase().includes(f.patron.toLowerCase())
  );

  const respuesta = encontrado
    ? encontrado.respuesta
    : "Puedo ayudarte con tratamientos corporales o faciales en Body Elite. Agenda tu evaluación gratuita aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  memoria.contexto.push({ texto, respuesta });
  guardarMemoria(memoria);

  return respuesta;
}

export default { analizarMensaje };
