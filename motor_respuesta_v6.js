// motor_respuesta_v6.js
// Versión emocional + detección avanzada + botón de agenda
import { diccionario } from "./base_conocimiento.js";
import { sendInteractive } from "./sendInteractive.js";
import { sendMessage } from "./sendMessage.js";

/* -----------------------------------------------
   ESTADO DE CONVERSACIÓN
------------------------------------------------- */
const estado = {
  primeraInteraccion: true,
  ultimaZona: null,
  ultimoObjetivo: null,
  intentosAgenda: 0,
  historial: []
};

/* -----------------------------------------------
   NORMALIZAR TEXTO
------------------------------------------------- */
function normalizar(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñáéíóúü\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* -----------------------------------------------
   ZONAS COLOQUIALES
------------------------------------------------- */
const zonasColoquiales = {
  abdomen: [
    "abdomen","guata","panza","barriga","estomago","rollo","rollitos",
    "flotador","vientre","guaton","guatonera"
  ],
  gluteos: [
    "gluteos","gluteo","trasero","poto","potito","cola","colita","nalga",
    "nalgas","booty","pompis","pompas"
  ],
  muslos: [
    "muslo","muslos","piernas","pierna","entrepierna","muslitos"
  ],
  papada: [
    "papada","papadita","doble menton","bajo el menton"
  ],
  patas_de_gallo: [
    "patas de gallo","arrugas ojos","lineas al reir","arruguitas"
  ],
  brazos: [
    "brazos","brazo","alas de murcielago","bye bye","tricep","triceps"
  ],
  espalda: [
    "espalda","rollos espalda","espalda baja","espalda alta"
  ],
  cintura: [
    "cintura","flancos","costados","llantitas","rollos laterales"
  ]
};

/* -----------------------------------------------
   DETECTAR ZONA COLOQUIAL
------------------------------------------------- */
function detectarZonaColoquial(texto) {
  const t = normalizar(texto);
  for (const zona in zonasColoquiales) {
    for (const palabra of zonasColoquiales[zona]) {
      if (t.includes(palabra)) return zona;
    }
  }
  return null;
}

/* -----------------------------------------------
   NLP INTENTS
------------------------------------------------- */
function intentDolor(t) {
  return (
    t.includes("duele") ||
    t.includes("dolor") ||
    t.includes("asusta") ||
    t.includes("miedo") ||
    t.includes("molesta") ||
    t.includes("arde")
  );
}

function intentPrecioJustificacion(t) {
  return (
    t.includes("caro") ||
    t.includes("costoso") ||
    t.includes("vale la pena") ||
    t.includes("muy caro") ||
    t.includes("por que tan caro")
  );
}

function intentEfectividad(t) {
  return (
    t.includes("funciona") ||
    t.includes("real") ||
    t.includes("sirve") ||
    t.includes("efectivo")
  );
}

function intentResultados(t) {
  return (
    t.includes("cuando se ven") ||
    t.includes("cuando noto") ||
    t.includes("cuanto demora") ||
    t.includes("cuanto se ve") ||
    t.includes("tiempo") ||
    (t.includes("cuanto") && t.includes("resultado"))
  );
}

function intentMasInfo(t) {
  return (
    t.includes("mas informacion") ||
    t.includes("dame mas") ||
    t.includes("cuentame mas") ||
    t.includes("explicame") ||
    t.includes("quiero saber mas") ||
    t.includes("como funciona") ||
    t.includes("como es")
  );
}

/* -----------------------------------------------
   DETECTAR INTENT GENERAL
------------------------------------------------- */
function detectIntent(texto) {
  const t = normalizar(texto);

  if (intentDolor(t)) return { tipo: "dolor" };
  if (intentPrecioJustificacion(t)) return { tipo: "precioJustificacion" };
  if (intentEfectividad(t)) return { tipo: "efectividad" };
  if (intentResultados(t)) return { tipo: "resultados" };
  if (intentMasInfo(t)) return { tipo: "masInfo" };

  const zona = detectarZonaColoquial(t);
  if (zona) return { tipo: "zona", zona };

  if (t.includes("depil")) return { tipo: "depilacion" };

  if (t.includes("postparto") || t.includes("post parto"))
    return { tipo: "postparto" };

  for (const p of diccionario.intents.precio)
    if (t.includes(p)) return { tipo: "precio" };

  for (const u of diccionario.intents.ubicacion)
    if (t.includes(u)) return { tipo: "ubicacion" };

  for (const c of diccionario.intents.consiste)
    if (t.includes(c)) return { tipo: "consiste" };

  if (t.includes("firmeza")) return { tipo: "objetivo", objetivo: "tonificar" };

  for (const obj in diccionario.objetivos)
    for (const k of diccionario.objetivos[obj])
      if (t.includes(k)) return { tipo: "objetivo", objetivo: obj };

  return null;
}

/* -----------------------------------------------
   LINK AGENDA
------------------------------------------------- */
const linkAgenda =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* -----------------------------------------------
   RESPUESTAS HUMANAS
------------------------------------------------- */

function saludoInicial() {
  return (
    "Hola! Soy Zara ✨🤍 del equipo Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión sin presiones, con total honestidad clínica.\n\n" +
    "Cuéntame, ¿qué zona o tratamiento quieres mejorar?"
  );
}

function rDolor() {
  return (
    "No te preocupes 🙈🤍. Nuestros tratamientos **no duelen**. Se siente como un **calorcito suave** o contracciones ligeras.\n\n" +
    "En la evaluación gratuita (40 min) incluso puedes probar cómo se siente.\n" +
    "¿Quieres que te deje una hora?"
  );
}

function rPrecioJustificacion() {
  return (
    "Te entiendo totalmente 🤍. Los valores dependen de la tecnología que usemos (HIFU 12D, cavitación, RF profunda o Pro Sculpt) y del resultado que buscas.\n\n" +
    "Lo bueno es que ajustamos todo a tu caso, sin sesiones de más.\n" +
    "¿Quieres revisar tu plan exacto en tu evaluación gratuita?"
  );
}

function rEfectividad() {
  return (
    "Sí, funciona 🤍✨. HIFU 12D, cavitación, RF y Pro Sculpt tienen resultados progresivos incluso desde las primeras sesiones.\n\n" +
    "En tu evaluación gratuita te mostramos exactamente qué resultado puedes esperar tú.\n" +
    "¿Quieres tu hora?"
  );
}

function rResultados() {
  return (
    "Los primeros cambios suelen notarse desde la **primera o segunda sesión** 🌟.\n\n" +
    "En tu evaluación gratuita (40 min) te damos un tiempo estimado según tu caso.\n" +
    "¿Quieres agendar?"
  );
}

function rMasInfo() {
  return (
    "Feliz te cuento más 🤍.\n\n" +
    "✨ Cavitación: rompe grasa localizada.\n" +
    "✨ RF: tensa piel y estimula colágeno.\n" +
    "✨ HIFU 12D: define contorno.\n" +
    "✨ Pro Sculpt: levanta y tonifica músculo.\n\n" +
    "Todo se combina según tu objetivo real. ¿Quieres avanzar a tu evaluación gratuita?"
  );
}

function rZona(z) {
  const textos = {
    abdomen:
      "En abdomen trabajamos reducción de volumen, contorno y firmeza con HIFU 12D, cavitación y RF 🤍.",
    gluteos:
      "En glúteos logramos levantamiento, forma y firmeza con Pro Sculpt ✨.",
    muslos:
      "En muslos reducimos celulitis, volumen y mejoramos firmeza 🌼.",
    papada:
      "En papada afinamos contorno y tensamos piel con HIFU 12D focalizado ✨.",
    patas_de_gallo:
      "En contorno de ojos suavizamos líneas y rejuvenecemos con RF focalizada 🤍.",
    brazos:
      "En brazos trabajamos firmeza, tonificación y tensado con RF profunda y Pro Sculpt 💛.",
    espalda:
      "En espalda reducimos volumen y tensamos piel con cavitación + RF ✨.",
    cintura:
      "En cintura y flancos afinamos contorno con cavitación y RF ❤️."
  };

  return textos[z] || "Podemos trabajar muy bien esa zona 🤍.";
}

function rDepilacion() {
  return (
    "Perfecto 🤍. En depilación láser trabajamos con equipos seguros y rápidos. Todos los planes incluyen **6 sesiones** y parten desde **$153.600**.\n\n" +
    "En tu evaluación gratuita definimos qué zonas necesitas y ajustamos el valor para no cobrarte de más.\n" +
    "¿Quieres reservar hora?"
  );
}

function rPostparto() {
  return (
    "Para postparto trabajamos firmeza, tensado y recuperación de la zona abdominal con RF profunda, HIFU 12D y Pro Sculpt ✨.\n\n" +
    "En tu evaluación gratuita definimos qué zonas requieren más trabajo y tu plan exacto.\n" +
    "¿Quieres que te deje tu hora?"
  );
}

/* -----------------------------------------------
   AGENDA AUTOMÁTICA
------------------------------------------------- */
async function enviarBoton(to, platform) {
  return await sendInteractive(
    to,
    {
      header: "Reserva tu Evaluación Gratuita 🤍",
      body:
        "La evaluación dura 40 min y una especialista te explica todo según tu caso.",
      button: "📅 Reservar ahora"
    },
    linkAgenda,
    platform
  );
}

/* -----------------------------------------------
   FALLBACK INTELIGENTE
------------------------------------------------- */
function fallback() {
  return (
    "Disculpa, no logré interpretar bien tu mensaje 🙈. " +
    "Pero en tu evaluación gratuita (40 min) una especialista puede explicarte todo paso a paso 🤍.\n" +
    "¿Quieres que te deje una hora?"
  );
}

/* -----------------------------------------------
   PROCESAR MENSAJE PRINCIPAL
------------------------------------------------- */
export async function procesarMensaje(texto, to, platform) {
  const t = normalizar(texto);
  estado.historial.push(t);

  if (estado.primeraInteraccion) {
    estado.primeraInteraccion = false;
    return await sendMessage(to, saludoInicial(), platform);
  }

  const intent = detectIntent(texto);
  if (!intent) return await sendMessage(to, fallback(), platform);

  switch (intent.tipo) {
    case "dolor":
      return await sendMessage(to, rDolor(), platform);

    case "precioJustificacion":
      return await sendMessage(to, rPrecioJustificacion(), platform);

    case "efectividad":
      return await sendMessage(to, rEfectividad(), platform);

    case "resultados":
      return await sendMessage(to, rResultados(), platform);

    case "masInfo":
      return await sendMessage(to, rMasInfo(), platform);

    case "zona":
      estado.ultimaZona = intent.zona;
      return await sendMessage(
        to,
        rZona(intent.zona) +
          "\n\nSi quieres, te dejo tu evaluación gratuita 🤍.\n¿Agendamos?",
        platform
      );

    case "depilacion":
      return await sendMessage(to, rDepilacion(), platform);

    case "postparto":
      return await sendMessage(to, rPostparto(), platform);

    case "precio":
      return await sendMessage(
        to,
        "Nuestros planes parten desde $60.000 en facial y $232.000 en corporal 🤍.\n" +
          "El valor exacto depende de tu objetivo.\n¿Quieres agendar para ver tu plan?",
        platform
      );

    case "ubicacion":
      return await sendMessage(
        to,
        "Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén**.\n" +
          "Lun–Vie 9:30 a 20:00 / Sáb 9:30 a 13:00 🤍.",
        platform
      );

    case "consiste":
      return await sendMessage(
        to,
        "Nuestros tratamientos combinan cavitación, RF, HIFU 12D y Pro Sculpt según tu objetivo 🤍.\n" +
          "En tu evaluación gratuita te explicamos todo paso a paso.\n¿Quieres agendar?",
        platform
      );

    case "objetivo":
      estado.ultimoObjetivo = intent.objetivo;
      return await sendMessage(
        to,
        "Perfecto 🤍. Podemos trabajar ese objetivo con la tecnología adecuada.\n" +
          "Si quieres, te dejo tu hora gratuita para revisar tu plan.",
        platform
      );

    default:
      return await sendMessage(to, fallback(), platform);
  }
}
