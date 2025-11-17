// ============================================================
// motor_respuesta_v3.js – Zara 2.1 (flujo humano, cálido y clínico)
// ============================================================

import { leerMemoria, guardarMemoria } from "./memoria.js";

// Palabras clave por temas
const palabras = {
  saludo: ["hola","holi","buenas","buenos días","buenas tardes","buenas noches","hello","ola"],
  rostro: ["rostro","cara","facial","face"],
  abdomen: ["abdomen","guata","guatita","estómago","estomago","panza","rollito","rollitos"],
  gluteos: ["gluteo","glúteo","gluteos","glúteos","poto","nalgas","colita","trasero"],
  piernas: ["piernas","muslos","cartuchera","cartucheras"],
  brazos: ["brazo","brazos","alas de murciélago","murcielago"],
  papada: ["papada","doble menton","doble mentón","mentón","menton"],
  arrugas: ["arrugas","líneas","lineas","patas de gallo","pata de gallo","líneas de expresión"],
  flacidez: ["flacidez","flacida","piel suelta","caída","caido","caída facial","rostro caído"],
  manchas: ["manchas","melasma","opacidad","tono disparejo"],
  textura: ["textura","poros","poros abiertos","aspereza"],
  depilacion: ["depilar","depilación","depilacion","vello","pelos","laser","láser"],
  agendar: ["agenda","agendar","reservar","quiero hora","quiero agendar","quiero ir","link"]
};

// -------------------------------------------
// UTILIDADES
// -------------------------------------------
const match = (t, list) => list.some((w) => t.includes(w));

function CTA_boton() {
  return {
    tipo: "boton",
    body: "Aquí tienes tu acceso directo a tu diagnóstico gratuito 🤍",
    button: "Agendar ahora",
    urlAgenda: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
  };
}

// -------------------------------------------
// PLANES
// -------------------------------------------
function planFacial(t) {
  if (match(t, palabras.arrugas)) {
    return {
      nombre: "Face Antiage",
      texto:
        "El **Face Antiage** trabaja arrugas y líneas finas combinando Toxina, Radiofrecuencia médica y Pink Glow regenerativo. Resultados desde la primera semana.",
      precio: 281600
    };
  }
  if (match(t, palabras.flacidez)) {
    return {
      nombre: "Face Elite",
      texto:
        "El **Face Elite** es perfecto para flacidez facial. Usa HIFU 12D + RF médica + Pink Glow para levantar y tensar.",
      precio: 358400
    };
  }
  if (match(t, palabras.papada)) {
    return {
      nombre: "Face Papada",
      texto:
        "El **Face Papada** reduce el volumen submentoniano con HIFU 12D + lipolítico + Radiofrecuencia.",
      precio: 198400
    };
  }
  if (match(t, palabras.manchas)) {
    return {
      nombre: "Face Smart",
      texto:
        "El **Face Smart** aclara manchas, mejora el tono y aporta luminosidad con limpieza profunda + Pink Glow.",
      precio: 198400
    };
  }
  if (match(t, palabras.textura)) {
    return {
      nombre: "Face Light",
      texto:
        "El **Face Light** mejora textura, poros y luminosidad con limpieza profunda + Radiofrecuencia suave.",
      precio: 128800
    };
  }
  return null;
}

function planCorporal(t) {
  if (match(t, palabras.abdomen)) {
    return {
      nombre: "Lipo Express",
      texto:
        "La **Lipo Express** reduce abdomen y rollitos con HIFU 12D, Cavitación y RF profunda. Resultados desde 2-3 semanas.",
      precio: 432000
    };
  }
  if (match(t, palabras.gluteos)) {
    return {
      nombre: "Push Up Glúteos",
      texto:
        "El **Push Up** levanta y da volumen al glúteo con EMS Pro Sculpt + Radiofrecuencia compactante.",
      precio: 376000
    };
  }
  if (match(t, palabras.piernas)) {
    return {
      nombre: "Lipo Focalizada Reductiva",
      texto:
        "La **Lipo Focalizada** reduce cartucheras, muslos y celulitis con Cavitación + RF médica.",
      precio: 348800
    };
  }
  if (match(t, palabras.brazos)) {
    return {
      nombre: "Lipo Focalizada Reductiva",
      texto:
        "La **Lipo Focalizada en brazos** afina, define y mejora firmeza con Cavitación + RF.",
      precio: 348800
    };
  }
  return null;
}

function planDepilacion(t) {
  if (match(t, palabras.depilacion)) {
    return {
      nombre: "Depilación Láser DL900",
      texto:
        "Nuestra **Depilación Láser DL900** es rápida, segura y progresiva. Sesiones cada 15 días. Ideal incluso en vello claro.",
      precio: 153600
    };
  }
  return null;
}

// -------------------------------------------
// MOTOR PRINCIPAL
// -------------------------------------------
export async function procesarMensaje(usuario, texto, memoria) {
  const t = texto.toLowerCase().trim();
  const mem = memoria || { ultimo_plan: null, zona: null };

  // -------------------------------------------
  // SALUDO
  // -------------------------------------------
  if (match(t, palabras.saludo)) {
    return {
      tipo: "texto",
      texto:
        "¡Qué alegría tenerte por aquí! Soy **Zara de Body Elite** 🤍\n" +
        "Estoy para ayudarte a sacar tu mejor versión.\n\n" +
        "Cuéntame, ¿qué zona te gustaría mejorar primero: **rostro**, **abdomen**, **piernas**, **glúteos** o **depilación láser**?"
    };
  }

  // -------------------------------------------
  // DETECCIÓN DE ZONA
  // -------------------------------------------
  if (match(t, palabras.rostro)) { mem.zona = "rostro"; }
  if (match(t, palabras.abdomen)) { mem.zona = "abdomen"; }
  if (match(t, palabras.gluteos)) { mem.zona = "gluteos"; }
  if (match(t, palabras.piernas)) { mem.zona = "piernas"; }
  if (match(t, palabras.brazos))  { mem.zona = "brazos"; }
  if (match(t, palabras.depilacion)) { mem.zona = "depilacion"; }

  if (mem.zona && t === mem.zona) {
    return {
      tipo: "texto",
      texto:
        `Perfecto, podemos trabajar **${mem.zona}** 🤍\n` +
        "Cuéntame, ¿qué te gustaría mejorar específicamente?"
    };
  }

  // -------------------------------------------
  // PLAN SEGÚN PROBLEMA
  // -------------------------------------------
  let plan =
    planFacial(t) ||
    planCorporal(t) ||
    planDepilacion(t);

  if (plan) {
    mem.ultimo_plan = plan.nombre;
    guardarMemoria(usuario, mem);

    return {
      tipo: "boton",
      body:
        `${plan.texto}\n\n` +
        `Valor desde: **$${plan.precio.toLocaleString("es-CL")}**\n\n` +
        "Te dejo el acceso directo a tu **diagnóstico gratuito** para ver cuántas sesiones necesitas 🤍",
      button: "Agendar ahora",
      urlAgenda: "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9"
    };
  }

  // -------------------------------------------
  // CONTINUIDAD DEL PLAN
  // -------------------------------------------
  if (mem.ultimo_plan) {
    return {
      tipo: "texto",
      texto:
        `Podemos seguir revisando tu **${mem.ultimo_plan}** 🤍\n` +
        "Si quieres, puedo dejarte nuevamente tu acceso al diagnóstico gratuito.",
      estadoNuevo: mem
    };
  }

  // -------------------------------------------
  // ERROR SUAVE
  // -------------------------------------------
  return {
    tipo: "texto",
    texto:
      "Disculpa, no estoy segura si entendí bien 🙈\n" +
      "Pero no te preocupes, puedo ayudarte. ¿Podrías contarme un poco más?"
  };
}
