// ============================================================
// motor_respuesta_v3.js – Versión Final Zara 2.1
// Clínico + Comercial + Empático + Campañas + Agenda
// ============================================================

import { leerMemoria, guardarMemoria } from "./memoria.js";

// ============================================================
// PALABRAS CLAVE Y FRASES COLOQUIALES
// ============================================================
const palabras = {
  arrugas: ["arruga","arrugas","patas de gallo","pata de gallo","líneas","lineas","lineas de expresión","expresión","ceño","entrecejo","frente marcada","patitas","lineas finas","ojeras marcadas"],
  flacidez_facial: ["flacidez","flacida","piel suelta","rostro caído","rostro caido","contorno caído","contorno caido","descolgado","cachetes sueltos"],
  papada: ["papada","doble mentón","doble menton","mentón","menton","submenton"],
  manchas: ["manchas","manchitas","melasma","opaca","opacidad","luminosidad","tono disparejo"],
  textura: ["textura","poros","poros abiertos","piel áspera","piel aspera","asperezas"],
  face_h12: ["face h12","h12","h 12"],
  face_one: ["face one","one"],
  grasa_abdomen: ["abdomen","guata","guatita","panza","pansa","rollito","rollitos","flotador","cintura","estomago","estómago","barriga","faja natural"],
  grasa_cuerpo: ["piernas","pierna","muslo","muslos","cartuchera","cartucheras","celulitis","retención","retencion","aductores","muslos laterales"],
  brazos: ["brazo","brazos","ala de murcielago","murcielago","brazito","brazitos"],
  gluteos: ["glúteo","gluteo","glúteos","gluteos","poto","colita","nalgas","levantar","gluteo caido","glúteo caído","gluteo","gluteos"],
  tono: ["marcación","marcacion","marcar","tonificar","tono","ems","músculo","musculo","musculatura","definir"],
  depilacion: ["depilar","depilación","depilacion","pelo","pelos","vello","vellos","rebaje","axila","pierna completa","laser","láser","depilado"],
  funcionamiento: ["como funciona","cómo funciona","en qué consiste","que máquinas usan","qué maquinas usan","maquina","máquina","que usan","qué usan"],
  sesiones: ["sesiones","cuantas sesiones","número de sesiones","numero de sesiones","frecuencia"],
  resultados: ["resultados","cuando se ven","cuándo veo","cuanto demora","demora","sirve","vale la pena","cuando noto"],
  dolor: ["duele","dolor","molesta","ardor","incomodo","sensación"],
  ubicacion: ["donde están","ubicación","como llegar","dirección","donde quedan","ubicacion"],
  agendar: ["agendar","reservar","quiero ir","quiero agendar","link","pasame el link","quiero hora","agenda","agendo","quiero reservar","quiero mi hora","dame tu agenda"],
};

// ============================================================
// UTILIDADES
// ============================================================
const match = (texto, lista) => lista.some((w) => texto.includes(w));

function CTA_ofrecer() {
  return {
    tipo: "texto",
    texto: "¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito? 🤍",
    estadoNuevo: null
  };
}

function CTA_enviar() {
  return {
    tipo: "boton",
    body: "Aquí tienes tu acceso directo al diagnóstico gratuito 🤍",
    button: "Agendar ahora",
    urlAgenda: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9",
    estadoNuevo: null
  };
}

function CTA_llamada() {
  return {
    tipo: "texto",
    texto: "Si prefieres, puedo pedir que una profesional te llame en horario laboral para ayudarte con tu hora. ¿Quieres que lo coordinemos? ☎️",
    estadoNuevo: null
  };
}

// ============================================================
// PLANES → RESPUESTAS TÉCNICAS + COMERCIALES
// ============================================================
function recomendarPlanCorporal(texto) {
  if (match(texto, palabras.grasa_abdomen)) {
    return {
      plan: "Lipo Express",
      precio: 432000,
      desc: "Lipo Express reduce abdomen y cintura con HIFU 12D, Cavitación y Radiofrecuencia profunda. Resultados desde las primeras semanas."
    };
  }

  if (match(texto, palabras.grasa_cuerpo)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      desc: "Lipo Focalizada Reductiva trabaja piernas y cartucheras con Cavitación + Radiofrecuencia + drenaje, mejorando volumen y celulitis."
    };
  }

  if (match(texto, palabras.brazos)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      desc: "Para brazos afinamos y definimos con Cavitación + Radiofrecuencia médica."
    };
  }

  if (texto.includes("flacidez")) {
    return {
      plan: "Body Tensor",
      precio: 232000,
      desc: "Body Tensor reafirma tejido corporal con Radiofrecuencia médica + EMS Sculptor."
    };
  }

  if (match(texto, palabras.tono)) {
    return {
      plan: "Body Fitness",
      precio: 360000,
      desc: "Body Fitness define y tonifica con EMS Sculptor (20.000 contracciones por sesión)."
    };
  }

  if (match(texto, palabras.gluteos)) {
    return {
      plan: "Push Up Glúteos",
      precio: 376000,
      desc: "Push Up levanta y da volumen al glúteo con EMS Pro Sculpt + Radiofrecuencia compactante."
    };
  }

  return null;
}

function recomendarPlanFacial(texto) {
  if (match(texto, palabras.arrugas)) {
    return {
      plan: "Face Antiage",
      precio: 281600,
      desc: "Face Antiage suaviza arrugas y líneas con Toxina, Radiofrecuencia médica y Pink Glow regenerativo."
    };
  }

  if (match(texto, palabras.flacidez_facial)) {
    return {
      plan: "Face Elite",
      precio: 358400,
      desc: "Face Elite da efecto lifting no invasivo con HIFU 12D + RF + Pink Glow."
    };
  }

  if (match(texto, palabras.papada)) {
    return {
      plan: "Face Papada",
      precio: 198400,
      desc: "Face Papada reduce papada y define contorno con HIFU 12D + lipolítico facial + RF médica."
    };
  }

  if (match(texto, palabras.manchas)) {
    return {
      plan: "Face Smart",
      precio: 198400,
      desc: "Face Smart aclara manchas y mejora el tono con Pink Glow + limpieza profunda."
    };
  }

  if (match(texto, palabras.textura)) {
    return {
      plan: "Face Light",
      precio: 128800,
      desc: "Face Light mejora textura y poros con limpieza profesional + RF suave + Pink Glow."
    };
  }

  if (match(texto, palabras.face_h12)) {
    return {
      plan: "Face H12",
      precio: 270400,
      desc: "Face H12 combina HIFU 12D facial + RF + Pink Glow para lifting profundo."
    };
  }

  if (match(texto, palabras.face_one)) {
    return {
      plan: "Face One",
      precio: 128800,
      desc: "Face One da efecto inmediato con RF médica + Pink Glow. Ideal cuando quieres verte mejor rápido."
    };
  }

  if (texto.includes("full face")) {
    return {
      plan: "Full Face",
      precio: 584000,
      desc: "Full Face es un rejuvenecimiento completo con HIFU 12D + RF médica + Pink Glow."
    };
  }

  return null;
}

function recomendarDepilacion(texto) {
  if (match(texto, palabras.depilacion)) {
    return {
      plan: "Depilación Láser DL900",
      precio: 153600,
      desc: "Trabajamos con láser diodo DL900. Sesiones cada 15 días, sensación cálida y resultados progresivos sesión a sesión."
    };
  }
  return null;
}

// ============================================================
// DETECTAR CAMPAÑA
// ============================================================
function detectarCampaña(texto) {
  const planes = [
    "push up","lipo express","lipo focalizada","lipo reductiva",
    "body tensor","body fitness","face elite","face antiage",
    "face smart","face light","face papada","face h12",
    "face one","full face","depilación","depilacion"
  ];

  const t = texto.toLowerCase();
  for (const p of planes) {
    if (t.includes(`plan ${p}`) || t.includes(p)) return p;
  }
  return null;
}

function describirCampaña(plan) {
  const p = plan.toLowerCase();

  if (p.includes("push up")) return recomendarPlanCorporal("gluteos").desc;
  if (p.includes("lipo express")) return recomendarPlanCorporal("abdomen").desc;
  if (p.includes("lipo focalizada")) return recomendarPlanCorporal("piernas").desc;
  if (p.includes("lipo reductiva")) return recomendarPlanCorporal("piernas celulitis").desc;
  if (p.includes("body tensor")) return recomendarPlanCorporal("flacidez").desc;
  if (p.includes("body fitness")) return recomendarPlanCorporal("marcación").desc;
  if (p.includes("face elite")) return recomendarPlanFacial("rostro caido").desc;
  if (p.includes("face antiage")) return recomendarPlanFacial("arrugas").desc;
  if (p.includes("face smart")) return recomendarPlanFacial("manchas").desc;
  if (p.includes("face light")) return recomendarPlanFacial("textura").desc;
  if (p.includes("face papada")) return recomendarPlanFacial("papada").desc;
  if (p.includes("face h12")) return recomendarPlanFacial("h12").desc;
  if (p.includes("face one")) return recomendarPlanFacial("one").desc;
  if (p.includes("full face")) return recomendarPlanFacial("full face").desc;
  if (p.includes("depilacion") || p.includes("depilación")) return recomendarDepilacion("depilar").desc;

  return "Es un plan muy solicitado por sus resultados rápidos y visibles.";
}

// ============================================================
// MOTOR PRINCIPAL
// ============================================================
export async function procesarMensaje(usuario, texto, memoria) {
  const t = (texto || "").toLowerCase().trim();

  const mem = memoria || {
    ultimo_plan: null,
    intentosAgenda: 0
  };

  // ============================================================
  // SALUDO / APERTURA
  // ============================================================
  const esSaludo =
    t.includes("hola") ||
    t.includes("buenas") ||
    t.includes("holi") ||
    t.includes("holaa") ||
    t.includes("holaaa");

  if (esSaludo && !mem.ultimo_plan) {
    return {
      tipo: "texto",
      texto:
        "¡Hola! Soy Zara de Body Elite 🤍\n" +
        "Cuéntame con confianza, ¿qué parte te gustaría mejorar primero: rostro, abdomen, piernas, glúteos o depilación láser?",
      estadoNuevo: mem
    };
  }

  // ============================================================
  // AGENDAR
  // ============================================================
  const quiereAgendar =
    match(t, palabras.agendar) ||
    ["si","sí","ok","dale","agenda","quiero","hagamos","perfecto","ya","sí quiero"].includes(t);

  if (quiereAgendar) {
    mem.intentosAgenda++;

    if (mem.intentosAgenda === 1) return { ...CTA_ofrecer(), estadoNuevo: mem };
    if (mem.intentosAgenda === 2 || mem.intentosAgenda === 3) return { ...CTA_enviar(), estadoNuevo: mem };
    if (mem.intentosAgenda >= 4) return { ...CTA_llamada(), estadoNuevo: mem };
  }

  // ============================================================
  // CAMPAÑA
  // ============================================================
  const camp = detectarCampaña(t);
  if (camp) {
    mem.ultimo_plan = camp;

    return {
      tipo: "texto",
      texto:
        `¡Qué bueno tenerte por aquí! Veo que vienes desde nuestra campaña del **${camp}** 💛\n\n` +
        `${describirCampaña(camp)}\n\n` +
        `¿Quieres que te deje tu acceso al diagnóstico gratuito para ver cuántas sesiones necesitas?`,
      estadoNuevo: mem
    };
  }

  // ============================================================
  // FACIAL
  // ============================================================
  const facial = recomendarPlanFacial(t);
  if (facial) {
    mem.ultimo_plan = facial.plan;
    return {
      tipo: "texto",
      texto:
        `${facial.desc}\n\n` +
        `Valor desde: $${facial.precio.toLocaleString("es-CL")}\n` +
        `¿Quieres que te deje el acceso para tu diagnóstico gratuito?`,
      estadoNuevo: mem
    };
  }

  // ============================================================
  // CORPORAL
  // ============================================================
  const corporal = recomendarPlanCorporal(t);
  if (corporal) {
    mem.ultimo_plan = corporal.plan;
    return {
      tipo: "texto",
      texto:
        `${corporal.desc}\n\n` +
        `Valor desde: $${corporal.precio.toLocaleString("es-CL")}\n` +
        `¿Quieres que te deje el acceso al diagnóstico gratuito?`,
      estadoNuevo: mem
    };
  }

  // ============================================================
  // DEPILACIÓN
  // ============================================================
  const dep = recomendarDepilacion(t);
  if (dep) {
    mem.ultimo_plan = dep.plan;
    return {
      tipo: "texto",
      texto:
        `${dep.desc}\n\n` +
        `Valor desde: $${dep.precio.toLocaleString("es-CL")}\n` +
        `¿Quieres que te deje el acceso para el diagnóstico gratuito?`,
      estadoNuevo: mem
    };
  }

  // ============================================================
  // YA HUBO PLAN ANTES
  // ============================================================
  if (mem.ultimo_plan) {
    return {
      tipo: "texto",
      texto:
        `Puedo contarte más sobre **${mem.ultimo_plan}**.\n` +
        `¿Te gustaría que veamos cuántas sesiones necesitas con un diagnóstico gratuito?`,
      estadoNuevo: mem
    };
  }

  // ============================================================
  // DEFAULT
  // ============================================================
  return {
    tipo: "texto",
    texto:
      "No me quedó claro lo que deseas trabajar. ¿Quieres mejorar volumen, flacidez, arrugas, papada o prefieres depilación láser? 🤍",
    estadoNuevo: mem
  };
}
