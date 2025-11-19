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
  "panza",
  "abdomen",
  "cintura",
  "bajar guata",
  "bajar panza",
  "bajar abdomen",
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
];

const frasesRostro = [
  "arrugas",
  "lineas",
  "líneas",
  "frente",
  "patas de gallo",
  "surcos",
  "codigo",
  "código",
  "codigo de barras",
  "ojeras",
  "flacidez facial",
];

const frasesPapada = ["papada", "doble menton", "doble mentón"];

const frasesPiernasBrazos = [
  "flacidez piernas",
  "flacidez brazos",
  "brazos flácidos",
  "piernas flácidas",
];

const frasesDepilacion = ["depilacion", "depilación", "depilar", "laser", "láser"];

// ===============================================================
// TRIGGERS AVANZADOS
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

// TRIGGER BOTOX — NUEVO
const triggersBotox = [
  "botox",
  "toxina",
  "toxina facial",
  "ponen botox",
  "aplican botox",
  "botoks",
];

// ===============================================================
// PLANES + PRECIOS + SESIONES + EXPLICACIÓN
// ===============================================================

const precios = {
  "lipo focalizada reductiva": 348800,
  "lipo express": 432000,
  "lipo reductiva": 480000,
  "lipo body elite": 664000,
  "body tensor": 232000,
  "body fitness": 360000,
  "push up": 376000,

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

  depilacion: 259200,
};

const sesiones = {
  "lipo express": "6–8 sesiones",
  "lipo reductiva": "8 sesiones",
  "lipo focalizada reductiva": "6 sesiones",
  "lipo body elite": "8–10 sesiones",
  "push up": "6–8 sesiones",
  "body fitness": "6 sesiones",
  "body tensor": "6 sesiones",

  "face h12": "3 sesiones",
  "face one": "5 sesiones",
  "face light": "3 sesiones",
  "face smart": "6 sesiones",
  "face inicia": "6 sesiones",
  "face antiage": "6 sesiones",
  "face elite": "6 sesiones",
  "full face": "6 sesiones",
  "face papada": "6 sesiones",

  depilacion: "6 sesiones",
};

const explicacion = {
  "lipo express":
    "✨ **Lipo Express** reduce abdomen, cintura y espalda con HIFU 12D + Cavitación + RF compactante.",
  "lipo reductiva":
    "✨ **Lipo Reductiva** moldea abdomen completo usando HIFU 12D + Cavitación + RF.",
  "lipo focalizada reductiva":
    "✨ **Lipo Focalizada** trabaja rollos pequeños con cavitación + radiofrecuencia.",
  "lipo body elite":
    "✨ **Lipo Body Elite** combina reducción profunda + tensado premium con HIFU 12D.",
  "body tensor":
    "✨ **Body Tensor** tensa la piel de piernas/brazos con radiofrecuencia profunda.",
  "body fitness":
    "✨ **Body Fitness** tonifica glúteos/piernas con ProSculpt + RF.",
  "push up":
    "✨ **Push Up** da volumen real con ProSculpt (20.000 contracciones) + HIFU 12D tensado.",

  "limpieza facial full":
    "✨ **Limpieza Facial Full** limpia en profundidad + extracción.",
  "rf facial":
    "✨ **RF Facial** mejora firmeza, textura y tono.",
  "face light":
    "✨ **Face Light** trabaja brillo + textura + líneas finas.",
  "face smart":
    "✨ **Face Smart** combina LFP + Pink Glow + RF + HIFU 12D suave.",
  "face inicia":
    "✨ **Face Inicia** trabaja arrugas, firmeza y luminosidad.",
  "face antiage":
    "✨ **Face Antiage** suaviza arrugas + líneas con HIFU 12D + RF.",
  "face elite":
    "✨ **Face Elite** es un lifting no invasivo completo con HIFU 12D + RF + toxina según evaluación.",
  "full face":
    "✨ **Full Face** combina RF + Pink Glow + Toxina + HIFU 12D en un protocolo integral.",
  "face h12":
    "✨ **Face H12** es un lifting suave con HIFU 12D focal + RF.",
  "face one":
    "✨ **Face One** combina RF + HIFU 12D + Exosomas.",
  "face papada":
    "✨ **Face Papada** reduce grasa + define contorno con HIFU 12D + lipolítico facial.",

  depilacion:
    "✨ **Depilación Láser DL900** elimina el vello desde la raíz con tecnología diodo original.",
};

// ===============================================================
// DETECTAR PLAN
// ===============================================================

function detectarPlan(msg) {
  msg = msg.toLowerCase();

  // campañas
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
    return `Los valores dependen del plan 💙\nAgenda aquí:\n${LINK}`;
  return `El plan **${capital(plan)}** parte desde **$${precios[
    plan
  ].toLocaleString("es-CL")}** 💙\nAgenda aquí:\n${LINK}`;
}

function respSesiones(plan) {
  return `El plan **${capital(plan)}** suele necesitar **${
    sesiones[plan] || "sesiones según evaluación"
  }**.\nEn tu diagnóstico vemos exactamente lo que necesitas 💙\nAgenda:\n${LINK}`;
}

function respDuele() {
  return `No duele 💙\nPuedes sentir calor o contracciones según el plan, pero nada doloroso.\nAgenda aquí:\n${LINK}`;
}

function respExplic(plan) {
  return `${explicacion[plan]}\n\nAgenda aquí:\n${LINK}`;
}

function respPlan(plan) {
  return `${explicacion[plan]}\n\nAgenda aquí:\n${LINK}`;
}

// RESPUESTA BOTOX — NUEVO
function respBotox() {
  return `💙 Sí, aplicamos toxina facial para arrugas de expresión.\nLa dosis exacta se define en tu evaluación.\n\nAgenda aquí:\n${LINK}`;
}

// ===============================================================
// CONTROL LINKS + LLAMADA
// ===============================================================

function controlarLinks(numero) {
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

  if (!memoria[numero]) memoria[numero] = {};

  // SALUDO único
  if (!memoria[numero].saludo) {
    memoria[numero].saludo = true;
    guardarMemoria();
    return SALUDO;
  }

  // BOTOX — NUEVO
  if (triggersBotox.some((x) => msg.includes(x))) {
    return respBotox();
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
    return `En tu diagnóstico vemos cuántas sesiones necesitas 💙\nAgenda aquí:\n${LINK}`;
  }

  // DUELE
  if (msg.includes("duele")) {
    return respDuele();
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

    const oferta = controlarLinks(numero);
    if (oferta) return oferta;

    return respPlan(plan);
  }

  // FALLBACK
  return `💙 Disculpa, no logre entender, pero estoy segura que nuestras profesionales resolverán todas tus dudas en la evaluacion.`;
}

// ===============================================================
function capital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
