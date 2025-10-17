import fs from "fs";
const MEMORIA_PATH = "./contexto_memoria.json";

export function cargarContexto() {
  try {
    if (fs.existsSync(MEMORIA_PATH)) {
      const data = JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
      console.log("🧠 Memoria cargada correctamente.");
      return data;
    }
  } catch (e) {
    console.error("❌ Error cargando memoria:", e);
  }
  return {};
}

export function guardarContexto(contexto) {
  try {
    fs.writeFileSync(MEMORIA_PATH, JSON.stringify(contexto, null, 2));
    console.log("💾 Contexto actualizado.");
  } catch (e) {
    console.error("❌ Error guardando contexto:", e);
  }
}

export function aprenderNuevaFrase(texto) {
  try {
    const data = JSON.parse(fs.readFileSync(MEMORIA_PATH, "utf8"));
    if (!data.desconocido) data.desconocido = [];
    if (!data.desconocido.includes(texto)) {
      data.desconocido.push(texto);
      fs.writeFileSync(MEMORIA_PATH, JSON.stringify(data, null, 2));
      console.log(`🧩 Nueva frase aprendida: ${texto}`);
    }
  } catch (e) {
    console.error("❌ Error al aprender nueva frase:", e);
  }
}
