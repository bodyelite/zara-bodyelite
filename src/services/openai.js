import { TRATAMIENTOS, NEGOCIO } from "../../config/knowledge_base.js";

export async function generarRespuestaIA(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase();

  // 1. DETECTOR DE ZONAS (Busca palabras clave en tu base de datos)
  for (const [clave, datos] of Object.entries(TRATAMIENTOS)) {
    // Busca si el mensaje contiene el nombre del tratamiento (ej: "lipo express")
    if (texto.includes(clave.replace("_", " ")) || texto.includes(datos.nombre.toLowerCase())) {
      return `✨ **${datos.nombre}**\n\n${datos.info}\n\n💰 Precio: ${datos.precio}\n💆‍♀️ Dolor: ${datos.dolor}\n\n¿Te gustaría agendar una evaluación? 👇\n${NEGOCIO.agenda_link}`;
    }
  }

  // 2. RESPUESTAS BÁSICAS
  if (texto.includes("hola") || texto.includes("buenos")) {
    return `¡Hola! 👋 Soy Zara de ${NEGOCIO.nombre}. \n\nCuéntame, ¿qué te gustaría mejorar hoy? (Escribe el nombre del tratamiento, ej: "Lipo Express", "Glúteos", "Depilación")`;
  }

  if (texto.includes("precio") || texto.includes("valor")) {
    return "Tengo los precios de todos nuestros tratamientos. 📝 Escribe cuál te interesa. (Ej: 'Lipo Express', 'Body Tensor'...)";
  }

  // 3. RESPUESTA POR DEFECTO (Si no entiende)
  return "¡Recibido! 📨 (Modo Manual)\n\nNo tengo mi cerebro de IA conectado, así que solo entiendo nombres exactos.\n\nPrueba escribiendo: 'Lipo Express', 'Push Up' o 'Hola'.";
}
