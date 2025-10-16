import fs from "fs";

const archivoMemoria = "./contexto_memoria.json";

export function buscarRespuesta(texto) {
  try {
    const memoria = JSON.parse(fs.readFileSync(archivoMemoria, "utf8"));
    const entrada = memoria.ejemplos.find(e => texto.includes(e.palabra));
    return entrada ? entrada.respuesta : null;
  } catch {
    return null;
  }
}

export function aprender(palabra, respuesta) {
  try {
    const memoria = JSON.parse(fs.readFileSync(archivoMemoria, "utf8"));
    memoria.ejemplos.push({ palabra, respuesta });
    fs.writeFileSync(archivoMemoria, JSON.stringify(memoria, null, 2));
  } catch {
    fs.writeFileSync(archivoMemoria, JSON.stringify({ ejemplos: [{ palabra, respuesta }] }, null, 2));
  }
}

