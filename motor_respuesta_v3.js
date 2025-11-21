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

// =============== PLANES, PRECIOS Y SESIONES ===============
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
  "body tensor": "Body Tensor tensa y mejora firmeza en piernas y brazos con radiofrecuencia profunda.",
  "body fitness": "Body Fitness combina ProSculpt + RF para tonificar y definir glúteos y piernas.",
  "push up": "Push Up levanta y da volumen real al glúteo con ProSculpt + HIFU 12D.",
  "limpieza facial full": "Limpieza Facial Full limpia en profundidad y mejora textura.",
  "rf facial": "RF Facial mejora firmeza, textura y colágeno.",
  "face light": "Face Light mejora brillo y primeras líneas.",
  "face smart": "Face Smart combina luz pulsada, Pink Glow y RF.",
  "face inicia": "Face Inicia trabaja arrugas suaves y brillo.",
  "face antiage": "Face Antiage suaviza arrugas con HIFU 12D + RF.",
  "face elite": "Face Elite es un lifting no invasivo con HIFU 12D + RF + biorevitalización.",
  "full face": "Full Face integra RF, Pink Glow, toxina ligera y HIFU 12D.",
  "face papada": "Face Papada reduce grasa submentoniana con HIFU 12D.",
  depilacion: "Depilación Láser DL900 elimina el vello desde la raíz con láser diodo seguro."
};

// =============== DETECCIÓN ===============
function normalizar(t) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const FRASES_ZONA = {
  abdomen: ["guata", "panza", "rollos", "abdomen", "cintura", "espalda"],
  gluteos: ["poto", "gluteo", "glúteo", "gluteos", "glúteos", "nalgas", "push up"],
  papada: ["papada", "doble menton", "doble mentón"],
  arrugas: ["arrugas", "lineas", "líneas", "patas de gallo", "frente", "entrecejo"],
  piernas: ["piernas", "muslos", "cartucheras"],
  brazos: ["brazos", "alas de murcielago", "alas de murciélago"],
  depilacion: ["depilacion", "depilación", "pelos", "vello", "laser"]
};

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
  if (t.includes("push up")) return "push up";
  if (t.includes("lipo express")) return "lipo express";
  if (t.includes("body fitness")) return "body fitness";
  if (t.includes("body tensor")) return "body tensor";
  if (t.includes("full face")) return "full face";
  if (t.includes("face elite")) return "face elite";
  if (t.includes("face antiage")) return "face antiage";
  if (t.includes("face papada")) return "face papada";
  if (t.includes("depilacion")) return "depilacion";
  return null;
}

const INTENCIONES = {
  explicacion: ["como funciona", "en que consiste", "que es", "de que se trata"],
  precio: ["precio", "valor", "cuanto vale", "cuanto sale", "cuanto cuesta"],
  sesiones: ["cuantas sesiones", "cuanto dura", "duracion"],
  dolor: ["duele", "dolor", "doloroso"],
  botox: ["botox", "toxina"]
};

function detectarIntencion(texto) {
  const t = normalizar(texto);
  if (INTENCIONES.explicacion.some(x => t.includes(x))) return "explicacion";
  if (INTENCIONES.precio.some(x => t.includes(x))) return "precio";
  if (INTENCIONES.sesiones.some(x => t.includes(x))) return "sesiones";
  if (INTENCIONES.dolor.some(x => t.includes(x))) return "dolor";
  if (INTENCIONES.botox.some(x => t.includes(x))) return "botox";
  return null;
}

// =============== RESPUESTAS ===============
function capital(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function responderExplicacion(plan) {
  if (EXPLICACION_PLAN[plan]) {
    return EXPLICACION_PLAN[plan] + "\n\nAgenda aquí:\n" + LINK;
  }
  return "Necesito saber la zona. ¿Qué deseas trabajar?";
}

function responderPrecio(plan) {
  const p = PRECIOS[plan];
  if (p) {
    return "El plan " + capital(plan) + " parte desde $" + p.toLocaleString("es-CL") + ".\n\nAgenda aquí:\n" + LINK;
  }
  return "Los valores se definen según tu caso. Agenda aquí:\n" + LINK;
}

function responderSesiones(plan) {
  const s = SESIONES[plan];
  if (s) {
    return "El plan " + capital(plan) + " suele requerir " + s + ".\n\nAgenda aquí:\n" + LINK;
  }
  return "La cantidad depende de tu diagnóstico. Agenda aquí:\n" + LINK;
}

function responderDolor() {
  return "No duele. Puedes sentir calor, vacío o contracciones intensas según el plan.\n\nAgenda aquí:\n" + LINK;
}

function responderBotox() {
  return "Sí, trabajamos toxina cuando corresponde. La indicación es médica.\n\nAgenda aquí:\n" + LINK;
}

// =============== SALUDO Y DESPEDIDA ===============
function esSaludoInicial(texto) {
  const t = normalizar(texto);
  return t === "hola" || t === "buenas" || t === "buenas tardes" || t === "buenas noches" || t === "buen dia";
}

function respuestaSaludo() {
  return "💙 Soy Zara de Body Elite.\n\nCuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, papada, piernas, brazos o depilación.";
}

function despedidaSiCorresponde(texto, mem) {
  const t = normalizar(texto);
  const gracias = ["gracias", "vale", "perfecto", "ok gracias", "muchas gracias", "super", "súper", "ya gracias"];
  if (gracias.some(x => t.includes(x)) && !mem.numero_pendiente && !mem.llamada_ofrecida) {
    return "💙 Me alegra ayudarte.\nAquí tienes tu diagnóstico gratuito:\n" + LINK;
  }
  return null;
}

// =============== LLAMADAS ===============
function manejarFlujoLlamada(texto, mem) {
  const t = normalizar(texto);

  const confirma = ["si", "sí", "ok", "dale", "llamame", "llámame", "quiero llamada"];

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

// =============== ANTI-REPETICIÓN ===============
function mensajeRepetido(texto, mem) {
  const t = normalizar(texto);
  if (mem.ultima_interaccion === t) return true;
  mem.ultima_interaccion = t;
  return false;
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
    return "💙 Te entiendo. ¿Quieres el link nuevamente para revisar tu caso con calma?";
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

  const intencion = detectarIntencion(texto);

  const llamada = manejarFlujoLlamada(texto, mem);
  if (llamada) {
    guardarMemoria();
    return llamada;
  }

  const despedida = despedidaSiCorresponde(texto, mem);
  if (despedida) {
    guardarMemoria();
    return despedida;
  }

  let respuesta = "";

  if (intencion === "explicacion" && plan) respuesta = responderExplicacion(plan);
  else if (intencion === "precio" && plan) respuesta = responderPrecio(plan);
  else if (intencion === "sesiones" && plan) respuesta = responderSesiones(plan);
  else if (intencion === "dolor") respuesta = responderDolor();
  else if (intencion === "botox") respuesta = responderBotox();
  else if (plan) respuesta = responderExplicacion(plan);
  else {
    guardarMemoria();
    return "💙 Para ayudarte necesito saber qué zona deseas trabajar: abdomen, glúteos, rostro, papada, piernas, brazos o depilación.";
  }

  mem.links_enviados += 1;

  if (mem.links_enviados >= 3 && !mem.llamada_ofrecida) {
    mem.llamada_ofrecida = true;
    respuesta += "\n\nSi prefieres, podemos llamarte en horario laboral. ¿Te gustaría?";
  }

  guardarMemoria();
  return respuesta;
}
