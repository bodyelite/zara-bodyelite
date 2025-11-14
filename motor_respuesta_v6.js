// motor_respuesta_v6.js
// Versión emocional segura (sin botones), 100% compatible con tu server.js

import { diccionario } from "./base_conocimiento.js";
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
    "nalgas","pompis","pompas","booty"
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
   DETECTAR ZONA
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
   INTENTS ESPECÍFICOS
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
   DETECT INTENT GENERAL
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

  if (t.includes("firmeza"))
    return { tipo: "objetivo", objetivo: "tonificar" };

  for (const obj in diccionario.objetivos)
    for (const k of diccionario.objetivos[obj])
      if (t.includes(k)) return { tipo: "objetivo", objetivo: obj };

  return null;
}

/* -----------------------------------------------
   LINK AGENDA (texto seguro, no botón)
------------------------------------------------- */
const txtAgenda =
  "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* -----------------------------------------------
   RESPUESTAS HUMANAS
------------------------------------------------- */

function saludoInicial() {
  return (
    "Hola! Soy Zara ✨🤍 del equipo Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión sin presiones y con total honestidad clínica.\n\n" +
    "Cuéntame, ¿qué zona o tratamiento quieres mejorar?"
  );
}

function rDolor() {
  return (
    "No te preocupes 🙈🤍. Nuestros tratamientos **no duelen**, se sienten como un calor suave o contracciones ligeras.\n\n" +
    txtAgenda
  );
}

function rPrecioJustificacion() {
  return (
    "Te entiendo totalmente 🤍. Los precios dependen de la tecnología (HIFU 12D, cavitación, RF o Pro Sculpt) y del objetivo que buscas.\n\n" +
    "Siempre ajustamos el plan a tu caso, sin sesiones de más.\n\n" +
    txtAgenda
  );
}

function rEfectividad() {
  return (
    "Sí, funciona súper bien 🤍✨. HIFU 12D, cavitación, RF y Pro Sculpt dan resultados progresivos incluso desde las primeras sesiones.\n\n" +
    txtAgenda
  );
}

function rResultados() {
  return (
    "Los primeros cambios suelen notarse desde la **primera o segunda sesión** 🌟.\n\n" +
    txtAgenda
  );
}

function rMasInfo() {
  return (
    "Feliz te cuento más 🤍.\n\n" +
    "✨ Cavitación: rompe grasa localizada.\n" +
    "✨ Radiofrecuencia: tensa piel y estimula colágeno.\n" +
    "✨ HIFU 12D: define contorno.\n" +
    "✨ Pro Sculpt: tonifica y levanta.\n\n" +
    txtAgenda
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
      "En papada afinamos contorno y tensamos con HIFU 12D focalizado ✨.",
    patas_de_gallo:
      "En contorno de ojos suavizamos líneas y rejuvenecemos con RF focalizada 🤍.",
    brazos:
      "En brazos trabajamos firmeza, tonificación y tensado con RF profunda + Pro Sculpt 💛.",
    espalda:
      "En espalda reducimos volumen y tensamos piel con cavitación + RF ✨.",
    cintura:
      "En cintura afinamos flancos y contorno con cavitación + RF ❤️."
  };

  return textos[z] || "Podemos trabajar muy bien esa zona 🤍.";
}

function rDepilacion() {
  return (
    "Perfecto 🤍. En depilación láser todos los planes incluyen **6 sesiones** y parten desde **$153.600**.\n\n" +
    "Según las zonas, el valor final se ajusta en tu evaluación gratuita.\n\n" +
    txtAgenda
  );
}

function rPostparto() {
  return (
    "Para postparto trabajamos firmeza, tensado y recuperación de la zona abdominal con RF profunda, HIFU 12D y Pro Sculpt ✨.\n\n" +
    txtAgenda
  );
}

/* -----------------------------------------------
   FALLBACK
------------------------------------------------- */
function fallback() {
  return (
    "Disculpa, no logré interpretar bien tu mensaje 🙈.\n\n" +
    txtAgenda
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
        rZona(intent.zona) + "\n\n" + txtAgenda,
        platform
      );

    case "depilacion":
      return await sendMessage(to, rDepilacion(), platform);

    case "postparto":
      return await sendMessage(to, rPostparto(), platform);

    case "precio":
      return await sendMessage(
        to,
        "Tenemos planes faciales desde $60.000 y corporales desde $232.000 🤍.\n\n" +
          txtAgenda,
        platform
      );

    case "ubicacion":
      return await sendMessage(
        to,
        "Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén**.\n" +
          "Horarios: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00 🤍.",
        platform
      );

    case "consiste":
      return await sendMessage(
        to,
        "Nuestros tratamientos combinan cavitación, RF, HIFU 12D y Pro Sculpt según tu objetivo 🤍.\n\n" +
          txtAgenda,
        platform
      );

    case "objetivo":
      estado.ultimoObjetivo = intent.objetivo;
      return await sendMessage(
        to,
        "Perfecto 🤍. Podemos trabajar ese objetivo con las tecnologías adecuadas.\n\n" +
          txtAgenda,
        platform
      );

    default:
      return await sendMessage(to, fallback(), platform);
  }
}
