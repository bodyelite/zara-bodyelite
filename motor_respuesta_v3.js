/* ===========================================================
   motor_respuesta_v3.js — Versión clínica + comercial v3.1
   Zara Body Elite — Motor completo, autónomo y transversal
   =========================================================== */

import { leerMemoria, guardarMemoria } from "./memoria.js";

// ===========================================================
// ESTRUCTURA PRINCIPAL DEL MOTOR
// ===========================================================

export async function procesarMensaje(usuario, textoEntrada) {
  const memoria = leerMemoria(usuario) || {
    ultima_zona: null,
    ultimo_plan: null,
    ultimo_objetivo: null,
    intentosAgenda: 0,
  };

  const respuesta = generarRespuesta(usuario, textoEntrada, memoria);

  guardarMemoria(usuario, memoria);
  return respuesta;
}

// ===========================================================
// PALABRAS CLAVE — DETECCIÓN CLÍNICA
// ===========================================================

const palabras = {
  // FACIAL
  arrugas: ["arruga", "arrugas", "patas de gallo", "pata de gallo", "líneas", "lineas", "lineas de expresión", "expresión", "ceño", "entrecejo", "frente marcada"],
  flacidez_facial: ["flacidez", "flacida", "piel suelta", "rostro caído", "rostro caido", "contorno caído", "contorno caido", "descolgado"],
  papada: ["papada", "doble mentón", "doble menton", "mentón", "menton"],

  manchas: ["manchas", "manchitas", "melasma", "opaca", "opacidad", "luminosidad"],
  textura: ["textura", "poros", "poros abiertos", "piel áspera", "piel aspera"],

  // CORPORAL
  grasa_abdomen: ["abdomen", "guata", "guatita", "panza", "pansa", "rollito", "rollitos", "flotador", "cintura", "estomago", "estómago"],
  grasa_cuerpo: ["piernas", "pierna", "muslo", "muslos", "cartuchera", "cartucheras", "celulitis", "retención", "retencion"],
  brazos: ["brazo", "brazos", "ala de murcielago", "murcielago"],
  gluteos: ["glúteo", "gluteo", "glúteos", "gluteos", "poto", "colita", "nalgas", "levantar", "gluteo caido", "glúteo caído"],
  tono: ["marcación", "marcacion", "marcar", "tonificar", "tono", "EMS", "músculo", "musculo"],

  // DEPILACIÓN
  depilacion: ["depilar", "depilación", "depilacion", "pelo", "pelos", "vello", "vellos", "rebaje", "axila", "pierna completa", "laser", "láser"],

  // INTENCIONES
  funcionamiento: ["como funciona", "cómo funciona", "en qué consiste", "que máquinas usan", "qué maquinas usan", "maquina", "máquina"],
  precio: ["precio", "vale", "cuesta", "caro", "valor", "barato", "cuanto sale", "cuánto sale", "cuanto vale"],
  sesiones: ["sesiones", "cuantas sesiones", "número de sesiones", "numero de sesiones"],
  resultados: ["resultados", "cuando se ven", "cuándo veo", "cuanto demora", "demora", "sirve", "vale la pena"],
  dolor: ["duele", "dolor", "molesta", "ardor", "incomodo"],
  ubicacion: ["donde están", "ubicación", "como llegar", "dirección", "donde quedan"],
  agendar: ["agendar", "reservar", "quiero ir", "quiero agendar", "link", "pasame el link", "quiero hora", "agenda"],
};

// ===========================================================
// UTILIDADES
// ===========================================================

const match = (texto, lista) => lista.some((w) => texto.includes(w));

// CTA inteligente
function CTA_ofrecer() {
  return "Si quieres, puedo dejarte aquí el acceso para agendar tu diagnóstico gratuito. Es sin costo.";
}

function CTA_enviar() {
  return "Aquí tienes el enlace directo para reservar tu diagnóstico gratuito:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function CTA_llamada() {
  return "Si te acomoda más, puedo coordinar que una profesional te llame en horario laboral para ayudarte a elegir tu hora. ¿Quieres que te contacten?";
}


// ===========================================================
// REGLAS CLÍNICAS — CORPORAL
// ===========================================================

function recomendarPlanCorporal(texto) {
  // GRASA ABDOMINAL / ROLLITOS
  if (match(texto, palabras.grasa_abdomen)) {
    return {
      plan: "Lipo Express",
      precio: 432000,
      descripcion: `
Para abdomen, guatita o rollitos, el plan que mejores resultados entrega es **Lipo Express**.

Trabaja tres tecnologías combinadas:
• **HIFU 12D** para grasa profunda resistente  
• **Cavitación** para romper adipocitos  
• **Radiofrecuencia médica** para firmeza

Te ayuda a reducir volumen, definir contorno y mejorar la firmeza al mismo tiempo.
`
    };
  }

  // GRASA EN PIERNAS / CARTUCHERAS
  if (match(texto, palabras.grasa_cuerpo)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: `
Para grasa localizada en piernas, muslos o cartucheras, se indica **Lipo Focalizada Reductiva**.

Combina:
• **Cavitación** para romper adipocitos  
• **Radiofrecuencia profunda** para firmeza  
• **Drenaje** si hay retención

Es ideal cuando hay volumen o celulitis.
`
    };
  }

  // BRAZOS
  if (match(texto, palabras.brazos)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: `
Para brazos con volumen o flacidez leve, el tratamiento indicado es **Lipo Focalizada Reductiva**.

Incluye:
• Cavitación  
• Radiofrecuencia médica  
• Trabajo específico en firmeza y contorno del brazo
`
    };
  }

  // GLÚTEOS
  if (match(texto, palabras.gluteos)) {
    return {
      plan: "Push Up Glúteos",
      precio: 376000,
      descripcion: `
Para levantar, dar forma y mejorar la proyección de glúteos, se utiliza **Push Up Glúteos**.

Incluye:
• **EMS Pro Sculpt** (contracciones profundas)  
• **Radiofrecuencia profunda** para firmeza  
• Modelado según la caída o forma que quieras lograr
`
    };
  }

  // TONO MUSCULAR / MARCACIÓN
  if (match(texto, palabras.tono)) {
    return {
      plan: "Body Fitness",
      precio: 360000,
      descripcion: `
Para tonificar, marcar o fortalecer la zona, trabajamos con **Body Fitness**.

Incluye:
• **EMS Sculptor** (20.000 contracciones por sesión)  
• Rutina personalizada según objetivo  
• Firmeza + tono muscular
`
    };
  }

  // FLACIDEZ CORPORAL
  if (texto.includes("flacidez") || texto.includes("flácido") || texto.includes("flacida")) {
    return {
      plan: "Body Tensor",
      precio: 232000,
      descripcion: `
Para flacidez corporal, el tratamiento más efectivo es **Body Tensor**.

Trabajamos:
• Radiofrecuencia médica profunda  
• EMS para tonificar  
• Enfocado en firmeza y retracción de piel
`
    };
  }

  return null;
}


// ===========================================================
// REGLAS CLÍNICAS — FACIAL
// ===========================================================

function recomendarPlanFacial(texto) {

  // ARRUGAS / LÍNEAS — Face Antiage como principal
  if (match(texto, palabras.arrugas)) {
    return {
      plan: "Face Antiage",
      precio: 281600,
      descripcion: `
Para arrugas, patas de gallo o líneas de expresión, lo más efectivo es **Face Antiage**.

Incluye:
• **Toxina** cuando es clínicamente necesaria  
• **Radiofrecuencia médica** para firmeza  
• **Pink Glow** para luminosidad y textura  
• Trabajo integral en frente, patas de gallo y entrecejo

Es el tratamiento más completo para suavizar líneas y mejorar la calidad de la piel.

Según tu evaluación, también revisamos si **Face Elite** sería alternativa si hay más flacidez.
`
    };
  }

  // FLACIDEZ FACIAL — Face Elite
  if (match(texto, palabras.flacidez_facial)) {
    return {
      plan: "Face Elite",
      precio: 358400,
      descripcion: `
Para firmeza, contorno y efecto lifting sin cirugía, el plan más completo es **Face Elite**.

Incluye:
• **HIFU 12D facial** para tensar capas profundas  
• **Radiofrecuencia médica** para colágeno  
• **Pink Glow** para textura y luminosidad  

Es ideal para contorno caído, mejillas sin firmeza o pérdida de estructura facial.

Si además tienes líneas de expresión marcadas, en la evaluación vemos si **Face Antiage** es mejor alternativa.
`
    };
  }

  // PAPADA — plan especializado
  if (match(texto, palabras.papada)) {
    return {
      plan: "Face Papada",
      precio: 198400,
      descripcion: `
Para papada trabajamos el plan **Face Papada**, enfocado en reducir volumen y afinar contorno facial.

Incluye:
• **HIFU 12D submentón**  
• **Lipolítico facial**  
• Radiofrecuencia para firmeza  

Es ideal para perfilar el rostro y disminuir el doble mentón.
`
    };
  }

  // MANCHAS / OPACIDAD — Face Smart
  if (match(texto, palabras.manchas)) {
    return {
      plan: "Face Smart",
      precio: 198400,
      descripcion: `
Para manchas, opacidad o tono disparejo, utilizamos **Face Smart**.

Incluye:
• **Pink Glow** (antioxidantes + péptidos)  
• **Limpieza profunda**  
• **Radiofrecuencia médica**  
• Tratamiento personalizado según tipo de mancha

El resultado es una piel más luminosa, pareja y saludable.
`
    };
  }

  // TEXTURA / POROS — Face Light
  if (match(texto, palabras.textura)) {
    return {
      plan: "Face Light",
      precio: 128800,
      descripcion: `
Para textura, poros abiertos o piel áspera, trabajamos con **Face Light**.

Incluye:
• Limpieza profunda  
• Radiofrecuencia suave  
• Pink Glow para mejorar luminosidad y suavidad  
• Hidratación profunda

Ideal para mejorar la calidad superficial de la piel.
`
    };
  }

  return null;
}


// ===========================================================
// REGLAS CLÍNICAS — DEPILACIÓN
// ===========================================================

function recomendarDepilacion(texto) {
  if (match(texto, palabras.depilacion)) {
    return {
      plan: "Depilación Láser",
      precio: 153600,
      descripcion: `
En depilación trabajamos con **láser diodo DL900**, seguro para distintos fototipos.

• Sesiones cada **15 días**  
• Zonas pequeñas, medianas o grandes  
• Muy tolerable (sensación cálida)  
• Resultados progresivos por ciclo de crecimiento  

En tu evaluación vemos la zona exacta que quieres trabajar y el plan ideal.
`
    };
  }
  return null;
}

// ===========================================================
// RESPUESTAS GENERALES (funcionamiento, sesiones, dolor…)
// ===========================================================

function respuestaFuncionamiento() {
  return `
Trabajamos con tecnologías clínicas reales como:

• **HIFU 12D** para grasa profunda o firmeza  
• **Cavitación** para adipocitos  
• **Radiofrecuencia médica** para colágeno  
• **EMS Sculptor** para tono muscular  
• **Pink Glow** para luminosidad  
• **Lipolítico facial/corporal** cuando se requiere  

Cada persona es distinta, por eso ajustamos el plan en tu diagnóstico gratuito.

${CTA_ofrecer()}
`;
}

function respuestaSesiones() {
  return `
La cantidad de sesiones depende del estado de tu tejido (firmeza, grasa, retención o arrugas).

En la evaluación te damos un número real y un plan ajustado a ti.

${CTA_ofrecer()}
`;
}

function respuestaResultados() {
  return `
Los resultados suelen verse desde la **3° o 4° sesión**, dependiendo de tu retención, metabolismo y firmeza.

${CTA_ofrecer()}
`;
}

function respuestaDolor() {
  return `
Los tratamientos son muy tolerables:

• HIFU → calor profundo  
• Cavitación → vibración  
• RF → calor agradable  
• EMS → contracciones controladas  

Todo es seguro y sin reposo posterior.

${CTA_ofrecer()}
`;
}

function respuestaUbicacion() {
  return `
Estamos en **Av. Las Perdices Nº2990, Local 23, Peñalolén**.

${CTA_ofrecer()}
`;
}

// ===========================================================
// MOTOR PRINCIPAL DE RESPUESTA
// ===========================================================

function generarRespuesta(usuario, texto, memoria) {
  const t = texto.toLowerCase();

  // ============================
  // 1) INTENCIÓN DE AGENDAR
  // ============================
  if (match(t, palabras.agendar)) {
    memoria.intentosAgenda++;

    // 4to intento → ofrecer llamada
    if (memoria.intentosAgenda === 4) {
      return CTA_llamada();
    }

    // desde el 2º intento → enviar CTA directo
    if (memoria.intentosAgenda > 1) {
      return CTA_enviar();
    }

    // primer intento → ofrecer CTA
    return CTA_ofrecer();
  }

  // ============================
  // 2) REGLAS CLÍNICAS FACIALES
  // ============================
  const facial = recomendarPlanFacial(t);
  if (facial) {
    memoria.ultimo_plan = facial.plan;

    return `
${facial.descripcion}

**Valor desde:** $${facial.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ============================
  // 3) REGLAS CLÍNICAS CORPORALES
  // ============================
  const corporal = recomendarPlanCorporal(t);
  if (corporal) {
    memoria.ultimo_plan = corporal.plan;

    return `
${corporal.descripcion}

**Valor desde:** $${corporal.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ============================
  // 4) REGLAS DEPILACIÓN
  // ============================
  const dep = recomendarDepilacion(t);
  if (dep) {
    memoria.ultimo_plan = dep.plan;

    return `
${dep.descripcion}

**Valor desde:** $${dep.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ============================
  // 5) INTENCIONES GENERALES
  // ============================

  if (match(t, palabras.funcionamiento)) return respuestaFuncionamiento();
  if (match(t, palabras.precio)) return CTA_ofrecer();
  if (match(t, palabras.sesiones)) return respuestaSesiones();
  if (match(t, palabras.resultados)) return respuestaResultados();
  if (match(t, palabras.dolor)) return respuestaDolor();
  if (match(t, palabras.ubicacion)) return respuestaUbicacion();

  // ============================
  // 6) CONTINUIDAD SI YA EXISTE PLAN
  // ============================
  if (memoria.ultimo_plan) {
    return `
¿Quieres que revisemos cuántas sesiones y qué resultados podrías esperar con **${memoria.ultimo_plan}**?

${CTA_ofrecer()}
`;
  }

  // ============================
  // 7) FALLBACK (pregunta abierta)
  // ============================
  return `
Soy Zara del equipo Body Elite 🤍  
Cuéntame, ¿qué zona o qué cambio te gustaría mejorar?
`;
}

