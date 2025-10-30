import fs from "fs";
import baseConocimiento from "./base_conocimiento.js";
import { registrarContexto, obtenerContexto } from "./memoria.js";

export async function responder(mensaje) {
  const t = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  if (t.startsWith("zara")) {
    const encontrado = baseConocimiento.find((p) => t.includes(p.activador));
    if (encontrado) {
      registrarContexto("interno", encontrado.plan);
      return `🧠 [Modo interno activo]\n${encontrado.detalle}`;
    } else {
      return "🧠 [Modo interno activo] No encontré un tratamiento con ese nombre. Verifica la escritura.";
    }
  }

  const saludos = ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "hey", "holi"];
  if (saludos.some((s) => t.startsWith(s))) {
    registrarContexto("saludo", "inicio conversacion");
    return "Hola 😊 Soy Zara de Body Elite. Cuéntame qué zona te gustaría mejorar para orientarte con el tratamiento ideal ✨";
  }

  const contextoPrevio = obtenerContexto();

  const categorias = {
    corporal: [
      "abdomen","panza","rollitos","grasa","grasita","vientre","cintura","brazos",
      "flacidez","celulitis","pierna","piernas","muslo","muslos","gluteo","glúteo",
      "poto","trasero","cola","tonificar","endurecer"
    ],
    facial: [
      "cara","rostro","papada","arrugas","lineas","expresion","frente","ojeras",
      "manchas","piel","luminosidad","rejuvenecer"
    ],
    tecnologia: ["hifu","cavitacion","radiofrecuencia","ems","sculptor","toxina","botox","pink","led","luz"],
    curiosidad: [
      "en que consiste","como funciona","que incluye","porque tan caro","mas barato",
      "cuantas sesiones","detalle","explicame","dime mas","que es","cual me sirve","cual recomiendas"
    ],
    duda: [
      "duele","sirve para hombres","demora","puedo pagar","cuando podria",
      "no tengo tiempo","cuanto dura","efecto"
    ],
    cierre: ["gracias","ok","perfecto","genial","listo"]
  };

  if (categorias.corporal.some(p => t.includes(p))) {
    registrarContexto("corporal", "Lipo Reductiva / Body Tensor / Push Up");
    return "Hola 😊 Esa zona se puede tratar sin cirugía ✨ Con nuestros planes **Lipo Reductiva**, **Body Tensor** o **Push Up**, según diagnóstico. Trabajamos con **HIFU 12D, Cavitación, RF y EMS Sculptor**, que reducen grasa y tensan la piel 💪 Resultados visibles desde las primeras sesiones. Planes desde **$348.800 (valor referencial, sujeto a evaluación clínica)**. ¿Quieres agendar tu evaluación gratuita? 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (categorias.facial.some(p => t.includes(p))) {
    registrarContexto("facial", "Face Smart / Face Antiage / Face Elite / Limpieza Facial Full");
    return "Hola 😊 Podemos mejorar la firmeza, textura y luminosidad de tu piel ✨ Con nuestros planes **Face Smart**, **Face Antiage**, **Face Elite** o **Limpieza Facial Full**, según tu diagnóstico. Usamos **HIFU 12D, RF fraccionada y activos antioxidantes**. Planes desde **$120.000 (valor referencial, sujeto a evaluación clínica)**. ¿Quieres agendar tu evaluación facial gratuita? 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (categorias.tecnologia.some(p => t.includes(p))) {
    registrarContexto("tecnologia", "Explicación técnica");
    return "💡 Trabajamos con tecnología avanzada: **HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor**. Cada una actúa sobre grasa, músculo o colágeno según tu necesidad. Durante tu evaluación gratuita definimos la combinación ideal para ti. 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (categorias.curiosidad.some(p => t.includes(p))) {
    if (contextoPrevio) {
      return `✨ Este tratamiento combina ${contextoPrevio.plan} con tecnologías seguras que actúan por calor o ultrasonido. Las sesiones duran entre 45 y 75 min, según zona. Los resultados son progresivos y visibles desde la primera aplicación 💬 ¿Quieres reservar tu evaluación gratuita?`;
    }
    return "✨ Es un procedimiento no invasivo que estimula colágeno y reduce grasa o flacidez según la zona. Resultados visibles desde las primeras sesiones 💬 ¿Quieres agendar tu evaluación gratuita? 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (categorias.duda.some(p => t.includes(p))) {
    if (t.includes("duele")) return "No duele 😊 Sentirás un leve calor o pequeñas contracciones, pero es perfectamente tolerable. Son procedimientos no invasivos y cómodos.";
    if (t.includes("hombres")) return "Sí 🙌 Todos nuestros tratamientos corporales y faciales son unisex. Ajustamos parámetros según tipo de piel y estructura corporal.";
    if (t.includes("pagar")) return "Sí 😊 Puedes pagar por sesión o en plan completo con descuento. En la evaluación gratuita te mostramos todas las opciones.";
    if (t.includes("tiempo")) return "Cada sesión dura menos de una hora y no requiere recuperación ✨ Puedes venir incluso en tu hora de almuerzo.";
    return "Te cuento 😊 los resultados dependen de la zona y plan, pero generalmente se notan desde las primeras sesiones.";
  }

  if (categorias.cierre.some(p => t.includes(p))) {
    return "Me alegra poder orientarte 😊 Recuerda que puedes agendar tu evaluación gratuita cuando quieras. 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  registrarContexto("general", "ninguno");
  return "No logré entender completamente tu mensaje, pero estoy segura de que tus dudas serán resueltas por nuestras profesionales durante tu evaluación gratuita 💬 Agenda aquí 👇 🔗 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
