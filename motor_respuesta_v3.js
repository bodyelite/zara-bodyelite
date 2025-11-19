/* ============================================================
   MOTOR DE RESPUESTA ZARA v3 – MASTER BODY ELITE
   Compatible con Zara 2.1
   Incluye:
   - Todos los tratamientos corporales
   - Todos los faciales
   - Depilación DL900 completa
   - Sinónimos reales
   - Listado de planes por zona (Opción B)
   - Campañas
   - Flujo agenda + contador + llamado
   - IG + WhatsApp
   - Emojis mínimos
   ============================================================ */

import fs from "fs";
import path from "path";
import { sendMessage } from "./sendMessage.js";

/* ============================================================
   MEMORIA
============================================================ */
const memoriaPath = path.join(process.cwd(), "memoria_usuarios.json");
let memoria = {};
try {
  memoria = JSON.parse(fs.readFileSync(memoriaPath, "utf8"));
} catch (e) {
  memoria = {};
}
function guardarMemoria() {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}

/* ============================================================
   HELPER
============================================================ */
function n(t) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

function registrarIntento(numero) {
  if (!memoria[numero]) memoria[numero] = { agendas: 0, campaña: null };
  memoria[numero].agendas++;
  guardarMemoria();
}
function necesitaLlamado(numero) {
  return memoria[numero] && memoria[numero].agendas >= 3;
}

async function notificar(numeroCliente, ultimoMensaje) {
  const msg = `📣 Solicitud de llamado:\n• Número: ${numeroCliente}\n• Último mensaje: ${ultimoMensaje}`;
  await sendMessage("+56983300262", msg, "whatsapp");
  await sendMessage("+56937648536", msg, "whatsapp");
}

/* ============================================================
   LISTADO COMPLETO DE PLANES
============================================================ */

const PLANES_FACIALES = [
  {
    nombre: "Limpieza Facial Full",
    precio: 120000,
    aplica: ["limpieza", "poros", "espinillas", "acné"],
    desc: "Limpieza profunda + extracción + aparatología suave. ✨"
  },
  {
    nombre: "RF Facial",
    precio: 60000,
    aplica: ["flacidez", "contorno", "pómulos"],
    desc: "Radiofrecuencia para tensado y firmeza facial."
  },
  {
    nombre: "Face Light",
    precio: 128800,
    aplica: ["manchas", "luminosidad", "tono"],
    desc: "Luz, brillo y tono parejo."
  },
  {
    nombre: "Face Smart",
    precio: 198400,
    aplica: ["primeras arrugas", "textura", "rejuvenecer"],
    desc: "Plan integral suave + aparatología combinada."
  },
  {
    nombre: "Face Inicia",
    precio: 270400,
    aplica: ["rejuvenecer", "primeras líneas", "tono"],
    desc: "Mejora textura, tono y líneas finas."
  },
  {
    nombre: "Face Antiage",
    precio: 281600,
    aplica: ["arrugas", "líneas", "frente", "patas de gallo", "ceño"],
    desc: "Rejuvenecimiento profundo para arrugas. ✨"
  },
  {
    nombre: "Face Elite",
    precio: 358400,
    aplica: ["arrugas", "flacidez facial", "contorno", "lifting"],
    desc: "Lifting no quirúrgico + firmeza avanzada."
  },
  {
    nombre: "Full Face",
    precio: 584000,
    aplica: ["todo el rostro", "resultado global"],
    desc: "Plan completo para firmeza, arrugas y textura."
  },
  {
    nombre: "Face Papada",
    precio: null,
    aplica: ["papada", "contorno", "debajo del mentón"],
    desc: "Reducción de papada + tensado profundo."
  },
  {
    nombre: "Face One",
    precio: null,
    aplica: ["tono", "arrugas", "líneas", "lifting"],
    desc: "Tratamiento focal + rejuvenecimiento exprés."
  },
  {
    nombre: "Face H12",
    precio: null,
    aplica: ["lifting", "firmeza profunda"],
    desc: "HIFU 12D específico para rostro."
  },
];

const PLANES_CORPORALES = [
  {
    nombre: "Lipo Focalizada Reductiva",
    precio: 348800,
    aplica: ["abdomen", "cintura", "rollos", "rebaje", "llantas"],
    desc: "HIFU 12D + cavitación para reducir zonas específicas."
  },
  {
    nombre: "Lipo Express",
    precio: 432000,
    aplica: ["abdomen", "cintura", "espalda", "bajar", "rebaje"],
    desc: "Reducción rápida abdomen/cintura/espalda. 🔥"
  },
  {
    nombre: "Lipo Reductiva",
    precio: 480000,
    aplica: ["abdomen", "cintura", "volumen"],
    desc: "HIFU 12D + RF + cavitación para moldeamiento real."
  },
  {
    nombre: "Lipo Body Elite",
    precio: 664000,
    aplica: ["abdomen", "cintura", "espalda completa"],
    desc: "Reducción y moldeamiento premium."
  },
  {
    nombre: "Body Tensor",
    precio: 232000,
    aplica: ["flacidez", "piernas", "brazos", "papada"],
    desc: "RF profunda para firmeza y tensado."
  },
  {
    nombre: "Body Fitness",
    precio: 360000,
    aplica: ["glúteos", "tonificar", "musculo", "piernas"],
    desc: "EMS Sculptor (20.000 contracciones) + RF compactante."
  },
  {
    nombre: "Push Up",
    precio: 376000,
    aplica: ["glúteos", "poto", "volumen"],
    desc: "Volumen + proyección con ProSculpt + HIFU 12D."
  },
];

const PLANES_DEPILACION = [
  { nombre: "Depilación Inicia", precio: 153600, aplica: ["depi", "vello"] },
  { nombre: "Depilación Summer Elite", precio: 192000, aplica: ["depi"] },
  { nombre: "Depilación Zona Pequeña", precio: 192000, aplica: ["depi"] },
  { nombre: "Depilación Midle", precio: 192000, aplica: ["depi"] },
  { nombre: "Depilación Zona Mediana", precio: 240000, aplica: ["depi"] },
  { nombre: "Depilación Full", precio: 259200, aplica: ["depi"] },
  { nombre: "Depilación Zona Grande", precio: 288000, aplica: ["depi"] },
];

/* ============================================================
   DETECCIÓN DE ZONA Y LISTA DE PLANES (OPCIÓN B)
============================================================ */

function planesPorZona(texto) {
  const t = n(texto);

  if (
    t.includes("arruga") ||
    t.includes("linea") ||
    t.includes("frente") ||
    t.includes("ceño") ||
    t.includes("papada") ||
    t.includes("mancha") ||
    t.includes("luminosidad") ||
    t.includes("glow") ||
    t.includes("ojera") ||
    t.includes("bolsa") ||
    t.includes("flacidez facial") ||
    t.includes("rostro") ||
    t.includes("cara")
  ) {
    return PLANES_FACIALES;
  }

  if (
    t.includes("abdomen") ||
    t.includes("cintura") ||
    t.includes("espalda") ||
    t.includes("rollo") ||
    t.includes("rebaje") ||
    t.includes("guata") ||
    t.includes("bajar") ||
    t.includes("piernas") ||
    t.includes("brazos") ||
    t.includes("muslo")
  ) {
    return PLANES_CORPORALES;
  }

  if (t.includes("depi") || t.includes("laser")) {
    return PLANES_DEPILACION;
  }

  if (t.includes("glute") || t.includes("poto") || t.includes("volumen")) {
    return PLANES_CORPORALES.filter((p) =>
      ["Push Up", "Body Fitness"].includes(p.nombre)
    );
  }

  return null;
}

/* ============================================================
   SALUDOS
============================================================ */

function saludoIG() {
  return `💙 ¡Hola! Soy Zara de Body Elite. ¿Qué zona deseas mejorar? abdomen, glúteos, rostro o depilación ✨`;
}
function saludoWSP() {
  return `💙 ¡Hola! Soy Zara. ¿Qué zona quieres trabajar? abdomen, glúteos, rostro o depilación.`;
}

/* ============================================================
   PROCESAR MENSAJE
============================================================ */

export async function procesarMensaje(texto, numero, plataforma) {
  const t = n(texto);
  const esIG = plataforma === "instagram";

  if (!memoria[numero])
    memoria[numero] = { agendas: 0, campaña: null };

  /* 1. Saludos */
  if (
    t.startsWith("hola") ||
    t.startsWith("holi") ||
    t.includes("buenas")
  ) {
    return esIG ? saludoIG() : saludoWSP();
  }

  /* 2. Detección por zona (OPCIÓN B) */
  const lista = planesPorZona(texto);
  if (lista) {
    let msg = `✨ Estos son los planes recomendados:\n`;
    lista.forEach((p) => {
      msg += `\n• *${p.nombre}* – ${p.precio ? "$" + p.precio.toLocaleString("es-CL") : "según zona"}\n  ${p.desc}`;
    });
    msg += `\n\n💙 Agenda tu diagnóstico gratuito aquí:\n${LINK}`;
    return msg;
  }

  /* 3. Precios */
  if (t.includes("precio") || t.includes("cuanto vale")) {
    return `Los valores dependen de la zona y el plan ✨\nAquí puedes agendar tu diagnóstico gratuito:\n${LINK}`;
  }

  /* 4. Llamado */
  if (t.includes("llamar") || t.includes("llamen")) {
    await notificar(numero, texto);
    return `Perfecto 💙 Una profesional te llamará pronto.`;
  }

  /* 5. Entrega de número */
  if (t.includes("+56")) {
    await notificar(numero, texto);
    return `Perfecto 💛 Ya envié tu número a una profesional.`;
  }

  /* 6. Fallback */
  return `💙 Cuéntame qué deseas mejorar: abdomen, glúteos, rostro o depilación.`;
}
