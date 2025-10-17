import fs from "fs";
const frases = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

// normaliza texto quitando tildes y signos
function limpiar(txt) {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function procesarMensaje(texto, contexto) {
  texto = limpiar(texto);

  // intenciones básicas
  if (texto === "si" || texto === "sí") return "confirmacion";
  if (texto.includes("gracias")) return "cierre";

  // emociones y sensaciones
  const sensaciones = ["rollitos","flacidez","grasa","piel suelta","me cuelga","me sobra","arrugas","papada","bolsas","marcas","manchas"];
  if (sensaciones.some(p => texto.includes(p))) return "sensacion";

  // tratamientos
  const tratamientos = ["lipo","push up","face","facial","pink glow","botox","toxina"];
  if (tratamientos.some(p => texto.includes(p))) return "tratamiento";

  // ubicación o horarios
  if (texto.includes("donde") || texto.includes("ubicad") || texto.includes("direccion")) return "ubicacion";

  // saludo
  if (texto.includes("hola") || texto.includes("buenas")) return "saludo";

  return "desconocido";
}
