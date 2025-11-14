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
   RESPUESTAS HUMANAS EXTENDIDAS (TONO C + HUMOR A)
------------------------------------------------- */

function saludoInicial() {
  return (
    "Hola JC! Soy Zara ✨🤍 del equipo Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión sin presiones, con total honestidad clínica.\n\n" +
    "Cuéntame, ¿qué zona o tratamiento quieres mejorar?"
  );
}

function rDolor() {
  return (
    "No te preocupes 🙈🤍. Nuestros tratamientos **no duelen**. Se siente como un **calorcito suave** o contracciones ligeras, nada molesto.\n\n" +
    "En la evaluación gratuita (40 min) incluso puedes probar cómo se siente, así quedas 100% tranquilo ✨.\n" +
    "¿Quieres que te deje hora?"
  );
}

function rPrecioJustificacion() {
  return (
    "Te entiendo totalmente 🤍. Los valores dependen de la tecnología (HIFU 12D, RF profunda o Pro Sculpt) y del resultado que buscas.\n\n" +
    "Lo bueno es que **no damos sesiones de más**, ajustamos todo a tu caso para que pagues solo lo necesario ✨.\n\n" +
    "Si quieres, revisamos tu objetivo y tu presupuesto en tu evaluación gratuita.\n¿Quieres que te deje la hora?"
  );
}

function rEfectividad() {
  return (
    "Sí, funciona 🤍✨. HIFU 12D, cavitación, RF y Pro Sculpt tienen resultados progresivos incluso desde las primeras sesiones.\n\n" +
    "En la evaluación gratuita te mostramos exactamente qué resultado puedes esperar **tú**, según tu cuerpo.\n" +
    "¿Quieres reservar tu hora?"
  );
}

function rResultados() {
  return (
    "Los primeros cambios suelen notarse desde la **primera o segunda sesión** 🌟.\n\n" +
    "Depende de tu piel, tu objetivo y la zona. En tu evaluación gratuita (40 min) te damos un tiempo estimado honesto.\n" +
    "¿Quieres agendar?"
  );
}

function rMasInfo() {
  return (
    "Feliz te cuento más JC 🤍.\n\n" +
    "✨ **Cavitación:** rompe grasa localizada.\n" +
    "✨ **Radiofrecuencia:** tensa piel y estimula colágeno.\n" +
    "✨ **HIFU 12D:** define contorno y da efecto lifting.\n" +
    "✨ **Pro Sculpt:** tonifica y levanta músculo.\n\n" +
    "Si quieres, en la evaluación gratuita te mostramos cuál se adapta mejor a lo que buscas.\n" +
    "¿Quieres avanzar?"
  );
}

function rZona(z) {
  const textos = {
    abdomen:
      "En abdomen trabajamos reducción de volumen, contorno y firmeza con HIFU 12D, cavitación y RF 🤍.",
    gluteos:
      "En glúteos logramos levantamiento, forma y firmeza con Pro Sculpt ✨.",
    muslos:
      "En muslos reducimos celulitis, mejoramos contorno y firmeza 🌼.",
    papada:
      "En papada afinamos contorno y tensamos con HIFU 12D focalizado ✨.",
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
  estado.ultimaZona = "depilacion";
  return (
    "Perfecto JC 🤍. Trabajamos depilación láser con equipos modernos y seguros. Todos los planes incluyen **6 sesiones** y parten desde **$153.600**.\n\n" +
    "El valor final depende de tus zonas y lo definimos en tu evaluación gratuita.\n" +
    "¿Quieres avanzar?"
  );
}

function rUbicacion() {
  return (
    "Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén** 🤍.\n" +
    "Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.\n" +
    "¿Quieres que vea disponibilidad para tu evaluación?"
  );
}

/* -----------------------------------------------
   BOTÓN DE AGENDA
------------------------------------------------- */
async function enviarBotonAgenda(to, platform) {
  return await sendInteractive(to, platform);
}

/* -----------------------------------------------
   FALLBACK HUMANO
------------------------------------------------- */
function fallbackHumano() {
  estado.intentosAgenda++;

  if (estado.intentosAgenda >= 2) {
    return (
      "Si quieres, uno de nuestros profesionales puede llamarte para aclarar todo 🤍.\n" +
      "¿Quieres dejar tu número?"
    );
  }

  return (
    "Disculpa JC, no logré interpretar bien tu mensaje 🙈. Pero en tu evaluación gratuita (40 min) te explicamos todo paso a paso 🤍.\n" +
    "¿Quieres agendar?"
  );
}

/* -----------------------------------------------
   MOTOR PRINCIPAL
------------------------------------------------- */
export async function procesarMensaje(usuario, texto, plataforma) {
  const t = normalizar(texto);
  estado.historial.push(texto);

  if (estado.primeraInteraccion) {
    estado.primeraInteraccion = false;
    return saludoInicial();
  }

  const intent = detectIntent(t);

  if (!intent) return fallbackHumano();

  estado.intentosAgenda = 0;

  switch (intent.tipo) {
    case "dolor":
      return rDolor();

    case "precioJustificacion":
      return rPrecioJustificacion();

    case "efectividad":
      return rEfectividad();

    case "resultados":
      return rResultados();

    case "masInfo":
      return rMasInfo();

    case "depilacion":
      return rDepilacion();

    case "postparto":
      return (
        "Después del postparto es muy común sentir la zona más suelta 🤍.\n\n" +
        "Usamos HIFU 12D + RF para mejorar firmeza y contorno, siempre según tu caso.\n" +
        "¿Quieres avanzar?"
      );

    case "ubicacion":
      return rUbicacion();

    case "consiste":
      return (
        "Usamos HIFU 12D, cavitación, RF o Pro Sculpt según lo que quieras lograr 🤍.\n\n" +
        "Si quieres, puedo mostrarte la opción exacta. ¿Quieres ver tu evaluación gratuita?"
      );

    case "zona":
      estado.ultimaZona = intent.zona;
      return rZona(intent.zona) + "";

    case "precio":
      return await enviarBotonAgenda(usuario, plataforma);

    case "objetivo":
      estado.ultimoObjetivo = intent.objetivo;
      return (
        `Perfecto JC 🤍. Podemos trabajar ` +
        intent.objetivo +
        " según tu punto de partida.\n" +
        "¿Quieres avanzar?"
      );

    default:
      return fallbackHumano();
  }
}
