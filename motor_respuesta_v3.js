import { diccionario } from "./base_conocimiento.js";

/* --------------------------------------------------
   ESTADO DEL MOTOR
-------------------------------------------------- */
const estado = {
  primeraInteraccion: true,
  ultimaZona: null,
  ultimoObjetivo: null,
  intentosAgenda: 0
};

/* --------------------------------------------------
   NORMALIZAR TEXTO
-------------------------------------------------- */
function normalizar(txt) {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñáéíóúü\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* --------------------------------------------------
   DICCIONARIO COLOQUIAL
-------------------------------------------------- */
const zonasColoquiales = {
  abdomen: [
    "abdomen","guata","wata","panza","barriga","estomago","rollo","rollitos",
    "flotador","guaton","guatonera","vientre","pansa"
  ],
  gluteos: [
    "gluteo","gluteos","glutea","gluteas","trasero","poto","potito","culo","cola",
    "colita","nalgas","nalga","pompas","pompis","booty","retaguardia"
  ],
  muslos: [
    "muslo","muslos","pierna","piernas","entrepierna","muslitos","piernas gorditas"
  ],
  papada: [
    "papada","papadita","papaga","doble menton","bajo el menton","cuello bajo"
  ],
  patas_de_gallo: [
    "patas de gallo","patas gallo","patas de gallina","arrugas ojos",
    "arrugas en los ojos","lineas al reir","arruguitas ojos","contorno de ojos"
  ],
  brazos: [
    "brazo","brazos","alas de murcielago","bye bye","brazo flacido","brazos caidos",
    "tricep","triceps","brazo suelto","brazo gordito"
  ],
  espalda: [
    "espalda","rollos espalda","gorditos espalda","michelines","rollos atras",
    "espalda baja","espalda alta"
  ],
  cintura: [
    "cintura","flancos","llantitas","rollitos laterales","costados","flotadores",
    "caderas anchas","los lados"
  ]
};

/* --------------------------------------------------
   DETECTAR ZONA COLOQUIAL
-------------------------------------------------- */
function detectarZonaColoquial(texto) {
  const t = normalizar(texto);

  for (const zona in zonasColoquiales) {
    for (const palabra of zonasColoquiales[zona]) {
      if (t.includes(palabra)) {
        console.log("DEBUG: Zona detectada por coloquial →", zona);
        return zona;
      }
    }
  }
  console.log("DEBUG: Zona coloquial NO detectada");
  return null;
}

/* --------------------------------------------------
   MATCHSCORE (respaldo)
-------------------------------------------------- */
const MIN_SCORE = 0.05;

function matchScore(texto) {
  const t = normalizar(texto);
  let puntos = 0;

  for (const palabra of t.split(" ")) {
    if (palabra.length > 4) puntos += 0.05;
  }

  for (const zona in zonasColoquiales) {
    for (const palabra of zonasColoquiales[zona]) {
      if (t.includes(palabra)) puntos += 1;
    }
  }

  console.log("DEBUG: score =", puntos);
  return puntos / 10;
}

/* --------------------------------------------------
   NUEVOS INTENTS HUMANOS
-------------------------------------------------- */
function intentDolor(t) {
  return (
    t.includes("duele") ||
    t.includes("dolor") ||
    t.includes("miedo") ||
    t.includes("asusta") ||
    t.includes("molesta") ||
    t.includes("arde")
  );
}

function intentPrecioJustificacion(t) {
  return (
    t.includes("caro") ||
    t.includes("costoso") ||
    t.includes("por que tan caro") ||
    t.includes("vale la pena") ||
    t.includes("muy caro")
  );
}

function intentEfectividad(t) {
  return (
    t.includes("funciona") ||
    t.includes("real") ||
    t.includes("sirve") ||
    t.includes("de verdad") ||
    t.includes("efectivo") ||
    t.includes("efectividad")
  );
}

function intentResultados(t) {
  return (
    t.includes("cuanto se ven") ||
    t.includes("cuando se ven") ||
    t.includes("cuanto tarda") ||
    t.includes("cuanto demora") ||
    t.includes("cuanto me demoro") ||
    t.includes("cuando noto") ||
    t.includes("resultados")
  );
}

function intentMasInfo(t) {
  return (
    t.includes("cuentame mas") ||
    t.includes("explicame") ||
    t.includes("quiero saber mas") ||
    t.includes("como es") ||
    t.includes("como funciona")
  );
}

/* --------------------------------------------------
   DETECCIÓN DE INTENCIÓN PRINCIPAL
-------------------------------------------------- */
function detectIntent(texto) {
  const t = normalizar(texto);

  if (intentDolor(t)) return { tipo: "dolor" };
  if (intentPrecioJustificacion(t)) return { tipo: "precioJustificacion" };
  if (intentEfectividad(t)) return { tipo: "efectividad" };
  if (intentResultados(t)) return { tipo: "resultados" };
  if (intentMasInfo(t)) return { tipo: "masInfo" };

  const zonaCol = detectarZonaColoquial(t);
  if (zonaCol) return { tipo: "zona", zona: zonaCol };

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

/* --------------------------------------------------
   LINK AGENDA
-------------------------------------------------- */
const linkAgenda =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* --------------------------------------------------
   PLANTILLAS Tono A
-------------------------------------------------- */

function saludoInicial() {
  return "Hola! Soy Zara, parte del equipo de Body Elite ✨🤍. Estoy aquí para ayudarte a encontrar tu mejor versión con total honestidad clínica. Cuéntame, ¿qué zona te gustaría mejorar?";
}

/* ------------------ DOLOR ------------------ */
function plantillaDolor() {
  return (
    "No te preocupes 🙈🤍. Nuestros tratamientos **no duelen**. Puedes sentir un **calorcito suave** o pequeñas **contracciones musculares** (como un apretón simpático), pero nada invasivo ni molesto.\n\n" +
    "En tu evaluación gratuita (40 min) una especialista te muestra exactamente cómo se siente para que estés tranquila 🌼.\n" +
    "¿Quieres que te deje tu hora?"
  );
}

/* ------------------ PRECIO JUSTIFICACIÓN ------------------ */
function plantillaPrecioJustificacion() {
  return (
    "Te entiendo totalmente 🤍. Los valores dependen de la tecnología incluida (HIFU 12D, RF profunda, Pro Sculpt) y del resultado que estás buscando.\n\n" +
    "Lo bueno es que **ajustamos el plan a tu caso real**, para no darte sesiones de más ni de menos ✨.\n\n" +
    "Si quieres, revisamos tu presupuesto y tu objetivo en tu evaluación gratuita. ¿Quieres que te deje la hora?"
  );
}

/* ------------------ EFECTIVIDAD ------------------ */
function plantillaEfectividad() {
  return (
    "Sí, funciona 🤍✨. Las tecnologías como HIFU 12D, cavitación, RF y Pro Sculpt tienen resultados progresivos y reales, incluso desde las primeras sesiones.\n\n" +
    "En tu evaluación gratuita te explicamos exactamente qué resultado puedes esperar **tú**, según tu caso. ¿Quieres que te deje tu hora?"
  );
}

/* ------------------ RESULTADOS / TIEMPO ------------------ */
function plantillaResultados() {
  return (
    "La mayoría de las pacientes nota cambios desde la **primera o segunda sesión** 🌟.\n\n" +
    "Puede ser menos volumen, más firmeza o mejor contorno según el tratamiento.\n\n" +
    "En tu evaluación gratuita (40 min) vemos tu caso real y te damos un tiempo estimado honesto 🤍.\n" +
    "¿Quieres que te deje tu hora?"
  );
}

/* ------------------ MAS INFO ------------------ */
function plantillaMasInfo() {
  return (
    "Claro, feliz te cuento más 🤍.\n\n" +
    "– **Cavitación:** ayuda a romper grasa localizada.\n" +
    "– **RF profunda:** tensa la piel y estimula colágeno.\n" +
    "– **HIFU 12D:** afina contorno y da efecto lifting.\n" +
    "– **Pro Sculpt:** tonifica y levanta músculo.\n\n" +
    "En tu evaluación gratuita te explican cuál combina mejor contigo ✨.\n¿Quieres que te deje la hora?"
  );
}

/* ------------------ ZONA ------------------ */
function plantillaZona(zona) {
  const textos = {
    abdomen:
      "En abdomen podemos ayudarte a reducir volumen y tensar la piel con HIFU 12D, cavitación y radiofrecuencia 🤍.",
    gluteos:
      "En glúteos trabajamos levantamiento, firmeza y forma con Pro Sculpt ✨.",
    muslos:
      "En muslos mejoramos contorno, celulitis y firmeza con cavitación y radiofrecuencia 🌼.",
    papada:
      "En papada usamos HIFU 12D focalizado para reducir y tensar el contorno del cuello ✨.",
    patas_de_gallo:
      "En contorno de ojos suavizamos líneas y damos firmeza con radiofrecuencia focalizada 🤍.",
    brazos:
      "En brazos podemos mejorar firmeza y definición con RF profunda y Pro Sculpt 💛.",
    espalda:
      "En espalda trabajamos reducción de volumen y tensado con cavitación y radiofrecuencia.",
    cintura:
      "En cintura y flancos trabajamos reducción y tensado con cavitación y radiofrecuencia ✨."
  };

  return (
    `${textos[zona] || "Podemos trabajar muy bien esa zona con nuestras tecnologías 🤍."}\n\n` +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* ------------------ DEPILACIÓN ------------------ */
function plantillaDepilacion() {
  estado.ultimaZona = "depilacion";
  return (
    "Perfecto 🤍. Trabajamos depilación láser con tecnología moderna y segura. Todos los planes incluyen **6 sesiones** y los valores parten desde **$153.600**.\n\n" +
    "El valor exacto depende de tu zona, y lo definimos juntas en tu evaluación gratuita (40 min). ¿Quieres que te deje tu hora?"
  );
}

function plantillaDepilacionPrecio() {
  return (
    "Los planes de depilación parten desde **$153.600 por 6 sesiones** 🤍.\n\n" +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* ------------------ POSTPARTO ------------------ */
function plantillaPostparto() {
  estado.ultimaZona = "abdomen";
  return (
    "Es súper común que después del postparto el abdomen quede más suelto o con menor firmeza 🤍.\n\n" +
    "Usamos HIFU 12D, cavitación y RF para mejorar contorno y tonicidad 🌼.\n\n" +
    "Puedes reservar tu evaluación gratuita aquí y revisamos tu caso con calma:\n" +
    linkAgenda
  );
}

/* ------------------ OBJETIVOS ------------------ */
function plantillaObjetivo(objetivo) {
  const mensaje = {
    reducir: "reducción de contorno",
    tonificar: "mayor firmeza",
    tensar: "tensado de piel",
    antiage: "rejuvenecimiento"
  };

  return (
    `Perfecto 🤍. Podemos trabajar la ${mensaje[objetivo] || objetivo}.\n\n` +
    "Puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* ------------------ CONSISTE ------------------ */
function plantillaConsiste() {
  return (
    "Usamos tecnologías como HIFU 12D, cavitación, radiofrecuencia o Pro Sculpt 🤍. Esto ayuda a reducir volumen, mejorar firmeza y definir contorno.\n\n" +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* ------------------ UBICACIÓN ------------------ */
function plantillaUbicacion() {
  return (
    "Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén** 🤍.\n" +
    "Horario: Lun–Vie 9:30–20:00, Sáb 9:30–13:00.\n\n" +
    "¿Quieres que te deje tu evaluación gratuita?"
  );
}

/* ------------------ PRECIOS ------------------ */
function plantillaPrecio(zona) {
  const precios = {
    abdomen: "Lipo Express ($432.000)",
    muslos: "Lipo Reductiva ($480.000)",
    gluteos: "Push Up ($376.000)",
    papada: "Lipo Papada (desde $60.000)",
    patas_de_gallo: "Face Elite ($358.400)",
    brazos: "Body Tensor ($232.000)",
    espalda: "Lipo Reductiva ($480.000)",
    cintura: "Lipo Express ($432.000)"
  };

  const plan = precios[zona] || "el plan recomendado según tu evaluación";

  return (
    `El plan recomendado para esa zona es **${plan}** ✨🤍.\n\n` +
    "Puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* ------------------ FALLBACK ------------------ */
function fallback() {
  estado.intentosAgenda++;

  if (estado.intentosAgenda >= 2) {
    return (
      "Si prefieres, una de nuestras profesionales puede llamarte para orientarte mejor 🤍.\n" +
      "¿Quieres que te llamen?"
    );
  }

  return (
    "Disculpa, no logré interpretar bien tu mensaje 🙈. En tu evaluación gratuita (40 min) una especialista puede explicarte todo paso a paso 🤍.\n" +
    "¿Quieres que te deje la hora?"
  );
}

/* --------------------------------------------------
   TELÉFONO
-------------------------------------------------- */
function manejarTelefono(texto) {
  const numero = texto.match(/\+?\d+/g);
  if (!numero)
    return "¿Podrías confirmarme tu número para que podamos llamarte? 🤍";

  return {
    interno: `Nueva solicitud de llamada:\nNúmero del paciente: ${numero[0]}\nZona: ${estado.ultimaZona}\nObjetivo: ${estado.ultimoObjetivo || "no indicado"}`,
    usuario: "Perfecto 🤍. Ya envié tu número al equipo, te van a contactar en breve."
  };
}

/* --------------------------------------------------
   MOTOR PRINCIPAL
-------------------------------------------------- */
export async function procesarMensaje(usuario, texto) {
  const t = normalizar(texto);
  console.log("DEBUG:", t);

  if (estado.primeraInteraccion) {
    estado.primeraInteraccion = false;
    return saludoInicial();
  }

  if (estado.intentosAgenda >= 2 && /\d/.test(t)) {
    const out = manejarTelefono(texto);
    if (typeof out === "string") return out;

    await fetch("https://api.whatsapp.com/send", {
      method: "POST",
      body: JSON.stringify({
        to: "+56983300262",
        text: out.interno
      })
    });

    return out.usuario;
  }

  const intent = detectIntent(t);
  console.log("DEBUG: intent →", intent);

  if (!intent) {
    const score = matchScore(t);
    if (score < MIN_SCORE) return fallback();
    return fallback();
  }

  estado.intentosAgenda = 0;

  switch (intent.tipo) {
    case "dolor":
      return plantillaDolor();

    case "precioJustificacion":
      return plantillaPrecioJustificacion();

    case "efectividad":
      return plantillaEfectividad();

    case "resultados":
      return plantillaResultados();

    case "masInfo":
      return plantillaMasInfo();

    case "depilacion":
      return plantillaDepilacion();

    case "postparto":
      return plantillaPostparto();

    case "precio":
      if (estado.ultimaZona === "depilacion")
        return plantillaDepilacionPrecio();
      return plantillaPrecio(estado.ultimaZona);

    case "ubicacion":
      return plantillaUbicacion();

    case "consiste":
      return plantillaConsiste();

    case "zona":
      estado.ultimaZona = intent.zona;
      return plantillaZona(intent.zona);

    case "objetivo":
      estado.ultimoObjetivo = intent.objetivo;
      return plantillaObjetivo(intent.objetivo);

    default:
      return fallback();
  }
}
