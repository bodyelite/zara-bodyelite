import { datos } from "./base_conocimiento.js";

/* === UTILIDAD === */
function limpiar(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* === MOTOR PRINCIPAL === */
export function responder(texto) {
  const t = limpiar(texto);
  const f = datos.frases;
  const info = datos.info;
  const alias = datos.alias;
  const probs = datos.problemas;
  const planes = datos.planes;

  if (f.bienvenida?.some(x => t.includes(x)))
    return "🌸 Hola, soy Zara IA de Body Elite. Cuéntame qué zona te gustaría mejorar.";
  if (f.precio?.some(x => t.includes(x)))
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito asistido por IA.";
  if (f.ubicacion?.some(x => t.includes(x)))
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  if (f.horarios?.some(x => t.includes(x)))
    return `🕒 Horarios de atención: ${info.horarios}`;
  if (f.humano?.some(x => t.includes(x)))
    return `📞 Puedes hablar con un especialista al ${info.telefono}`;
  if (f.intencion?.some(x => t.includes(x)))
    return `📅 Agenda tu evaluación gratuita aquí 👉 ${info.agendar}`;

  // Zona y problema
  let zona = null;
  for (const [z, arr] of Object.entries(alias || {})) {
    if (arr.some(a => t.includes(a))) zona = z;
  }

  let problema = null;
  for (const [z, grupo] of Object.entries(probs || {})) {
    for (const [clave] of Object.entries(grupo)) {
      if (t.includes(clave)) {
        problema = clave;
        if (!zona) zona = z;
      }
    }
  }

  if (zona && problema) {
    const arr = probs[zona][problema];
    if (arr) {
      const [p1, p2] = arr;
      const d1 = planes[p1] || "", d2 = planes[p2] || "";
      let r = `✨ Para ${zona} con ${problema}, te recomiendo **${p1}**.\n${d1}`;
      if (p2) r += `\nTambién puedes considerar **${p2}**.\n${d2}`;
      r += `\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
      return r;
    }
  }

  if (zona) {
    const grupo = probs[zona];
    const p1 = Object.values(grupo)[0][0];
    const d1 = planes[p1];
    return `💡 Para ${zona}, te recomiendo **${p1}**.\n${d1}\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
  }

  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}

/* === CAPAS ADICIONALES === */

// Empatía
export function capaEmpatica(textoUsuario, respuestaBase) {
  const saludo = "Hola 😊 ";
  const pie = "\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  const enlace = "\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  if (respuestaBase.includes("Para")) {
    return saludo + "Esa grasita o flacidez se puede tratar sin cirugía ✨\n" +
      respuestaBase.replace("✨ Para", "Con nuestros planes").replace("💡 Para", "Con nuestros planes") +
      enlace + pie;
  }
  return saludo + respuestaBase + enlace + pie;
}

// Curiosidad
export async function capaCuriosidad(textoUsuario, respuestaBase) {
  const t = textoUsuario.toLowerCase();
  const frasesCur = datos.frases?.curiosidad;
  if (!frasesCur || !frasesCur.some(f => t.includes(f))) return respuestaBase;

  const match = respuestaBase.match(/\*\*(.*?)\*\*/);
  if (!match) return respuestaBase;

  const plan = match[1].trim();
  const detalle = datos.planes[plan] || "";

  if (t.includes("barato") || t.includes("econ"))
    return "💡 También existen planes más accesibles con resultados progresivos. Podemos orientarte según tu presupuesto.";
  if (t.includes("caro"))
    return `💬 El plan **${plan}** utiliza tecnología premium (HIFU 12D, RF, EMS) y diagnóstico personalizado. Refleja resultados reales y duraderos.`;
  if (t.includes("sesion"))
    return `📆 El plan **${plan}** incluye entre 6 y 12 sesiones según evaluación clínica. Resultados visibles desde la primera.`;

  return `💬 El plan **${plan}** consiste en ${detalle.toLowerCase()}. Combina tecnología avanzada con enfoque clínico seguro.`;
}

// Interno
export async function capaInterna(textoUsuario) {
  const t = textoUsuario.toLowerCase().trim();
  if (!t.startsWith("zara")) return null;
  const nombres = Object.keys(datos.planes).map(p => p.toLowerCase());
  const encontrado = nombres.find(p => t.includes(p));
  if (!encontrado)
    return "🧠 [MODO INTERNO] No encontré un tratamiento con ese nombre. Verifica la escritura.";
  const nombre = Object.keys(datos.planes).find(p => p.toLowerCase() === encontrado);
  const detalle = datos.planes[nombre] || "";
  return `🧠 [MODO INTERNO]\nTratamiento **${nombre}**:\n${detalle}\n\nUso clínico interno — sin CTA ni enlace.`;
}


/* === EXTENSIÓN FINAL: responderExtendido con capas internas === */
export function responderExtendido(textoUsuario) {
  const t = textoUsuario.toLowerCase().trim();

  // --- 1. MODO INTERNO (solo si inicia con "zara") ---
  if (t.startsWith("zara")) {
    const nombres = Object.keys(datos.planes).map(p => p.toLowerCase());
    const encontrado = nombres.find(p => t.includes(p));
    if (encontrado) {
      const nombre = Object.keys(datos.planes).find(p => p.toLowerCase() === encontrado);
      const detalle = datos.planes[nombre] || "";
      return `🧠 [MODO INTERNO]\nTratamiento **${nombre}**:\n${detalle}\n\nUso clínico interno — sin CTA ni enlace.`;
    }
    return "🧠 [MODO INTERNO] No encontré un tratamiento con ese nombre. Verifica la escritura.";
  }

  // --- 2. RESPUESTA BASE ---
  const base = responder(textoUsuario);

  // --- 3. CAPA DE CURIOSIDAD ---
  const curiosas = [
    "en que consiste","cómo funciona","como funciona","me explicas",
    "detalle","que incluye","que es","por que tan caro","porque tan caro",
    "hay algo mas barato","opcion economica","alternativa","cuentame mas",
    "explicame mas","dime mas","cuantas sesiones","resultado","resultados"
  ];

  if (curiosas.some(f => t.includes(f))) {
    const match = base.match(/\*\*(.*?)\*\*/);
    if (match) {
      const plan = match[1].trim();
      const detalle = datos.planes[plan] || "";
      if (t.includes("barato") || t.includes("econ"))
        return "💡 También existen planes más accesibles con resultados progresivos. Podemos orientarte según tu presupuesto.";
      if (t.includes("caro"))
        return `💬 El plan **${plan}** utiliza tecnología premium (HIFU 12D, RF, EMS) y diagnóstico profesional. Refleja resultados reales y duraderos.`;
      if (t.includes("sesion"))
        return `📆 El plan **${plan}** incluye entre 6 y 12 sesiones según evaluación clínica. Resultados visibles desde la primera.`;
      return `💬 El plan **${plan}** consiste en ${detalle.toLowerCase()}. Combina tecnología avanzada con enfoque clínico seguro.`;
    }
  }

  // --- 4. CAPA EMPÁTICA ---
  const saludo = "Hola 😊 ";
  const pie = "\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  const enlace = "\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  if (base.includes("Para")) {
    return saludo + "Esa grasita o flacidez se puede tratar sin cirugía ✨\n" +
      base.replace("✨ Para", "Con nuestros planes").replace("💡 Para", "Con nuestros planes") +
      enlace + pie;
  }

  // --- 5. FALLBACK ---
  return base;
}


/* === AMPLIACIÓN DETECCIÓN EMPÁTICA 2025 === */
/* Este bloque se suma al responder() sin eliminar contenido anterior. */

if (t.includes("poto") || t.includes("gluteo") || t.includes("glúteo") || t.includes("trasero") || t.includes("levantar") && (t.includes("gluteo") || t.includes("poto"))) {
  return "Hola 😊 Esa zona se puede levantar y tonificar sin cirugía ✨\nCon nuestros planes **Push Up** desde $376.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("panza") || t.includes("abdomen") || t.includes("vientre") || t.includes("rollito") || t.includes("grasa localizada") || t.includes("reductor")) {
  return "Hola 😊 Esa grasita abdominal se puede tratar sin cirugía ✨\nCon nuestros planes **Lipo Reductiva** desde $348.800 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("brazo") || t.includes("brazos") || t.includes("flacidez") && t.includes("brazo")) {
  return "Hola 😊 Esa flacidez en brazos se puede mejorar sin cirugía ✨\nCon nuestros planes **Body Tensor** desde $232.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("piel flacida") || t.includes("flacidez corporal") || t.includes("tonificar") || t.includes("endurecer")) {
  return "Hola 😊 Podemos ayudarte a tonificar y reafirmar la piel ✨\nCon nuestros planes **Body Fitness** desde $360.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("cara") || t.includes("rostro") || t.includes("papada") || t.includes("arrugas") || t.includes("frente") || t.includes("ojeras") || t.includes("piel apagada") || t.includes("cara cansada")) {
  return "Hola 😊 Podemos mejorar la firmeza y luminosidad de tu rostro ✨\nCon nuestros planes **Face Smart** desde $198.400 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("acne") || t.includes("espinilla") || t.includes("grano") || t.includes("piel grasa") || t.includes("imperfeccion")) {
  return "Hola 😊 Ese tipo de piel se puede equilibrar con limpieza profunda y luz LED ✨\nCon nuestros planes **Limpieza Facial Full** desde $120.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("hifu") || t.includes("radiofrecuencia") || t.includes("ems") || t.includes("sculptor") || t.includes("cavitacion")) {
  return "Hola 😊 Trabajamos con tecnología avanzada como HIFU 12D, Cavitación y EMS Sculptor ✨\nPodemos recomendarte un plan desde $348.800 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("toxina") || t.includes("botox") || t.includes("arrugas") || t.includes("expresion")) {
  return "Hola 😊 Podemos suavizar las líneas de expresión y mejorar la firmeza facial ✨\nCon nuestros planes **Face Elite** desde $358.400 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("manchas") || t.includes("luminosidad") || t.includes("rejuvenecer") || t.includes("antiedad") || t.includes("antiage") || t.includes("renovar")) {
  return "Hola 😊 Podemos rejuvenecer y devolver luminosidad a tu piel ✨\nCon nuestros planes **Face Antiage** desde $281.600 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}


/* === AMPLIACIÓN DETECCIÓN EMPÁTICA 2025 === */
/* Este bloque se suma al responder() sin eliminar contenido anterior. */

if (t.includes("poto") || t.includes("gluteo") || t.includes("glúteo") || t.includes("trasero") || t.includes("levantar") && (t.includes("gluteo") || t.includes("poto"))) {
  return "Hola 😊 Esa zona se puede levantar y tonificar sin cirugía ✨\nCon nuestros planes **Push Up** desde $376.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("panza") || t.includes("abdomen") || t.includes("vientre") || t.includes("rollito") || t.includes("grasa localizada") || t.includes("reductor")) {
  return "Hola 😊 Esa grasita abdominal se puede tratar sin cirugía ✨\nCon nuestros planes **Lipo Reductiva** desde $348.800 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("brazo") || t.includes("brazos") || t.includes("flacidez") && t.includes("brazo")) {
  return "Hola 😊 Esa flacidez en brazos se puede mejorar sin cirugía ✨\nCon nuestros planes **Body Tensor** desde $232.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("piel flacida") || t.includes("flacidez corporal") || t.includes("tonificar") || t.includes("endurecer")) {
  return "Hola 😊 Podemos ayudarte a tonificar y reafirmar la piel ✨\nCon nuestros planes **Body Fitness** desde $360.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("cara") || t.includes("rostro") || t.includes("papada") || t.includes("arrugas") || t.includes("frente") || t.includes("ojeras") || t.includes("piel apagada") || t.includes("cara cansada")) {
  return "Hola 😊 Podemos mejorar la firmeza y luminosidad de tu rostro ✨\nCon nuestros planes **Face Smart** desde $198.400 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("acne") || t.includes("espinilla") || t.includes("grano") || t.includes("piel grasa") || t.includes("imperfeccion")) {
  return "Hola 😊 Ese tipo de piel se puede equilibrar con limpieza profunda y luz LED ✨\nCon nuestros planes **Limpieza Facial Full** desde $120.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("hifu") || t.includes("radiofrecuencia") || t.includes("ems") || t.includes("sculptor") || t.includes("cavitacion")) {
  return "Hola 😊 Trabajamos con tecnología avanzada como HIFU 12D, Cavitación y EMS Sculptor ✨\nPodemos recomendarte un plan desde $348.800 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("toxina") || t.includes("botox") || t.includes("arrugas") || t.includes("expresion")) {
  return "Hola 😊 Podemos suavizar las líneas de expresión y mejorar la firmeza facial ✨\nCon nuestros planes **Face Elite** desde $358.400 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}

if (t.includes("manchas") || t.includes("luminosidad") || t.includes("rejuvenecer") || t.includes("antiedad") || t.includes("antiage") || t.includes("renovar")) {
  return "Hola 😊 Podemos rejuvenecer y devolver luminosidad a tu piel ✨\nCon nuestros planes **Face Antiage** desde $281.600 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
}
