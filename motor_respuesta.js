import fs from "fs";
import { registrarContexto, obtenerContexto } from "./memoria.js";

// === MOTOR DE RESPUESTA CLÍNICO-COMERCIAL BODY ELITE ===
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

  // --- mapa clínico por zona ---
  const mapaZona = (t) => {
    if (t.includes("gluteo")||t.includes("glúteo")||t.includes("poto")||t.includes("cola")||t.includes("trasero"))
      return {
        tipo:"corporal",
        plan:"Push Up Glúteo",
        texto:"Para levantar y definir glúteos aplicamos **Push Up Glúteo**, con **EMS Sculptor + Radiofrecuencia Dual**. Tonifica, mejora el volumen natural y reafirma la piel 🍑 Resultados visibles desde las primeras sesiones.",
        precio:"desde $376.000 CLP"
      };
    if (t.includes("brazo")||t.includes("brazos"))
      return {
        tipo:"corporal",
        plan:"Body Tensor o Lipo Focalizada",
        texto:"En brazos tratamos **grasa localizada y flacidez** con **Body Tensor** o **Lipo Focalizada**, que combinan **HIFU 12D + RF Dual + EMS Sculptor** 💪",
      };
    if (t.includes("abdomen")||t.includes("vientre")||t.includes("cintura")||t.includes("panza"))
      return {
        tipo:"corporal",
        plan:"Lipo Reductiva o Body Elite",
        texto:"Para reducir grasa abdominal trabajamos con **Lipo Reductiva** o **Lipo Body Elite**, que combinan **HIFU 12D, Cavitación y Radiofrecuencia**. Logramos reducción y firmeza sin cirugía 🔥",
        precio:"desde $480.000 CLP"
      };
    if (t.includes("pierna")||t.includes("muslo")||t.includes("muslos"))
      return {
        tipo:"corporal",
        plan:"Body Tensor",
        texto:"En piernas y muslos aplicamos **Body Tensor**, que utiliza **RF Dual + EMS Sculptor** para mejorar tono, textura y firmeza ✨",
      };
    if (t.includes("rostro")||t.includes("cara")||t.includes("papada")||t.includes("arrugas")||t.includes("frente"))
      return {
        tipo:"facial",
        plan:"Face Elite o Face Antiage",
        texto:"En rostro trabajamos con **Face Elite** o **Face Antiage**, que combinan **HIFU 12D + Radiofrecuencia Fraccionada + Toxina Botulínica**, logrando lifting facial sin cirugía ✨",
      };
    return null;
  };
  const zona = mapaZona(t);
  if (zona) {
    registrarContexto("tipo", zona.tipo);
    registrarContexto("plan", zona.plan);
    return `Entiendo 😊 ${zona.texto}\nEl valor es ${zona.precio}. ¿Quieres agendar tu evaluación gratuita? ${CTA}`;
  }

  // --- categorías y dudas generales ---
  const categorias = {
    curiosidad:["en que consiste","como funciona","que incluye","cuantas sesiones","detalle","explicame","dime mas","que es","cual recomiendas"],
    duda:["duele","sirve para hombres","demora","puedo pagar","cuando podria","garantia","garantias"],
    cierre:["gracias","ok","perfecto","genial","listo"]
  };

  if (categorias.duda.some(p => t.includes(p))) {
    if (t.includes("duele")) return "No duele 😊 Solo sentirás un leve calor o contracciones suaves, perfectamente tolerables. Procedimientos no invasivos y cómodos.";
    if (t.includes("hombres")) return "Sí 🙌 Todos nuestros tratamientos son unisex y se ajustan al tipo de piel y objetivo de cada persona.";
    if (t.includes("pagar")) return "Puedes pagar por sesión o plan completo con descuento 💳 En tu evaluación gratuita te mostramos todas las opciones.";
    if (t.includes("garantia")||t.includes("resultados")) return "Nuestros equipos están certificados y los resultados se documentan con registro fotográfico antes y después 💪";
    return "Los resultados se notan desde las primeras sesiones y mejoran progresivamente.";
  }

  if (categorias.curiosidad.some(p => t.includes(p))) {
    if (ctx?.tipo === "corporal") return `Nuestros tratamientos corporales combinan **HIFU 12D, Radiofrecuencia Dual y EMS Sculptor**. Sesiones de 45–60 min, sin cirugía ni recuperación 💬 ¿Quieres coordinar tu evaluación gratuita? ${CTA}`;
    if (ctx?.tipo === "facial") return `Los tratamientos faciales estimulan colágeno y firmeza con **HIFU 12D y RF Fraccionada**. Piel más firme y luminosa desde la primera sesión ✨ ¿Agendamos tu evaluación gratuita? ${CTA}`;
    return `Son tratamientos no invasivos que actúan sobre grasa o flacidez según la zona 💬 ¿Quieres tu evaluación gratuita? ${CTA}`;
  }

  if (categorias.cierre.some(p => t.includes(p))) {
    return `Encantada 😊 Recuerda que puedes agendar tu evaluación gratuita cuando quieras. ${CTA}`;
  }

  // --- mejora precio y contexto ---
  if (t.includes("precio") || t.includes("vale") || t.includes("cuesta") || t.includes("valor")) {
    if (ctx?.plan) {
      return `El plan **${ctx.plan}** tiene un valor ${ctx.plan.toLowerCase().includes("face") ? "desde $281.600 CLP" : "desde $232.000 CLP"} según evaluación inicial 💬 ¿Quieres que coordinemos tu evaluación gratuita? ${CTA}`;
    }
    return `Los tratamientos corporales van **desde $232.000 CLP** y los faciales **desde $120.000 CLP**, dependiendo de la zona y diagnóstico. ¿Quieres que agendemos tu evaluación gratuita? ${CTA}`;
  }

  // --- fallback ---
  return `No logré entender completamente tu mensaje, pero estoy segura de que tus dudas serán resueltas por nuestras profesionales 💬 Agenda aquí 👇 ${CTA}`;
}

if (t.includes("precio") || t.includes("vale") || t.includes("cuesta") || t.includes("valor")) {
  if (ctx?.plan) {
    return `El plan **${ctx.plan}** tiene un valor ${
    } según evaluación inicial 💬 ¿Quieres que coordinemos tu evaluación gratuita? ${CTA}`;
  }
}
// === FIN BLOQUE DE MEJORA ===

if (typeof t === "string") {
  if (t.includes("precio") || t.includes("vale") || t.includes("cuesta") || t.includes("valor")) {
    if (ctx?.plan) {
      return `El plan **${ctx.plan}** tiene un valor ${
      } según evaluación inicial 💬 ¿Quieres que coordinemos tu evaluación gratuita? ${CTA}`;
    }
  }
}
// === FIN BLOQUE DE MEJORA ===

if (typeof t === "string") {
  if (t.includes("precio") || t.includes("vale") || t.includes("cuesta") || t.includes("valor")) {
    if (ctx?.plan) {
      return `El plan **${ctx.plan}** tiene un valor ${
      } según evaluación inicial 💬 ¿Quieres que coordinemos tu evaluación gratuita? ${CTA}`;
    }
  }
}
// === FIN BLOQUE DE MEJORA ===
