import { sendMessage } from "./sendMessage.js";
import fs from "fs";
import path from "path";

// =============== MEMORIA ===============
const memoriaPath = path.resolve("./memoria_usuarios.json");

let memoria = {};
try {
  const data = fs.readFileSync(memoriaPath, "utf8");
  memoria = JSON.parse(data);
} catch {
  memoria = {};
}

function guardarMemoria() {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}

// =============== LINK ===============
const LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";

// =============== PLANES ===============
const PRECIOS = {
  "lipo express": 432000,
  "lipo reductiva": 480000,
  "lipo focalizada reductiva": 348800,
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
  "face papada": 313600,
  depilacion: 259200
};

const SESIONES = {
  "lipo express": "6–8 sesiones",
  "lipo reductiva": "8 sesiones",
  "lipo focalizada reductiva": "6 sesiones",
  "lipo body elite": "8–10 sesiones",
  "body tensor": "6 sesiones",
  "body fitness": "6 sesiones",
  "push up": "6–8 sesiones",
  "face antiage": "6 sesiones",
  "face elite": "6 sesiones",
  "face light": "3 sesiones",
  "face smart": "6 sesiones",
  "face inicia": "6 sesiones",
  "face papada": "6 sesiones",
  "full face": "6 sesiones",
  depilacion: "6 sesiones"
};

const EXPLICACION_PLAN = {
  "lipo express": "Lipo Express reduce abdomen, cintura y espalda con HIFU 12D + cavitación + radiofrecuencia compactante.",
  "lipo reductiva": "Lipo Reductiva moldea abdomen completo con HIFU 12D + cavitación + radiofrecuencia.",
  "lipo focalizada reductiva": "Lipo Focalizada Reductiva trabaja rollitos localizados con cavitación + RF puntual.",
  "lipo body elite": "Lipo Body Elite es un plan premium para reducción y tensado corporal completo.",
  "body tensor": "Body Tensor tensa piernas y brazos.",
  "body fitness": "Body Fitness combina ProSculpt + RF para tonificar piernas y glúteos.",
  "push up": "Push Up levanta, afirma y proyecta glúteos con ProSculpt + HIFU 12D.",
  "limpieza facial full": "Limpieza Facial Full limpia en profundidad.",
  "rf facial": "RF Facial mejora firmeza y colágeno.",
  "face light": "Face Light mejora brillo y primeras líneas.",
  "face smart": "Face Smart combina luz pulsada + Pink Glow + RF.",
  "face inicia": "Face Inicia trabaja arrugas suaves y textura.",
  "face antiage": "Face Antiage suaviza arrugas con HIFU 12D + RF.",
  "face elite": "Face Elite es lifting no invasivo completo.",
  "full face": "Full Face integra RF + Pink Glow + toxina ligera + HIFU 12D.",
  "face papada": "Face Papada reduce grasa submentoniana con HIFU 12D.",
  depilacion: "Depilación Láser DL900 elimina el vello desde la raíz."
};

// =============== DETECCION ZONA ===============
const FRASES_ZONA = {
  abdomen: ["abdomen", "panza", "guata", "rollos", "cintura", "espalda"],
  gluteos: ["gluteo", "glúteo", "gluteos", "poto", "push up", "nalgas"],
  papada: ["papada", "doble menton"],
  arrugas: ["arrugas", "patas de gallo", "frente", "entrecejo"],
  piernas: ["piernas", "muslos", "cartucheras"],
  brazos: ["brazos", "alas de murcielago"],
  depilacion: ["pelos", "vello", "depilacion", "laser"]
};

function normalizar(t) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function detectarPlanPorZona(texto) {
  const t = normalizar(texto);

  if (FRASES_ZONA.abdomen.some(x => t.includes(x))) return "lipo express";
  if (FRASES_ZONA.gluteos.some(x => t.includes(x))) return "push up";
  if (FRASES_ZONA.papada.some(x => t.includes(x))) return "face papada";
  if (FRASES_ZONA.arrugas.some(x => t.includes(x))) return "face antiage";
  if (FRASES_ZONA.piernas.some(x => t.includes(x))) return "body tensor";
  if (FRASES_ZONA.brazos.some(x => t.includes(x))) return "body tensor";
  if (FRASES_ZONA.depilacion.some(x => t.includes(x))) return "depilacion";

  return null;
}

function detectarPlanPorCampania(texto) {
  const t = normalizar(texto);

  const planes = [
    "push up",
    "lipo express",
    "body fitness",
    "body tensor",
    "full face",
    "face elite",
    "face antiage",
    "face papada",
    "depilacion"
  ];

  for (const p of planes) {
    if (t.includes(p)) return p;
  }

  return null;
}

// =============== INTENCIONES ===============
const INTENCIONES = {
  explicacion: ["como funciona", "que es", "en que consiste"],
  precio: ["precio", "valor", "cuanto vale", "cuanto cuesta"],
  sesiones: ["cuantas sesiones", "cuanto dura"],
  dolor: ["duele", "dolor", "doloroso"],
  botox: ["botox", "toxina"]
};

function detectarIntencion(texto) {
  const t = normalizar(texto);
  for (const key in INTENCIONES) {
    if (INTENCIONES[key].some(x => t.includes(x))) return key;
  }
  return null;
}

// =============== ANTI REPETICION ===============
function mensajeRepetido(texto, mem) {
  const t = normalizar(texto);
  if (!mem) return false;
  if (mem.ultima_interaccion === t) return true;
  mem.ultima_interaccion = t;
  return false;
}

// =============== SALUDO ===============
function esSaludoInicial(texto) {
  const t = normalizar(texto);
  return ["hola", "hola!", "buenas", "buen dia", "buenas tardes", "buenas noches"].includes(t);
}

function respuestaSaludo() {
  return "💙 Soy Zara de Body Elite.\n\nCuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, papada, piernas, brazos o depilación.";
}

// =============== DESPEDIDA ===============
function despedidaSiCorresponde(texto, mem) {
  const t = normalizar(texto);
  const gracias = ["gracias", "perfecto", "vale", "ok gracias", "muchas gracias"];
  if (gracias.some(x => t.includes(x)) && !mem.numero_pendiente && !mem.llamada_ofrecida) {
    return "💙 Me alegra ayudarte.\nAquí tienes tu diagnóstico gratuito:\n" + LINK;
  }
  return null;
}

// =============== LLAMADA ===============
function manejarFlujoLlamada(texto, mem) {
  const t = normalizar(texto);

  const confirma = ["si", "sí", "dale", "ok", "llamame", "quiero llamada"];

  if (mem.llamada_ofrecida && !mem.numero_pendiente) {
    if (confirma.some(x => t.includes(x))) {
      mem.numero_pendiente = true;
      guardarMemoria();
      return "Perfecto. ¿Me compartes tu número para llamarte?";
    }
  }

  if (mem.numero_pendiente) {
    const detectado =
      texto.match(/(\+?56\s?9\s?\d{4}\s?\d{4})/) ||
      texto.match(/(9\d{7,8})/);

    if (detectado) {
      const numeroCliente = detectado[0].replace(/\s+/g, "");

      sendMessage("+56983300262", "Solicitud de llamada: " + numeroCliente);
      sendMessage("+56937648536", "Solicitud de llamada: " + numeroCliente);

      mem.numero_pendiente = false;
      mem.numero_cliente = numeroCliente;
      guardarMemoria();

      return "Perfecto. Te llamaremos en horario laboral.";
    }
  }

  return null;
}

// =============== RESPUESTAS ===============
function capital(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function responderExplicacion(plan) {
  if (EXPLICACION_PLAN[plan]) {
    return EXPLICACION_PLAN[plan] + "\n\nAgenda aquí:\n" + LINK;
  }
  return "Necesito saber la zona que deseas trabajar.";
}

function responderPrecio(plan) {
  const p = PRECIOS[plan];
  if (p) return "El plan " + capital(plan) + " parte desde $" + p.toLocaleString("es-CL") + ".\n\nAgenda aquí:\n" + LINK;
  return "El precio depende de tu caso. Aquí puedes agendar:\n" + LINK;
}

function responderSesiones(plan) {
  const s = SESIONES[plan];
  if (s) return "El plan " + capital(plan) + " suele requerir " + s + ".\n\nAgenda aquí:\n" + LINK;
  return "Las sesiones se definen en el diagnóstico.\n\nAgenda aquí:\n" + LINK;
}

function responderDolor() {
  return "No duele. Las sensaciones dependen del plan.\n\nAgenda aquí:\n" + LINK;
}

function responderBotox() {
  return "Sí, trabajamos toxina cuando corresponde. La dosis es médica.\n\nAgenda aquí:\n" + LINK;
}

// =============== MOTOR PRINCIPAL ===============
export function procesarMensaje(texto, numero, plataforma = "wsp") {
  if (!memoria[numero]) {
    memoria[numero] = {
      links_enviados: 0,
      llamada_ofrecida: false,
      plan_detectado: null,
      ultima_interaccion: null
    };
  }

  const mem = memoria[numero];

  if (mensajeRepetido(texto, mem)) {
    guardarMemoria();
    return "💙 Te entiendo, si quieres podemos verlo directo en tu diagnóstico.\n¿Quieres el link nuevamente?";
  }

  if (!mem.plan_detectado && esSaludoInicial(texto)) {
    guardarMemoria();
    return respuestaSaludo();
  }

  let plan =
    detectarPlanPorCampania(texto) ||
    detectarPlanPorZona(texto) ||
    mem.plan_detectado;

  if (plan) mem.plan_detectado = plan;

  const despedida = despedidaSiCorresponde(texto, mem);
  if (despedida) {
    guardarMemoria();
    return despedida;
  }

  const llamada = manejarFlujoLlamada(texto, mem);
  if (llamada) {
    guardarMemoria();
    return llamada;
  }

  const intencion = detectarIntencion(texto);

  let respuesta = "";

  if (intencion === "explicacion" && plan) respuesta = responderExplicacion(plan);
  else if (intencion === "precio" && plan) respuesta = responderPrecio(plan);
  else if (intencion === "sesiones" && plan) respuesta = responderSesiones(plan);
  else if (intencion === "dolor") respuesta = responderDolor();
  else if (intencion === "botox") respuesta = responderBotox();
  else if (plan) respuesta = responderExplicacion(plan);
  else {
    guardarMemoria();
    return "💙 Para ayudarte, cuéntame qué deseas mejorar: abdomen, glúteos, rostro, papada, piernas, brazos o depilación.";
  }

  mem.links_enviados += 1;

  if (mem.links_enviados >= 3 && !mem.llamada_ofrecida) {
    mem.llamada_ofrecida = true;
    respuesta += "\n\nSi prefieres, podemos llamarte en horario laboral. ¿Te gustaría?";
  }

  guardarMemoria();
  return respuesta;
}
