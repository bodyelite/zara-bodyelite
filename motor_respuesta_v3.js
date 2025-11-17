// =====================================================================
// Zara 2.1 – MOTOR DEFINITIVO (versión extendida + humana + robusta)
// =====================================================================
// - Palabras coloquiales ampliadas para TODAS las áreas.
// - Flujo perfecto: saludo → zona → problema → plan → botón → dudas.
// - Incluye continuidad de contexto y evita repeticiones.
// =====================================================================

import { guardarMemoria } from "./memoria.js";

// =====================================================================
// PALABRAS COLOQUIALES (ULTRA AMPLIADAS)
// =====================================================================
const palabras = {
  saludo: [
    "hola","holi","hello","buenas","buenos dias","buenas tardes","buenas noches",
    "oli","ola","aquí","hey","que tal"
  ],

  // Zonas generales
  rostro: ["rostro","cara","face","facial","cachetes","mejillas","ojeras"],
  abdomen: [
    "abdomen","guata","guatita","panza","estomago","estómago","rollo","rollos",
    "rollito","rollitos","grasa","grasita","michelin","michelines","flotador",
    "pancita","panzita","barriga","llantita"
  ],
  gluteos: [
    "gluteo","glúteo","gluteos","glúteos","poto","colita","trasero","nalgas",
    "glutis","glutito","glutitos","cola","booty"
  ],
  piernas: [
    "piernas","pierna","muslos","muslo","cartuchera","cartucheras","piernitas",
    "aductores","celulitis","piel de naranja"
  ],
  brazos: [
    "brazo","brazos","alas de murciélago","murcielago","brazitos","triceps",
    "tricep","tricep suelto","brazo flácido"
  ],

  // Problemas faciales
  arrugas: [
    "arrugas","arruguitas","patas de gallo","pata de gallo","lineas","líneas",
    "lineas de expresión","expresión","pesadez ocular","ceño","entrecejo"
  ],
  flacidez_facial: [
    "flacidez","flacida","rostro caido","rostro caído","cachetes caídos",
    "piel suelta","descolgado","papadita"
  ],
  papada: [
    "papada","papadita","doble menton","doble mentón","menton","mentón",
    "submenton","me cuelga el cuello"
  ],
  manchas: [
    "manchas","melasma","opacidad","piel apagada","tono disparejo","manchitas"
  ],
  textura: [
    "textura","poros","poritos","piel áspera","aspereza","rugosa","poros abiertos"
  ],

  // Corporal – problemas adicionales
  flacidez_corporal: ["piel suelta","flacidez","flacida","sueltita"],
  tono: ["marcar","marcación","definir","tonificar","tono","musculo","músculo"],

  // Depilación
  depilacion: [
    "pelos","vello","vellito","pelitos","depilar","depilacion","depilación",
    "rebaje","axila","axilas","pierna completa","bigote","bozo","ingles"
  ],

  // Intenciones comunes
  agendar: ["agendar","agenda","quiero hora","reservar","quiero ir","link"],
  dudas: ["cuentame","cuéntame","más","mas","en que consiste","qué es","que es"],
  dolor: ["duele","molesta","ardor","sensación","incomodo"],
  sesiones: ["cuantas sesiones","cuánto dura","frecuencia","sesiones"],
  resultados: ["resultados","sirve","cuando veo","cuando se nota","vale la pena"],
  aparatos: ["maquina","máquina","qué usan","como funciona","como trabajan"]
};

// Helper
const match = (t, arr) => arr.some(w => t.includes(w));

// =====================================================================
// PLANES
// =====================================================================
function planFacial(t) {
  if (match(t, palabras.arrugas)) return {
    nombre: "Face Antiage",
    texto: "El **Face Antiage** suaviza arrugas con Toxina, Radiofrecuencia médica y Pink Glow regenerativo. Resultados visibles desde la primera semana 🤍",
    precio: 281600
  };
  if (match(t, palabras.flacidez_facial)) return {
    nombre: "Face Elite",
    texto: "El **Face Elite** trabaja flacidez facial con HIFU 12D + RF médica + Pink Glow. Levanta y define contorno.",
    precio: 358400
  };
  if (match(t, palabras.papada)) return {
    nombre: "Face Papada",
    texto: "El **Face Papada** reduce volumen submentoniano con HIFU 12D + lipolítico + Radiofrecuencia.",
    precio: 198400
  };
  if (match(t, palabras.manchas)) return {
    nombre: "Face Smart",
    texto: "El **Face Smart** aclara manchas, equilibra tono y aporta luminosidad.",
    precio: 198400
  };
  if (match(t, palabras.textura)) return {
    nombre: "Face Light",
    texto: "El **Face Light** mejora textura, poros y luminosidad con limpieza profunda + RF suave.",
    precio: 128800
  };

  return null;
}

function planCorporal(t) {
  if (match(t, palabras.abdomen)) return {
    nombre: "Lipo Express",
    texto: "La **Lipo Express** reduce abdomen, grasa localizada y rollitos con HIFU 12D + Cavitación + Radiofrecuencia profunda.",
    precio: 432000
  };
  if (match(t, palabras.gluteos)) return {
    nombre: "Push Up Glúteos",
    texto: "El **Push Up** levanta y da volumen al glúteo con EMS Pro Sculpt + Radiofrecuencia compactante.",
    precio: 376000
  };
  if (match(t, palabras.piernas)) return {
    nombre: "Lipo Focalizada Reductiva",
    texto: "La **Lipo Focalizada** reduce cartucheras, muslos y celulitis con Cavitación + Radiofrecuencia médica.",
    precio: 348800
  };
  if (match(t, palabras.brazos)) return {
    nombre: "Lipo Focalizada Reductiva",
    texto: "La **Lipo Brazos** afina y reafirma brazos con Cavitación + RF.",
    precio: 348800
  };

  return null;
}

function planDepilacion(t) {
  if (match(t, palabras.depilacion)) return {
    nombre: "Depilación Láser DL900",
    texto: "Nuestra **Depilación Láser DL900** es rápida, segura, progresiva y apta para vello claro. Sesiones cada 15 días.",
    precio: 153600
  };
  return null;
}

// =====================================================================
// RESPUESTAS CLÍNICAS A DUDAS
// =====================================================================
function responderDudas(plan, t) {
  if (match(t, palabras.dolor))
    return `${plan.texto}\n\nNo duele: las tecnologías son seguras y muy tolerables 🤍`;

  if (match(t, palabras.sesiones))
    return `${plan.texto}\n\nLa cantidad de sesiones varía según tu caso, pero en el diagnóstico te damos un estimado preciso 🤍`;

  if (match(t, palabras.resultados))
    return `${plan.texto}\n\nLos resultados se empiezan a notar desde las primeras semanas 🤍`;

  if (match(t, palabras.aparatos))
    return `${plan.texto}\n\nUsamos HIFU 12D, Cavitación, RF médica, EMS Pro Sculpt y Pink Glow según el plan 🤍`;

  if (match(t, palabras.dudas))
    return `${plan.texto}\n\nPuedo contarte más: este tratamiento es personalizado y lo ajustamos 100% a tu objetivo 🤍`;

  return null;
}

// =====================================================================
// MOTOR PRINCIPAL
// =====================================================================
export async function procesarMensaje(usuario, texto, memoriaPrev) {
  const t = texto.toLowerCase().trim();
  const mem = memoriaPrev || { zona: null, ultimo_plan: null };

  // SALUDO
  if (match(t, palabras.saludo)) {
    return {
      tipo: "texto",
      texto:
        "¡Qué alegría tenerte por aquí! Soy **Zara de Body Elite** 🤍\nEstoy para ayudarte a sacar tu mejor versión.\n\n" +
        "Cuéntame, ¿qué zona te gustaría mejorar primero: **rostro**, **abdomen**, **piernas**, **glúteos** o **depilación láser**?"
    };
  }

  // SELECCIÓN DE ZONA
  if (match(t, palabras.rostro))  mem.zona = "rostro";
  if (match(t, palabras.abdomen)) mem.zona = "abdomen";
  if (match(t, palabras.gluteos)) mem.zona = "glúteos";
  if (match(t, palabras.piernas)) mem.zona = "piernas";
  if (match(t, palabras.brazos))  mem.zona = "brazos";
  if (match(t, palabras.depilacion)) mem.zona = "depilación";

  if (mem.zona && t === mem.zona) {
    return {
      tipo: "texto",
      texto:
        `Perfecto, podemos trabajar **${mem.zona}** 🤍\n` +
        "Cuéntame, ¿qué te gustaría mejorar específicamente?"
    };
  }

  // DETECCIÓN DE PLAN
  let plan =
    planFacial(t) ||
    planCorporal(t) ||
    planDepilacion(t);

  // EXPLICAR PLAN + BOTÓN
  if (plan) {
    mem.ultimo_plan = plan.nombre;
    guardarMemoria(usuario, mem);

    return {
      tipo: "boton",
      body:
        `${plan.texto}\n\n` +
        `Valor desde: **$${plan.precio.toLocaleString("es-CL")}**\n\n` +
        "Te dejo tu acceso directo a tu **diagnóstico gratuito** 🤍",
      button: "Agendar ahora",
      urlAgenda:
        "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    };
  }

  // SI YA HAY PLAN → RESPONDER DUDAS
  if (mem.ultimo_plan) {
    const planSimulado = {
      nombre: mem.ultimo_plan,
      texto: "",
      precio: ""
    };

    const respuestaDuda = responderDudas(planSimulado, t);
    if (respuestaDuda) {
      return {
        tipo: "texto",
        texto: respuestaDuda
      };
    }

    return {
      tipo: "texto",
      texto:
        `Podemos seguir revisando tu **${mem.ultimo_plan}** 🤍\n` +
        "Si quieres, puedo dejarte nuevamente tu acceso al diagnóstico gratuito."
    };
  }

  // ERROR SUAVE
  return {
    tipo: "texto",
    texto:
      "Creo que no entendí del todo 🙈 pero no te preocupes, estoy aquí para ayudarte.\n" +
      "¿Podrías contarme un poquito más?"
  };
}
