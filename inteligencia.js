import { respuestas } from "./responses.js";
import fs from "fs";

const contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // Bienvenida general
  if (t.includes("hola") || t.includes("buenas"))
    return respuestas.bienvenida;

  // Facial
  if (t.includes("cara") || t.includes("facial") || t.includes("arrugas") || t.includes("acné")) {
    return "✨ Entiendo, para el área facial tenemos distintos tratamientos que se ajustan a tus necesidades. Por eso es importante una **evaluación gratuita** para definir el plan ideal. Sin embargo, te cuento que el más utilizado es el **Face Elite**, que combina *HIFU focalizado, Radiofrecuencia y LED Therapy* en sesiones secuenciales que mejoran firmeza, textura y luminosidad. Valor desde **$358 400 CLP**. ¿Quieres que te indique en qué consiste cada tecnología? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Glúteos
  if (t.includes("gluteo") || t.includes("glúteos") || t.includes("levantar") || t.includes("trasero")) {
    return "🍑 Entiendo, para la zona que indicas contamos con tratamientos enfocados en tonificar y levantar glúteos. El más utilizado es el **PUSH UP**, que combina *EMS Sculptor* (contracciones musculares intensas) y *Radiofrecuencia* para firmeza y volumen. Se realizan entre **6 y 8 sesiones**, y los resultados son visibles desde la segunda semana. Valor desde **$376 000 CLP**. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Abdomen
  if (t.includes("abdomen") || t.includes("grasa") || t.includes("flacidez")) {
    return "🔥 Entiendo, para abdomen y grasa localizada contamos con el **Lipo Body Elite**, que combina *HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor*. Se aplican entre **8 y 10 sesiones**, reduciendo grasa y mejorando tonicidad. Los resultados se aprecian desde el primer mes. Valor desde **$348 800 CLP**. Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Planes y precios
  if (t.includes("planes") || t.includes("precios"))
    return respuestas.planes;

  // Ubicación
  if (t.includes("donde") || t.includes("ubicados") || t.includes("dirección"))
    return respuestas.ubicacion;

  // Toxina o Botox
  if (t.includes("botox") || t.includes("toxina"))
    return "💉 Aplicamos **Toxina Botulínica y Ácido Hialurónico** con profesionales certificadas. Tratamientos seguros, sin dolor y con resultados naturales. Agenda tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

  // Fallback
  return respuestas.desconocido;
}
