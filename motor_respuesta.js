import { registrarConversacion } from "./memoria.js";
import baseConocimiento from "./base_conocimiento.js";
import logs from "./logs_wsp.json" assert { type: "json" };

/* === FUNCIÓN PRINCIPAL DE RESPUESTA === */
export async function responder(mensaje) {
  const t = mensaje.toLowerCase().trim();
  let respuesta = "";

  /* --- RESPUESTAS EMPÁTICAS / CLÍNICAS --- */
  if (t.includes("poto") || t.includes("gluteo") || t.includes("glúteo") || t.includes("trasero") || (t.includes("levantar") && (t.includes("gluteo") || t.includes("poto")))) {
    return "Hola 😊 Esa zona se puede levantar y tonificar sin cirugía ✨\nCon nuestros planes **Push Up** desde $376.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  }

  if (t.includes("panza") || t.includes("abdomen") || t.includes("vientre") || t.includes("rollito") || t.includes("grasa localizada") || t.includes("reductor")) {
    return "Hola 😊 Esa grasita abdominal se puede tratar sin cirugía ✨\nCon nuestros planes **Lipo Reductiva** desde $348.800 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  }

  if (t.includes("brazo") || t.includes("brazos") || (t.includes("flacidez") && t.includes("brazo"))) {
    return "Hola 😊 Esa flacidez en brazos se puede mejorar sin cirugía ✨\nCon nuestros planes **Body Tensor** desde $232.000 (valor referencial, sujeto a evaluación clínica).\n🔗 Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9\n\n📍 Av. Las Perdices 2990, Peñalolén\n🕐 Lun–Vie 9:30–20:00 · Sáb 9:30–13:00";
  }

  if (t.includes("flacidez corporal") || t.includes("tonificar") || t.includes("endurecer")) {
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

  /* --- SI NO HAY COINCIDENCIAS --- */
  respuesta = baseConocimiento.find((e) => t.includes(e.pregunta));
  if (respuesta) return respuesta.respuesta;

  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indicaré el tratamiento ideal con descripción y valor.";
}
