// motor_respuesta_v3.js  — lógica de respuestas Zara (solo capa interna)

// Carga de frases coloquiales / sinónimos (si no existe, usa defaults internos)
let FRASES = {
  precio: ["precio", "caro", "cuánto vale", "cuanto vale", "cuánto cuesta", "cuanto cuesta", "valores", "tarifa", "coste", "costo"],
  donde: ["dónde", "donde", "ubicación", "ubicacion", "dirección", "direccion", "horario", "horarios", "abren", "cierran", "están", "estan"],
  consiste: ["en qué consiste", "en que consiste", "cómo funciona", "como funciona", "qué hacen", "que hacen", "qué es", "que es", "detalle", "explica", "explicación"],
  zonas: [
    "glúteo","gluteo","glúteos","gluteos","gluti","cola","trasero","pompis","nalgas",
    "abdomen","guata","barriga","vientre","panza",
    "pierna","piernas","muslo","muslos","pantorrilla","pantorrillas",
    "brazo","brazos","bíceps","biceps","tríceps","triceps",
    "espalda","cintura","flancos","papada","rostro","cara","cachetes","pecho","pectorales","caderas"
  ]
};

try {
  // Node ESM JSON import (Node >= v20)
  // Asegúrate que el proyecto tiene "type": "module" en package.json
  // y que el archivo existe en la raíz del proyecto.
  // Estructura esperada: { precio:[], donde:[], consiste:[], zonas:[] }
  const mod = await import("./frases_coloq.json", { assert: { type: "json" } });
  const j = mod?.default || {};
  // Merge no destructivo: prioriza el JSON y completa con defaults cuando falten claves
  FRASES = {
    precio: Array.isArray(j.precio) && j.precio.length ? j.precio : FRASES.precio,
    donde: Array.isArray(j.donde) && j.donde.length ? j.donde : FRASES.donde,
    consiste: Array.isArray(j.consiste) && j.consiste.length ? j.consiste : FRASES.consiste,
    zonas: Array.isArray(j.zonas) && j.zonas.length ? j.zonas : FRASES.zonas
  };
} catch (_) {
  // Si no existe el archivo o falla el import, seguimos con defaults internos
}

// Umbral de decisión (configurable por env, seguro por defecto)
const MIN_SCORE = Number(process.env.MIN_SCORE ?? 0.32);

// Utilidades de texto
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text, needles) => {
  const t = norm(text);
  let hits = 0;
  for (const n of needles) {
    const q = norm(n);
    if (!q) continue;
    // Coincidencia por palabra/frase (simple)
    if (t.includes(q)) hits++;
  }
  const score = needles.length ? hits / needles.length : 0;
  return { hits, score };
};

const detectZona = (text) => {
  const t = norm(text);
  const zonasDict = [
    { k: ["gluteo","gluteos","gluteos","gluteo","gluti","cola","trasero","pompis","nalgas"], v: "glúteos" },
    { k: ["abdomen","guata","barriga","vientre","panza"], v: "abdomen" },
    { k: ["pierna","piernas","muslo","muslos","pantorrilla","pantorrillas"], v: "piernas" },
    { k: ["brazo","brazos","biceps","triceps"], v: "brazos" },
    { k: ["espalda"], v: "espalda" },
    { k: ["cintura","flancos"], v: "cintura" },
    { k: ["papada"], v: "papada" },
    { k: ["rostro","cara","cachetes"], v: "rostro" },
    { k: ["pecho","pectorales"], v: "pecho" },
    { k: ["cadera","caderas"], v: "caderas" }
  ];
  for (const z of zonasDict) {
    for (const alias of z.k) {
      if (t.includes(alias)) return z.v;
    }
  }
  // Revisión con FRASES.zonas adicional
  for (const z of FRASES.zonas) {
    if (t.includes(norm(z))) return z;
  }
  return null;
};

// Clasificador simple por reglas + score
function clasificarIntent(text) {
  const sPrecio = includesAny(text, FRASES.precio);
  const sDonde = includesAny(text, FRASES.donde);
  const sCons  = includesAny(text, FRASES.consiste);
  const zona   = detectZona(text);

  // Ranking por mayor score (y priorización estable: precio > donde > consiste > zonas)
  const intents = [
    { intent: "precio",   score: sPrecio.score },
    { intent: "donde",    score: sDonde.score },
    { intent: "consiste", score: sCons.score },
    { intent: zona ? "zonas" : "ninguno", score: zona ? 1 : 0 }
  ];

  intents.sort((a, b) => b.score - a.score);

  const top = intents[0] || { intent: "ninguno", score: 0 };
  if (top.intent === "zonas") return { intent: "zonas", score: 1, zona };

  return { intent: top.intent, score: top.score, zona: null };
}

// Respuestas base (neutras, sin tocar conexiones ni URLs explícitas)
const RESP = {
  precio:
    "Puedo orientarte con precios según tu objetivo y zona. La evaluación es gratuita y sin compromiso; ahí definimos el plan exacto y su valor. ¿Te ayudo a coordinar tu hora?",
  donde:
    "Estamos en Av. Las Perdices Nº 2990, Local 23, Peñalolén. Horario: Lun–Vie 9:30–20:00; Sáb 9:30–13:00. ¿Te reservo una evaluación gratuita?",
  consiste:
    "Trabajamos con HIFU 12D, Cavitación, Radiofrecuencia y EMS Sculptor. Combinamos tecnologías para reducir, tensar y definir según tu caso. ¿Prefieres que veamos tu objetivo en una evaluación gratuita?",
  zonasGenerico:
    "Puedo recomendarte el plan adecuado para esa zona y tu objetivo (reducir, reafirmar o tonificar). La evaluación es gratuita; coordinamos y te dejo con todo listo.",
  fallback:
    "💛 Disculpa, no logré entender tu mensaje, pero puedo ayudarte a encontrar el tratamiento más adecuado para ti. ✨ Recuerda que la evaluación es gratuita y sin compromiso. ¿Te ayudo a coordinar tu hora?"
};

// Sugerencias rápidas por zona
function sugerenciaPorZona(z) {
  const zona = (z || "").toLowerCase();
  if (["glúteos","gluteos","gluteo","cola","trasero","nalgas","pompis","gluti"].includes(zona)) {
    return "Para levantar y dar forma en glúteos usamos Push Up (EMS Sculptor + RF + HIFU tensor). Firmeza desde la primera sesión.";
  }
  if (["abdomen","guata","barriga","vientre","panza"].includes(zona)) {
    return "Para abdomen trabajamos con HIFU 12D + Cavitación + RF. Reducción de centímetros y definición de cintura.";
  }
  if (["piernas","pierna","muslos","muslo","pantorrilla","pantorrillas"].includes(zona)) {
    return "En piernas/muslos combinamos Cavitación + RF para reducir grasa localizada y mejorar firmeza.";
  }
  if (["brazos","brazo","biceps","triceps"].includes(zona)) {
    return "En brazos usamos RF + EMS para tono y definición, y Cavitación si hay adiposidad localizada.";
  }
  if (["espalda"].includes(zona)) {
    return "En espalda priorizamos Cavitación + RF para contorno y piel más firme.";
  }
  if (["cintura","flancos"].includes(zona)) {
    return "Para cintura/flancos usamos HIFU 12D + Cavitación + RF para moldear y reducir centímetros.";
  }
  if (["papada"].includes(zona)) {
    return "Para papada trabajamos con HIFU focal y RF para tensar y definir contorno del cuello.";
  }
  if (["rostro","cara","cachetes"].includes(zona)) {
    return "En facial usamos RF, HIFU focal y protocolos de bioestimulación según diagnóstico (antiage, contorno, textura).";
  }
  if (["pecho","pectorales"].includes(zona)) {
    return "Para pectorales/pecho podemos trabajar definición con EMS (en hombres) y tensado cutáneo con RF.";
  }
  if (["caderas"].includes(zona)) {
    return "Para caderas combinamos Cavitación + RF para perfilar contorno y mejorar firmeza.";
  }
  return null;
}

// Generador de respuesta según intención detectada
function generarRespuesta(intel) {
  if (intel.intent === "precio" && intel.score >= MIN_SCORE) {
    return RESP.precio;
  }
  if (intel.intent === "donde" && intel.score >= MIN_SCORE) {
    return RESP.donde;
  }
  if (intel.intent === "consiste" && intel.score >= MIN_SCORE) {
    return RESP.consiste;
  }
  if (intel.intent === "zonas") {
    const tip = sugerenciaPorZona(intel.zona);
    if (tip) {
      return `${tip} ✨ La evaluación es gratuita; ahí vemos tu caso y plan ideal. ¿Agendamos?`;
    }
    return RESP.zonasGenerico;
  }
  // Fallback SIEMPRE al final (no tapa reglas)
  return RESP.fallback;
}

// API del motor: no rompe firmas externas
export function procesarMensaje(textoEntrante, platform = "whatsapp") {
  const t = String(textoEntrante || "").trim();
  if (!t) return RESP.fallback;

  const intel = clasificarIntent(t);
  const respuesta = generarRespuesta(intel);

  // Puedes personalizar por plataforma si lo necesitas en el futuro (sin tocar conexiones):
  // if (platform === "instagram") { ... }
  return respuesta;
}
