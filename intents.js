import fs from "fs";
const frases = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export function procesarMensaje(texto, contexto) {
  texto = texto.toLowerCase();

  if (texto === "sí" || texto === "si") return "confirmacion";
  if (texto.includes("gracias")) return "cierre";

  for (const [clave, lista] of Object.entries(frases)) {
    if (lista.some(p => texto.includes(p))) return clave;
  }

  return "desconocido";
}
