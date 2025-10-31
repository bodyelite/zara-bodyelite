import fs from "fs";
import baseConocimiento from "./base_conocimiento.js";
import { registrarContexto, obtenerContexto } from "./memoria.js";

// === MOTOR DE RESPUESTA CLÍNICO-COMERCIAL ===
export async function responder(mensaje) {
  const t = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const CTA = "🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  const ctx = obtenerContexto();

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
    if (ctx?.tipo === "corporal") return "Excelente 💪 podemos coordinar tu evaluación corporal gratuita. ¿Qué día te acomoda asistir?";
    if (ctx?.tipo === "facial") return "Perfecto 😊 agendemos tu evaluación facial sin costo. ¿Qué día te acomoda?";
    return "Excelente 😊 podemos coordinar tu evaluación sin costo. ¿Qué día te acomoda asistir?";
  }

  // --- capa clínica avanzada (mapa de zonas) ---
  const mapaClinicoAvanzado = (mensaje) => {
    const t = mensaje.toLowerCase();
    if (t.includes("pierna")||t.includes("muslo")) {
      registrarContexto("tipo","corporal");
      return `En piernas y muslos recomendamos **Body Tensor**, que usa **RF Dual + EMS Sculptor** para mejorar tono y firmeza ✨ Resultados visibles desde la primera sesión. ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    }
    if (t.includes("gluteo")||t.includes("glúteo")||t.includes("cola")||t.includes("poto")||t.includes("trasero")) {
      registrarContexto("tipo","corporal");
      return `Para glúteos aplicamos el plan **Push Up Glúteo**, con **EMS Sculptor + RF Dual**, ideal para levantar, tonificar y mejorar el volumen natural 🍑 ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
    }
    if (t.includes("brazo")||t.includes("brazos")) {
      registrarContexto("tipo","corporal");
      return `En brazos tratamos **grasa localizada y flacidez** con **Body Tensor** o **Lipo Focalizada**, que combinan **HIFU 12D + RF Dual + EMS Sculptor**. Resultados visibles desde la primera sesión 💪 ¿Agendamos tu evaluación gratuita? ${CTA}`;
    }
    if (t.includes("abdomen")||t.includes("vientre")||t.includes("cintura")) {
      registrarContexto("tipo","corporal");
      return `Para grasa abdominal o cintura te recomendamos **Lipo Reductiva** o **Body Elite**, que combinan **HIFU 12D + Cavitación + RF**, logrando reducción y firmeza desde las primeras sesiones 🔥 ¿Quieres coordinar tu evaluación gratuita? ${CTA}`;
    }
    if (t.includes("rostro")||t.includes("cara")||t.includes("papada")||t.includes("arrugas")||t.includes("frente")) {
      registrarContexto("tipo","facial");
      return `En rostro trabajamos con **Face Elite** o **Face Antiage**, que usan **HIFU 12D + RF Fraccionada + Toxina Botulínica** para lifting facial sin cirugía ✨ ¿Agendamos tu evaluación gratuita? ${CTA}`;
    }
    return null;
  };

  // --- categorías principales ---
  const categorias = {
    corporal:["abdomen","panza","rollitos","grasa","grasita","vientre","cintura","brazos","flacidez","celulitis","pierna","muslo","gluteo","glúteo","poto","trasero","cola"],
    facial:["cara","rostro","papada","arrugas","lineas","expresion","frente","ojeras","manchas","piel","luminosidad"],
    curiosidad:["en que consiste","como funciona","que incluye","cuantas sesiones","detalle","explicame","dime mas","que es","cual recomiendas"],
    duda:["duele","sirve para hombres","demora","puedo pagar","cuando podria","garantia","garantias"],
    cierre:["gracias","ok","perfecto","genial","listo"]
  };

  // --- tratamientos corporales ---
  if (categorias.corporal.some(p => t.includes(p))) {
    const respuestaAvanzada = mapaClinicoAvanzado(mensaje);
    if (respuestaAvanzada) return respuestaAvanzada;
    registrarContexto("tipo","corporal");
    return `Podemos tratar esa zona sin cirugía ✨ con **Lipo Reductiva**, **Body Tensor** o **Push Up**, según diagnóstico. Usamos **HIFU 12D**, **Cavitación**, **RF** y **EMS Sculptor** 💪 ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
  }

  // --- tratamientos faciales ---
  if (categorias.facial.some(p => t.includes(p))) {
    const respuestaAvanzada = mapaClinicoAvanzado(mensaje);
    if (respuestaAvanzada) return respuestaAvanzada;
    registrarContexto("tipo","facial");
    return `Podemos mejorar firmeza y luminosidad facial con **Face Smart**, **Face Antiage** o **Face Elite**, según diagnóstico. Usamos **HIFU 12D y RF Fraccionada** ✨ ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
  }

  // --- dudas frecuentes ---
  if (categorias.duda.some(p => t.includes(p))) {
    if (t.includes("duele")) return "No duele 😊 solo sentirás un calor leve o pequeñas contracciones tolerables, sin molestias.";
    if (t.includes("hombres")) return "Sí 🙌 todos nuestros tratamientos son unisex y ajustados a cada tipo de piel.";
    if (t.includes("pagar")) return "Puedes pagar por sesión o plan completo con descuento 💳 En la evaluación te mostramos las opciones.";
    if (t.includes("garantia")) return "Nuestros equipos están certificados y los resultados son medibles clínicamente 💪";
    return "Los resultados se notan desde las primeras sesiones y mejoran progresivamente.";
  }

  // --- curiosidad ---
  if (categorias.curiosidad.some(p => t.includes(p))) {
    if (ctx?.tipo === "corporal") return `Nuestros tratamientos corporales combinan **HIFU 12D, RF y EMS Sculptor**. Sesiones de 45–60 min, sin cirugía ni recuperación 💬 ¿Quieres coordinar tu evaluación gratuita? ${CTA}`;
    if (ctx?.tipo === "facial") return `Los tratamientos faciales estimulan colágeno y firmeza con **HIFU 12D y RF Fraccionada** ✨ ¿Agendamos tu evaluación gratuita? ${CTA}`;
    return `Son tratamientos no invasivos que actúan sobre grasa o flacidez según la zona 💬 ¿Quieres tu evaluación gratuita? ${CTA}`;
  }

  // --- cierre ---
  if (categorias.cierre.some(p => t.includes(p))) {
    return `Encantada 😊 recuerda que puedes agendar tu evaluación gratuita cuando quieras. ${CTA}`;
  }

  // --- fallback general ---
  return `No logré entender completamente tu mensaje, pero estoy segura de que tus dudas serán resueltas por nuestras profesionales 💬 Agenda aquí 👇 ${CTA}`;
}
