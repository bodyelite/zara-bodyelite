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
   DETECTAR ZONA
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
   MATCHSCORE – respaldo para fallback
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
   DETECCIÓN DE INTENCIÓN
-------------------------------------------------- */
function detectIntent(texto) {
  const t = normalizar(texto);

  // Zona
  const zonaCol = detectarZonaColoquial(t);
  if (zonaCol) return { tipo: "zona", zona: zonaCol };

  // Depilación
  if (t.includes("depil")) return { tipo: "depilacion" };

  // Postparto
  if (t.includes("postparto") || t.includes("post parto"))
    return { tipo: "postparto" };

  // Precio / ubicación / consiste
  for (const p of diccionario.intents.precio)
    if (t.includes(p)) return { tipo: "precio" };

  for (const u of diccionario.intents.ubicacion)
    if (t.includes(u)) return { tipo: "ubicacion" };

  for (const c of diccionario.intents.consiste)
    if (t.includes(c)) return { tipo: "consiste" };

  // Objetivos
  if (t.includes("firmeza"))
    return { tipo: "objetivo", objetivo: "tonificar" };

  for (const obj in diccionario.objetivos)
    for (const k of diccionario.objetivos[obj])
      if (t.includes(k)) return { tipo: "objetivo", objetivo: obj };

  return null;
}

/* --------------------------------------------------
   LINK DE AGENDA
-------------------------------------------------- */
const linkAgenda =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

/* --------------------------------------------------
   PLANTILLAS Tono C humano
-------------------------------------------------- */

function saludoInicial() {
  return "Hola, soy Zara, parte del equipo de Body Elite 🤍. Estoy aquí para ayudarte a encontrar tu mejor versión y orientarte según lo que quieras mejorar. Cuéntame, ¿qué zona o aspecto te gustaría trabajar?";
}

/* DEPILACIÓN – sin intención → sin link */
function plantillaDepilacion() {
  estado.ultimaZona = "depilacion";
  return "Perfecto, trabajamos depilación láser con tecnología moderna y muy segura 🤍. Todos los planes incluyen **6 sesiones** y los valores parten desde **$153.600**.\n\nEl valor exacto depende de tu zona y lo definimos juntas en tu evaluación gratuita (40 minutos, y es un regalo 🎁). ¿Quieres que te deje tu hora?";
}

/* DEPILACIÓN – precio → con link */
function plantillaDepilacionPrecio() {
  return (
    "Nuestros planes de depilación parten desde **$153.600 por 6 sesiones** 🤍. El valor final depende si tu zona es pequeña, mediana, grande o full.\n\n" +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* POSTPARTO → con link */
function plantillaPostparto() {
  estado.ultimaZona = "abdomen";
  return (
    "Entiendo, después del postparto es muy común que el abdomen quede más suelto o con menor firmeza 🤍. Trabajamos esta zona con HIFU 12D, cavitación y radiofrecuencia para mejorar contorno y tonicidad.\n\n" +
    "Tu evaluación gratuita dura 40 minutos y revisamos tu caso a fondo. Puedes reservar aquí:\n" +
    linkAgenda
  );
}

/* ZONAS → con link */
function plantillaZona(zona) {
  const textos = {
    abdomen:
      "En abdomen podemos ayudarte a reducir volumen y tensar la piel con HIFU 12D, cavitación y radiofrecuencia.",
    gluteos:
      "En glúteos trabajamos levantamiento, firmeza y mejor forma con Pro Sculpt 🤍.",
    muslos:
      "En muslos mejoramos contorno, celulitis y firmeza con cavitación y radiofrecuencia.",
    papada:
      "En papada usamos HIFU 12D focalizado para reducir y tensar el contorno.",
    patas_de_gallo:
      "En el contorno de ojos trabajamos suavizado y firmeza con radiofrecuencia focalizada.",
    brazos:
      "En brazos podemos mejorar firmeza y definición con radiofrecuencia profunda y Pro Sculpt.",
    espalda:
      "En espalda abordamos reducción de volumen y tensado con cavitación y radiofrecuencia.",
    cintura:
      "En cintura y flancos trabajamos reducción y tensado con cavitación y radiofrecuencia."
  };

  return (
    `${textos[zona] || "Podemos trabajar muy bien esa zona con nuestra tecnología 🤍."}\n\n` +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* OBJETIVOS → con link */
function plantillaObjetivo(objetivo) {
  const mensaje = {
    reducir: "reducción de contorno",
    tonificar: "mayor firmeza",
    tensar: "tensado de piel",
    antiage: "rejuvenecimiento"
  };

  return (
    `Perfecto, podemos trabajar la ${mensaje[objetivo] || objetivo} 🤍.\n\n` +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* CONSISTE → con link */
function plantillaConsiste() {
  return (
    "Usamos tecnologías como HIFU 12D, cavitación, radiofrecuencia o Pro Sculpt según tu caso 🤍. Esto ayuda a reducir volumen, mejorar firmeza y definir contorno.\n\n" +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* UBICACIÓN – sin intención → sin link */
function plantillaUbicacion() {
  return (
    "Estamos en **Av. Las Perdices 2990, Local 23, Peñalolén** 🤍.\nHorario: Lun–Vie 9:30–20:00, Sáb 9:30–13:00.\n\n" +
    "¿Te dejo tu evaluación gratuita?"
  );
}

/* PRECIO → con link */
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

  const plan = precios[zona] || "el tratamiento indicado para tu caso";

  return (
    `El plan recomendado para esa zona es **${plan}** 🤍.\n\n` +
    "Si quieres avanzar, puedes reservar tu evaluación gratuita aquí:\n" +
    linkAgenda
  );
}

/* FALLBACK HUMANO (sin intención) */
function fallback() {
  estado.intentosAgenda++;

  if (estado.intentosAgenda >= 2) {
    return "Si prefieres, una de nuestras profesionales puede llamarte para orientarte mejor y resolver tus dudas 🤍. ¿Quieres que te llamen?";
  }

  return "Disculpa, no logré interpretar bien tu mensaje. En tu evaluación gratuita (40 min) una especialista puede explicarte todo paso a paso 🤍. ¿Quieres que te deje la hora?";
}

/* --------------------------------------------------
   MOTOR PRINCIPAL
-------------------------------------------------- */
export async function procesarMensaje(usuario, texto) {
  const t = normalizar(texto);
  console.log("DEBUG: mensaje normalizado:", t);

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
    if (score < MIN_SCORE) {
      console.log("DEBUG: score insuficiente → fallback");
      return fallback();
    }
    return fallback();
  }

  estado.intentosAgenda = 0;

  if (intent.tipo === "depilacion") return plantillaDepilacion();

  if (intent.tipo === "postparto") return plantillaPostparto();

  if (intent.tipo === "precio") {
    if (estado.ultimaZona === "depilacion")
      return plantillaDepilacionPrecio();
    return plantillaPrecio(estado.ultimaZona);
  }

  if (intent.tipo === "ubicacion") return plantillaUbicacion();

  if (intent.tipo === "consiste") return plantillaConsiste();

  if (intent.tipo === "zona") {
    estado.ultimaZona = intent.zona;
    return plantillaZona(intent.zona);
  }

  if (intent.tipo === "objetivo") {
    estado.ultimoObjetivo = intent.objetivo;
    return plantillaObjetivo(intent.objetivo);
  }

  return fallback();
}

/* --------------------------------------------------
   TELÉFONO
-------------------------------------------------- */
function manejarTelefono(texto) {
  const numero = texto.match(/\+?\d+/g);
  if (!numero)
    return "¿Podrías confirmarme tu número para que podamos llamarte?";

  return {
    interno: `Nueva solicitud de llamada:\nNúmero del paciente: ${numero[0]}\nZona: ${estado.ultimaZona}\nObjetivo: ${estado.ultimoObjetivo || "no indicado"}`,
    usuario: "Listo, ya envié tu número al equipo. Te van a contactar en breve 🤍."
  };
}
