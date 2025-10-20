import fs from "fs";
import { frases } from "./respuestas.js";

const memoriaPath = "./contexto_memoria.json";

function cargarMemoria() {
  try {
    const data = fs.readFileSync(memoriaPath, "utf8");
    return JSON.parse(data).contexto || [];
  } catch {
    return [];
  }
}

function guardarMemoria(contexto) {
  fs.writeFileSync(memoriaPath, JSON.stringify({ contexto }, null, 2));
}

async function analizarMensaje(texto) {
  const entrada = texto.toLowerCase();
  const contexto = cargarMemoria();
  for (const f of frases) {
    if (entrada.includes(f.patron)) {
      contexto.push({ entrada, respuesta: f.respuesta });
      guardarMemoria(contexto);
      return f.respuesta;
    }
  }
  const desconocido = "No entendí tu mensaje. Escribe *hola* para comenzar.";
  contexto.push({ entrada, respuesta: desconocido });
  guardarMemoria(contexto);
  return desconocido;
}

export { analizarMensaje };
