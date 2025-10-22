import { respuestas } from "./responses.js";
import fs from "fs";

let contexto = {};
try {
  contexto = JSON.parse(fs.readFileSync("./contexto_memoria.json", "utf8"));
} catch (e) {
  contexto = {};
}

// Motor híbrido: frases aprendidas + coincidencias directas
const patrones = {
  facial: [
    "arrugas", "manchas", "piel", "hidratar", "iluminar", "cara", "rejuvenecer",
    "antiage", "líneas", "ojeras", "papada", "lifting", "poros", "flacidez facial"
  ],
  corporal: [
    "abdomen", "grasa", "flacidez", "vientre", "celulitis", "cintura", "reducir",
    "bajar", "piernas", "muslos", "brazos", "espalda", "cartuchera", "cadera"
  ],
  gluteos: [
    "gluteo", "glúteos", "levantar", "aumentar", "trasero", "tonificar", "push up"
  ],
  toxina: [
    "botox", "toxina", "frente", "expresión", "patas de gallo", "entrecejo"
  ],
  ubicacion: ["donde", "ubicados", "dirección", "peñalolén", "horarios"],
  precios: ["precio", "cuánto", "valor", "planes", "costos", "tarifas"]
};

function similitud(texto, palabra) {
  const t = texto.toLowerCase();
  const p = palabra.toLowerCase();
  return t.includes(p) || t.startsWith(p) || t.endsWith(p);
}

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // Chequea coincidencias en contexto_memoria.json (las 500 frases)
  for (const [frase, categoria] of Object.entries(contexto)) {
    if (t.includes(frase.toLowerCase())) {
      if (categoria === "facial") return respuestaFacial();
      if (categoria === "corporal") return respuestaCorporal();
      if (categoria === "gluteos") return respuestaGluteos();
      if (categoria === "toxina") return respuestaToxina();
    }
  }

  // Chequea coincidencias por palabras clave
  if (patrones.facial.some((p) => similitud(t, p))) return respuestaFacial();
  if (patrones.gluteos.some((p) => similitud(t, p))) return respuestaGluteos();
  if (patrones.corporal.some((p) => similitud(t, p))) return respuestaCorporal();
  if (patrones.toxina.some((p) => similitud(t, p))) return respuestaToxina();
  if (patrones.ubicacion.some((p) => similitud(t, p))) return respuestas.ubicacion;
  if (patrones.precios.some((p) => similitud(t, p))) return respuestas.planes;

  if (t.includes("hola") || t.includes("buenas")) return respuestas.bienvenida;

  return respuestas.desconocido;
}

// Respuestas clínico-comerciales
function respuestaFacial() {
  return "✨ Entiendo, para el área facial tenemos distintos tratamientos según tus necesidades. El más utilizado es el **Face Elite**, que combina *HIFU focalizado* (tensado profundo del tejido), *Radiofrecuencia* (colágeno y firmeza), *LED Therapy* (regeneración) y *Pink Glow* (hidratación y luminosidad). Se realizan **6 a 8 sesiones**, con resultados desde la primera semana. Valor desde **$358 400 CLP**. ¿Quieres que te indique cómo actúa cada tecnología? 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaCorporal() {
  return "🔥 Para abdomen, piernas o grasa localizada recomendamos **Lipo Body Elite**, que combina *HIFU 12D* (reducción de grasa), *Cavitación Ultrasónica* (ruptura de adipocitos), *Radiofrecuencia Corporal* (efecto tensor) y *EMS Sculptor* (definición muscular). Se aplican **8 a 10 sesiones**, con resultados visibles desde el primer mes. Valor desde **$348 800 CLP**. Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaGluteos() {
  return "🍑 Entiendo, para la zona que indicas contamos con tratamientos enfocados en tonificar y levantar glúteos. El más utilizado es el **PUSH UP**, que combina *EMS Sculptor* (contracciones musculares intensas) y *Radiofrecuencia Corporal* (efecto tensor). Se realizan **6 a 8 sesiones**, con resultados visibles desde la segunda semana. Valor desde **$376 000 CLP**. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaToxina() {
  return "💉 En Body Elite aplicamos exclusivamente **Toxina Botulínica**, realizada por profesionales certificadas. Es un procedimiento seguro y sin dolor, que relaja la musculatura facial y suaviza líneas de expresión. Incluye diagnóstico facial asistido con IA. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
