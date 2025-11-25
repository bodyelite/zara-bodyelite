import { TRATAMIENTOS, NEGOCIO } from "../../config/knowledge_base.js";

/**
 * 🧠 CEREBRO MANUAL (MODO PRUEBA GRATIS)
 * Este archivo simula ser la IA, pero usa lógica simple para que pruebes
 * la conexión sin gastar créditos.
 */
export async function generarRespuestaIA(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase();

  // 1. DETECTOR DE ZONAS Y TRATAMIENTOS
  // Busca en tu base de conocimiento si alguna palabra coincide
  for (const [clave, datos] of Object.entries(TRATAMIENTOS)) {
    // Usamos el nombre del tratamiento como palabra clave simple
    if (texto.includes(clave.replace("_", " ")) || texto.includes(datos.nombre.toLowerCase())) {
      return `✨ **${datos.nombre}**\n\n${datos.info}\n\n💰 Precio: ${datos.precio}\n💆‍♀️ Dolor: ${datos.dolor}\n\n¿Te gustaría agendar una evaluación? 👇\n${NEGOCIO.agenda_link}`;
    }
  }

  // 2. RESPUESTAS ESPECÍFICAS
  if (texto.includes("hola") || texto.includes("buenos")) {
    return `¡Hola! 👋 Soy Zara de ${NEGOCIO.nombre}. \n\nCuéntame, ¿qué te gustaría mejorar hoy? (Tenemos Lipo, Glúteos, Rostro, Depilación...)`;
  }

  if (texto.includes("precio") || texto.includes("valor")) {
    return "Tengo los precios de todos nuestros tratamientos. 📝 ¿Cuál te interesa? (Ej: Lipo, Glúteos, Piernas...)";
  }

  if (texto.includes("agendar") || texto.includes("hora") || texto.includes("cita")) {
    return `¡Claro! La evaluación es gratuita. 💙\nPuedes elegir tu horario aquí: ${NEGOCIO.agenda_link}`;
  }

  // 3. RESPUESTA POR DEFECTO (ECO)
  return "¡Recibido! 📨 (Modo Prueba Sin IA)\n\nEntendí que dijiste: \"" + mensajeUsuario + "\".\n\nPara probar, escribe 'Lipo Express' o 'Hola'.";
}
