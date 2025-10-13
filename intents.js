// intents.js
// Clasificación mejorada de intenciones para Zara IA

export function clasificarIntencion(texto) {
  const t = texto.toLowerCase();

  if (t.includes("hola") || t.includes("buenas")) return "saludo";
  if (t.includes("gracias") || t.includes("adios")) return "despedida";
  if (t.includes("precio") || t.includes("valor") || t.includes("cuesta")) return "precios";
  if (t.includes("agendar") || t.includes("reserva") || t.includes("cita")) return "agenda";
  if (t.includes("donde") || t.includes("ubicacion") || t.includes("direccion")) return "ubicacion";
  if (t.includes("diagnostico") || t.includes("evaluacion")) return "diagnostico";

  // frases de interés o aclaración
  if (
    t.includes("promo") ||
    t.includes("promocion") ||
    t.includes("en que consiste") ||
    t.includes("esa") ||
    t.includes("quiero esa") ||
    t.includes("quiero la")
  )
    return "interes_promo";

  return "general";
}

export default { clasificarIntencion };
