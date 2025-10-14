// memoria.js
// Memoria conversacional + almacenamiento de aprendizajes locales

const memoriaConversaciones = new Map();
const aprendizajesLocales = new Map();

/**
 * Guarda historial reciente por número.
 */
export function actualizarMemoria(telefono, mensaje, respuesta) {
  const historial = memoriaConversaciones.get(telefono) || [];
  historial.push({ usuario: mensaje, zara: respuesta, fecha: Date.now() });

  if (historial.length > 10) historial.shift();
  memoriaConversaciones.set(telefono, historial);
}

/**
 * Devuelve contexto breve de los últimos mensajes.
 */
export function obtenerContexto(telefono) {
  const historial = memoriaConversaciones.get(telefono);
  if (!historial) return "";
  const ultimos = historial.slice(-3).map(h => h.usuario).join(" | ");
  return ultimos ? `Contexto previo: ${ultimos}` : "";
}

/**
 * Borra memoria de un usuario.
 */
export function limpiarMemoria(telefono) {
  memoriaConversaciones.delete(telefono);
}

/**
 * Registra nuevas palabras/frases detectadas en conversaciones reales.
 */
export function registrarAprendizaje(frase, respuesta) {
  const f = frase.toLowerCase().trim();
  if (!f || f.length < 3) return;
  if (!aprendizajesLocales.has(f)) {
    aprendizajesLocales.set(f, respuesta);
  }
}

/**
 * Busca si hay una respuesta aprendida.
 */
export function buscarAprendizaje(frase) {
  const f = frase.toLowerCase().trim();
  for (const [clave, valor] of aprendizajesLocales.entries()) {
    if (f.includes(clave)) return valor;
  }
  return null;
}

/**
 * Devuelve una vista resumida de aprendizajes (solo para depuración local).
 */
export function verAprendizajes() {
  return Array.from(aprendizajesLocales.entries());
}
