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
   MATCHSCORE (solo respaldo para fallback)
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

  // 1) Zona coloquial primero
  const zonaCol = detectarZonaColoquial(t);
  if (zonaCol) return { tipo: "zona", zona: zonaCol };

  // 2) Depilación
  if (t.includes("depil")) return { tipo: "depilacion" };

  // 3) Postparto
  if (t.includes("postparto") || t.includes("post parto"))
    return { tipo: "postparto" };

  // 4) Precio, ubicación, consiste
  for (const p of diccionario.intents.precio)
    if (t.includes(p)) return { tipo: "precio" };

  for (const u of diccionario.intents.ubicacion)
    if (t.includes(u)) return { tipo: "ubicacion" };

  for (const c of diccionario.intents.consiste)
    if (t.includes(c)) return { tipo: "consiste" };

  // 5) Objetivos (incluyendo “firmeza” como tonificar)
  if (t.includes("firmeza"))
    return { tipo: "objetivo", objetivo: "tonificar" };

  for (const obj in diccionario.objetivos)
    for (const k of diccionario.objetivos[obj])
      if (t.includes(k)) return { tipo: "objetivo", objetivo: obj };

  return null;
}

/* --------------------------------------------------
   PLANTILLAS
-------------------------------------------------- */

function saludoInicial() {
  return "Hola, soy Zara, parte del equipo de Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión y orientarte según lo que quieras mejorar. Cuéntame, ¿qué zona o aspecto te gustaría trabajar?";
}

/* DEPILACIÓN */
function plantillaDepilacion() {
  estado.ultimaZona = "depilacion";
  return "Trabajamos depilación láser con tecnología moderna. Todos los planes incluyen **6 sesiones** y los precios parten desde **$153.600**. El valor final depende de tu zona específica, que definimos juntas en la evaluación gratuita. ¿Quieres que te deje tu evaluación?";
}

function plantillaDepilacionPrecio() {
  return "Nuestros planes de depilación parten desde **$153.600 por 6 sesiones**. El valor final depende de si tu zona es pequeña, mediana, grande o full. Todo se confirma en tu evaluación gratuita. ¿Te la dejo agendada?";
}

/* POSTPARTO */
function plantillaPostparto() {
  estado.ultimaZona = "abdomen";
  return "El postparto suele dejar flacidez y piel suelta en el abdomen. Trabajamos esta zona con HIFU 12D, cavitación y radiofrecuencia para reducir y tensar de forma progresiva. La evaluación gratuita nos permite ver tu punto de partida. ¿Quieres que te la deje agendada?";
}

/* ZONA SUAVIZADA */
function plantillaZona(zona) {
  const t = {
    abdomen:
      "En abdomen trabajamos reducción y tensado con HIFU 12D, cavitación y radiofrecuencia.",
    gluteos:
      "En glúteos podemos trabajar levantamiento, forma y firmeza con Pro Sculpt.",
    muslos:
      "En muslos trabajamos reducción de contorno, celulitis y firmeza con cavitación y radiofrecuencia.",
    papada:
      "En papada usamos HIFU 12D focalizado para reducir grasa y tensar el contorno.",
    patas_de_gallo:
      "En contorno de ojos trabajamos suavizado y firmeza con radiofrecuencia focalizada.",
    brazos:
      "En brazos se puede mejorar firmeza y definición con radiofrecuencia profunda y Pro Sculpt.",
    espalda:
      "En espalda se trabaja reducción de volumen y tensado con cavitación y radiofrecuencia.",
    cintura:
      "En cintura y flancos podemos trabajar reducción y tensado con cavitación y radiofrecuencia."
  };

  return `${t[zona] || "Podemos trabajar esa zona con tecnología avanzada."} ¿Quieres enfocarte más en reducción o firmeza?`;
}

/* OBJETIVOS */
function plantillaObjetivo(objetivo) {
  const m = {
    reducir: "reducción de contorno",
    tonificar: "mayor firmeza",
    tensar: "tensado de piel",
    antiage: "rejuvenecimiento"
  };

  return `Perfecto, podemos trabajar la ${m[objetivo] || objetivo}. La evaluación gratuita nos ayuda a definir tu punto de partida y tu plan exacto. ¿Quieres que te deje agendada?`;
}

/* CONSISTE */
function plantillaConsiste() {
  return "Usamos tecnologías como HIFU 12D, cavitación, radiofrecuencia o Pro Sculpt según la zona, para reducir volumen y mejorar firmeza. ¿Quieres tu evaluación gratuita?";
}

/* UBICACIÓN */
function plantillaUbicacion() {
  return "Estamos en Av. Las Perdices 2990, Local 23, Peñalolén. Horario Lun–Vie 9:30–20:00, Sáb 9:30–13:00. ¿Quieres agendar tu evaluación gratuita?";
}

/* PRECIO */
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

  return `El plan recomendado para esa zona es ${p[zona] || "el correspondiente"}. Validamos todo juntas en tu evaluación gratuita. ¿Quieres agendarla?`;
}

/* FALLBACK */
function fallback() {
  estado.intentosAgenda++;

  if (estado.intentosAgenda >= 2) {
    return "Si te resulta más cómodo, una de nuestras profesionales puede llamarte para orientarte mejor y resolver tus dudas. ¿Quieres que te llamen?";
  }

  return "Disculpa, no logré entender bien tu mensaje. En la evaluación gratuita nuestras profesionales pueden orientarte mejor. ¿Quieres que la agende para ti?";
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
  console.log("DEBUG: mensaje normalizado:", t);

  // 1) Saludo inicial
  if (estado.primeraInteraccion) {
    estado.primeraInteraccion = false;
    return saludoInicial();
  }

  // 2) Manejo de teléfono después de 2 intentos de agenda
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

  // 3) Intento de entender la intención PRIMERO
  const intent = detectIntent(t);
  console.log("DEBUG: intent →", intent);

  // 4) Si no hay intención clara, usamos score para decidir fallback
  if (!intent) {
    const score = matchScore(t);
    if (score < MIN_SCORE) {
      console.log("DEBUG: score insuficiente → fallback");
      return fallback();
    }
    // Si el score pasa pero no hay intent claro igual usamos fallback suave
    return fallback();
  }

  // Si hubo intención, reseteamos contador de agenda
  estado.intentosAgenda = 0;

  // 5) Ruteo por tipo de intención
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
    return plantillaObjetivo(intent.objetivo);
  }

  return fallback();
}
