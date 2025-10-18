import fs from "fs";

const rutaMemoria = "./contexto_memoria.json";

export function cargarMemoria() {
  if (!fs.existsSync(rutaMemoria)) {
    fs.writeFileSync(rutaMemoria, JSON.stringify({ ejemplos: [] }, null, 2));
  }
  const data = fs.readFileSync(rutaMemoria, "utf8");
  return JSON.parse(data);
}

export function guardarEjemplo(pregunta, respuesta) {
  const memoria = cargarMemoria();
  memoria.ejemplos.push({ pregunta, respuesta, fecha: new Date().toISOString() });
  fs.writeFileSync(rutaMemoria, JSON.stringify(memoria, null, 2));
}

export function buscarRespuesta(pregunta) {
  const memoria = cargarMemoria();
  const entrada = memoria.ejemplos.find(e =>
    pregunta.toLowerCase().includes(e.pregunta.toLowerCase())
  );
  return entrada ? entrada.respuesta : null;
}

if (process.argv[2] === "test") {
  guardarEjemplo("hola", "Hola 👋 Soy Zara. ¿En qué puedo ayudarte?");
  console.log("✅ Memoria inicializada y funcionando.");
}
