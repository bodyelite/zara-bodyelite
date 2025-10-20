import fs from "fs";

const memoriaPath = "./contexto_memoria.json";

// Cargar la memoria actual
function cargarMemoria() {
  try {
    const data = fs.readFileSync(memoriaPath, "utf8");
    return JSON.parse(data);
  } catch {
    return { conversaciones: [] };
  }
}

// Guardar la memoria actualizada
function guardarMemoria(memoria) {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}

// Aprender una nueva conversación
function aprender(fraseUsuario, respuestaZara) {
  const memoria = cargarMemoria();

  // Verificar si ya existe una coincidencia similar
  const existe = memoria.conversaciones.some(item =>
    item.usuario.some(u => u.toLowerCase() === fraseUsuario.toLowerCase())
  );

  if (!existe) {
    memoria.conversaciones.push({
      usuario: [fraseUsuario],
      zara: respuestaZara
    });
    guardarMemoria(memoria);
    console.log("Nueva frase aprendida y guardada.");
  } else {
    console.log("La frase ya existía en la memoria.");
  }
}

// Simulación de aprendizaje manual desde terminal
if (process.argv.length >= 4) {
  const fraseUsuario = process.argv[2];
  const respuestaZara = process.argv.slice(3).join(" ");
  aprender(fraseUsuario, respuestaZara);
}

export { aprender };
