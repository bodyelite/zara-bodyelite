// motor_respuesta_v3.js FINAL LIMPIO
// Zara Body Elite v3.5 – Motor refinado completo

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

// =============== CTA ===============
const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";
const CTA = () => `Reserva ahora:
${LINK}`;

// =============== PLANES ===============
const PLANES = {
  "lipo express": {
    precio: 432000,
    sesiones: "6–8 sesiones",
    explicacion:
      "Reduce grasa de abdomen, cintura y espalda con HIFU 12D + cavitación + radiofrecuencia compactante.",
  },
  "push up": {
    precio: 376000,
    sesiones: "6–8 sesiones",
    explicacion:
      "Levanta, afirma y proyecta glúteos con Pro Sculpt + HIFU 12D.",
  },
  "body fitness": {
    precio: 360000,
    sesiones: "6 sesiones",
    explicacion:
      "Tonifica piernas y glúteos con Pro Sculpt + radiofrecuencia compactante.",
  },
  "body tensor": {
    precio: 232000,
    sesiones: "6 sesiones",
    explicacion:
      "Tensa brazos y piernas con RF profunda + compactación.",
  },
  "face antiage": {
    precio: 281600,
    sesiones: "6 sesiones",
    explicacion: "Reafirma y suaviza arrugas con HIFU 12D + radiofrecuencia.",
  },
  "face papada": {
    precio: 313600,
    sesiones: "6 sesiones",
    explicacion: "Reduce grasa submentoniana con HIFU 12D.",
  },
  depilacion: {
    precio: 259200,
    sesiones: "6 sesiones",
    explicacion:
      "Depilación láser DL900, alta potencia y apto para vello fino y rubio claro.",
  },
};

// =============== DETECCIÓN ===============
const ZONAS = {
  abdomen: ["abdomen", "guata", "panza", "rollo", "cintura", "espalda"],
  gluteos: ["gluteo", "glúteo", "poto", "nalgas", "push up"],
  papada: ["papada", "menton"],
  arrugas: ["arrugas", "patas de gallo", "frente", "entrecejo"],
  piernas: ["piernas", "muslos"],
  brazos: ["brazos", "alas"],
  depilacion: ["pelos", "vello", "depilacion", "laser"],
};

function norm(t) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function detectarZona(t) {
  t = norm(t);
  if (ZONAS.abdomen.some((x) => t.includes(x))) return "lipo express";
  if (ZONAS.gluteos.some((x) => t.includes(x))) return "push up";
  if (ZONAS.papada.some((x) => t.includes(x))) return "face papada";
  if (ZONAS.arrugas.some((x) => t.includes(x))) return "face antiage";
  if (ZONAS.piernas.some((x) => t.includes(x))) return "body tensor";
  if (ZONAS.brazos.some((x) => t.includes(x))) return "body tensor";
  if (ZONAS.depilacion.some((x) => t.includes(x))) return "depilacion";
  return null;
}

function detectarCampania(t) {
  t = norm(t);
  return Object.keys(PLANES).find((p) => t.includes(p)) || null;
}

const INTENCIONES = {
  explicacion: ["en que consiste", "como funciona", "que es"],
  precio: ["precio", "valor", "cuanto vale", "cuanto cuesta"],
  sesiones: ["cuantas sesiones", "duracion", "cuanto dura"],
  dolor: ["duele", "dolor"],
};

function detectarIntencion(t) {
  t = norm(t);
  for (const key in INTENCIONES) {
    if (INTENCIONES[key].some((x) => t.includes(x))) return key;
  }
  return null;
}

// =============== ANTI-REPETICION ===============
function repetido(texto, mem) {
  const t = norm(texto);
  if (mem.ultima === t) return true;
  mem.ultima = t;
  return false;
}

// =============== LLAMADA ===============
function manejarLlamada(texto, mem) {
  const t = norm(texto);

  if (mem.pidiendo_numero) {
    const n =
      texto.match(/(\+?56\s?9\s?\d{4}\s?\d{4})/) ||
      texto.match(/(9\d{7,8})/);

    if (n) {
      const numero = n[0].replace(/\s+/g, "");
      sendMessage("+56983300262", "Solicitud de llamada: " + numero);
      sendMessage("+56937648536", "Solicitud de llamada: " + numero);
      mem.pidiendo_numero = false;
      guardarMemoria();
      return "Perfecto. Te llamaremos en horario laboral.";
    }
  }

  if (mem.ofrecer_llamada) {
    if (["si", "sí", "dale", "ok", "llamame"].some((x) => t.includes(x))) {
      mem.pidiendo_numero = true;
      guardarMemoria();
      return "¿Me compartes tu número?";
    }
  }

  return null;
}

// =============== SALUDO ===============
function esSaludo(t) {
  return ["hola", "hola!", "buenas", "holaa"].includes(norm(t));
}

function saludo() {
  return (
    "💙 Soy Zara de Body Elite.

¿En qué zona quieres trabajar? abdomen, glúteos, rostro, papada, piernas, brazos o depilación."
  );
}

// =============== RESPUESTAS ===============
function rExp(plan) {
  return PLANES[plan].explicacion + "

" + CTA();
}
function rPrecio(plan) {
  return (
    "El plan parte desde $" +
    PLANES[plan].precio.toLocaleString("es-CL") +
    ".

" +
    CTA()
  );
}
function rSesiones(plan) {
  return "Generalmente requiere " + PLANES[plan].sesiones + ".

" + CTA();
}
function rDolor() {
  return "No duele, solo se siente calor o vibración según la tecnología.

" + CTA();
}

// =============== MOTOR PRINCIPAL ===============
export function procesarMensaje(texto, numero) {
  if (!memoria[numero]) {
    memoria[numero] = {
      ultima: null,
      plan: null,
      links: 0,
      ofrecer_llamada: false,
      pidiendo_numero: false,
    };
  }

  const mem = memoria[numero];

  if (repetido(texto, mem)) {
    guardarMemoria();
    return "💙 Te entiendo.
¿Quieres el link nuevamente?";
  }

  if (!mem.plan && esSaludo(texto)) {
    guardarMemoria();
    return saludo();
  }

  let plan =
    detectarCampania(texto) || detectarZona(texto) || mem.plan;

  if (plan) mem.plan = plan;

  const llamada = manejarLlamada(texto, mem);
  if (llamada) {
    guardarMemoria();
    return llamada;
  }

  const intencion = detectarIntencion(texto);

  let r = "";

  if (plan) {
    if (intencion === "explicacion") r = rExp(plan);
    else if (intencion === "precio") r = rPrecio(plan);
    else if (intencion === "sesiones") r = rSesiones(plan);
    else if (intencion === "dolor") r = rDolor();
    else r = rExp(plan);
  } else {
    guardarMemoria();
    return "💙 Para ayudarte mejor, dime la zona que deseas trabajar.";
  }

  mem.links += 1;

  if (mem.links >= 3 && !mem.ofrecer_llamada) {
    mem.ofrecer_llamada = true;
    r += "

Si prefieres, puedo llamarte. ¿Quieres que te llame?";
  }

  guardarMemoria();
  return r;
}
