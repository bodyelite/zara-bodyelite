import fs from "fs";
import { interpretarIntencion } from "./responses.js";

const DATA_FILE = "./aprendizaje.json";
const MEMORIA_FILE = "./patrones.json";

// === carga de datos ===
function cargarAprendizaje() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// === guardar patrones actualizados ===
function guardarPatrones(patrones) {
  fs.writeFileSync(MEMORIA_FILE, JSON.stringify(patrones, null, 2));
  console.log("✅ Patrones actualizados guardados en patrones.json");
}

// === entrenamiento leve ===
export function entrenar() {
  const datos = cargarAprendizaje();
  if (!datos.length) {
    console.log("⚠️ No hay nuevos datos de aprendizaje aún.");
    return;
  }

  // Agrupar por tema
  const conteo = {};
  for (const d of datos) {
    const key = d.tema || "general";
    conteo[key] = conteo[key] || [];
    conteo[key].push(d.texto);
  }

  const patrones = {};

  for (const [tema, frases] of Object.entries(conteo)) {
    const frecuentes = frases
      .map(f => f.toLowerCase())
      .filter(f => f.split(" ").length <= 6) // solo frases cortas útiles
      .reduce((acc, f) => {
        acc[f] = (acc[f] || 0) + 1;
        return acc;
      }, {});

    const top = Object.entries(frecuentes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([f]) => f);

    patrones[tema] = top;
  }

  guardarPatrones(patrones);
}

// === carga dinámica al iniciar Zara ===
export function cargarPatrones() {
  if (!fs.existsSync(MEMORIA_FILE)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(MEMORIA_FILE, "utf8"));
    console.log("🧠 Patrones cargados dinámicamente:", Object.keys(data));
    return data;
  } catch {
    return {};
  }
}
