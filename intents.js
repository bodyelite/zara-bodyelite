import fs from "fs";

const frases = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export function procesarMensaje(texto, contexto) {
  texto = texto.toLowerCase();
  for (const [clave, lista] of Object.entries(frases)) {
    if (lista.some(p => texto.includes(p))) return clave;
  }
  if (texto.includes("hola") || texto.includes("buenas")) return "saludo";
  return "desconocido";
}
