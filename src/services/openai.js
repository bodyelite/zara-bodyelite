import { TRATAMIENTOS, NEGOCIO } from "../../config/knowledge_base.js";

export async function generarRespuestaIA(mensajeUsuario) {
  // 1. Normalizar texto (quitar tildes y mayúsculas para que entienda igual)
  const texto = mensajeUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 2. DICCIONARIO DE SINÓNIMOS (Aquí cargamos las "palabras comunes")
  const DICCIONARIO = {
    "lipo_express": ["lipo", "abdomen", "guata", "panza", "barriga", "gordura", "express"],
    "lipo_body_elite": ["body elite", "completo", "full", "cuerpo entero"],
    "push_up": ["gluteo", "poto", "cola", "trasero", "nalga", "levantar", "push"],
    "body_tensor": ["pierna", "celulitis", "flacidez", "brazo", "tensor", "piel suelta"],
    "face_elite": ["cara", "rostro", "arruga", "botox", "rejuveneci", "face"],
    "depilacion": ["depila", "laser", "pelo", "vello", "bosque"]
  };

  // 3. BUSCAR COINCIDENCIAS
  // Recorremos el diccionario para ver si el usuario dijo alguna palabra clave
  for (const [llaveTratamiento, palabrasClave] of Object.entries(DICCIONARIO)) {
    // Si el texto del usuario contiene alguna de las palabras de la lista...
    if (palabrasClave.some(palabra => texto.includes(palabra))) {
      const datos = TRATAMIENTOS[llaveTratamiento];
      
      // Respondemos con la ficha técnica
      return `✨ **${datos.nombre}**\n\n${datos.info}\n\n💰 Precio: ${datos.precio}\n💆‍♀️ Dolor: ${datos.dolor}\n\n¿Te gustaría agendar una evaluación gratis? 👇\n${NEGOCIO.agenda_link}`;
    }
  }

  // 4. RESPUESTAS SOCIALES (Saludos y despedidas)
  if (texto.includes("hola") || texto.includes("buenos") || texto.includes("alo")) {
    return `¡Hola! 👋 Soy Zara de ${NEGOCIO.nombre}.\n\nCuéntame, ¿qué zona te gustaría mejorar? (Ej: Abdomen, Glúteos, Rostro...)`;
  }

  if (texto.includes("precio") || texto.includes("valor") || texto.includes("cuanto sale")) {
    return "Tengo los precios de todo. 📝 Dime qué tratamiento buscas o qué zona del cuerpo te molesta.";
  }

  if (texto.includes("agendar") || texto.includes("hora") || texto.includes("pedir")) {
    return `¡Por supuesto! La evaluación es costo cero. 💙\nAgenda aquí: ${NEGOCIO.agenda_link}`;
  }

  if (texto.includes("gracias") || texto.includes("te pasaste")) {
    return "¡De nada! 💙 Estoy atenta si necesitas algo más.";
  }

  // 5. RESPUESTA POR DEFECTO (Si no entiende nada)
  return `Mmm... no estoy segura de qué tratamiento buscas 🤔.\n\nPrueba escribiendo la zona del cuerpo, por ejemplo:\n- "Abdomen"\n- "Glúteos"\n- "Rostro"\n- "Depilación"`;
}
