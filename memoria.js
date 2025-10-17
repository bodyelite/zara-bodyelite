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
    console.log("💾 Memoria actualizada.");
  } catch (e) {
    console.error("❌ Error guardando memoria:", e);
  }
}
