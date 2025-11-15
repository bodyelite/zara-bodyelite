// ======================================================
// motor_respuesta_v3_final.js – ZARA DEFINITIVA
// Tonalidad femenina, CTA inteligente, 4º intento → llamada.
// Detecta TODO: corporal, facial, depilación.
// ======================================================

import { leerMemoria, guardarMemoria } from "./memoria.js";

// ======================================================
// FUNCIÓN PRINCIPAL PARA SERVER.JS
// ======================================================
export async function procesarMensaje(usuario, textoEntrada) {
  const memoria = leerMemoria(usuario) || {
    ultima_zona: null,
    ultimo_plan: null,
    ultimo_objetivo: null,
    intentosAgenda: 0
  };

  const respuesta = generarRespuesta(usuario, textoEntrada, memoria);

  guardarMemoria(usuario, memoria);

  return respuesta;
}

// ======================================================
// LISTAS DE DETECCIÓN DE ZONAS Y LENGUAJE REAL
// ======================================================

const zonas = {
  abdomen: [
    "abdomen","abdómen","abd","panza","pansa","barriga","vientre",
    "guata","guatita","guatita baja","rollo","rollito","llanta","llantita",
    "flotador","flotadorcito","cintura","zona abdominal"
  ],
  gluteos: [
    "gluteo","glúteo","gluteos","glúteos","glutes","gluts","poto","potito",
    "colita","trasero","nalgas","pompas","gluteo caido","levantar gluteo",
    "levantar poto","push up","aumento no quirurgico","proyección"
  ],
  piernas: [
    "pierna","piernas","muslo","muslos","muslito","muslitos","cartuchera",
    "cartucheras","chaparreras","entrepierna","celulitis","retención piernas",
    "muslo interno","muslo externo","muslo caido"
  ],
  brazos: [
    "brazo","brazos","bracito","bracitos","brazos gordos","brazos gorditos",
    "brazo flacido","ala de murcielago","brazo suelto","brazo caido"
  ],
  espalda: [
    "espalda","espalda baja","rollo espalda","flancos","laterales","cintura lateral"
  ],
  rostro: [
    "rostro","cara","piel","cachete","cachetes","mejilla","papada","menton",
    "papada","mandibula","lineas","arrugas","arruguitas","patas de gallo",
    "afinar rostro","contorno facial","doble menton"
  ],
  depilacion: [
    "depilacion","depilación","depilar","depilarme","laser","láser",
    "pelos","pelito","vello","vellos","rebaje","axila","axilas",
    "pierna completa","bozo","pecho","espalda","zona intima"
  ]
};

// ======================================================
// PLANES OFICIALES POR ZONA
// ======================================================
const planes = {
  abdomen: { nombre: "Lipo Express", precio: 432000 },
  gluteos: { nombre: "Push Up Glúteos", precio: 376000 },
  piernas: { nombre: "Body Tensor", precio: 232000 },
  brazos: { nombre: "Lipo Focalizada Reductiva", precio: 348800 },
  rostro: { nombre: "Face Elite", precio: 358400 },
  papada: { nombre: "Face Papada", precio: 198400 },
  depilacion: { nombre: "Depilación Láser", precio: 153600 }
};

// ======================================================
// DETECTAR ZONA
// ======================================================
function detectarZona(texto) {
  const t = texto.toLowerCase();

  for (const zona in zonas) {
    if (zonas[zona].some(w => t.includes(w))) {
      return zona;
    }
  }
  return null;
}

// ======================================================
// INTENCIONES DE CONVERSACIÓN
// ======================================================
const intencion = {
  precio: ["precio","vale","cuesta","caro","valor","cuánto sale","cuanto sale","cuanto cuesta"],
  sesiones: ["sesiones","cuantas sesiones","cantidad de sesiones","numero de sesiones"],
  resultados: ["resultados","cuando se ven","cuándo veo","cuanto demora","demora mucho","sirve","funciona","vale la pena"],
  dolor: ["duele","molesta","que se siente","ardor","incomodo","dolor"],
  funcionamiento: ["como funciona","cómo funciona","que maquinas","qué máquinas","como trabajan","en que consiste"],
  ubicacion: ["donde estan","ubicacion","como llegar","direccion","donde quedan","donde atienden"],
  horario: ["horarios","atienden","hora hoy","trabajan sábado","trabajan domingo","a que hora"],
  agendar: ["agendar","reservar","quiero ir","quiero agendar","dame el link","pasame el link","como agendo","quiero reservar","link"]
};

// ======================================================
// RESPUESTAS COMERCIALES (Modo B suave, femenino)
// ======================================================

function CTA_suave() {
  return "Si quieres, puedo dejarte aquí el acceso para tu diagnóstico gratuito 🤍.";
}

function CTA_llamada() {
  return "Tal vez sería más cómodo para ti que te llamemos directamente 🤍. ¿Quieres que una de nuestras profesionales te contacte y te ayude a coordinar tu diagnóstico?";
}

function resp_precio(plan) {
  return `
Entiendo totalmente tu duda, preciosa 🤍. Te lo explico clarito:

El valor parte desde ahí porque trabajamos tecnologías clínicas como **HIFU 12D**, cavitación y **Pro Sculpt**, que actúan en profundidad real y entregan cambios visibles y mantenibles ✨.

Cada cuerpo es distinto en grasa, firmeza y retención.  
Por eso el valor exacto lo definimos juntas en tu diagnóstico gratuito.

${CTA_suave()}
  `;
}

function resp_sesiones() {
  return `
La cantidad exacta de sesiones depende de tu punto de partida.

En el diagnóstico gratuito te evaluamos y te damos un número real, sin venderte de más ni de menos 🤍.

${CTA_suave()}
  `;
}

function resp_resultados() {
  return `
La mayoría empieza a notar cambios desde la **3ª o 4ª sesión**, dependiendo de tu retención, grasa y firmeza.

En tu diagnóstico te mostramos tu proyección real 🤍.

${CTA_suave()}
  `;
}

function resp_funcionamiento(plan) {
  return `
Te cuento rapidito, hermosa 🤍:

• **HIFU 12D** destruye grasa profunda.  
• **Cavitación** rompe adipocitos.  
• **Radiofrecuencia** tensa y mejora firmeza.  
• **EMS Pro Sculpt** (si aplica) tonifica músculo profundo.

Todo personalizado según tu tejido.

${CTA_suave()}
  `;
}

function resp_dolor() {
  return `
No duele 🤍.  
Son tecnologías cálidas o vibrantes, muy tolerables y sin reposo.

${CTA_suave()}
  `;
}

function resp_ubicacion() {
  return `
Estamos en **Av. Las Perdices Nº2990, Local 23, Peñalolén** 🤍.

${CTA_suave()}
  `;
}

// ======================================================
// RESPUESTA PRINCIPAL
// ======================================================
function generarRespuesta(usuario, textoEntrada, memoria) {
  const t = textoEntrada.toLowerCase();

  // 1. DETECTAR ZONA
  const zona = detectarZona(t);

  if (zona) {
    memoria.ultima_zona = zona;
    memoria.ultimo_plan = planes[zona].nombre;

    return `
Para ${zona} trabajamos con nuestro plan **${planes[zona].nombre}**, desde **$${planes[zona].precio.toLocaleString(
      "es-CL"
    )}**.

Es ideal para mejorar firmeza, contorno y retención según tu punto de partida 🤍.

${CTA_suave()}
    `;
  }

  // 2. DETECTAR INTENCIONES
  if (intencion.precio.some(w => t.includes(w))) return resp_precio(memoria.ultimo_plan);
  if (intencion.sesiones.some(w => t.includes(w))) return resp_sesiones();
  if (intencion.resultados.some(w => t.includes(w))) return resp_resultados();
  if (intencion.dolor.some(w => t.includes(w))) return resp_dolor();
  if (intencion.funcionamiento.some(w => t.includes(w)))
    return resp_funcionamiento(memoria.ultimo_plan);
  if (intencion.ubicacion.some(w => t.includes(w))) return resp_ubicacion();

  // 3. AGENDA (CTA inteligente)
  if (intencion.agendar.some(w => t.includes(w))) {
    memoria.intentosAgenda++;

    if (memoria.intentosAgenda >= 4) return CTA_llamada();
    return CTA_suave();
  }

  // 4. CONTINUIDAD
  if (memoria.ultimo_plan) {
    return `
Puedo contarte más sobre *${memoria.ultimo_plan}* bonita 🤍.
¿Quieres saber sobre sesiones, resultados o funcionamiento?
    `;
  }

  // 5. MENSAJE BASE
  return `
Hola preciosa 🤍 Soy Zara de Body Elite.
Estoy aquí para ayudarte a sacar tu mejor versión.
¿Qué zona te gustaría mejorar?
  `;
}
