import memoria from "./memoria_usuarios.json" with { type: "json" };
import { writeFileSync } from "fs";

const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

// ------------------------------------------------------
// GUARDAR MEMORIA EN DISCO
// ------------------------------------------------------
function guardarMemoria() {
  writeFileSync("./memoria_usuarios.json", JSON.stringify(memoria, null, 2));
}

// ------------------------------------------------------
// FRASES COLOQUIALES (DETECCIÓN AMPLIA DE INTENCIONES)
// ------------------------------------------------------
const frasesZonaAbdomen = [
  "guata",
  "rollos",
  "rollito",
  "panza",
  "abdomen",
  "cintura",
  "bajar barriga",
  "bajar guata",
  "bajar panza",
];

const frasesZonaGluteos = [
  "poto",
  "gluteo",
  "glúteo",
  "gluteos",
  "glúteos",
  "nalgas",
  "trasero",
  "cola",
  "levantar poto",
  "quiero poto",
];

const frasesZonaRostro = [
  "arrugas",
  "líneas",
  "lineas",
  "frente",
  "patas de gallo",
  "patas",
  "codigo de barras",
  "surcos",
  "ojeras",
  "me veo cansada",
];

const frasesZonaPapada = ["papada", "papadita", "doble mentón"];

const frasesZonaPiernasBrazos = [
  "flacidez piernas",
  "flacidez brazos",
  "piernas flácidas",
  "brazos flácidos",
  "flácidos",
];

const frasesDepilacion = [
  "depilar",
  "depilación",
  "depilacion",
  "depilarme",
  "depilación laser",
  "laser",
  "láser",
];

// ------------------------------------------------------
// TRIGGERS AVANZADOS (EXPLICACIÓN)
// ------------------------------------------------------
const triggersExplicacion = [
  "que es",
  "qué es",
  "q es",
  "en que consiste",
  "en qué consiste",
  "como funciona",
  "cómo funciona",
  "como es",
  "cómo es",
  "detalles",
  "detalle",
  "explicame",
  "explícame",
  "que incluye",
  "qué incluye",
  "información",
  "informacion",
  "info",
  "como se hace",
  "cómo se hace",
  "sirve",
  "funciona",
  "realmente sirve",
  "vale la pena",
  "es bueno",
  "duele",
  "duele?",
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
];

// ------------------------------------------------------
// SALUDO INICIAL (solo 1 vez por usuario)
// ------------------------------------------------------
function generarSaludo(numero) {
  if (!memoria[numero]) memoria[numero] = {};
  if (!memoria[numero].saludoEnviado) {
    memoria[numero].saludoEnviado = true;
    guardarMemoria();
    return (
      "💙 Hola! Soy Zara 💫 Cuéntame, ¿qué zona quieres mejorar? abdomen, glúteos, rostro o depilación."
    );
  }
  return null;
}

// ------------------------------------------------------
// PLANES + PRECIO + SESIONES + EXPLICACIÓN
// ------------------------------------------------------
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
  depilacion: 259200,
  "face papada": 128800,
};

const sesionesPlan = {
  "lipo express": "6–8 sesiones",
  "lipo reductiva": "8 sesiones",
  "lipo focalizada reductiva": "6 sesiones",
  "lipo body elite": "8–10 sesiones",
  "push up": "6–8 sesiones",
  "body fitness": "6 sesiones",
  "body tensor": "6 sesiones",
  "face antiage": "6 sesiones",
  "face papada": "6 sesiones",
  depilacion: "6 sesiones",
};

const explicacionPlan = {
  "lipo express":
    "✨ **Lipo Express** trabaja abdomen/cintura con HIFU 12D (grasa profunda) + cavitación (adipocitos) + radiofrecuencia (compacta). Resultados desde 2–3 semanas.",
  "lipo reductiva":
    "✨ **Lipo Reductiva** moldea abdomen real usando HIFU 12D + RF + cavitación. Ideal para abdomen completo.",
  "lipo focalizada reductiva":
    "✨ **Lipo Focalizada** se usa para rollos pequeños. Cavitación + RF localizada.",
  "lipo body elite":
    "✨ **Lipo Body Elite** combina reducción profunda + tensado premium con HIFU 12D.",
  pushup:
    "✨ **Push Up** da volumen real con ProSculpt (20.000 contracciones) + HIFU 12D.",
  "push up":
    "✨ **Push Up** da volumen real con ProSculpt (20.000 contracciones) + HIFU 12D.",
  "body fitness":
    "✨ **Body Fitness** tonifica piernas/glúteos/abdomen con ProSculpt + RF.",
  "body tensor":
    "✨ **Body Tensor** tensa la piel con radiofrecuencia profunda.",
  "face antiage":
    "✨ **Face Antiage** suaviza arrugas + líneas con HIFU 12D + radiofrecuencia.",
  "face papada":
    "✨ **Face Papada** reduce grasa + tensa contorno con HIFU 12D.",
  depilacion:
    "✨ **Depilación Láser DL900** elimina el vello desde la raíz, rápido y seguro.",
};

// ------------------------------------------------------
// RESPUESTA AL PLAN PRINCIPAL
// ------------------------------------------------------
function responderPlan(plan) {
  memoria.ultimoPlan = plan;

  const alternativas = {
    "push up": "Body Fitness",
    "lipo express": "Lipo Reductiva",
    "face antiage": "Face Elite",
  };

  const alt = alternativas[plan]
    ? `\nComo alternativa también podría aplicar **${alternativas[plan]}**.`
    : "";

  return `✨ El plan recomendado es **${capital(plan)}**.\n${explicacionPlan[
    plan
  ]}\n${alt}\n\nAgenda aquí:\n${LINK}`;
}

// ------------------------------------------------------
// RESPUESTAS a Precio, Sesiones, Duele, Explicación
// ------------------------------------------------------
function responderPrecio(plan) {
  if (!precios[plan])
    return `Los valores dependen del plan y la zona.\nAgenda aquí:\n${LINK}`;

  return `El plan **${capital(
    plan
  )}** parte desde **$${precios[plan].toLocaleString(
    "es-CL"
  )}** 💙\nAgenda aquí:\n${LINK}`;
}

function responderSesiones(plan) {
  if (!sesionesPlan[plan])
    return `En la evaluación definimos cuántas sesiones necesitas 💙\nAgenda aquí:\n${LINK}`;

  return `El plan **${capital(plan)}** suele necesitar **${
    sesionesPlan[plan]
  }**.\nEn tu diagnóstico definimos exactamente lo que necesitas 💙\nAgenda aquí:\n${LINK}`;
}

function responderDuele(plan) {
  return `No duele 💙\nPuedes sentir calor o contracciones (según el plan), pero nada doloroso.\nAgenda aquí:\n${LINK}`;
}

function responderExplicacion(plan) {
  return `${explicacionPlan[plan]}\n\nAgenda aquí:\n${LINK}`;
}

// ------------------------------------------------------
// CAPTURA DE PLAN POR ZONA / CAMPAÑA
// ------------------------------------------------------
function detectarPlan(texto) {
  const t = texto.toLowerCase();

  if (
    frasesZonaAbdomen.some((p) => t.includes(p)) ||
    t.includes("abdomen") ||
    t.includes("cintura")
  )
    return "lipo express";

  if (frasesZonaGluteos.some((p) => t.includes(p))) return "push up";

  if (frasesZonaPapada.some((p) => t.includes(p))) return "face papada";

  if (frasesZonaRostro.some((p) => t.includes(p))) return "face antiage";

  if (frasesZonaPiernasBrazos.some((p) => t.includes(p)))
    return "body tensor";

  if (frasesDepilacion.some((p) => t.includes(p))) return "depilacion";

  return null;
}

// ------------------------------------------------------
// CONTADOR DE LINKS + OFERTA DE LLAMADA
// ------------------------------------------------------
function controlarLinks(numero) {
  if (!memoria[numero]) memoria[numero] = {};
  if (!memoria[numero].links) memoria[numero].links = 0;

  memoria[numero].links += 1;

  guardarMemoria();

  if (memoria[numero].links === 4) {
    return (
      "💙 Veo que aún no agendas.\n¿Quieres que una profesional te llame para ayudarte? 📞"
    );
  }

  return null;
}

// ------------------------------------------------------
// MOTOR PRINCIPAL
// ------------------------------------------------------
export function procesarMensaje(texto, numero, plataforma) {
  const msg = texto.toLowerCase().trim();

  // Saludo inicial (solo 1 vez)
  const saludo = generarSaludo(numero);
  if (saludo) return saludo;

  // Precio
  if (triggersPrecio.some((p) => msg.includes(p))) {
    const plan = memoria[numero]?.ultimoPlan;
    if (plan) return responderPrecio(plan);
    return `Los valores dependen del plan y la zona.\nAgenda aquí:\n${LINK}`;
  }

  // Sesiones
  if (triggersSesiones.some((p) => msg.includes(p))) {
    const plan = memoria[numero]?.ultimoPlan;
    if (plan) return responderSesiones(plan);
    return `En tu evaluación definimos cuántas sesiones necesitas 💙\nAgenda aquí:\n${LINK}`;
  }

  // Duele
  if (msg.includes("duele")) {
    const plan = memoria[numero]?.ultimoPlan;
    return responderDuele(plan);
  }

  // Explicación
  if (triggersExplicacion.some((p) => msg.includes(p))) {
    const plan = memoria[numero]?.ultimoPlan;
    if (plan) return responderExplicacion(plan);
    return `Para explicarte bien necesito saber tu objetivo 💙\n¿Quieres trabajar abdomen, glúteos, rostro o depilación?`;
  }

  // Detectar plan por zona
  const planZona = detectarPlan(msg);
  if (planZona) {
    memoria[numero].ultimoPlan = planZona;
    guardarMemoria();

    const respuesta = responderPlan(planZona);

    const ofertaLlamada = controlarLinks(numero);
    if (ofertaLlamada) return ofertaLlamada;

    return respuesta;
  }

  // Fallback
  return `💙 Cuéntame qué deseas mejorar: abdomen, glúteos, rostro o depilación.`;
}

// ------------------------------------------------------
// UTILIDAD
// ------------------------------------------------------
function capital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
