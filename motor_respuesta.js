import fs from "fs";

function obtenerDetalleClinico(mensaje, contextoPrevio) {
  const t = mensaje.toLowerCase();
  let planDetectado = null;

  // --- detección por palabras clave según zona o interés ---
  if (t.includes("muslo") || t.includes("pierna")) planDetectado = "body tensor";
  if (t.includes("gluteo") || t.includes("glúteo") || t.includes("push")) planDetectado = "push up";
  if (t.includes("abdomen") || t.includes("cintura")) planDetectado = "lipo reductiva";
  if (t.includes("arruga") || t.includes("frente") || t.includes("expresion")) planDetectado = "face antiage";
  if (t.includes("papada") || t.includes("contorno")) planDetectado = "face elite";
  if (t.includes("mancha") || t.includes("piel seca")) planDetectado = "face smart";
  if (t.includes("limpieza")) planDetectado = "limpieza facial";
  if (t.includes("toxina") || t.includes("botox")) planDetectado = "toxina";
  if (t.includes("pink")) planDetectado = "pink glow";

  // --- si no hay palabra clave, usar contexto previo ---
  if (!planDetectado && contextoPrevio && contextoPrevio.plan) {
    planDetectado = contextoPrevio.plan.toLowerCase();
  }

  // --- buscar en base de conocimiento ---
  const plan = baseConocimiento.find((p) => planDetectado && p.activador === planDetectado);
  if (!plan) return null;

  // --- generar resumen clínico compacto ---
  return `📋 **${plan.plan}**\n${plan.detalle
    .split("\n")
    .filter(linea => !linea.startsWith("**Valor") && !linea.startsWith("**Tratamiento"))
    .join("\n")}\n¿Quieres agendar tu evaluación gratuita? 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
}

// --- interceptar antes del fallback ---
const originalResponder = responder;
export async function responder(mensaje) {
  const respuestaBase = await originalResponder(mensaje);
  const contextoPrevio = obtenerContexto();
  const detalle = obtenerDetalleClinico(mensaje, contextoPrevio);
  if (detalle && respuestaBase.includes("No logré entender completamente")) {
    return detalle;
  }
  return respuestaBase;
}
