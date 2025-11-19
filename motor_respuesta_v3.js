/* ============================================================
   MOTOR DE RESPUESTA ZARA v3 – MASTER BODY ELITE (IG Friendly)
   Compatible con Zara 2.1 (IG + WSP)
   - Detecta zona/problema clínico
   - Plan principal + alternativa automática
   - Textos cortos IG-friendly
   - Campañas
   - Memoria por cliente
   - Agenda + contador + llamado
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
   HELPERS
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
  const msg = `📣 Solicitud de llamado\n• ${numeroCliente}\n• Último mensaje: ${ultimoMensaje}`;
  await sendMessage("+56983300262", msg, "whatsapp");
  await sendMessage("+56937648536", msg, "whatsapp");
}

/* ============================================================
   SELECCIÓN CLÍNICA: PLAN PRINCIPAL + ALTERNATIVA
============================================================ */

function seleccionarPlan(texto) {
  const t = n(texto);

  /* ---------------- ABDOMEN ---------------- */
  if (
    t.includes("guata") ||
    t.includes("abdomen") ||
    t.includes("cintura") ||
    t.includes("rebaje") ||
    t.includes("rollo") ||
    t.includes("llanta") ||
    t.includes("bajar")
  ) {
    // principal
    const principal = {
      nombre: "Lipo Express",
      precio: 432000,
      desc:
        "Reduce abdomen, cintura y espalda con HIFU 12D + cavitación + RF.",
    };

    // alternativa clínica
    let alternativa = { nombre: "Lipo Reductiva", precio: 480000 };
    if (t.includes("rollo chico") || t.includes("pequeño"))
      alternativa = { nombre: "Lipo Focalizada Reductiva", precio: 348800 };
    if (t.includes("flacidez"))
      alternativa = { nombre: "Lipo Body Elite", precio: 664000 };

    return { principal, alternativa };
  }

  /* ---------------- ARRUGAS / ROSTRO ---------------- */
  if (
    t.includes("arruga") ||
    t.includes("linea") ||
    t.includes("frente") ||
    t.includes("ceño") ||
    t.includes("pata de gallo") ||
    t.includes("ojera") ||
    t.includes("bolsa")
  ) {
    const principal = {
      nombre: "Face Antiage",
      precio: 281600,
      desc: "Reduce líneas, frente, ceño y patas de gallo con HIFU 12D + RF.",
    };
    const alternativa = {
      nombre: "Face Elite",
      precio: 358400,
      desc: "",
    };

    return { principal, alternativa };
  }

  /* ---------------- PAPADA ---------------- */
  if (t.includes("papada") || t.includes("menton")) {
    const principal = {
      nombre: "Face Papada",
      precio: null,
      desc: "Reducción + tensado del contorno con HIFU 12D/RF.",
    };

    // alternativa elegida por criterio clínico según grasa
    let alternativa = { nombre: "Lipolítico Facial", precio: null };

    if (t.includes("flacidez"))
      alternativa = { nombre: "Face Elite", precio: 358400 };

    return { principal, alternativa };
  }

  /* ---------------- GLÚTEOS ---------------- */
  if (
    t.includes("glute") ||
    t.includes("poto") ||
    t.includes("volumen") ||
    t.includes("trasero")
  ) {
    const principal = {
      nombre: "Push Up",
      precio: 376000,
      desc: "Volumen + proyección con ProSculpt + HIFU 12D.",
    };

    const alternativa = {
      nombre: "Body Fitness",
      precio: 360000,
      desc: "",
    };

    return { principal, alternativa };
  }

  /* ---------------- PIERNAS / BRAZOS ---------------- */
  if (
    t.includes("pierna") ||
    t.includes("brazo") ||
    t.includes("muslo") ||
    t.includes("flacidez")
  ) {
    const principal = {
      nombre: "Body Tensor",
      precio: 232000,
      desc: "RF profunda para firmeza en piernas/brazos.",
    };

    const alternativa = {
      nombre: "Body Fitness",
      precio: 360000,
    };

    return { principal, alternativa };
  }

  /* ---------------- DEPILACIÓN ---------------- */
  if (t.includes("depi") || t.includes("laser") || t.includes("vello")) {
    const principal = {
      nombre: "Depilación Full (DL900)",
      precio: 259200,
      desc: "Láser diodo de alta potencia DL900.",
    };
    const alternativa = {
      nombre: "Depilación Zona Mediana",
      precio: 240000,
    };

    return { principal, alternativa };
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
  return `💙 ¡Hola! Soy Zara. ¿Qué zona deseas trabajar? abdomen, glúteos, rostro o depilación.`;
}

/* ============================================================
   PROCESAR MENSAJE
============================================================ */

export async function procesarMensaje(texto, numero, plataforma) {
  const t = n(texto);
  const esIG = plataforma === "instagram";

  if (!memoria[numero]) memoria[numero] = { agendas: 0, campaña: null };

  /* SALUDOS */
  if (
    t.startsWith("hola") ||
    t.startsWith("holi") ||
    t.includes("buenas") ||
    t === "hi"
  ) {
    return esIG ? saludoIG() : saludoWSP();
  }

  /* ZONA / PROBLEMA → PLAN PRINCIPAL + ALTERNATIVA */
  const plan = seleccionarPlan(texto);
  if (plan) {
    const p = plan.principal;
    memoria[numero].ultimoPlan = p.nombre;
    guardarMemoria();
    memoria[numero].ultimoPlan = p.nombre;
    guardarMemoria();
    const a = plan.alternativa;

    let msg = `✨ El plan más recomendado es **${p.nombre}**.\n${p.desc ? p.desc + "\n" : ""}`;

    msg += `\nComo alternativa, también puede aplicar **${a.nombre}**.`;

    msg += `\n\n💙 En tu evaluación definimos cuál se ajusta mejor a tus necesidades.`;
    msg += `\nAgenda aquí tu diagnóstico gratuito:\n${LINK}`;
    return msg;
  }

  /* PREGUNTA POR PRECIO */
    if (memoria[numero] && memoria[numero].ultimoPlan) {
      const plan = memoria[numero].ultimoPlan.toLowerCase();
      const preciosDesde = {
        "lipo express": "$432.000",
        "lipo reductiva": "$480.000",
        "lipo focalizada reductiva": "$348.800",
        "lipo body elite": "$664.000",
        "face antiage": "$281.600",
        "face elite": "$358.400",
        "face papada": "según diagnóstico",
        "lipolítico facial": "según diagnóstico",
        "push up": "$376.000",
        "body tensor": "$232.000",
        "body fitness": "$360.000",
        "depilación full (dl900)": "$259.200"
      };
      if (preciosDesde[plan]) {
        return "El plan **" + memoria[numero].ultimoPlan + "** parte desde **" + preciosDesde[plan] + "** 💙\nAgenda aquí tu diagnóstico:\n" + LINK;
      }
    }
  if (t.includes("precio") || t.includes("valor") || t.includes("cuanto vale")) {
    return `Los valores dependen del plan y la zona ✨\nAgenda tu diagnóstico para ver tu caso:\n${LINK}`;
  }

  /* LLAMADO */
  if (t.includes("llamar") || t.includes("llamen")) {
    await notificar(numero, texto);
    return `Perfecto 💛 Una profesional te llamará pronto.`;
  }

  if (t.includes("+56")) {
    await notificar(numero, texto);
    return `Perfecto 💙 Ya envié tu número a una profesional.`;
  }

  /* FALLBACK */
  return `💙 Cuéntame qué deseas mejorar: abdomen, glúteos, rostro o depilación.`;
}
