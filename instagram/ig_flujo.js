import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const flujoPath = path.join(__dirname, "ig_flujo.json");
const flujo = JSON.parse(fs.readFileSync(flujoPath, "utf8")).flujo_zara_instagram;

// Normaliza texto para comparación
function limpiarTexto(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Busca coincidencia con detonantes
function detectarNodo(texto) {
  const t = limpiarTexto(texto);
  for (const [nodo, data] of Object.entries(flujo)) {
    if (data.detonantes && data.detonantes.some(p => t.includes(p))) return nodo;
  }
  return "no_entendido";
}

// Genera respuesta según flujo
export function responderIG(textoUsuario, nombreUsuario = "") {
  const nodo = detectarNodo(textoUsuario);
  const data = flujo[nodo];

  if (!data) return flujo.no_entendido.respuesta;

  let respuesta = "";
  if (typeof data.respuesta === "string") {
    respuesta = data.respuesta.replace("{{nombre}}", nombreUsuario || "");
  } else if (typeof data.respuesta === "object") {
    const tipo = limpiarTexto(textoUsuario);
    if (tipo.includes("grasa")) respuesta = data.respuesta.grasa;
    else if (tipo.includes("flacidez")) respuesta = data.respuesta.flacidez;
    else respuesta = data.respuesta.ambas;
  }

  return respuesta || flujo.no_entendido.respuesta;
}

// Prueba local (opcional)
if (import.meta.url === `file://${process.argv[1]}`) {
  const pruebas = [
    "hola",
    "tengo grasa en abdomen",
    "quiero saber precios",
    "hay algo más barato?",
    "no entiendo nada"
  ];
  console.log("=== PRUEBA ZARA IG ===");
  for (const p of pruebas) console.log(`\n🗣️ Usuario: ${p}\n🤖 Zara IG: ${responderIG(p, "María")}`);
}
