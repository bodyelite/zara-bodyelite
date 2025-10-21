import fs from "fs";
import path from "path";

const archivoMemoria = path.join(process.cwd(), "contexto_memoria.json");

let memoria = [];
try {
  const data = fs.readFileSync(archivoMemoria, "utf8");
  memoria = JSON.parse(data);
  console.log("🧠 Memoria cargada correctamente:", memoria.length, "frases");
} catch (error) {
  console.error("⚠️ No se pudo cargar la memoria:", error.message);
  memoria = [];
}

export function buscarRespuesta(texto) {
  const limpio = texto.toLowerCase().trim();
  for (const item of memoria) {
    if (item.patrones.some(p => limpio.includes(p.toLowerCase()))) {
      return item.respuesta;
    }
  }
  return null;
}

export function agregarFrase(patrones, respuesta) {
  memoria.push({ patrones, respuesta });
  guardarMemoria();
}

function guardarMemoria() {
  try {
    fs.writeFileSync(archivoMemoria, JSON.stringify(memoria, null, 2), "utf8");
    console.log("💾 Memoria actualizada correctamente.");
  } catch (error) {
    console.error("⚠️ Error al guardar la memoria:", error.message);
  }
}

export default { buscarRespuesta, agregarFrase };
