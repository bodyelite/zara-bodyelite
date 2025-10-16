import fs from "fs";

const RUTA_MEMORIA = "./contexto_memoria.json";

function cargarMemoria() {
  try {
    const data = fs.readFileSync(RUTA_MEMORIA, "utf8");
    return JSON.parse(data);
  } catch {
    return { ejemplos: [] };
  }
}

function guardarMemoria(memoria) {
  fs.writeFileSync(RUTA_MEMORIA, JSON.stringify(memoria, null, 2), "utf8");
}

export function aprender(texto, respuesta) {
  const memoria = cargarMemoria();
  memoria.ejemplos.push({ texto, respuesta });
  guardarMemoria(memoria);
  return "Gracias por tu mensaje. Estoy aprendiendo de tus consultas para mejorar mis respuestas.";
}

export function buscarRespuesta(texto) {
  const memoria = cargarMemoria();
  const coincidencia = memoria.ejemplos.find(e =>
    texto.toLowerCase().includes(e.texto.toLowerCase())
  );
  return coincidencia ? coincidencia.respuesta : null;
}
