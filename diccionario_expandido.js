export const sinonimos = {
  arrugas: ["arruga", "líneas", "lineas", "marcas", "pliegues", "arruguitas"],
  flacidez: ["piel suelta", "piel caída", "flojera", "sin firmeza"],
  manchas: ["manchitas", "hiperpigmentación", "tono irregular", "pecas"],
  acne: ["espinillas", "granos", "acné", "comedones"],
  grasa: ["grasa localizada", "acumulación", "acumulada", "exceso de grasa"],
  celulitis: ["piel de naranja", "hoyuelos", "adiposidad"],
  tonificar: ["endurecer", "fortalecer", "definir", "marcar"],
  piel: ["cutis", "epidermis", "piel seca", "resequedad", "deshidratada"],
  gluteos: ["glúteos", "cola", "trasero", "pompis"],
  abdomen: ["vientre", "barriga", "panza", "cintura"],
  rostro: ["cara", "frente", "papada", "mentón", "mejillas", "cuello"]
};

export function expandirTexto(texto) {
  let t = texto.toLowerCase();
  for (const [clave, lista] of Object.entries(sinonimos)) {
    if (lista.some(p => t.includes(p))) {
      t += ` ${clave}`; // refuerza la detección
    }
  }
  return t;
}
