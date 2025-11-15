// ======================================================
// motor_respuesta_v3.js  (versión final v4)
// Zara Body Elite – Motor clínico + comercial
// ======================================================

import { leerMemoria, guardarMemoria } from "./memoria.js";

// ======================================================
// FUNCIÓN PRINCIPAL
// ======================================================
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

// ======================================================
// DETECTORES DE PALABRAS
// ======================================================

const keywords = {
  arrugas: [
    "arruga", "arrugas", "patas de gallo", "líneas", "lineas", "lineas de expresión",
    "expresión", "expresion", "ceño", "entrecejo", "frente marcada"
  ],
  flacidez_facial: [
    "flacidez", "flacida", "piel suelta", "rostro caído", "papada leve",
    "contorno caído", "descolgado"
  ],
  papada: ["papada", "doble mentón", "menton", "mentón"],
  manchas: ["manchas", "manchita", "melasma", "opaca", "opacidad", "luminosidad"],
  textura: ["textura", "poros", "poros abiertos", "piel áspera"],
  grasa_abdomen: [
    "abdomen","abomen","guata","guatita","panza","pansa","rollito","rollitos","llanta",
    "rollo","flotador","cintura","estómago","estomago"
  ],
  grasa_cuerpo: [
    "piernas","muslos","cartuchera","cartucheras","pierna","muslo","muslito","celulitis","retención"
  ],
  brazos: ["brazo","brazos","ala de murcielago","murciélago"],
  gluteos: ["glúteos","gluteos","poto","colita","nalgas","gluteo caído","levantar"],
  tono_muscular: ["marcación","marcar","tonificar","tono","tonificar abdomen","musculo"],
  depilacion: ["depilar","depilación","depilacion","pelo","pelos","vello","vellos","laser","láser"],
  botox: ["botox","toxina","toxina botulinica","antiarrugas","botulinica","botulínica"],
  funcionamiento: ["cómo funciona","como funciona","en qué consiste","en que consiste","qué máquina","que máquina","maquinas"],
  precio: ["precio","vale","cuesta","caro","barato","valor","cuánto sale","cuanto sale"],
  sesiones: ["sesiones","cuantas sesiones","número de sesiones","numero de sesiones"],
  resultados: ["resultados","cuando se ven","cuándo veo","demora","cuanto demora","vale la pena","sirve"],
  dolor: ["duele","dolor","molesta","ardor","incomodo"],
  ubicacion: ["donde están","ubicación","como llegar","direccion","dirección","donde quedan"],
  agendar: ["agendar","reservar","quiero ir","quiero agendar","link","pasame el link","agendo","agenda"]
};

// ======================================================
// PLANES Y REGLAS CLÍNICAS
// ======================================================
function recomendarPlan(texto) {
  texto = texto.toLowerCase();

  // ARRUGAS → Face Antiage (principal) + Face Elite alternativa
  if (match(texto, keywords.arrugas)) {
    return {
      principal: "Face Antiage",
      precio: 281600,
      alternativa: "Face Elite",
      texto: `Para arrugas, líneas de expresión o patas de gallo, el plan que mejores resultados entrega es **Face Antiage**, porque incluye toxina botulínica cuando corresponde y trabaja firmeza al mismo tiempo.  
En tu evaluación también revisamos si **Face Elite** puede ser alternativa según el nivel de flacidez y tejido.`
    };
  }

  // FLACIDEZ FACIAL → Face Elite (principal)
  if (match(texto, keywords.flacidez_facial)) {
    return {
      principal: "Face Elite",
      precio: 358400,
      alternativa: "Face Antiage",
      texto: `Para firmeza y contorno del rostro, **Face Elite** es el plan más completo, porque combina HIFU 12D facial, radiofrecuencia médica y Pink Glow.  
Si además hubiesen arrugas marcadas, se evalúa complementar con **Face Antiage**.`
    };
  }

  // PAPADA
  if (match(texto, keywords.papada)) {
    return {
      principal: "Face Papada",
      precio: 198400,
      texto: `Para papada trabajamos **HIFU 12D facial** + **lipolítico** para afinar contorno.`
    };
  }

  // MANCHAS / TEXTURA → Face Smart
  if (match(texto, keywords.manchas) || match(texto, keywords.textura)) {
    return {
      principal: "Face Smart",
      precio: 198400,
      texto: `Para manchas, opacidad o textura irregular, **Face Smart** combina Pink Glow, RF médica y limpieza profunda.`
    };
  }

  // ABDOMEN / ROLLITOS → Lipo Express
  if (match(texto, keywords.grasa_abdomen)) {
    return {
      principal: "Lipo Express",
      precio: 432000,
      texto: `Para abdomen y rollitos, **Lipo Express** combina HIFU 12D, cavitación y radiofrecuencia para reducción, firmeza y modelado.`
    };
  }

  // PIERNAS / CELULITIS → Body Tensor
  if (match(texto, keywords.grasa_cuerpo)) {
    return {
      principal: "Body Tensor",
      precio: 232000,
      texto: `Para firmeza y retención en piernas o muslos, **Body Tensor** trabaja RF profunda + EMS.`
    };
  }

  // BRAZOS
  if (match(texto, keywords.brazos)) {
    return {
      principal: "Lipo Focalizada Reductiva",
      precio: 348800,
      texto: `Para brazos sueltos o con grasa localizada, **Lipo Focalizada Reductiva** trabaja cavitación + RF firmeza.`
    };
  }

  // GLÚTEOS
  if (match(texto, keywords.gluteos)) {
    return {
      principal: "Push Up Glúteos",
      precio: 376000,
      texto: `Para levantar y dar forma a glúteos, **Push Up** combina EMS Pro Sculpt + RF profunda.`
    };
  }

  // TONO MUSCULAR
  if (match(texto, keywords.tono_muscular)) {
    return {
      principal: "Body Fitness",
      precio: 360000,
      texto: `Para tono muscular, marcación o fuerza, **Body Fitness** trabaja con EMS Sculptor (20.000 contracciones por sesión).`
    };
  }

  // DEPILACIÓN
  if (match(texto, keywords.depilacion)) {
    return {
      principal: "Depilación Láser",
      precio: 153600,
      texto: `En depilación usamos láser DL900 (diodo), sesiones cada 15 días. Funciona en zonas pequeñas, medianas o grandes.`
    };
  }

  return null;
}

// ======================================================
// UTILIDADES
// ======================================================
function match(texto, lista) {
  return lista.some((w) => texto.includes(w));
}

function CTA() {
  return "Si quieres, puedo dejarte aquí el acceso para reservar tu diagnóstico gratuito 🤍.";
}

function CTA_LLAMADA() {
  return "Si te acomoda más, también podemos coordinar una llamada con una profesional para orientarte mejor. ¿Quieres que te contacten?";
}

// ======================================================
// RESPUESTA PRINCIPAL
// ======================================================

function generarRespuesta(usuario, textoEntrada, memoria) {
  const t = textoEntrada.toLowerCase();

  // ----- REGLA DE INTENCIÓN DE AGENDA -----
  if (match(t, keywords.agendar)) {
    memoria.intentosAgenda++;
    if (memoria.intentosAgenda >= 4) return CTA_LLAMADA();
    return CTA();
  }

  // ----- RECOMENDACIÓN CLÍNICA -----
  const plan = recomendarPlan(t);
  if (plan) {
    memoria.ultimo_plan = plan.principal;

    const textoAlternativa = plan.alternativa
      ? `  
En la evaluación también revisamos si **${plan.alternativa}** sería alternativa según tu tejido.`
      : "";

    return `
${plan.texto}${textoAlternativa}

${CTA()}
`;
  }

  // ----- OTRAS INTENCIONES -----
  if (match(t, keywords.funcionamiento)) {
    return `
Trabajamos con tecnologías clínicas reales como HIFU 12D, cavitación, radiofrecuencia médica, EMS Sculptor y Pink Glow.  
Cada una actúa en una capa distinta del tejido para cambios visibles y seguros.

${CTA()}
    `;
  }

  if (match(t, keywords.precio)) {
    return `
El valor exacto depende de lo que realmente necesitas según tu punto de partida.  
En el diagnóstico gratuito revisamos tu caso y te damos un plan preciso, sin venderte sesiones de más.

${CTA()}
    `;
  }

  if (match(t, keywords.sesiones)) {
    return `
El número de sesiones depende de tu firmeza, retención y grasa.  
En la evaluación medimos tu punto de partida y te damos el número exacto.

${CTA()}
    `;
  }

  if (match(t, keywords.resultados)) {
    return `
La mayoría empieza a notar cambios entre la **3ª y la 4ª sesión**, según tejido, hábitos y retención.

${CTA()}
    `;
  }

  if (match(t, keywords.dolor)) {
    return `
Los tratamientos son muy tolerables. HIFU y RF generan calor agradable, cavitación es vibración, y EMS son contracciones controladas.

${CTA()}
    `;
  }

  if (match(t, keywords.ubicacion)) {
    return `
Estamos en **Av. Las Perdices Nº2990, Local 23, Peñalolén**.

${CTA()}
    `;
  }

  // ----- SI YA TIENE UN PLAN EN CONTEXTO -----
  if (memoria.ultimo_plan) {
    return `
Puedo contarte más sobre **${memoria.ultimo_plan}**.  
¿Quieres saber sobre sesiones, resultados o cómo funciona?

${CTA()}
    `;
  }

  // ----- MENSAJE BASE -----
  return `
Hola, soy Zara del equipo Body Elite 🤍.  
Estoy aquí para ayudarte a encontrar el tratamiento más adecuado para ti.  
¿Qué zona o qué cambio te gustaría mejorar?
`;
}
