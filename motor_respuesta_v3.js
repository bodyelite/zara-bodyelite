import { diccionario } from "./base_conocimiento.js";

/* --------------------------------------------------
   ESTADO
-------------------------------------------------- */
const estado = {
  primeraInteraccion: true,
  ultimaZona: null,
  ultimoObjetivo: null,
  intentosAgenda: 0,
  modoDepilacion: false
};

/* --------------------------------------------------
   MATCH SCORE
-------------------------------------------------- */
const MIN_SCORE = 0.20;

function matchScore(texto, dicc) {
  if (!dicc) return 0;
  const t = texto.toLowerCase();
  let puntos = 0;

  for (const arr of Object.values(dicc.intents))
    for (const k of arr)
      if (t.includes(k)) puntos += 1;

  for (const arr of Object.values(dicc.zonas))
    for (const k of arr)
      if (t.includes(k)) puntos += 0.7;

  for (const arr of Object.values(dicc.objetivos))
    for (const k of arr)
      if (t.includes(k)) puntos += 0.7;

  if (t.includes("depil")) puntos += 2;

  return puntos / 12;
}

/* --------------------------------------------------
   DETECT INTENT
-------------------------------------------------- */
function detectIntent(texto, dicc) {
  const t = texto.toLowerCase();

  if (t.includes("depil")) return { tipo: "depilacion" };
  if (t.includes("postparto") || t.includes("post parto") || t.includes("post-parto")) return { tipo: "postparto" };

  for (const p of diccionario.intents.precio)
    if (t.includes(p)) return { tipo: "precio" };

  for (const u of diccionario.intents.ubicacion)
    if (t.includes(u)) return { tipo: "ubicacion" };

  for (const c of diccionario.intents.consiste)
    if (t.includes(c)) return { tipo: "consiste" };

  for (const zona in diccionario.zonas)
    for (const k of diccionario.zonas[zona])
      if (t.includes(k)) return { tipo: "zona", zona };

  for (const objetivo in diccionario.objetivos)
    for (const k of diccionario.objetivos[objetivo])
      if (t.includes(k)) return { tipo: "objetivo", objetivo };

  return null;
}

/* --------------------------------------------------
   PLANTILLAS
-------------------------------------------------- */
function saludoInicial() {
  return "Hola, soy Zara, parte del equipo de Body Elite. Estoy aquí para ayudarte a encontrar tu mejor versión y orientarte según lo que quieras mejorar. Cuéntame, ¿qué zona o aspecto te gustaría trabajar?";
}

/* ---- DEPILACIÓN ---- */
function plantillaDepilacion() {
  estado.modoDepilacion = true;
  estado.ultimaZona = "depilacion";

  return "Trabajamos depilación láser con tecnología avanzada y **todos los planes incluyen 6 sesiones**. Los valores parten desde **$153.600**, y el precio final depende de si tu zona corresponde a pequeña, mediana, grande o full. En la evaluación gratuita revisamos tu piel y definimos tu zona exacta para ajustar el valor a tus necesidades. ¿Quieres que te deje tu evaluación?";
}

function plantillaDepilacionZona() {
  return "Perfecto, para depilación el valor exacto depende de si tu zona corresponde a pequeña, mediana, grande o full, pero todos los planes incluyen **6 sesiones** y parten desde **$153.600**. En la evaluación gratuita definimos tu zona con precisión. ¿Quieres que la agende para ti?";
}

function plantillaDepilacionPrecio() {
  return "Nuestros planes de depilación parten desde **$153.600 por 6 sesiones**. El valor final depende de la zona exacta que revisamos en tu evaluación gratuita para darte el precio justo. ¿Quieres que te deje tu evaluación?";
}

/* ---- POSTPARTO ---- */
function plantillaPostparto() {
  estado.ultimaZona = "abdomen";
  return "Entiendo perfecto, el postparto suele dejar cambios como flacidez, piel suelta o grasa blanda en abdomen. Trabajamos esta etapa con HIFU 12D, cavitación y radiofrecuencia para reducir y tensar de forma progresiva. La evaluación gratuita nos permite ver tu punto de partida y cuántas sesiones necesitas. ¿Quieres que te deje agendada?";
}

/* ---- ZONAS ---- */
function plantillaZona(zona) {
  const t = {
    abdomen: "En abdomen trabajamos reducción y tensado con HIFU 12D, cavitación y radiofrecuencia.",
    muslos: "En muslos logramos reducción de contorno y firmeza usando cavitación, radiofrecuencia y Pro Sculpt.",
    gluteos: "En glúteos trabajamos levantamiento y definición con Pro Sculpt.",
    papada: "En papada aplicamos HIFU 12D focalizado para reducir grasa y tensar.",
    patas_de_gallo: "En esa zona trabajamos firmeza y suavidad con radiofrecuencia focalizada."
  };

  return `${t[zona] || "Podemos trabajar esa zona con tecnología avanzada."} ¿Quieres enfocarte más en reducir volumen o tensar la piel?`;
}

/* ---- OBJETIVO ---- */
function plantillaObjetivo(objetivo, zona) {
  const m = {
    reducir: "reducción de contorno",
    tonificar: "mayor firmeza",
    tensar: "tensado de piel",
    antiage: "suavizado de arrugas"
  };
  const z = zona ? `en ${zona}` : "";

  return `Perfecto, podemos trabajar la ${m[objetivo] || objetivo} ${z}. La evaluación gratuita nos ayuda a definir tu punto de partida y tu plan exacto. ¿Quieres que te deje agendada?`;
}

/* ---- CONSISTE ---- */
function plantillaConsiste(zona) {
  const des = {
    abdomen: "Combina HIFU 12D, cavitación y radiofrecuencia para reducir y tensar.",
    muslos: "Cavitación, radiofrecuencia y Pro Sculpt para contorno y firmeza.",
    gluteos: "Pro Sculpt para levantar y definir.",
    papada: "HIFU 12D focalizado para reducir grasa y tensar.",
    patas_de_gallo: "Radiofrecuencia focalizada para suavizar la piel."
  };

  return `${des[zona] || "Es un tratamiento no invasivo con tecnología avanzada."} ¿Quieres tu evaluación gratuita para ver tu punto de partida?`;
}

/* ---- UBICACION ---- */
function plantillaUbicacion() {
  return "Estamos en Av. Las Perdices 2990, Local 23, Peñalolén. Atendemos Lun–Vie 9:30–20:00 y Sáb 9:30–13:00. ¿Quieres agendar tu evaluación gratuita?";
}

/* ---- PRECIO ---- */
function plantillaPrecio(zona) {
  const planes = {
    abdomen: "Lipo Express ($432.000)",
    muslos: "Lipo Reductiva ($480.000)",
    gluteos: "Push Up ($376.000)",
    papada: "Lipo Papada (desde $60.000)",
    patas_de_gallo: "Face Elite ($358.400)"
  };

  const plan = planes[zona] || "el plan indicado";

  return `El valor recomendado para esa zona es ${plan}. Igual lo confirmamos contigo en la evaluación gratuita según tu punto de partida. ¿Quieres que la agende?`;
}

/* ---- FALLBACK ---- */
function fallback() {
  estado.intentosAgenda += 1;

  if (estado.intentosAgenda >= 2) {
    return "Si te resulta más cómodo, una de nuestras profesionales puede llamarte para orientarte mejor y resolver tus dudas. ¿Quieres que te llamen?";
  }

  return "Disculpa, no logré interpretar bien tu mensaje. En la evaluación gratuita nuestras profesionales pueden aclarar todo contigo. ¿Quieres que la agende para ti?";
}

/* ---- MANEJO DE TELÉFONO ---- */
function manejarTelefono(texto) {
  const numero = texto.match(/\+?\d+/g);
  if (!numero)
    return "¿Podrías confirmarme tu número para que podamos llamarte?";

  return {
    interno: `Nueva solicitud de llamada:\nNúmero del paciente: ${numero[0]}\nZona: ${estado.ultimaZona || "no especificada"}\nObjetivo: ${estado.ultimoObjetivo || "no especificado"}`,
    usuario: "Perfecto, ya envié tu número al equipo. Te van a contactar en breve."
  };
}

/* --------------------------------------------------
   MOTOR PRINCIPAL
-------------------------------------------------- */
export async function procesarMensaje(usuario, texto) {
  const t = texto.toLowerCase();

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

  const score = matchScore(texto, diccionario);
  if (score < MIN_SCORE)
    return fallback();

  const intent = detectIntent(texto, diccionario);
  if (!intent)
    return fallback();

  estado.intentosAgenda = 0;

  if (intent.tipo === "depilacion")
    return plantillaDepilacion();

  if (intent.tipo === "postparto")
    return plantillaPostparto();

  if (intent.tipo === "precio") {
    if (estado.modoDepilacion) return plantillaDepilacionPrecio();
    return plantillaPrecio(estado.ultimaZona);
  }

  if (intent.tipo === "ubicacion")
    return plantillaUbicacion();

  if (intent.tipo === "consiste")
    return plantillaConsiste(estado.ultimaZona);

  if (intent.tipo === "zona") {
    if (estado.modoDepilacion)
      return plantillaDepilacionZona();

    estado.ultimaZona = intent.zona;
    return plantillaZona(intent.zona);
  }

  if (intent.tipo === "objetivo") {
    estado.ultimoObjetivo = intent.objetivo;
    return plantillaObjetivo(intent.objetivo, estado.ultimaZona);
  }

  return fallback();
}
