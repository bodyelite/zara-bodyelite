import { respuestas } from "./responses.js";
import fs from "fs";

const contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  if (t.includes("hola") || t.includes("buenas")) {
    return respuestas.bienvenida;
  }

  if (t.includes("facial") || t.includes("cara") || t.includes("rostro") || t.includes("acné") || t.includes("arrugas")) {
    return respuestas.faciales;
  }

  if (t.includes("corporal") || t.includes("abdomen") || t.includes("gluteo") || t.includes("grasa") || t.includes("celulitis")) {
    return respuestas.corporales;
  }

  if (t.includes("planes") || t.includes("precio") || t.includes("valores")) {
    return respuestas.planes;
  }

  if (t.includes("donde") || t.includes("ubicados") || t.includes("direccion")) {
    return respuestas.ubicacion;
  }

  // Recomendaciones clínicas específicas
  if (t.includes("gluteo") || t.includes("levantar")) {
    return "🍑 Para levantar y tonificar glúteos recomendamos el plan **PUSH UP** con EMS Sculptor y Radiofrecuencia. Desde $376.000 CLP. Agenda tu evaluación gratuita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (t.includes("abdomen") || t.includes("reducir") || t.includes("grasa")) {
    return "🔥 Para grasa localizada o abdomen recomendamos **Lipo Body Elite** con HIFU 12D, Cavitación y EMS Sculptor. Desde $664.000 CLP. Agenda tu diagnóstico aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (t.includes("botox") || t.includes("toxina")) {
    return "✨ Sí, aplicamos Toxina Botulínica y Ácido Hialurónico con profesionales certificadas. Resultados naturales, sin dolor y con diagnóstico gratuito. Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  return respuestas.desconocido;
}
