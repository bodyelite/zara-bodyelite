import { diccionario } from "./base_conocimiento.js";

/* --------------------------------------------------
   ESTADO
-------------------------------------------------- */
const estado = {
  primeraInteraccion: true,
  ultimaZona: null,
  ultimoObjetivo: null,
  intentosAgenda: 0
};

/* --------------------------------------------------
   NORMALIZADOR DE TEXTO
-------------------------------------------------- */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* --------------------------------------------------
   LISTA COLOQUIAL AMPLIADA
-------------------------------------------------- */
const zonasColoquiales = {
  abdomen: [
    "abdomen","guata","guatita","wata","panza","barriga","estomago","flotador",
    "rollo","rollitos","guaton","guatonera","punto medio","vientre"
  ],
  gluteos: [
    "gluteo","gluteos","glutea","gluteas","trasero","poto","potito","culo","cola",
    "colita","nalgas","nalga","pompas","pompis","retaguardia","booty","traserito"
  ],
  muslos: [
    "muslo","muslos","pierna","piernas","entrepierna","muslitos","piernas gorditas"
  ],
  papada: [
    "papada","papadita","papaga","doble menton","doble menton","bajo el menton",
    "cuello bajo","papita","papda"
  ],
  patas_de_gallo: [
    "patas de gallo","patas gallo","patas de gallina","arrugas ojos",
    "arrugas en los ojos","lineas al reir","arruguitas ojos","contorno de ojos",
    "ojos arrugados"
  ],
  brazos: [
    "brazos","brazo","alas de murcielago","bye bye","brazo flacido","brazos caidos",
    "tricep","triceps","parte alta del brazo","brazos gorditos"
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
      if (t.includes(palabra)) return zona;
    }
  }
  return null;
}

/* --------------------------------------------------
   MATCH SCORE
-------------------------------------------------- */
const MIN_SCORE = 0.20;

function matchScore(texto) {
  let t = normalizar(texto);
  let puntos = 0;

  for (const arr of Object.values(diccionario.intents))
    for (const k of arr)
      if (t.includes(k)) puntos += 1;

  for (const zona in zonasColoquiales)
    for (const palabra of zonasColoquiales[zona])
      if (t.includes(palabra)) puntos += 1.5;

  return puntos / 15;
}

/* --------------------------------------------------
   INTENCIONES
-------------------------------------------------- */
function detectIntent(texto) {
  const t = normalizar(texto);

  if (t.includes("depil")) return { tipo: "depilacion" };

  if (t.includes("postparto") || t.includes("post parto") || t.includes("post-parto"))
    return { tipo: "postparto" };

  for (const p of diccionario.intents.precio)
    if (t.includes(p)) return { tipo: "precio" };

  for (const u of diccionario.intents.ubicacion)
    if (t.includes(u)) return { tipo: "ubicacion" };

  for (const c of diccionario.intents.consiste)
    if (t.includes(c)) return { tipo: "consiste" };

  const zonaCol = detectarZonaColoquial(t);
  if (zonaCol) return { tipo: "zona", zona: zonaCol };

  for (const objetivo in diccionario.objetivos)
    for (const k of diccionario.objetivos[objetivo])
      if (t.includes(k)) return { tipo: "objetivo", objetivo };

  return null;
}

/* --------------------------------------------------
   PLANTILLAS (versión profesional suavizada)
-------------------------------------------------- */
function saludoInicial() {
  return "Hola, soy Zara, parte del equipo de Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión y orientarte según lo que quieras mejorar. Cuéntame, ¿qué zona o aspecto te gustaría trabajar?";
}

/* DEPILACIÓN */
function plantillaDepilacion() {
  estado.ultimaZona = "depilacion";
  return "Trabajamos depilación láser con tecnología avanzada. Todos los planes incluyen **6 sesiones** y los valores parten desde **$153.600**. El valor final depende de si tu zona corresponde a pequeña, mediana, grande o full. En la evaluación gratuita definimos tu zona exacta y el plan más conveniente. ¿Quieres que te deje tu evaluación?";
}

function plantillaDepilacionPrecio() {
  return "Nuestros planes de depilación parten desde **$153.600 por 6 sesiones**. El valor final depende de tu zona exacta, que revisamos juntas en la evaluación gratuita. ¿Quieres que la agende?";
}

/* POSTPARTO */
function plantillaPostparto() {
  estado.ultimaZona = "abdomen";
  return "Entiendo muy bien el postparto: suele dejar flacidez, piel suelta o grasa blanda en abdomen. Trabajamos esta zona con HIFU 12D, cavitación y radiofrecuencia para reducir y tensar de forma progresiva. La evaluación gratuita nos permite ver tu punto de partida y definir cuántas sesiones necesitas. ¿Quieres que te deje agendada?";
}

/* ZONAS (suavizadas) */
function plantillaZona(zona) {
  const t = {
    abdomen: "En abdomen trabajamos reducción y tensado con HIFU 12D, cavitación y radiofrecuencia.",
    gluteos: "En glúteos podemos trabajar levantamiento, forma y firmeza con Pro Sculpt.",
    muslos: "En muslos trabajamos reducción de contorno, celulitis y firmeza con cavitación, radiofrecuencia y Pro Sculpt.",
    papada: "En papada usamos HIFU 12D focalizado para reducir grasa y tensar.",
    patas_de_gallo: "En la zona del contorno de ojos trabajamos suavizado y firmeza con radiofrecuencia focalizada.",
    brazos: "En brazos se puede trabajar firmeza, tensado y definición con radiofrecuencia profunda y Pro Sculpt.",
    espalda: "En espalda trabajamos reducción de rollos y mejora de firmeza con cavitación y radiofrecuencia.",
    cintura: "En cintura y flancos trabajamos reducción de volumen y tensado con cavitación y radiofrecuencia."
  };

  return `${t[zona] || "Podemos trabajar esa zona con tecnología avanzada."} ¿Quieres enfocarte más en reducción o firmeza?`;
}

/* OBJETIVOS */
function plantillaObjetivo(objetivo, zona) {
  const m = {
    reducir: "reducción de contorno",
    tonificar: "mayor firmeza",
    tensar: "tensado de piel",
    antiage: "rejuvenecimiento"
  };
  return `Perfecto, podemos trabajar la ${m[objetivo] || objetivo} en esa zona. La evaluación gratuita nos ayuda a definir tu punto de partida. ¿Quieres que te deje agendada?`;
}

/* CONSISTE */
function plantillaConsiste(zona) {
  return "Es un tratamiento no invasivo que combina tecnologías como HIFU 12D, cavitación, radiofrecuencia o Pro Sculpt según la zona. ¿Quieres tu evaluación gratuita para ver tu punto de partida?";
}

/* UBICACIÓN */
function plantillaUbicacion() {
  return "Estamos en Av. Las Perdices 2990, Local 23, Peñalolén. Atendemos Lun–Vie 9:30–20:00 y Sáb 9:30–13:00. ¿Quieres agendar tu evaluación gratuita?";
}

/* PRECIO (no depilación) */
function plantillaPrecio(zona) {
  const p = {
    abdomen: "Lipo Express ($432.000)",
    muslos: "Lipo Reductiva ($480.000)",
    gluteos: "Push Up ($376.000)",
    papada: "Lipo Papada (desde $60.000)",
    patas_de_gallo: "Face Elite ($358.400)",
    brazos: "Body Tensor ($232.000)",
    espalda: "Lipo Reductiva ($480.000)",
    cintura: "Lipo Express ($432.000)"
  };
  return `El plan recomendado para esa zona es ${p[zona] || "el correspondiente"}. Igual todo se confirma en la evaluación gratuita. ¿Quieres que la agende?`;
}

/* FALLBACK */
function fallback() {
  estado.intentosAgenda++;

  if (estado.intentosAgenda >= 2) {
    return "Si te resulta más cómodo, una de nuestras profesionales puede llamarte para orientarte mejor y resolver tus dudas. ¿Quieres que te llamen?";
  }

  return "Disculpa, no logré interpretar bien tu mensaje. En la evaluación gratuita nuestras profesionales pueden ayudarte a resolver todas tus dudas. ¿Quieres que la agende para ti?";
}

/* MANEJO TELÉFONO */
function manejarTelefono(texto) {
  const numero = texto.match(/\+?\d+/g);
  if (!numero)
    return "¿Podrías confirmarme tu número para que podamos llamarte?";

  return {
    interno: `Nueva solicitud de llamada:\nNúmero del paciente: ${numero[0]}\nZona: ${estado.ultimaZona}\nObjetivo: ${estado.ultimoObjetivo || "no indicado"}`,
    usuario: "Listo, ya envié tu número al equipo. Te van a contactar en breve."
  };
}

/* --------------------------------------------------
   MOTOR PRINCIPAL
-------------------------------------------------- */
export async function procesarMensaje(usuario, texto) {
  const t = normalizar(texto);

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

  const score = matchScore(t);
  if (score < MIN_SCORE) return fallback();

  const intent = detectIntent(t);
  if (!intent) return fallback();

  estado.intentosAgenda = 0;

  if (intent.tipo === "depilacion")
    return plantillaDepilacion();

  if (intent.tipo === "postparto")
    return plantillaPostparto();

  if (intent.tipo === "precio") {
    if (estado.ultimaZona === "depilacion")
      return plantillaDepilacionPrecio();
    return plantillaPrecio(estado.ultimaZona);
  }

  if (intent.tipo === "ubicacion")
    return plantillaUbicacion();

  if (intent.tipo === "consiste")
    return plantillaConsiste(estado.ultimaZona);

  if (intent.tipo === "zona") {
    estado.ultimaZona = intent.zona;
    return plantillaZona(intent.zona);
  }

  if (intent.tipo === "objetivo") {
    estado.ultimoObjetivo = intent.objetivo;
    return plantillaObjetivo(intent.objetivo, estado.ultimaZona);
  }

  return fallback();
}
