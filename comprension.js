// comprension.js
// Módulo de comprensión avanzada para Zara IA
// Analiza palabras, errores ortográficos y contexto de conversación.

const sinonimos = {
  "haifu": ["hifu", "haifo", "haifu12d", "hifu12d", "haifu 12d", "hifu 12 d"],
  "toxin": ["toxina", "botox", "botulina", "botulínica", "toxina botulinica", "botulina"],
  "pink glow": ["pinkglow", "pink", "glow", "face light", "faceglow"],
  "lipo": ["liposuccion", "lipocavitacion", "cavitacion", "lipoescultura", "abdomen", "reductiva"],
  "sculptor": ["prosculpt", "sculpt", "ems", "electro", "fitness"],
  "antiage": ["arrugas", "rejuvenecimiento", "anti-edad", "lifting", "flacidez"],
  "face": ["rostro", "facial", "cara"],
  "body": ["cuerpo", "corporal", "abdomen", "gluteos"],
  "agenda": ["reservar", "agendar", "cita", "evaluacion", "diagnostico", "reserva", "hora"]
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
