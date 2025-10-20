import fs from "fs";

const memoriaPath = "./contexto_memoria.json";

// Leer memoria en JSON
function cargarMemoria() {
  try {
    const data = fs.readFileSync(memoriaPath, "utf8");
    return JSON.parse(data).conversaciones || [];
  } catch {
    return [];
  }
}

// Normalizar texto para comparación
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Buscar mejor coincidencia entre mensaje y memoria
function obtenerRespuesta(textoUsuario) {
  const conversaciones = cargarMemoria();
  const entrada = normalizar(textoUsuario);

  for (const item of conversaciones) {
    for (const frase of item.usuario) {
      if (entrada.includes(normalizar(frase))) {
        return item.zara;
      }
    }
  }

  // Respuesta por defecto
  return "No entendí tu mensaje. Escribe *hola* para comenzar o indica si te interesa un tratamiento *facial* o *corporal* 🌸";
}

export { obtenerRespuesta };
