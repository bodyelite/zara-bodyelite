// motor_respuesta_v3.js – Versión estable con procesarMensaje + continuidad

import { leerMemoria, guardarMemoria } from "./memoria.js";

// =========================================
// FUNCIÓN PUENTE PARA SERVER.JS
// =========================================
export async function procesarMensaje(usuario, texto) {
  const memoriaActual = leerMemoria(usuario) || {};

  const respuesta = generarRespuesta(texto, usuario, memoriaActual);

  // guardar el contexto actualizado
  guardarMemoria(usuario, memoriaActual);

  return respuesta;
}

// =========================================
// PLANES OFICIALES
// =========================================
const planes = {
  abdomen: {
    nombre: "Lipo Express",
    precio: 432000,
    texto:
      "Para abdomen trabajamos grasa profunda, retención de líquido y firmeza con *HIFU 12D*, cavitación y radiofrecuencia para compactar tejido y definir el contorno abdominal."
  },
  gluteos: {
    nombre: "Push Up Glúteos",
    precio: 376000,
    texto:
      "En glúteos trabajamos levantamiento, proyección y firmeza usando *EMS Pro Sculpt* y radiofrecuencia profunda."
  },
  piernas: {
    nombre: "Lipo Reductiva",
    precio: 480000,
    texto:
      "En piernas abordamos volumen, retención de líquido y celulitis con *HIFU 12D*, cavitación y radiofrecuencia profunda."
  },
  brazos: {
    nombre: "Lipo Focalizada Reductiva",
    precio: 348800,
    texto:
      "En brazos trabajamos grasa localizada y flacidez con *HIFU 12D*, cavitación y radiofrecuencia para definir el contorno."
  },
  rostro: {
    nombre: "Face Smart / Face Antiage / Face Elite",
    precio: 128800,
    texto:
      "En rostro trabajamos firmeza, arrugas finas y luminosidad usando *HIFU 12D facial*, radiofrecuencia y **Pink Glow** (sin LED)."
  }
};

// =========================================
// DETECTAR ZONA
// =========================================
function detectarZona(texto) {
  texto = texto.toLowerCase();

  if (texto.includes("abdomen") || texto.includes("guata") || texto.includes("panza"))
    return "abdomen";

  if (texto.includes("glute") || texto.includes("poto") || texto.includes("trasero"))
    return "gluteos";

  if (texto.includes("pierna") || texto.includes("muslo"))
    return "piernas";

  if (texto.includes("brazo"))
    return "brazos";

  if (texto.includes("cara") || texto.includes("rostro") || texto.includes("arrugas"))
    return "rostro";

  return null;
}

// =========================================
// RESPUESTAS SECUNDARIAS
// =========================================
function respuestaPrecio(zona, plan) {
  return `
Entiendo completamente tu duda 🤍 y te explico con transparencia.

El valor parte desde el plan recomendado porque trabajamos tecnologías clínicas como *HIFU 12D*, cavitación, radiofrecuencia o **Pro Sculpt**, que actúan en profundidad real del tejido y entregan resultados visibles ✨.

Cada persona tiene un nivel distinto de grasa, firmeza o retención, por eso el valor exacto lo definimos en tu diagnóstico gratuito 🤍.

Si necesitas opciones más acotadas, en tu evaluación revisamos alternativas económicas que se adapten a tu objetivo.`;
}

function respuestaFuncionamiento(zona, plan) {
  return `
Te cuento cómo funciona 🤍.

Las tecnologías que usamos en *${plan}* actúan así:

• **HIFU 12D** destruye grasa resistente.  
• **Cavitación** rompe adipocitos.  
• **Radiofrecuencia** mejora firmeza y textura.  
• **EMS Pro Sculpt** (si aplica) tonifica con contracciones profundas.

Todo se personaliza según tu punto de partida y lo definimos en tu diagnóstico.`;
}

// =========================================
// MOTOR PRINCIPAL
// =========================================

export function generarRespuesta(textoEntrada, remitente, memoria) {
  const texto = textoEntrada.toLowerCase();

  // 1) detectar zona nueva
  const zona = detectarZona(texto);

  if (zona) {
    const plan = planes[zona];

    memoria.ultima_zona = zona;
    memoria.ultimo_plan = plan.nombre;
    memoria.ultimo_objetivo = zona;

    return `
Para ${zona} trabajamos así ✨:

${plan.texto}

El plan con mejores resultados en esta zona es *${plan.nombre}*, desde **$${plan.precio.toLocaleString(
      "es-CL"
    )}**.

¿Quieres que te deje el acceso para tu diagnóstico gratuito?`;
  }

  // 2) continuidad con plan activo
  if (memoria.ultimo_plan) {
    const plan = memoria.ultimo_plan;

    if (texto.includes("caro") || texto.includes("precio")) {
      return respuestaPrecio(memoria.ultima_zona, plan);
    }

    if (texto.includes("funciona")) {
      return respuestaFuncionamiento(memoria.ultima_zona, plan);
    }

    if (texto.includes("duele")) {
      return `
Generalmente no duele 🤍.  
Tecnologías como HIFU 12D, cavitación y radiofrecuencia se sienten cálidas o vibrantes, pero son tolerables.

Lo revisamos contigo en tu diagnóstico según tu sensibilidad.`;
    }

    return `
Puedo darte más detalles de *${plan}* 🤍.  
¿Qué te gustaría saber: sesiones, dolor, resultados, precio o funcionamiento?`;
  }

  // 3) mensaje base si no hay contexto previo
  return `
Hola 🤍 Soy Zara de Body Elite.  
Estoy aquí para ayudarte a sacar tu mejor versión.

¿Qué zona te gustaría mejorar?`;
}
