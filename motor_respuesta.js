/* =========================================================
   MOTOR DE RESPUESTA ZARA 2.1
   Estructura centralizada: mantiene comportamiento actual,
   agrega memoria temporal y prepara conexión con Campañas.xlsx
   ========================================================= */

import fs from "fs";
// import * as XLSX from "xlsx"; // ← Activar más adelante para leer campañas.xlsx

/* =========================================================
   1. CONFIGURACIÓN Y MEMORIA TEMPORAL
   ========================================================= */
let contextoUltimo = null; // memoriza último tratamiento mencionado (temporal)

/* =========================================================
   2. PLANTILLA DE CAMPAÑAS (opcional futuro)
   ========================================================= */
// let campañas = [];
// try {
//   if (fs.existsSync("./Campañas.xlsx")) {
//     const workbook = XLSX.readFile("./Campañas.xlsx");
//     const hoja = workbook.Sheets[workbook.SheetNames[0]];
//     campañas = XLSX.utils.sheet_to_json(hoja);
//     console.log("Campañas cargadas:", campañas.length);
//   }
// } catch (err) {
//   console.error("No se pudo leer Campañas.xlsx:", err);
// }

/* =========================================================
   3. TABLAS BASE: SINÓNIMOS Y PRECIOS
   ========================================================= */
const precios = {
  "pink glow": "$198.400 (parte de Face Smart, Face Inicia y Face Elite)",
  "toxina": "$281.600 (en Face Antiage y Full Face)",
  "exosoma": "$270.400 (según protocolo regenerativo)",
  "rf": "$60.000 (Radiofrecuencia facial)",
  "lipo": "$348.800 a $664.000 según plan",
  "face": "$120.000 a $584.000 según plan",
  "push up": "$376.000 (con Prosculpt + RF)",
  "body fitness": "$360.000 (EMS Sculptor + tonificación)",
  "body tensor": "$232.000 (Reafirmación y tensado corporal)"
};

const sinonimos = {
  "pink glow": ["pink", "glow", "biostimulante"],
  "toxina": ["botox", "toxina", "arruga"],
  "exosoma": ["exosoma", "regeneración", "fibroblasto"],
  "rf": ["radiofrecuencia", "rf"],
  "lipo": ["lipo", "grasa", "abdomen", "cintura"],
  "face": ["facial", "cara", "rostro", "face"],
  "push up": ["push up", "glúteo", "gluteo", "trasero", "poto"],
  "body fitness": ["fitness", "tonificar", "sculptor", "ems"],
  "body tensor": ["tensor", "reafirmar", "flacidez"]
};

/* =========================================================
   4. FUNCIÓN PRINCIPAL
   ========================================================= */
export function procesarMensaje(usuario, texto) {
  if (!texto) return "✨ Soy Zara de Body Elite. Cuéntame qué zona o tratamiento te gustaría mejorar.";

  const lower = texto.toLowerCase().trim();

  /* ---- MODO INTERNO (mensaje comienza con 'zara') ---- */
  if (lower.startsWith("zara")) {
    return generarRespuestaInterna(lower);
  }

  /* ---- DETECCIÓN DE CAMPAÑA (bloque preparado) ---- */
  // if (campañas.length > 0) {
  //   const match = campañas.find(c => lower.includes(c.palabra_clave.toLowerCase()));
  //   if (match) {
  //     return `${match.saludo}\n\n${match.descripcion}\n💰 ${match.precio} · ${match.sesiones} sesiones\n${match.cta}`;
  //   }
  // }

  /* ---- DETECCIÓN DE TRATAMIENTO ---- */
  for (const [clave, lista] of Object.entries(sinonimos)) {
    if (lista.some(p => lower.includes(p))) {
      contextoUltimo = clave;
      return generarRespuesta(clave);
    }
  }

  /* ---- PREGUNTAS DE PRECIO ---- */
  if (lower.includes("cuánto") || lower.includes("vale") || lower.includes("precio")) {
    if (contextoUltimo && precios[contextoUltimo]) {
      return `💰 El valor de ${contextoUltimo} es ${precios[contextoUltimo]}. Incluye diagnóstico gratuito con IA y profesional clínico.`;
    }
    return "💰 Los planes faciales comienzan desde $120.000 y los corporales desde $348.800. Incluyen diagnóstico gratuito con IA y profesional clínico.";
  }

  /* ---- UBICACIÓN Y HORARIO ---- */
  if (lower.includes("dónde") || lower.includes("direccion") || lower.includes("ubicacion") || lower.includes("horario")) {
    return "📍 Estamos en *Av. Las Perdices Nº2990, Local 23, Peñalolén*, cerca de Av. Tobalaba.\n🕒 Horarios: Lun–Vie 9:30–20:00 · Sáb 9:30–13:00\nAgenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
  }

  /* ---- PREGUNTAS SOBRE DOLOR O SEGURIDAD ---- */
  if (lower.includes("duele") || lower.includes("dolor") || lower.includes("seguro")) {
    return "💆‍♀️ Son tratamientos cómodos y no invasivos. Solo puedes sentir un leve calor o una contracción suave según la tecnología aplicada.";
  }

  /* ---- SALUDO GENERAL ---- */
  if (["hola", "buenas", "saludos", "hey"].some(p => lower.startsWith(p))) {
    return "✨ Soy Zara de Body Elite. Qué gusto saludarte, cuéntame qué zona o tratamiento te gustaría mejorar o conseguir para orientarte mejor.";
  }

  /* ---- FALLBACK ---- */
  return "💛 Disculpa, no logré entender tu pregunta, pero estoy segura que nuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.\n📅 Agenda tu cita aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
}

/* =========================================================
   5. RESPUESTAS CLÍNICAS Y COMERCIALES
   ========================================================= */
function generarRespuesta(clave) {
  switch (clave) {
    case "pink glow":
      return "💖 *Pink Glow* es un bioestimulante con péptidos y antioxidantes que mejora luminosidad y regeneración celular. Forma parte de *Face Smart*, *Face Inicia* y *Face Elite*.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "toxina":
      return "💉 Aplicamos *Toxina Botulínica (Botox)* de forma clínica y segura. Se usa en *Face Antiage*, *Face Elite* y *Full Face* para suavizar arrugas.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "exosoma":
      return "🌿 Usamos *Exosomas*, regeneradores celulares que estimulan fibroblastos y colágeno IV. Se aplican junto a *Pink Glow* en protocolos regenerativos.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "rf":
      return "📡 La *Radiofrecuencia* estimula colágeno y elastina para reafirmar piel y mejorar textura. Está en *Body Tensor*, *Face Antiage* y *Face Elite*.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "lipo":
      return "🔥 Nuestros planes *Lipo* van desde *Lipo Focalizada Reductiva* ($348.800) hasta *Lipo Body Elite* ($664.000). Incluyen tecnologías HIFU, Cavitación y RF.\n👉 Agenda aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "push up":
      return "🍑 Para levantar y reafirmar glúteos trabajamos con *Push Up* y *Body Fitness*. Push Up combina *Prosculpt + RF*, mientras Body Fitness usa *EMS Sculptor* para tono y fuerza.\n👉 Agenda tu valoración gratuita aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "body fitness":
      return "💪 *Body Fitness* combina *EMS Sculptor* con radiofrecuencia para tonificar y mejorar el volumen muscular. Ideal para abdomen, brazos y glúteos.\n👉 Agenda tu sesión gratuita aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    case "body tensor":
      return "✨ *Body Tensor* es un tratamiento reafirmante que mejora flacidez con radiofrecuencia y bioestimulación. Perfecto para abdomen, brazos o muslos.\n👉 Agenda tu sesión gratuita aquí: https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
    default:
      return "✨ Soy Zara de Body Elite. Cuéntame qué zona o tratamiento te gustaría mejorar para orientarte mejor.";
  }
}

/* =========================================================
   6. RESPUESTA MODO INTERNO
   ========================================================= */
function generarRespuestaInterna(texto) {
  const contenido = texto.replace(/^zara\s*/i, "");
  return `🧠 *MODO INTERNO - ANÁLISIS CLÍNICO Y COMERCIAL*\n\n${contenido}\n\n— Fin del modo interno —`;
}
