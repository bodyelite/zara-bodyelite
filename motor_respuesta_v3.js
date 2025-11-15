/* ===========================================================
   motor_respuesta_v3.js — Motor Clínico + Comercial v3.1 Final
   Zara Body Elite — Semántica Suave + Planes + Campañas por texto
   =========================================================== */

import { leerMemoria, guardarMemoria } from "./memoria.js";

// ===========================================================
// PROCESADOR PRINCIPAL
// ===========================================================

export async function procesarMensaje(usuario, textoEntrada) {
  const memoria = leerMemoria(usuario) || {
    ultimo_plan: null,
    intentosAgenda: 0,
  };

  const respuesta = generarRespuesta(usuario, textoEntrada, memoria);

  guardarMemoria(usuario, memoria);
  return respuesta;
}

// ===========================================================
// PALABRAS CLAVE — SEMÁNTICA SUAVE
// ===========================================================

const palabras = {
  // FACIAL
  arrugas: ["arruga", "arrugas", "patas de gallo", "pata de gallo", "líneas", "lineas", "lineas de expresión", "expresión", "ceño", "entrecejo", "frente marcada"],
  flacidez_facial: ["flacidez", "flacida", "piel suelta", "rostro caído", "rostro caido", "contorno caído", "contorno caido", "descolgado"],
  papada: ["papada", "doble mentón", "doble menton", "mentón", "menton"],
  manchas: ["manchas", "manchitas", "melasma", "opaca", "opacidad", "luminosidad"],
  textura: ["textura", "poros", "poros abiertos", "piel áspera", "piel aspera"],
  
  // NUEVOS PLANES FACIALES
  face_h12: ["face h12", "h12", "h 12"],
  face_one: ["face one", "one"],

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
  sesiones: ["sesiones", "cuantas sesiones", "número de sesiones", "numero de sesiones"],
  resultados: ["resultados", "cuando se ven", "cuándo veo", "cuanto demora", "demora", "sirve", "vale la pena"],
  dolor: ["duele", "dolor", "molesta", "ardor", "incomodo"],
  ubicacion: ["donde están", "ubicación", "como llegar", "dirección", "donde quedan"],
  agendar: ["agendar", "reservar", "quiero ir", "quiero agendar", "link", "pasame el link", "quiero hora", "agenda", "agendo"],
};

// ===========================================================
// UTILIDADES GENERALES
// ===========================================================

const match = (texto, lista) => lista.some((w) => texto.includes(w));

// CTA LÓGICA
function CTA_ofrecer() {
  return "¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito? Es sin costo.";
}

function CTA_enviar() {
  return "Aquí tienes el acceso directo para agendar tu diagnóstico gratuito:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function CTA_llamada() {
  return "Si prefieres, también puedo pedir que una profesional te llame en horario laboral para ayudarte a elegir tu hora. ¿Quieres que lo coordinemos?";
}


// ===========================================================
// REGLAS CLÍNICAS — CORPORAL
// ===========================================================

function recomendarPlanCorporal(texto) {

  // ABDOMEN / ROLLITOS / CINTURA — LIPO EXPRESS
  if (match(texto, palabras.grasa_abdomen)) {
    return {
      plan: "Lipo Express",
      precio: 432000,
      descripcion: `
El **Plan Lipo Express** está pensado para reducir volumen en abdomen, cintura y rollitos de forma rápida y visible.

Trabajamos tres tecnologías combinadas:
• **HIFU 12D** para grasa profunda resistente  
• **Cavitación médica** para romper adipocitos  
• **Radiofrecuencia profunda** para firmeza y contorno  

Es ideal si buscas resultados desde las primeras sesiones, especialmente en zonas donde la grasa cuesta más en bajar.  
`
    };
  }

  // PIERNAS / MUSLOS / CARTUCHERAS — LIPO FOCALIZADA
  if (match(texto, palabras.grasa_cuerpo)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: `
El **Plan Lipo Focalizada Reductiva** es perfecto para trabajar **piernas, muslos y cartucheras**, donde suele haber retención y grasa localizada.

Incluye:
• **Cavitación médica** para adipocitos  
• **Radiofrecuencia profunda** para firmeza  
• Drenaje si hay retención  

Mejora contorno, celulitis y volumen al mismo tiempo.  
`
    };
  }

  // BRAZOS
  if (match(texto, palabras.brazos)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: `
Para brazos con volumen o flacidez leve, trabajamos con **Lipo Focalizada Reductiva**.

Incluye:
• Cavitación  
• Radiofrecuencia profunda  
• Trabajo específico para contorno del brazo  

Ideal para afinar y mejorar firmeza.  
`
    };
  }

  // FLACIDEZ CORPORAL — BODY TENSOR
  if (texto.includes("flacidez") || texto.includes("flácida") || texto.includes("flacida")) {
    return {
      plan: "Body Tensor",
      precio: 232000,
      descripcion: `
El **Plan Body Tensor** está diseñado específicamente para **flacidez corporal**.

Incluye:
• **Radiofrecuencia médica profunda** para tensado  
• **EMS Sculptor** para tono muscular  
• Protocolos de retracción de piel  

Ideal si buscas firmeza y mejor caída del tejido.  
`
    };
  }

  // TONO MUSCULAR / MARCACIÓN — BODY FITNESS
  if (match(texto, palabras.tono)) {
    return {
      plan: "Body Fitness",
      precio: 360000,
      descripcion: `
El **Plan Body Fitness** trabaja **tono, definición y fortalecimiento muscular**.

Incluye:
• **EMS Sculptor** con 20.000 contracciones por sesión  
• Protocolos de musculación no invasiva  
• Trabajo personalizado según objetivo (marcación, abdomen firme, glúteo más tonificado)  
`
    };
  }

  // GLÚTEOS / LEVANTAR / FORMA — PUSH UP
  if (match(texto, palabras.gluteos)) {
    return {
      plan: "Push Up Glúteos",
      precio: 376000,
      descripcion: `
El **Plan Push Up Glúteos** está enfocado en levantar, afirmar y mejorar la forma del glúteo sin cirugía.

Incluye:
• **EMS Pro Sculpt** (20.000 contracciones profundas)  
• **Radiofrecuencia médica** para firmeza  
• Trabajo según caída, simetría y forma que quieras lograr  

Excelente para proyección, firmeza y levantamiento natural.  
`
    };
  }

  return null;
}


// ===========================================================
// REGLAS CLÍNICAS — FACIAL
// ===========================================================

function recomendarPlanFacial(texto) {

  // ARRUGAS / PATAS DE GALLO / LÍNEAS — FACE ANTIAGE
  if (match(texto, palabras.arrugas)) {
    return {
      plan: "Face Antiage",
      precio: 281600,
      descripcion: `
El **Plan Face Antiage** está diseñado para suavizar arrugas, patas de gallo, líneas de expresión y rasgos de cansancio.

Incluye:
• **Toxina** cuando es clínicamente indicada  
• **Radiofrecuencia médica** para firmeza  
• **Pink Glow** para textura y luminosidad  
• Trabajo en frente, entrecejo y contorno de ojos  

Da un aspecto más descansado, suave y rejuvenecido.

En tu evaluación revisamos si **Face Elite** sería mejor alternativa si además hay flacidez.  
`
    };
  }

  // FLACIDEZ FACIAL / CONTORNO CAÍDO — FACE ELITE
  if (match(texto, palabras.flacidez_facial)) {
    return {
      plan: "Face Elite",
      precio: 358400,
      descripcion: `
El **Plan Face Elite** es el más completo para **lifting, firmeza y contorno facial**, sin cirugía.

Incluye:
• **HIFU 12D facial** para tensado profundo (capa SMAS)  
• **Radiofrecuencia médica** para colágeno  
• **Pink Glow** para textura y luminosidad  

Ideal para contorno marcado, mejillas caídas, mandíbula menos definida o sensación de “rostro cansado”.

Si además hay líneas marcadas, revisamos si **Face Antiage** es mejor para complementar.  
`
    };
  }

  // PAPADA / DOBLE MENTÓN — FACE PAPADA
  if (match(texto, palabras.papada)) {
    return {
      plan: "Face Papada",
      precio: 198400,
      descripcion: `
El **Plan Face Papada** trabaja la zona submentón para reducir volumen y definir el contorno inferior del rostro.

Incluye:
• **HIFU 12D submentón** para grasa profunda  
• **Lipolítico facial** para adiposidad localizada  
• **Radiofrecuencia médica** para firmeza  

Ideal cuando hay doble mentón o pérdida de definición mandibular.  
`
    };
  }

  // MANCHAS / OPACIDAD — FACE SMART
  if (match(texto, palabras.manchas)) {
    return {
      plan: "Face Smart",
      precio: 198400,
      descripcion: `
El **Plan Face Smart** está orientado a **manchas, tono disparejo y piel opaca**.

Incluye:
• **Pink Glow** (péptidos + antioxidantes)  
• **Limpieza profunda**  
• **Radiofrecuencia suave**  
• Protocolos para uniformar tono y aclarar zonas comprometidas  

Ideal para piel apagada o con manchas recientes.  
`
    };
  }

  // TEXTURA / POROS / ASPECTO IRREGULAR — FACE LIGHT
  if (match(texto, palabras.textura)) {
    return {
      plan: "Face Light",
      precio: 128800,
      descripcion: `
El **Plan Face Light** está enfocado en **textura, poros abiertos y suavidad general**.

Incluye:
• Limpieza profunda  
• Radiofrecuencia suave  
• **Pink Glow** para mejorar luminosidad  
• Hidratación profunda  

Deja la piel más lisa, suave y pareja.  
`
    };
  }

  // NUEVO — FACE H12
  if (match(texto, palabras.face_h12)) {
    return {
      plan: "Face H12",
      precio: 270400,
      descripcion: `
El **Plan Face H12** combina **HIFU 12D facial** con un protocolo de reafirmación profunda.

Incluye:
• HIFU 12D por capas  
• Radiofrecuencia médica  
• Pink Glow  
• Enfoque en mejillas, surcos y contorno inferior  

Ideal cuando buscas un lifting más profundo y progresivo.  
`
    };
  }

  // NUEVO — FACE ONE (rápido y visible)
  if (match(texto, palabras.face_one)) {
    return {
      plan: "Face One",
      precio: 128800,
      descripcion: `
El **Plan Face One** es un tratamiento rápido, enfocado en dar un efecto visible en una sesión.

Incluye:
• Radiofrecuencia médica  
• Pink Glow  
• Protocolos de hidratación y firmeza inmediata  

Ideal para eventos, fotos o cuando buscas un efecto inmediato.  
`
    };
  }

  // DETECCIÓN DIRECTA SI LA PERSONA MENCIONA "Full Face"
  if (texto.includes("full face")) {
    return {
      plan: "Full Face",
      precio: 584000,
      descripcion: `
El **Plan Full Face** es un rejuvenecimiento facial integral que trabaja **todo el rostro** con protocolos avanzados.

Incluye:
• HIFU 12D en zonas clave  
• Radiofrecuencia médica  
• Pink Glow  
• Hidratación y textura  
• Protocolos complementarios según flacidez y arrugas  

Ideal si buscas un cambio global, firmeza, contorno y piel más luminosa.  
`
    };
  }

  return null;
}


// ===========================================================
// REGLAS — DEPILACIÓN
// ===========================================================

function recomendarDepilacion(texto) {
  if (match(texto, palabras.depilacion)) {
    return {
      plan: "Depilación Láser DL900",
      precio: 153600,
      descripcion: `
Trabajamos con **láser diodo DL900**, seguro para distintos fototipos.

• Sesiones cada **15 días**  
• Muy tolerable (sensación cálida)  
• Resultados progresivos por ciclo de crecimiento  
• Ideal para axila, rebaje, piernas, brazos y zona facial  

En tu evaluación vemos la zona exacta y el plan ideal para ti.
`
    };
  }
  return null;
}

// ===========================================================
// RESPUESTAS GENERALES SEGÚN INTENCIÓN
// ===========================================================

function respuestaFuncionamiento() {
  return `
Trabajamos con tecnologías clínicas reales como:

• **HIFU 12D** para grasa profunda o firmeza  
• **Cavitación médica** para adipocitos  
• **Radiofrecuencia médica** para colágeno  
• **EMS Sculptor** para tonificación muscular  
• **Pink Glow** para textura y luminosidad  
• **Lipolítico facial/corporal** cuando se requiere  

Cada persona es distinta, por eso ajustamos el plan en tu diagnóstico gratuito.

${CTA_ofrecer()}
`;
}

function respuestaSesiones() {
  return `
La cantidad de sesiones depende del estado de tu piel o tejido (firmeza, grasa, retención o arrugas).

En la evaluación te damos un número real y un plan ajustado exactamente a tus objetivos.

${CTA_ofrecer()}
`;
}

function respuestaResultados() {
  return `
Los resultados suelen verse desde la **3° o 4° sesión**, dependiendo del metabolismo, retención y firmeza inicial.

${CTA_ofrecer()}
`;
}

function respuestaDolor() {
  return `
Los tratamientos son muy tolerables:

• HIFU → calor profundo  
• Cavitación → vibración  
• Radiofrecuencia → calor agradable  
• EMS → contracciones controladas  
• Láser depilación DL900 → leve calor  

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
// DETECCIÓN DE CAMPAÑAS POR TEXTO — “Plan X”
// ===========================================================

function detectarCampaña(texto) {
  const t = texto.toLowerCase();

  const planes = [
    "push up",
    "lipo express",
    "lipo focalizada",
    "lipo reductiva",
    "body tensor",
    "body fitness",
    "face elite",
    "face antiage",
    "face smart",
    "face light",
    "face papada",
    "face h12",
    "face one",
    "full face",
    "depilación",
    "depilacion",
  ];

  for (const p of planes) {
    if (t.includes(`plan ${p}`) || t.includes(p)) return p;
  }

  return null;
}

// ===========================================================
// MOTOR PRINCIPAL
// ===========================================================

function generarRespuesta(usuario, texto, memoria) {
  const t = texto.toLowerCase();

  // ================
  // 1. CAMPAÑA DETECTADA (Plan X)
  // ================
  const campaña = detectarCampaña(t);

  if (campaña) {
    memoria.ultimo_plan = campaña;

    return describirPlanDirecto(campaña) + `

${CTA_ofrecer()}`;
  }

  // ================
  // 2. INTENCIÓN DE AGENDAR
  // ================
  if (match(t, palabras.agendar) || t === "sí" || t === "si" || t === "ok" || t === "dale") {
    memoria.intentosAgenda++;

    // 4° intento → ofrecer llamada
    if (memoria.intentosAgenda === 4) {
      return CTA_llamada();
    }

    // desde el 2° intento → enviar botón automáticamente
    if (memoria.intentosAgenda > 1) {
      return CTA_enviar();
    }

    // primer intento → solo ofrecer
    return CTA_ofrecer();
  }

  // ================
  // 3. REGLAS FACIALES
  // ================
  const facial = recomendarPlanFacial(t);
  if (facial) {
    memoria.ultimo_plan = facial.plan;

    return `
${facial.descripcion}

**Valor desde:** $${facial.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ================
  // 4. REGLAS CORPORALES
  // ================
  const corporal = recomendarPlanCorporal(t);
  if (corporal) {
    memoria.ultimo_plan = corporal.plan;

    return `
${corporal.descripcion}

**Valor desde:** $${corporal.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ================
  // 5. REGLAS DEPILACIÓN
  // ================
  const dep = recomendarDepilacion(t);
  if (dep) {
    memoria.ultimo_plan = dep.plan;

    return `
${dep.descripcion}

**Valor desde:** $${dep.precio.toLocaleString("es-CL")}

${CTA_ofrecer()}
`;
  }

  // ================
  // 6. INTENCIONES SECUNDARIAS
  // ================
  if (match(t, palabras.funcionamiento)) return respuestaFuncionamiento();
  if (match(t, palabras.sesiones)) return respuestaSesiones();
  if (match(t, palabras.resultados)) return respuestaResultados();
  if (match(t, palabras.dolor)) return respuestaDolor();
  if (match(t, palabras.ubicacion)) return respuestaUbicacion();

  // ================
  // 7. CONTINUIDAD POR PLAN PREVIO
  // ================
  if (memoria.ultimo_plan) {
    return `
Si quieres, puedo contarte más sobre **${memoria.ultimo_plan}**, ya sea resultados, sesiones o funcionamiento.

${CTA_ofrecer()}
`;
  }

  // ================
  // 8. FALLBACK INTELIGENTE
  // ================
  return `
Disculpa, no logré entenderte bien 🤍  
Para ayudarte mejor, cuéntame qué quieres mejorar: **volumen, flacidez, arrugas, papada o depilación**.
`;
}

// ===========================================================
// DESCRIPTOR DIRECTO PARA CAMPAÑAS (Plan X)
// ===========================================================

function describirPlanDirecto(plan) {
  const texto = plan.toLowerCase();

  // Reutiliza los descriptores exactos del motor
  if (texto.includes("push up")) return recomendarPlanCorporal("glúteos").descripcion;
  if (texto.includes("lipo express")) return recomendarPlanCorporal("abdomen").descripcion;
  if (texto.includes("lipo focalizada")) return recomendarPlanCorporal("piernas").descripcion;
  if (texto.includes("lipo reductiva")) return recomendarPlanCorporal("piernas celulitis retencion").descripcion;
  if (texto.includes("body tensor")) return recomendarPlanCorporal("flacidez").descripcion;
  if (texto.includes("body fitness")) return recomendarPlanCorporal("marcación").descripcion;

  if (texto.includes("face elite")) return recomendarPlanFacial("rostro caído").descripcion;
  if (texto.includes("face antiage")) return recomendarPlanFacial("arrugas").descripcion;
  if (texto.includes("face smart")) return recomendarPlanFacial("manchas").descripcion;
  if (texto.includes("face light")) return recomendarPlanFacial("textura").descripcion;
  if (texto.includes("face papada")) return recomendarPlanFacial("papada").descripcion;
  if (texto.includes("face h12")) return recomendarPlanFacial("h12").descripcion;
  if (texto.includes("face one")) return recomendarPlanFacial("one").descripcion;
  if (texto.includes("full face")) return recomendarPlanFacial("full face").descripcion;

  if (texto.includes("depilación") || texto.includes("depilacion")) return recomendarDepilacion("depilar").descripcion;

  return "";
}

