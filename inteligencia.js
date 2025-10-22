import { respuestas } from "./responses.js";
import fs from "fs";

const contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  if (t.includes("hola") || t.includes("buenas"))
    return respuestas.bienvenida;

  // Facial general
  if (t.includes("facial") || t.includes("cara") || t.includes("arrugas") || t.includes("hidratar") || t.includes("iluminar") || t.includes("piel")) {
    return "✨ Entiendo, para el área facial tenemos distintos tratamientos según tus necesidades. Por eso es importante una **evaluación gratuita** para definir el plan ideal. El más utilizado es el **Face Elite**, que combina *HIFU focalizado* (tensado profundo del tejido), *Radiofrecuencia* (colágeno y firmeza), *LED Therapy* (regeneración) y *Pink Glow* (hidratación y luminosidad). Se realizan **6 a 8 sesiones**, con resultados desde la primera semana. Valor desde **$358 400 CLP**. ¿Quieres que te indique cómo actúa cada tecnología? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Glúteos
  if (t.includes("gluteo") || t.includes("glúteos") || t.includes("levantar") || t.includes("trasero"))) {
    return "🍑 Entiendo, para la zona que indicas contamos con tratamientos enfocados en tonificar y levantar glúteos. El más utilizado es el **PUSH UP**, que combina *EMS Sculptor* (contracciones musculares intensas) y *Radiofrecuencia Corporal* (efecto tensor y reafirmante). Se realizan **6 a 8 sesiones**, con resultados visibles desde la segunda semana. Valor desde **$376 000 CLP**. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Abdomen / grasa localizada
  if (t.includes("abdomen") || t.includes("grasa") || t.includes("flacidez") || t.includes("reducir"))) {
    return "🔥 Para abdomen o grasa localizada recomendamos **Lipo Body Elite**, que combina *HIFU 12D* (reducción focal de grasa), *Cavitación Ultrasónica* (ruptura de adipocitos), *Radiofrecuencia Corporal* (efecto tensor) y *EMS Sculptor* (definición muscular). Se aplican **8 a 10 sesiones**, con resultados visibles desde el primer mes. Valor desde **$348 800 CLP**. Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  // Toxina Botulínica
  if (t.includes("botox") || t.includes("toxina")) {
    return "💉 En Body Elite aplicamos exclusivamente **Toxina Botulínica**, realizada por profesionales certificadas. Es un procedimiento seguro, sin dolor, que relaja la musculatura facial y suaviza líneas de expresión. Incluye diagnóstico facial asistido con IA. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (t.includes("planes") || t.includes("precio"))
    return respuestas.planes;

  if (t.includes("donde") || t.includes("ubicados") || t.includes("dirección"))
    return respuestas.ubicacion;

  return respuestas.desconocido;
}
