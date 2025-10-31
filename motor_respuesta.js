import fs from "fs";
import baseConocimiento from "./base_conocimiento.js";
import { registrarContexto, obtenerContexto } from "./memoria.js";

// === FUNCIÓN PRINCIPAL DE RESPUESTA ===
export async function responder(mensaje) {
  const t = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const CTA = "🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  const contextoPrevio = obtenerContexto();

  // --- saludos ---
  const saludos = ["hola","buenas","buen dia","buenos dias","buenas tardes","buenas noches","hey","holi"];
  if (saludos.some(s => t.startsWith(s))) {
    registrarContexto("saludo","inicio conversacion");
    return "Hola 😊 Soy Zara de Body Elite. Cuéntame qué zona te gustaría mejorar para orientarte con el tratamiento ideal ✨";
  }

  // --- ubicación y horarios ---
  if (t.includes("donde") || t.includes("ubic") || t.includes("direccion")) {
    return "📍 Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén (Strip Center Las Pircas)**. Horarios: Lun–Vie 9:30–20:00 y Sáb 9:30–13:00.";
  }
  if (t.includes("horario") || t.includes("abren") || t.includes("atienden")) {
    return "🕓 Nuestro horario es de **lunes a viernes 9:30 a 20:00** (última atención 19:00) y **sábado 9:30 a 13:00**.";
  }

  // --- intención positiva ---
  const positiva = ["si","sí","me interesa","quiero","ok","claro","perfecto","genial","obvio","dale"];
  if (positiva.some(p => t === p || t.includes(p))) {
    if (contextoPrevio?.tipo === "corporal") return "Excelente 💪 podemos coordinar tu evaluación corporal gratuita. ¿Qué día te acomoda asistir?";
    if (contextoPrevio?.tipo === "facial") return "Perfecto 😊 agendemos tu evaluación facial sin costo. ¿Qué día te acomoda?";
    return "Excelente 😊 podemos coordinar tu evaluación sin costo. ¿Qué día te acomoda asistir?";
  }

  // --- categorías principales ---
  const categorias = {
    corporal:["abdomen","panza","rollitos","grasa","grasita","vientre","cintura","brazos","flacidez","celulitis","pierna","muslo","gluteo","glúteo","poto","trasero","cola"],
    facial:["cara","rostro","papada","arrugas","lineas","expresion","frente","ojeras","manchas","piel","luminosidad"],
    curiosidad:["en que consiste","como funciona","que incluye","cuantas sesiones","detalle","explicame","dime mas","que es","cual recomiendas"],
    duda:["duele","sirve para hombres","demora","puedo pagar","cuando podria","garantia","garantias"],
    cierre:["gracias","ok","perfecto","genial","listo"]
  };

  // --- tratamientos corporales personalizados ---
  if (categorias.corporal.some(p => t.includes(p))) {
    registrarContexto("tipo","corporal");
    if (t.includes("flacidez")) return `Para flacidez localizada recomendamos **Body Tensor**, que utiliza RF Dual + EMS Sculptor para tonificar piel y músculo. Resultados visibles desde las primeras sesiones 💪 ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    if (t.includes("gluteo")||t.includes("glúteo")||t.includes("poto")||t.includes("cola")) return `Para levantar y definir glúteos el plan ideal es **Push Up Glúteo**, con EMS Sculptor + Radiofrecuencia Dual 🍑 ¿Quieres reservar tu evaluación gratuita? ${CTA}`;
    if (t.includes("brazo")||t.includes("brazos")) return `En brazos trabajamos grasa y flacidez con **Body Tensor** o **Lipo Focalizada**, que combinan HIFU 12D + RF Dual. ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    if (t.includes("grasa")||t.includes("abdomen")||t.includes("vientre")) return `Para reducción de grasa abdominal te recomendamos **Lipo Reductiva** o **Lipo Body Elite**, con HIFU 12D y Cavitación 🔥 ¿Agendamos tu evaluación? ${CTA}`;
    return `Podemos tratar esa zona sin cirugía ✨ con **Lipo Reductiva**, **Body Tensor** o **Push Up**, según diagnóstico. Usamos HIFU 12D, Cavitación, RF y EMS Sculptor 💪 ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
  }

  // --- tratamientos faciales ---
  if (categorias.facial.some(p => t.includes(p))) {
    registrarContexto("tipo","facial");
    return `Podemos mejorar firmeza y luminosidad facial con **Face Smart**, **Face Antiage** o **Face Elite**, según diagnóstico. Usamos HIFU 12D y RF fraccionada ✨ ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
  }

  // --- dudas ---
  if (categorias.duda.some(p => t.includes(p))) {
    if (t.includes("duele")) return "No duele 😊 solo sentirás un calor leve o pequeñas contracciones tolerables.";
    if (t.includes("hombres")) return "Sí 🙌 todos nuestros tratamientos son unisex y ajustados a cada tipo de piel.";
    if (t.includes("pagar")) return "Puedes pagar por sesión o plan completo con descuento 💳 en la evaluación te mostramos las opciones.";
    if (t.includes("garantia")) return "Nuestros equipos están certificados y los resultados son medibles clínicamente. Acompañamos tu proceso en cada sesión 💪.";
    return "Los resultados se notan desde las primeras sesiones y mejoran progresivamente.";
  }

  // --- curiosidad ---
  if (categorias.curiosidad.some(p => t.includes(p))) {
    if (contextoPrevio?.tipo==="corporal") return `Nuestros tratamientos corporales combinan ultrasonido, RF y EMS Sculptor. Sesiones de 45–60 min, sin cirugía ni recuperación 💬 ¿Quieres coordinar tu evaluación gratuita? ${CTA}`;
    if (contextoPrevio?.tipo==="facial") return `Los tratamientos faciales estimulan colágeno y firmeza con HIFU 12D y RF fraccionada ✨ ¿Agendamos tu evaluación gratuita? ${CTA}`;
    return `Son tratamientos no invasivos que actúan sobre grasa o flacidez según la zona 💬 ¿Quieres tu evaluación gratuita? ${CTA}`;
  }

  // --- cierre ---
  if (categorias.cierre.some(p => t.includes(p))) {
    return `Encantada 😊 recuerda que puedes agendar tu evaluación gratuita cuando quieras. ${CTA}`;
  }

  // --- capa clínica avanzada integrada ---
  const mapaClinicoAvanzado = (mensaje) => {
    const t = mensaje.toLowerCase();
    if (t.includes("pierna")||t.includes("muslo")) return `En piernas y muslos recomendamos **Body Tensor**, que usa RF Dual + EMS Sculptor para mejorar tono y firmeza ✨ ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    if (t.includes("gluteo")||t.includes("glúteo")||t.includes("cola")||t.includes("poto")) return `Para glúteos aplicamos **Push Up Glúteo** con EMS Sculptor + RF Dual 🍑 Resultados reales desde la segunda semana. ¿Quieres tu evaluación gratuita? ${CTA}`;
    if (t.includes("brazo")||t.includes("brazos")) return `En brazos usamos **Body Tensor** y **Lipo Focalizada**, que reducen grasa localizada y tensan la piel. Resultados visibles desde la primera sesión 💪 ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    if (t.includes("abdomen")||t.includes("vientre")) return `**Lipo Reductiva** combina HIFU 12D + Cavitación para reducir grasa abdominal 🔥 ¿Agendamos tu evaluación gratuita? ${CTA}`;
    return null;
  };
  const respuestaAvanzada = mapaClinicoAvanzado(mensaje);
  if (respuestaAvanzada) return respuestaAvanzada;

  // --- fallback ---
  return `No logré entender completamente tu mensaje, pero estoy segura de que tus dudas serán resueltas por nuestras profesionales 💬 Agenda aquí 👇 ${CTA}`;
}
