// intents.js
// Detección de intención para Zara IA (Body Elite)

export default function detectarIntencion(texto) {
  const t = texto.toLowerCase();

  if (
    t.includes("hola") ||
    t.includes("buenas") ||
    t.includes("zara") ||
    t.includes("ayuda")
  ) {
    return "saludo";
  }

  if (
    t.includes("agendar") ||
    t.includes("evaluacion") ||
    t.includes("agenda gratis") ||
    t.includes("reservo") ||
    t.includes("quiero agenda") ||
    t.includes("agenda") ||
    t.includes("cita")
  ) {
    return "agendar";
  }

  if (
    t.includes("lipo") ||
    t.includes("cavitacion") ||
    t.includes("hifu") ||
    t.includes("toxina") ||
    t.includes("sculptor") ||
    t.includes("radiofrecuencia") ||
    t.includes("tratamiento")
  ) {
    return "tratamientos";
  }

  if (
    t.includes("promo") ||
    t.includes("descuento") ||
    t.includes("oferta") ||
    t.includes("valor") ||
    t.includes("precio")
  ) {
    return "promocion";
  }

  return "desconocido";
}
