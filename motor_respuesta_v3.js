// ===============================================================
// ZARA — MOTOR DE RESPUESTA v3 (VERSIÓN FINAL AUTOSUFICIENTE)
// Body Elite / IG+WSP / Motor único con memoria persistente
// ===============================================================

import fs from "fs";

// Ruta memoria persistente
const MEM_FILE = "./memoria_usuarios.json";

// Cargar memoria o inicializar
let memoria = {};
try {
  if (fs.existsSync(MEM_FILE)) {
    memoria = JSON.parse(fs.readFileSync(MEM_FILE, "utf8"));
  }
} catch (e) {
  memoria = {};
}

// Guardar memoria en disco
function guardarMemoria() {
  fs.writeFileSync(MEM_FILE, JSON.stringify(memoria, null, 2));
}

// ===============================================================
// CONFIG
// ===============================================================

const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// SALUDO IG
const SALUDO =
  "💙 Hola! Soy Zara 💫 Cuéntame, ¿qué zona quieres mejorar? abdomen, glúteos, rostro o depilación.";

// ===============================================================
// FRASES COLOQUIALES / DETECCIÓN DE ZONAS
// ===============================================================

const frasesAbdomen = [
  "guata",
  "rollo",
  "rollos",
  "rollito",
  "papada abdominal",
  "panza",
  "abdomen",
  "cintura",
  "bajar guata",
  "bajar panza",
  "bajar abdomen",
  "hacer abdomen",
];

const frasesGluteos = [
  "poto",
  "gluteo",
  "glúteo",
  "nalgas",
  "cola",
  "trasero",
  "poto caído",
  "levantar poto",
  "quiero poto",
  "dar volumen",
  "más glúteo",
];

const frasesRostro = [
  "arrugas",
  "lineas",
  "líneas",
  "frente",
  "patas de gallo",
  "surcos",
  "codigo de barras",
  "codigo",
  "ojeras",
  "flacidez facial",
];

const frasesPapada = ["papada", "doble menton", "doble mentón"];

const frasesPiernasBrazos = [
  "flacidez piernas",
  "flacidez brazos",
  "brazos flácidos",
  "piernas flácidas",
  "brazos caídos",
];

const frasesDepilacion = ["depilacion", "depilación", "depilar", "laser", "láser"];

// ===============================================================
// TRIGGERS DE INTENCIÓN
// ===============================================================

const triggersExplicacion = [
  "que es",
  "qué es",
  "en que consiste",
  "en qué consiste",
  "como funciona",
  "cómo funciona",
  "como es",
  "cómo es",
  "explicame",
  "explícame",
  "detalles",
  "detalle",
  "info",
  "información",
  "informacion",
  "como se hace",
  "cómo se hace",
  "funciona",
  "sirve",
  "vale la pena",
  "realmente sirve",
  "que tal",
  "cómo actúa",
  "como actua",
];

const triggersSesiones = [
  "cuantas sesiones",
  "cuántas sesiones",
  "sesiones",
  "cuanto dura",
  "cuánto dura",
];

const triggersPrecio = [
  "precio",
  "valor",
  "cuanto vale",
  "cuánto vale",
  "cuanto sale",
  "cuánto sale",
  "porque tan caro",
];

// ===============================================================
// PLANES + PRECIOS + SESIONES + EXPLICACIÓN REAL
// (Definidos según tu tabla oficial + protocolos cargados)
// ===============================================================

const precios = {
  // Corporales
  "lipo focalizada reductiva": 348800,
  "lipo express": 432000,
  "lipo reductiva": 480000,
  "lipo body elite": 664000,
  "body tensor": 232000,
  "body fitness": 360000,
  "push up": 376000,

  // Faciales
  "limpieza facial full": 120000,
  "rf facial": 60000,
  "face light": 128800,
  "face smart": 198400,
  "face inicia": 270400,
  "face antiage": 281600,
  "face elite": 358400,
  "full face": 584000,
  "face h12": 128000,
  "face one": 152000,
  "face papada": 128800,

  // Depilación
  depilacion: 259200,
};

const sesiones = {
  // Corporales
  "lipo express": "6–8 sesiones",
  "lipo reductiva": "8 sesiones",
  "lipo focalizada reductiva": "6 sesiones",
  "lipo body elite": "8–10 sesiones",
  "push up": "6–8 sesiones",
  "body fitness": "6 sesiones",
  "body tensor": "6 sesiones",

  // Faciales
  "face h12": "3 sesiones",
  "face one": "5 sesiones",
  "face light": "3 sesiones",
  "face smart": "6 sesiones",
  "face inicia": "6 sesiones",
  "face antiage": "6 sesiones",
  "face elite": "6 sesiones",
  "full face": "6 sesiones",
  "face papada": "6 sesiones",

  // Depilación
  depilacion: "6 sesiones",
};

const explicacion = {
  // Corporales
  "lipo express":
    "✨ **Lipo Express** reduce abdomen, cintura y espalda con HIFU 12D (grasa profunda) + cavitación (rompe adipocitos) + radiofrecuencia (compacta y tensa). Resultados desde 2–3 semanas.",
  "lipo reductiva":
    "✨ **Lipo Reductiva** moldea abdomen completo con HIFU 12D + Cavitación + RF. Ideal cuando hay grasa + flacidez combinada.",
  "lipo focalizada reductiva":
    "✨ **Lipo Focalizada** trabaja rollos pequeños con cavitación + radiofrecuencia localizada.",
  "lipo body elite":
    "✨ **Lipo Body Elite** es un protocolo premium que combina reducción profunda + tensado con HIFU 12D y RF avanzada.",
  "body tensor":
    "✨ **Body Tensor** tensa y mejora firmeza en piernas/brazos con radiofrecuencia profunda.",
  "body fitness":
    "✨ **Body Fitness** tonifica glúteos/piernas/abdomen con ProSculpt (20.000 contracciones) + RF compactante.",
  "push up":
    "✨ **Push Up** da volumen real al glúteo con ProSculpt (20.000 contracciones por sesión) + HIFU 12D para tensar y proyectar.",

  // Faciales
  "limpieza facial full":
    "✨ **Limpieza Facial Full**: limpieza profunda + extracción + aparatología suave.",
  "rf facial":
    "✨ **RF Facial** mejora firmeza, tono y textura con radiofrecuencia profunda.",
  "face light":
    "✨ **Face Light**: protocolo suave para textura, brillo y líneas finas.",
  "face smart":
    "✨ **Face Smart** combina LFP + Pink Glow + RF + HIFU 12D suave.",
  "face inicia":
    "✨ **Face Inicia** trabaja líneas, firmeza y luminosidad con un mix completo de RF + Pink Glow + HIFU 12D.",
  "face antiage":
    "✨ **Face Antiage** suaviza arrugas, líneas y flacidez con HIFU 12D + radiofrecuencia + toxina ligera según necesidad.",
  "face elite":
    "✨ **Face Elite** es un lifting no invasivo completo con HIFU 12D + Pink Glow + RF + Toxina según evaluación.",
  "full face":
    "✨ **Full Face** combina controles faciales + RF + Pink Glow + Toxina + HIFU 12D en un protocolo integral.",
  "face h12":
    "✨ **Face H12** es un lifting suave con HIFU 12D focal + RF.",
  "face one":
    "✨ **Face One** combina RF + HIFU 12D + Exosomas.",
  "face papada":
    "✨ **Face Papada** reduce grasa + define contorno con HIFU 12D + Lipolítico facial.",

  // Depilación
  depilacion:
    "✨ **Depilación Láser DL900** elimina el vello desde la raíz con tecnología diodo original, rápida y segura.",
};

// ===============================================================
// DETECTAR PLAN SEGÚN EL MENSAJE
// ===============================================================

function detectarPlan(msg) {
  msg = msg.toLowerCase();

  // campañas: si el usuario parte diciendo "push up", "lipo express", etc.
  for (const p of Object.keys(precios)) {
    if (msg.includes(p)) return p;
  }

  if (frasesAbdomen.some((x) => msg.includes(x))) return "lipo express";
  if (frasesGluteos.some((x) => msg.includes(x))) return "push up";
  if (frasesPapada.some((x) => msg.includes(x))) return "face papada";
  if (frasesRostro.some((x) => msg.includes(x))) return "face antiage";
  if (frasesPiernasBrazos.some((x) => msg.includes(x))) return "body tensor";
  if (frasesDepilacion.some((x) => msg.includes(x))) return "depilacion";

  return null;
}

// ===============================================================
// RESPUESTAS
// ===============================================================

function respPrecio(plan) {
  if (!precios[plan])
    return `Los valores dependen del plan y la zona 💙\nAgenda aquí:\n${LINK}`;
  return `El plan **${capital(plan)}** parte desde **$${precios[
    plan
  ].toLocaleString("es-CL")}** 💙\nAgenda aquí:\n${LINK}`;
}

function respSesiones(plan) {
  return `El plan **${capital(plan)}** suele requerir **${
    sesiones[plan] || "sesiones según evaluación"
  }**.\nEn tu diagnóstico vemos exactamente lo que necesitas 💙\nAgenda aquí:\n${LINK}`;
}

function respDuele(plan) {
  return `No duele 💙\nPuedes sentir calor o contracciones dependiendo del plan, pero nada doloroso.\nAgenda aquí:\n${LINK}`;
}

function respExplic(plan) {
  return `${explicacion[plan]}\n\nAgenda aquí:\n${LINK}`;
}

function respPlan(plan) {
  return `${explicacion[plan]}\n\nAgenda aquí:\n${LINK}`;
}

// ===============================================================
// CONTROL DE LINKS Y LLAMADA
// ===============================================================

function controlarLinks(numero) {
  if (!memoria[numero]) memoria[numero] = {};
  if (!memoria[numero].links) memoria[numero].links = 0;
  memoria[numero].links++;
  guardarMemoria();

  if (memoria[numero].links === 4) {
    return "💙 Veo que aún no agendas.\n¿Quieres que una profesional te llame para ayudarte? 📞";
  }
  return null;
}

// ===============================================================
// MOTOR PRINCIPAL
// ===============================================================

export function procesarMensaje(texto, numero, plataforma) {
  const msg = texto.toLowerCase().trim();

  // Inicializar memoria del usuario
  if (!memoria[numero]) memoria[numero] = {};

  // SALUDO ÚNICO
  if (!memoria[numero].saludo) {
    memoria[numero].saludo = true;
    guardarMemoria();
    return SALUDO;
  }

  // PRECIO
  if (triggersPrecio.some((x) => msg.includes(x))) {
    const plan = memoria[numero].plan;
    if (plan) return respPrecio(plan);
    return respPrecio("lipo express");
  }

  // SESIONES
  if (triggersSesiones.some((x) => msg.includes(x))) {
    const plan = memoria[numero].plan;
    if (plan) return respSesiones(plan);
    return `En el diagnóstico definimos cuántas necesitas 💙\nAgenda aquí:\n${LINK}`;
  }

  // DUELE
  if (msg.includes("duele")) {
    const plan = memoria[numero].plan;
    return respDuele(plan);
  }

  // EXPLICACIÓN
  if (triggersExplicacion.some((x) => msg.includes(x))) {
    const plan = memoria[numero].plan;
    if (plan) return respExplic(plan);
    return `Para explicarte bien necesito saber tu objetivo 💙\n¿Abdomen, glúteos, rostro o depilación?`;
  }

  // DETECTAR PLAN
  const plan = detectarPlan(msg);
  if (plan) {
    memoria[numero].plan = plan;
    guardarMemoria();

    const ofertaLlamada = controlarLinks(numero);
    if (ofertaLlamada) return ofertaLlamada;

    return respPlan(plan);
  }

  // FALLBACK
  return `💙 Disculpa, no logre entender, pero estoy segura que nuestras profesionales resolverán todas tus dudas en la evaluacion.`;
}

// ===============================================================
// UTILS
// ===============================================================

function capital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
