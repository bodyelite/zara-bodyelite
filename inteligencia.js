import { respuestas } from "./responses.js";
import fs from "fs";

const contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));

// Grupos de frases comunes (basadas en las 500 recopiladas)
const patrones = {
  facial: [
    "arrugas", "manchas", "piel", "hidratar", "iluminar", "cara", "rejuvenecer",
    "antiage", "líneas de expresión", "ojeras", "papada", "lifting", "poros", "flacidez facial"
  ],
  corporal: [
    "abdomen", "grasa", "flacidez", "vientre", "celulitis", "cintura", "reducir", "bajar", "bajar de peso",
    "cadera", "espalda baja", "brazos", "piernas", "rodillas", "muslos", "cartuchera", "muslo"
  ],
  gluteos: [
    "gluteo", "glúteos", "levantar", "aumentar glúteos", "trasero", "tonificar", "push up"
  ],
  toxina: [
    "botox", "toxina", "relleno", "expresión", "frente", "entrecejo", "patas de gallo"
  ],
  ubicacion: [
    "donde", "ubicados", "dirección", "peñalolén", "local", "mapa", "llegar", "horarios"
  ],
  precios: [
    "precio", "cuánto", "valor", "planes", "costos", "tarifas"
  ]
};

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // Clasificación rápida por coincidencias
  const match = (grupo) => patrones[grupo].some((palabra) => t.includes(palabra));

  if (match("facial")) {
    return "✨ Entiendo, para el área facial tenemos distintos tratamientos según tus necesidades. Por eso es importante una **evaluación gratuita** para definir el plan ideal. El más utilizado es el **Face Elite**, que combina *HIFU focalizado* (tensado profundo del tejido), *Radiofrecuencia* (colágeno y firmeza), *LED Therapy* (regeneración) y *Pink Glow* (hidratación y luminosidad). Se realizan **6 a 8 sesiones**, con resultados desde la primera semana. Valor desde **$358 400 CLP**. ¿Quieres que te indique cómo actúa cada tecnología? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (match("gluteos")) {
    return "🍑 Entiendo, para la zona que indicas contamos con tratamientos enfocados en tonificar y levantar glúteos. El más utilizado es el **PUSH UP**, que combina *EMS Sculptor* (contracciones musculares intensas) y *Radiofrecuencia Corporal* (efecto tensor y reafirmante). Se realizan **6 a 8 sesiones**, con resultados visibles desde la segunda semana. Valor desde **$376 000 CLP**. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (match("corporal")) {
    return "🔥 Para abdomen o grasa localizada recomendamos **Lipo Body Elite**, que combina *HIFU 12D* (reducción focal de grasa), *Cavitación Ultrasónica* (ruptura de adipocitos), *Radiofrecuencia Corporal* (efecto tensor) y *EMS Sculptor* (definición muscular). Se aplican **8 a 10 sesiones**, con resultados visibles desde el primer mes. Valor desde **$348 800 CLP**. Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (match("toxina")) {
    return "💉 En Body Elite aplicamos exclusivamente **Toxina Botulínica**, realizada por profesionales certificadas. Es un procedimiento seguro, sin dolor, que relaja la musculatura facial y suaviza líneas de expresión. Incluye diagnóstico facial asistido con IA. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
  }

  if (match("ubicacion")) return respuestas.ubicacion;
  if (match("precios")) return respuestas.planes;
  if (t.includes("hola")) return respuestas.bienvenida;

  return respuestas.desconocido;
}
