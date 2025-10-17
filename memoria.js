import fs from "fs";

export function guardarContexto(contexto) {
  fs.writeFileSync("./contexto_memoria.json", JSON.stringify(contexto, null, 2));
  console.log("🧠 Contexto guardado en memoria local");
}

export function cargarContexto() {
  try {
    const data = fs.readFileSync("./contexto_memoria.json", "utf8");
    console.log("🧩 Contexto cargado en memoria local");
    return JSON.parse(data);
  } catch (err) {
    console.error("⚠️ No se pudo cargar el contexto, iniciando vacío");
    return {};
  }
}
