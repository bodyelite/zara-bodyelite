// limpiado de funciones obsoletas (analizarSemantica eliminado)
import fs from "fs";

const DATA_PATH = "./contexto_memoria.json";

export function entrenarIA() {
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]");
  const frases = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  console.log(`🧠 IA entrenada con ${frases.length} ejemplos locales.`);
  return frases.length;
}

export function agregarEjemplo(frase, categoria) {
  const frases = fs.existsSync(DATA_PATH)
    ? JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
    : [];
  frases.push({ frase, categoria });
  fs.writeFileSync(DATA_PATH, JSON.stringify(frases, null, 2));
}
