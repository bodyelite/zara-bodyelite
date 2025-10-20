export function interpretarMensaje(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("hola")) return "inicio";
  if (texto.includes("facial") || texto.includes("cara")) return "facial";
  if (texto.includes("cuerpo") || texto.includes("corporal")) return "corporal";
  if (texto.includes("abdomen") || texto.includes("grasa") || texto.includes("pierna") || texto.includes("gluteo") || texto.includes("muslo") || texto.includes("trasero")) return "zona corporal";
  if (texto.includes("precio") || texto.includes("valor")) return "consulta precio";
  return "desconocido";
}
