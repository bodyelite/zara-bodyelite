// comprension.js
export function limpiarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, "")
    .trim();
}

const alias = {
  haifu: ["hifu", "haifu", "haifuu", "haif", "hiifu", "haifo"],
  botox: ["botox", "boto", "botx", "botz", "toxina", "toxxina", "toxina botulinica", "botul"],
  lipo: ["lipo", "lipoexpres", "lipoescultura", "lippo", "lippoexpres"],
  sculptor: ["sculptor", "sculptorr", "scultor", "escultor"],
  facial: ["facial", "face", "rostro", "cara", "antiage", "antiedad"],
  corporal: ["corporal", "body", "abdomen", "pierna", "gluteos", "brazos"],
  promo: ["promo", "promocion", "oferta", "descuento"],
  agendar: ["agendar", "agendo", "cita", "reserva", "reservar", "agenda", "diagnostico"],
};

export function normalizar(texto) {
  const limpio = limpiarTexto(texto);
  for (const [clave, variantes] of Object.entries(alias)) {
    for (const v of variantes) {
      if (limpio.includes(v)) return clave;
    }
  }
  return limpio;
}

export function clasificarIntencion(texto) {
  const normal = normalizar(texto);
  if (["agendar"].includes(normal)) return "agendar";
  if (["promo"].includes(normal)) return "promocion";
  if (["facial", "corporal", "hifu", "botox", "lipo", "sculptor"].includes(normal)) return "tratamientos";
  if (normal.includes("hola") || normal.includes("buenas")) return "saludo";
  return "desconocido";
}
