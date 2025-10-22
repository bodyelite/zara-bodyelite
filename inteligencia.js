import { respuestas } from "./responses.js";
import fs from "fs";
import path from "path";

let contexto = {};
try {
  const rutaContexto = path.resolve("./contexto_memoria.json");
  if (fs.existsSync(rutaContexto)) {
    const contenido = fs.readFileSync(rutaContexto, "utf8");
    contexto = JSON.parse(contenido);
    console.log("✅ contexto_memoria.json cargado correctamente (" + Object.keys(contexto).length + " frases)");
  } else {
    console.log("⚠️ No se encontró contexto_memoria.json");
  }
} catch (err) {
  console.log("⚠️ Error cargando contexto_memoria.json:", err.message);
  contexto = {};
}

// Patrones principales
const patrones = {
  facial: ["arrugas", "manchas", "piel", "hidratar", "iluminar", "cara", "rejuvenecer", "antiage", "líneas", "ojeras", "papada", "lifting", "poros", "flacidez facial"],
  corporal: ["abdomen", "grasa", "flacidez", "vientre", "celulitis", "cintura", "reducir", "bajar", "piernas", "muslos", "brazos", "espalda", "cartuchera", "cadera"],
  gluteos: ["gluteo", "glúteos", "levantar", "aumentar", "trasero", "tonificar", "push up"],
  toxina: ["botox", "toxina", "frente", "expresión", "patas de gallo", "entrecejo"],
  ubicacion: ["donde", "ubicados", "dirección", "peñalolén", "horarios"],
  precios: ["precio", "cuánto", "valor", "planes", "costos", "tarifas"]
};

const similitud = (texto, palabra) => texto.toLowerCase().includes(palabra.toLowerCase());

export function obtenerRespuesta(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // Revisión de frases aprendidas
  for (const [frase, categoria] of Object.entries(contexto)) {
    if (t.includes(frase.toLowerCase())) {
      if (categoria === "facial") return respuestaFacial();
      if (categoria === "corporal") return respuestaCorporal();
      if (categoria === "gluteos") return respuestaGluteos();
      if (categoria === "toxina") return respuestaToxina();
    }
  }

  // Revisión por patrones
  if (patrones.facial.some(p => similitud(t, p))) return respuestaFacial();
  if (patrones.gluteos.some(p => similitud(t, p))) return respuestaGluteos();
  if (patrones.corporal.some(p => similitud(t, p))) return respuestaCorporal();
  if (patrones.toxina.some(p => similitud(t, p))) return respuestaToxina();
  if (patrones.ubicacion.some(p => similitud(t, p))) return respuestas.ubicacion;
  if (patrones.precios.some(p => similitud(t, p))) return respuestas.planes;

  if (t.includes("hola") || t.includes("buenas")) return respuestas.bienvenida;
  return respuestas.desconocido;
}

// Respuestas clínicas
function respuestaFacial() {
  return "✨ Para el área facial tenemos tratamientos como **Face Elite**, que combina *HIFU focalizado*, *Radiofrecuencia*, *LED Therapy* y *Pink Glow* para firmeza, textura e hidratación. Se realizan **6 a 8 sesiones**, con resultados desde la primera semana. Valor desde **$358 400 CLP**. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaCorporal() {
  return "🔥 Para abdomen, piernas o cintura recomendamos **Lipo Body Elite**, que combina *HIFU 12D*, *Cavitación*, *Radiofrecuencia Corporal* y *EMS Sculptor*. Se aplican **8 a 10 sesiones**, con resultados visibles desde el primer mes. Valor desde **$348 800 CLP**. Agenda tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaGluteos() {
  return "🍑 Para tonificar y levantar glúteos, el más utilizado es el **PUSH UP**, que combina *EMS Sculptor* y *Radiofrecuencia Corporal*. Se realizan **6 a 8 sesiones**, con resultados visibles desde la segunda semana. Valor desde **$376 000 CLP**. Agenda tu evaluación sin costo aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function respuestaToxina() {
  return "💉 Aplicamos exclusivamente **Toxina Botulínica**, realizada por profesionales certificadas. Es segura, sin dolor, y suaviza líneas de expresión. Incluye diagnóstico facial asistido con IA. Agenda tu evaluación gratuita 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
