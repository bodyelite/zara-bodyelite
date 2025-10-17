export function procesarMensaje(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("botox")) return "botox";
  if (texto.includes("full face")) return "fullface";
  if (texto.includes("pink glow")) return "pinkglow";
  if (texto.includes("planes") || texto.includes("tratamientos")) return "planes";

  return "general";
}
