import fs from "fs";
import baseConocimiento from "./base_conocimiento.js";
import { registrarContexto, obtenerContexto } from "./memoria.js";

export async function responder(mensaje) {
  const t = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const contextoPrevio = obtenerContexto();

  // --- saludos ---
  const saludos = ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "hey", "holi"];
  if (saludos.some((s) => t.startsWith(s))) {
    registrarContexto("saludo", "inicio conversacion");
    return "Hola 😊 Soy Zara de Body Elite. Cuéntame qué zona te gustaría mejorar para orientarte con el tratamiento ideal ✨";
  }

  // --- ubicación y horarios ---
  if (t.includes("donde") || t.includes("ubic") || t.includes("direccion")) {
    return "📍 Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén (Strip Center Las Pircas)**. Horarios: Lun–Vie 9:30–20:00 y Sáb 9:30–13:00.";
  }
  if (t.includes("horario") || t.includes("abren") || t.includes("atienden")) {
    return "🕓 Nuestro horario es de **lunes a viernes 9:30 a 20:00 (última atención 19:00)** y **sábado de 9:30 a 13:00**.";
  }

  // --- intención positiva ---
  const positiva = ["si", "sí", "me interesa", "quiero", "ok", "claro", "perfecto", "genial", "obvio", "dale"];
  if (positiva.some((p) => t === p || t.includes(p))) {
    if (contextoPrevio?.tipo === "corporal") {
      return "Excelente 💪 podemos coordinar tu evaluación corporal gratuita. ¿Qué día te acomoda asistir? Lunes a viernes de 9:30 a 20:00 o sábado en la mañana.";
    }
    if (contextoPrevio?.tipo === "facial") {
      return "Perfecto 😊 agendemos tu evaluación facial sin costo. ¿Qué día te acomoda?";
    }
    return "Excelente 😊 podemos coordinar tu evaluación sin costo. ¿Qué día te acomoda asistir?";
  }

  // --- categorías principales ---
  const categorias = {
    corporal: [
      "abdomen","panza","rollitos","grasa","grasita","vientre","cintura","brazos",
      "flacidez","celulitis","pierna","muslo","gluteo","glúteo","poto","trasero","cola"
    ],
    facial: [
      "cara","rostro","papada","arrugas","lineas","expresion","frente","ojeras","manchas","piel","luminosidad"
    ],
    curiosidad: [
      "en que consiste","como funciona","que incluye","cuantas sesiones","detalle","explicame","dime mas","que es","cual recomiendas"
    ],
    duda: [
      "duele","sirve para hombres","demora","puedo pagar","cuando podria","garantia","garantias"
    ],
    cierre: ["gracias","ok","perfecto","genial","listo"]
  };

  // --- tratamientos corporales personalizados ---
  if (categorias.corporal.some(p => t.includes(p))) {
    registrarContexto("tipo", "corporal");

    if (t.includes("flacidez")) {
      return "Para flacidez localizada te recomiendo **Body Tensor**, que utiliza radiofrecuencia dual y EMS Sculptor para tonificar piel y músculo. Resultados visibles desde las primeras sesiones 💪 ¿Quieres agendar tu evaluación gratuita?";
    }
    if (t.includes("gluteo") || t.includes("glúteo") || t.includes("poto")) {
      return "Para levantar y definir glúteos el plan ideal es **Push Up**, combina EMS Sculptor con radiofrecuencia. Mejora tono y volumen natural sin dolor 🍑 ¿Quieres reservar tu evaluación gratuita?";
    }
    if (t.includes("grasa") || t.includes("abdomen") || t.includes("vientre")) {
      return "Para reducción de grasa abdominal te recomendamos **Lipo Reductiva** o **Lipo Body Elite**, que combinan HIFU 12D, cavitación y radiofrecuencia. Reducción visible desde la primera sesión 🔥 ¿Agendamos tu evaluación?";
    }

    return "Hola 😊 Esa zona se puede tratar sin cirugía ✨ Con nuestros planes **Lipo Reductiva**, **Body Tensor** o **Push Up**, según diagnóstico. Trabajamos con **HIFU 12D, Cavitación, RF y EMS Sculptor** 💪 Resultados visibles desde las primeras sesiones. ¿Quieres agendar tu evaluación gratuita?";
  }

  // --- tratamientos faciales ---
  if (categorias.facial.some(p => t.includes(p))) {
    registrarContexto("tipo", "facial");
    return "Podemos mejorar la firmeza, textura y luminosidad de tu piel ✨ con **Face Smart**, **Face Antiage** o **Face Elite**, según diagnóstico. Usamos **HIFU 12D, RF fraccionada y activos antioxidantes**. ¿Quieres agendar tu evaluación facial gratuita?";
  }

  // --- dudas ---
  if (categorias.duda.some(p => t.includes(p))) {
    if (t.includes("duele")) return "No duele 😊 sentirás calor leve o contracciones suaves, perfectamente tolerables.";
    if (t.includes("hombres")) return "Sí 🙌 todos nuestros tratamientos son unisex, ajustamos parámetros según tu tipo de piel y estructura corporal.";
    if (t.includes("pagar")) return "Puedes pagar por sesión o plan completo con descuento 💳. En la evaluación gratuita te mostramos las opciones.";
    if (t.includes("garantia")) return "Nuestros equipos están certificados y los resultados son medibles clínicamente. Acompañamos tu proceso en cada sesión 💪.";
    return "Los resultados se notan desde las primeras sesiones y mejoran progresivamente.";
  }

  // --- curiosidad ---
  if (categorias.curiosidad.some(p => t.includes(p))) {
    if (contextoPrevio?.tipo === "corporal") {
      return "Nuestros tratamientos corporales combinan ultrasonido, radiofrecuencia y EMS Sculptor. Sesiones de 45–60 min, sin cirugía ni tiempo de recuperación 💬 ¿Quieres coordinar tu evaluación gratuita?";
    }
    if (contextoPrevio?.tipo === "facial") {
      return "Los tratamientos faciales estimulan colágeno y firmeza con tecnología HIFU 12D y RF fraccionada. Piel más firme y luminosa desde la primera sesión 💬 ¿Agendamos tu evaluación gratuita?";
    }
    return "Es un tratamiento no invasivo que actúa sobre grasa o flacidez según la zona, con resultados visibles desde las primeras sesiones 💬 ¿Quieres tu evaluación gratuita?";
  }

  // --- cierre ---
  if (categorias.cierre.some(p => t.includes(p))) {
    return "Encantada 😊 recuerda que puedes agendar tu evaluación gratuita en el horario que prefieras. 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // --- capa clínica resumida ---
  const detalle = baseConocimiento.find(p => t.includes(p.activador));
  if (detalle) {
    return `📋 **${detalle.plan}**\n${detalle.detalle}\n¿Quieres agendar tu evaluación gratuita? 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9`;
  }

  return "No logré entender completamente tu mensaje, pero estoy segura de que tus dudas serán resueltas por nuestras profesionales durante tu evaluación gratuita 💬 Agenda aquí 👇 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
