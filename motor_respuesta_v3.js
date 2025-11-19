/* ============================================================
   MOTOR DE RESPUESTA ZARA v3 – FINAL ESTABLE
   Compatible con Zara 2.1 (IG + WSP)
   Incluye:
   - Detección de campaña por mensaje inicial
   - Memoria de campaña activa
   - Explicaciones específicas por plan
   - Precios por plan
   - "En qué consiste" según campaña/intent
   - Agenda + contador + llamado automático
   - Respuestas cortas optimizadas para WhatsApp
   ============================================================ */

import fs from "fs";
import path from "path";
import { sendMessage } from "./sendMessage.js";

/* ============================================================
                      MEMORIA USUARIOS
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
                      LINK AGENDA
============================================================ */
const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* ============================================================
                      HELPERS
============================================================ */
function n(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function registrarIntento(numero) {
  if (!memoria[numero])
    memoria[numero] = { agendas: 0, campaña: null, ultimoIntent: null };
  memoria[numero].agendas += 1;
  guardarMemoria();
}

function necesitaLlamado(numero) {
  return memoria[numero] && memoria[numero].agendas >= 3;
}

async function notificar(numeroCliente, ultimoMensaje) {
  const msg = `📣 Solicitud de llamado.\n• Número: ${numeroCliente}\n• Último mensaje: ${ultimoMensaje}`;
  await sendMessage("+56983300262", msg, "whatsapp");
  await sendMessage("+56937648536", msg, "whatsapp");
}

/* ============================================================
                  PLANES (DESCRIPCIÓN + PRECIOS)
============================================================ */

const PLANES = {
  pushup: {
    nombre: "Push Up",
    precio: 376000,
    descripcion: `🍑 *Push Up*
Levanta, afirma y da volumen combinando:
• Pro Sculpt (20.000 contracciones/sesión)
• HIFU 12D para firmeza profunda
• Radiofrecuencia para compactar tejido

✨ Glúteo más firme y proyectado sin cirugía.`,
  },

  lipoexpress: {
    nombre: "Lipo Express",
    precio: 432000,
    descripcion: `🔥 *Lipo Express*  
Trabaja abdomen, cintura y espalda usando:
• HIFU 12D (grasa profunda)  
• Cavitación (rompe adipocitos)  
• Radiofrecuencia (compacta y define)

✨ Reducción visible desde semanas.`,
  },

  liporeductiva: {
    nombre: "Lipo Reductiva",
    precio: 480000,
    descripcion: `🔥 *Lipo Reductiva*  
• HIFU 12D  
• Cavitación  
• Radiofrecuencia profunda  

✨ Reduce volumen y define cintura.`,
  },

  bodytensor: {
    nombre: "Body Tensor",
    precio: 232000,
    descripcion: `✨ *Body Tensor*
Radiofrecuencia profunda + tensado dérmico.
Ideal para flacidez en abdomen, brazos, piernas o papada.`,
  },

  bodyfitness: {
    nombre: "Body Fitness",
    precio: 360000,
    descripcion: `🔥 *Body Fitness*
Tonificación con:
• EMS Sculptor (20.000 contracciones)
• RF compactante (según diagnóstico)

✨ Firmeza y tono real.`,
  },

  depilacion: {
    nombre: "Depilación Láser DL900",
    precio: null,
    descripcion: `⚡ *Depilación DL900*
Láser diodo original Body Elite.
Rápido, seguro y eficaz desde la raíz.`,
  },
};

/* ============================================================
                  DETECTAR INTENT POR TEXTO
============================================================ */

function detectarIntent(texto) {
  const t = n(texto);

  if (t.includes("poto") || t.includes("glute") || t.includes("push"))
    return "pushup";
  if (t.includes("lipo express") || t.includes("abdomen"))
    return "lipoexpress";
  if (t.includes("reductiva")) return "liporeductiva";
  if (t.includes("tensor") || t.includes("flacidez")) return "bodytensor";
  if (t.includes("fitness")) return "bodyfitness";
  if (t.includes("depi") || t.includes("laser")) return "depilacion";

  return null;
}

/* ============================================================
              DETECTAR CAMPAÑA POR MENSAJE INICIAL
============================================================ */

function detectarCampañaInicial(texto) {
  const t = n(texto);

  const campañas = {
    pushup: ["push up", "pushup"],
    lipoexpress: ["lipo express"],
    liporeductiva: ["lipo reductiva"],
    bodyfitness: ["body fitness"],
    bodytensor: ["body tensor"],
    depilacion: [
      "depilacion",
      "depilación full",
      "depilación summer elite",
      "depilacion inicia",
    ],
  };

  for (const key in campañas) {
    for (const frase of campañas[key]) {
      if (t.startsWith(n(frase))) return key;
    }
  }

  return null;
}

/* ============================================================
                    SALUDOS IG / WSP
============================================================ */

function saludoIG() {
  return `💙 ¡Hola! Soy Zara de Body Elite. ¿Qué zona te gustaría mejorar? abdomen, glúteos, rostro, piernas o depilación ✨`;
}

function saludoWSP() {
  return `💙 ¡Hola! Soy Zara de Body Elite. ¿Qué zona deseas trabajar? abdomen, glúteos, rostro, piernas o depilación.`;
}

/* ============================================================
                  RESPUESTAS “CÓMO FUNCIONA”
============================================================ */
function respuestaComoFunciona(intent) {
  if (!PLANES[intent]) return null;
  return PLANES[intent].descripcion;
}

/* ============================================================
                    PROCESAR MENSAJE
============================================================ */

export async function procesarMensaje(texto, numero, plataforma = "whatsapp") {
  const t = n(texto);
  const esIG = plataforma === "instagram";

  if (!memoria[numero])
    memoria[numero] = { agendas: 0, campaña: null, ultimoIntent: null };

  /* ----------------- DETECCIÓN DE CAMPAÑA AL INICIO ----------------- */
  if (!memoria[numero].campaña) {
    const camp = detectarCampañaInicial(texto);
    if (camp) {
      memoria[numero].campaña = camp;
      memoria[numero].ultimoIntent = camp;
      guardarMemoria();

      return `${PLANES[camp].descripcion}\n\n💙 Agenda tu diagnóstico gratuito aquí:\n${LINK}`;
    }
  }

  /* ----------------- SALUDOS ----------------- */
  if (
    t.startsWith("hola") ||
    t.startsWith("holi") ||
    t.startsWith("buenas") ||
    t.startsWith("oye")
  ) {
    return esIG ? saludoIG() : saludoWSP();
  }

  /* ----------------- INTENT DIRECTO ----------------- */
  const intent = detectarIntent(texto);
  if (intent) {
    memoria[numero].ultimoIntent = intent;
    memoria[numero].campaña = intent;
    registrarIntento(numero);

    let msg = `${PLANES[intent].descripcion}\n\n💙 Agenda aquí:\n${LINK}`;

    if (necesitaLlamado(numero))
      msg += `\n\n📞 ¿Deseas que una profesional te llame?`;

    return msg;
  }

  /* ----------------- CÓMO FUNCIONA / EN QUÉ CONSISTE ----------------- */
  if (
    t.includes("como funciona") ||
    t.includes("en que consiste") ||
    t.includes("que incluye") ||
    t.includes("de que se trata") ||
    t.includes("como es")
  ) {
    registrarIntento(numero);

    const base = memoria[numero].campaña || memoria[numero].ultimoIntent;

    if (base && PLANES[base]) {
      let msg = `${PLANES[base].descripcion}\n\n💙 Agenda tu diagnóstico aquí:\n${LINK}`;

      if (necesitaLlamado(numero))
        msg += `\n\n📞 ¿Quieres que una profesional te llame?`;

      return msg;
    }

    return (
      `✨ Trabajamos con: HIFU 12D, Cavitación, Radiofrecuencia, EMS Sculptor, Pink Glow, Exosomas, Lipolítico facial y Láser DL900.\n\n` +
      `💙 Agenda aquí:\n${LINK}`
    );
  }

  /* ----------------- PRECIOS ----------------- */
  if (t.includes("precio") || t.includes("cuanto vale") || t.includes("valor")) {
    const base = memoria[numero].campaña || memoria[numero].ultimoIntent;

    if (base && PLANES[base]) {
      let textoPrecio =
        PLANES[base].precio !== null
          ? `El valor del plan *${PLANES[base].nombre}* es *$${PLANES[
              base
            ].precio.toLocaleString("es-CL")}*.`
          : `El valor depende de la zona a tratar.`;

      return `${textoPrecio}\n\n💙 Puedes agendar tu diagnóstico gratuito aquí:\n${LINK}`;
    }

    return `Los valores dependen de la zona y el plan. 💙 Agenda tu diagnóstico gratuito aquí:\n${LINK}`;
  }

  /* ----------------- PEDIR LLAMADA ----------------- */
  if (
    t.includes("llamen") ||
    t.includes("llamada") ||
    t.includes("quiero que me llamen")
  ) {
    await notificar(numero, texto);
    return `Perfecto 💛 Una profesional te contactará pronto.`;
  }

  /* ----------------- ENTREGA DE NÚMERO ----------------- */
  if (t.includes("+56")) {
    await notificar(texto, texto);
    return `Perfecto 💛 Pasé tu número a una profesional.`;
  }

  /* ----------------- FALLBACK ----------------- */
  return `💙 Cuéntame, ¿qué objetivo quieres trabajar? reducción, firmeza, volumen, arrugas o depilación.`;
}
