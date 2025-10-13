// entrenador.js
// Módulo de conocimiento y normalización semántica de Zara IA – Body Elite
// No modifica conexiones con Meta ni Render.

import fs from "fs";

// ==========================
// CARGA DE ARCHIVOS JSON
// ==========================
function loadJSON(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al cargar ${path}:`, error.message);
    return {};
  }
}

const baseConocimiento = loadJSON("./base_conocimiento.json");
const knowledge = loadJSON("./knowledge.json");
const contexto = loadJSON("./contexto.json");
const training = loadJSON("./zara_training.json");

// ==========================
// NORMALIZACIÓN SEMÁNTICA
// ==========================
// Diccionario ampliado de errores comunes, abreviaciones y variantes fonéticas.
const correcciones = {
  // Tecnologías y tratamientos
  haifu: "hifu",
  jai: "hifu",
  jaiifu: "hifu",
  jifu: "hifu",
  hyfu: "hifu",
  hiifu: "hifu",
  hifu12d: "hifu 12d",
  haifuu: "hifu",

  toccina: "toxina",
  toxxina: "toxina",
  tocina: "toxina",
  tokina: "toxina",
  toxsina: "toxina",
  toxinaa: "toxina",

  cavitasion: "cavitacion",
  cavitasión: "cavitacion",
  cavitazion: "cavitacion",
  cabitacion: "cavitacion",
  cavitacionn: "cavitacion",

  radiofrecuensia: "radiofrecuencia",
  radiofrecuecia: "radiofrecuencia",
  rediofrecuencia: "radiofrecuencia",
  radifrec: "radiofrecuencia",
  rrf: "radiofrecuencia",
  rf: "radiofrecuencia",

  // Planes y nombres de servicios
  lipoe: "lipo",
  lippo: "lipo",
  lipoescultura: "lipo",
  pushup: "push up",
  pusup: "push up",
  poshup: "push up",
  gluteos: "push up",
  gluteo: "push up",
  faceelit: "face elite",
  faceelitte: "face elite",
  facelite: "face elite",
  facelitt: "face elite",
  facila: "facial",
  faciar: "facial",
  faciales: "facial",
  antiacne: "antiacne",
  antiacnee: "antiacne",
  acnee: "acne",
  acne: "acne",
  depilasion: "depilacion",
  depilazion: "depilacion",
  depilasionlaser: "depilacion laser",
  depilazionlaser: "depilacion laser",

  // Términos de uso común
  diagnosticoo: "diagnostico",
  diagnotico: "diagnostico",
  diagnostik: "diagnostico",
  evaluasion: "evaluacion",
  evalusion: "evaluacion",
  evaluasión: "evaluacion",
  agendarrr: "agendar",
  agendarme: "agendar",
  agendame: "agendar",
  reserv: "reserva",
  resver: "reserva",

  // Nombres internos
  botz: "bot",
  zra: "zara",
  zarra: "zara",
  bode: "body",
  elitee: "elite",
  bodyelitte: "body elite",
  bodyelit: "body elite",

  // Otros
  limpiesa: "limpieza",
  limpiea: "limpieza",
  limieza: "limpieza",
  masage: "masaje",
  masje: "masaje",
  trataminto: "tratamiento",
  tratamientto: "tratamiento",
  promosión: "promocion",
  promocion: "promocion",
  promo: "promocion",
  ubicazion: "ubicacion",
  direcsion: "direccion",
  direcion: "direccion",
};

// ==========================
// FUNCIÓN DE NORMALIZACIÓN
// ==========================
export function normalizarTexto(text) {
  if (!text) return "";
  const palabras = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/);

  const corregidas = palabras.map((p) => correcciones[p] || p);
  return corregidas.join(" ");
}

// ==========================
// FUNCIONES PRINCIPALES
// ==========================
export function getKnowledge() {
  return {
    baseConocimiento,
    knowledge,
    contexto,
    training,
  };
}

// Búsqueda semántica dentro del conocimiento
export function buscarEnConocimiento(term) {
  const t = normalizarTexto(term);
  const results = [];

  function buscar(obj, origen) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "string" && value.toLowerCase().includes(t)) {
        results.push({ origen, key, value });
      } else if (typeof value === "object") {
        buscar(value, origen);
      }
    }
  }

  buscar(baseConocimiento, "base_conocimiento");
  buscar(knowledge, "knowledge");
  buscar(contexto, "contexto");
  buscar(training, "training");

  return results;
}

export default {
  getKnowledge,
  normalizarTexto,
  buscarEnConocimiento,
};
