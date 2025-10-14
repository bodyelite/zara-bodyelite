// comprension.js
// Módulo de comprensión avanzada con contexto clínico Body Elite

const sinonimos = {
  "lipo": [
    "lipo", "liposuccion", "reductiva", "grasa", "cintura", "abdomen",
    "bajar centimetros", "reducir grasa", "rollitos", "flacidez", "moldear cuerpo"
  ],
  "haifu": ["hifu", "haifu", "hifu 12d", "lifting", "rejuvenecer", "tensar piel"],
  "sculptor": ["sculptor", "ems", "electro", "fitness", "tonificar", "musculo", "abdominales"],
  "pink glow": ["pink glow", "face glow", "revitalizante", "vitaminas", "luminosidad"],
  "toxina": ["toxina", "botox", "botulinica", "toxina botulinica", "arrugas", "frente", "expresion"],
  "antiage": ["antiage", "rejuvenecimiento", "arrugas", "lifting", "colageno", "radiofrecuencia"],
  "facial": ["facial", "cara", "rostro", "piel"],
  "body": ["corporal", "cuerpo", "gluteos", "piernas", "abdomen", "reafirmar"],
  "agenda": ["agenda", "reservar", "cita", "diagnostico", "reserva", "hora"],
  "funciona": ["como funciona", "en que consiste", "como es", "como actua", "duracion", "resultados", "efectos", "cuantas sesiones"]
};

export function detectarIntencion(mensaje) {
  const texto = mensaje.toLowerCase();
  for (const [clave, variantes] of Object.entries(sinonimos)) {
    if (texto.includes(clave) || variantes.some(v => texto.includes(v))) {
      return clave;
    }
  }
  return "general";
}
