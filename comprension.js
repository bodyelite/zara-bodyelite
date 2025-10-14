// comprension.js
// Interpreta mensajes informales, con errores y abreviaciones

export function analizarTexto(texto) {
  const msg = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const reemplazos = {
    haifu: "hifu",
    toxxina: "toxina",
    toccina: "toxina",
    botz: "botox",
    radifrecuecia: "radiofrecuencia",
    lippo: "lipo",
    escultur: "sculptor",
  };

  let limpio = msg;
  for (const [error, correcto] of Object.entries(reemplazos)) {
    limpio = limpio.replaceAll(error, correcto);
  }

  return limpio;
}
