// ================================
// motor_respuesta_v3.js – Zara 2.1
// CONTINUIDAD + MEMORIA CONTEXTUAL
// ================================

import { guardarMemoria, leerMemoria } from "./memoria.js";

// ================================
// PLANES OFICIALES
// ================================
const planes = {
  abdomen: {
    nombre: "Lipo Express",
    precio: 432000,
    texto: "Para abdomen trabajamos grasa profunda, retención de líquido y firmeza de la piel. Usamos *HIFU 12D*, cavitación y radiofrecuencia para compactar tejido y definir el contorno abdominal."
  },
  gluteos: {
    nombre: "Push Up Glúteos",
    precio: 376000,
    texto: "En glúteos trabajamos levantamiento, proyección y firmeza usando *EMS Pro Sculpt* y radiofrecuencia profunda para mejorar tono y forma."
  },
  piernas: {
    nombre: "Lipo Reductiva",
    precio: 480000,
    texto: "En piernas abordamos retención de líquido, volumen y celulitis combinando *HIFU 12D*, cavitación y radiofrecuencia profunda."
  },
  brazos: {
    nombre: "Lipo Focalizada Reductiva",
    precio: 348800,
    texto: "En brazos trabajamos grasa localizada y flacidez usando *HIFU 12D* + cavitación + radiofrecuencia para definir contorno y firmeza."
  },
  rostro: {
    nombre: "Face Smart / Face Antiage / Face Elite",
    precio: 128800,
    texto: "En rostro trabajamos firmeza, arrugas finas y luminosidad combinando *HIFU 12D facial*, radiofrecuencia y **Pink Glow** (sin LED)."
  }
};

// ======================================================
// DETECTAR ZONAS
// ======================================================
function detectarZona(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("abdomen") || texto.includes("guata") || texto.includes("panza"))
    return "abdomen";

  if (texto.includes("glute") || texto.includes("poto") || texto.includes("trasero"))
    return "gluteos";

  if (texto.includes("pierna") || texto.includes("muslo"))
    return "piernas";

  if (texto.includes("brazo") || texto.includes("brazos"))
    return "brazos";

  if (texto.includes("cara") || texto.includes("rostro") || texto.includes("arrugas"))
    return "rostro";

  return null;
}

// ======================================================
// RESPUESTAS CONTEXTUALES
// ======================================================
function respuestaPrecio(zona, plan) {
  return `
Entiendo tu duda 🤍 y te lo explico con transparencia.

El valor parte desde este plan porque trabajamos con tecnologías clínicas como *HIFU 12D*, cavitación, radiofrecuencia o **Pro Sculpt**, que actúan en profundidad real del tejido para lograr cambios visibles y mantenibles ✨.

Cada persona tiene distinta grasa, firmeza o retención.  
Por eso el valor exacto se ajusta en tu diagnóstico gratuito 🤍.

Si necesitas opciones más acotadas en precio, en tu evaluación revisamos alternativas que se adapten a tu objetivo.`;
}

function respuestaFuncionamiento(zona, plan) {
  return `
Te cuento cómo funciona 🤍.

Las tecnologías que usamos en *${plan}* actúan así:

• **HIFU 12D**: destruye grasa resistente en profundidad.  
• **Cavitación**: rompe adipocitos por vibración.  
• **Radiofrecuencia**: tensa la piel y mejora firmeza.  
• **EMS Pro Sculpt** (si aplica): tonifica con contracciones musculares profundas.

Todo se personaliza según tu punto de partida y lo definimos en tu diagnóstico.`;
}

function respuestaGeneral(plan) {
  return `
Puedo ayudarte con más detalles sobre *${plan}* 🤍.  
Cuéntame qué cosa específica te gustaría saber:  
• resultados  
• dolor  
• sesiones  
• funcionamiento  
• precio  

Estoy aquí para orientarte.`;
}

// ======================================================
// MOTOR PRINCIPAL
// ======================================================
export function generarRespuesta(textoEntrada, remitente) {
  const memoria = leerMemoria(remitente) || {};

  const texto = textoEntrada.toLowerCase();

  // Detectar zona actual
  let zonaDetectada = detectarZona(texto);

  // Si detecta una zona nueva → actualizar memoria
  if (zonaDetectada) {
    const plan = planes[zonaDetectada];

    memoria.ultima_zona = zonaDetectada;
    memoria.ultimo_plan = plan.nombre;
    memoria.ultimo_objetivo = zonaDetectada;

    guardarMemoria(remitente, memoria);

    return `
Para ${zonaDetectada} trabajamos así ✨:

${plan.texto}

El plan que mejores resultados entrega en esta zona es *${plan.nombre}*, desde **$${plan.precio.toLocaleString("es-CL")}**.

¿Quieres que te deje el acceso para tu diagnóstico gratuito?`;
  }

  // ============================================
  // CONTINUIDAD DE CONVERSACIÓN (sin cortar)
  // ============================================

  if (texto.includes("caro") || texto.includes("caros") || texto.includes("precio")) {
    if (memoria.ultimo_plan) {
      return respuestaPrecio(memoria.ultima_zona, memoria.ultimo_plan);
    }
  }

  if (texto.includes("como funciona") || texto.includes("cómo funciona") || texto.includes("funciona")) {
    if (memoria.ultimo_plan) {
      return respuestaFuncionamiento(memoria.ultima_zona, memoria.ultimo_plan);
    }
  }

  if (texto.includes("duele") || texto.includes("dolor")) {
    return `
Generalmente no duele 🤍.  
Las tecnologías como HIFU 12D, cavitación y radiofrecuencia pueden sentirse cálidas o como una vibración, pero son tolerables.

Si quieres lo revisamos en tu diagnóstico gratuito según tu sensibilidad.`;
  }

  if (texto.includes("resultados") || texto.includes("cuándo") || texto.includes("cuando")) {
    return `
Los primeros cambios suelen sentirse entre la **3° y 4° sesión**, dependiendo del plan y de tu punto de partida 🤍.

En el diagnóstico gratuito te indicamos número exacto de sesiones y qué resultados puedes esperar.`;
  }

  // ============================================
  // SI HAY PLAN EN MEMORIA → SEGUIR EL TEMA
  // ============================================
  if (memoria.ultimo_plan) {
    return respuestaGeneral(memoria.ultimo_plan);
  }

  // ============================================
  // SI NO HAY CONTEXTO → MENSAJE BASE
  // ============================================
  return `
Hola 🤍 Soy Zara de Body Elite.  
Estoy aquí para ayudarte a sacar tu mejor versión.

¿Qué zona te gustaría mejorar?`;
}
