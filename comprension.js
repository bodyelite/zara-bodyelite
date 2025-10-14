// comprension.js
// Módulo de comprensión avanzada para Zara IA (Body Elite)
// Reconoce sinónimos, errores ortográficos y frases coloquiales para identificar intención.

const sinonimos = {
  "lipo": [
    "lipo", "lipito", "liposuccion", "cavitacion", "reductiva", "grasa", "abdomen", 
    "cintura", "rollito", "rollos", "guatita", "piernas", "reducir", "rebajar"
  ],
  "haifu": ["hifu", "haifu", "haifuu", "hifu12d", "haifu 12d", "haif", "hiifu"],
  "sculptor": ["sculptor", "sculptorr", "ems", "fitness", "tonificar", "electro"],
  "pink glow": ["pink glow", "pinkglow", "face glow", "revitalizante"],
  "toxina": ["toxina", "botox", "botulínica", "botulina", "toxina botulinica"],
  "antiage": ["antiage", "rejuvenecimiento", "arrugas", "lifting", "flacidez"],
  "facial": ["facial", "face", "rostro", "cara"],
  "body": ["corporal", "cuerpo", "gluteos", "abdomen", "piernas"],
  "agenda": ["agendar", "cita", "diagnostico", "reserva", "reservar", "hora"]
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
