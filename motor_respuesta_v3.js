const RESERVO_LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

const ORIGEN_MENSAJES = {
  anuncio: [
    "respondió a tu anuncio",
    "replied to your ad",
    "view ad",
    "respondió a un anuncio",
    "replied to your lipo express ad",
    "ad conversation started",
    "lead from ad"
  ],
  contenido_organico: [
    "respondió a tu publicación",
    "respondió a tu reel",
    "respondió a tu historia",
    "reply to your story",
    "reply to your post",
    "reacted to your story",
    "replied from post",
    "⭐ commented on your post"
  ]
};

const PLANES_KEYWORDS = {
  "lipo express": "Lipo Express",
  "lipo body elite": "Lipo Body Elite",
  "lipo body": "Lipo Body Elite",
  "body elite": "Lipo Body Elite",
  "push up": "Push Up",
  "pushup": "Push Up",
  "gluteo": "Push Up",
  "glúteo": "Push Up",
  "gluteos": "Push Up",
  "glúteos": "Push Up",
  "trasero": "Push Up",
  "poto": "Push Up",
  "nalgas": "Push Up",
  "face elite": "Face Elite",
  "antiage": "Face Elite",
  "facial": "Face Elite",
  "cara": "Face Elite",
  "rostro": "Face Elite",
  "depil": "Depilación DL900",
  "pelito": "Depilación DL900",
  "pelitos": "Depilación DL900",
  "cera": "Depilación DL900",
  "laser": "Depilación DL900",
  "láser": "Depilación DL900",
  "tonificar": "Body Fitness",
  "marcar": "Body Fitness",
  "músculo": "Body Fitness",
  "musculo": "Body Fitness",
  "abdomen marcado": "Body Fitness",
  "flacidez": "Body Tensor",
  "tensar": "Body Tensor",
  "piel suelta": "Body Tensor"
};

const PLAN_DETALLE = {
  "Lipo Express": {
    objetivo: "reducir grasa localizada en abdomen, cintura y espalda baja",
    tecnologias: "HIFU 12D, cavitación y radiofrecuencia",
    sesiones: "8–10 sesiones aprox.",
    precio: "$432.000"
  },
  "Lipo Body Elite": {
    objetivo: "reducir grasa y tensar cintura, abdomen y espalda con enfoque más intenso",
    tecnologias: "HIFU 12D, EMS Sculptor, cavitación y radiofrecuencia",
    sesiones: "10–12 sesiones aprox.",
    precio: "$664.000"
  },
  "Push Up": {
    objetivo: "levantar, dar volumen y mejorar firmeza del glúteo",
    tecnologias: "Pro Sculpt, HIFU 12D y radiofrecuencia",
    sesiones: "8–10 sesiones aprox.",
    precio: "$376.000"
  },
  "Face Elite": {
    objetivo: "rejuvenecer y tensar el rostro completo (líneas de expresión, flacidez, luminosidad)",
    tecnologias: "HIFU 12D, Pink Glow, radiofrecuencia y toxina según evaluación",
    sesiones: "8–10 sesiones aprox.",
    precio: "$358.400"
  },
  "Depilación DL900": {
    objetivo: "reducir y eliminar el vello de forma progresiva sin dañar la piel",
    tecnologias: "Láser diodo DL900 (certificado CE)",
    sesiones: "6 sesiones por zona (promedio)",
    precio: "planes desde $153.600 por 6 sesiones"
  },
  "Body Fitness": {
    objetivo: "tonificar, marcar musculatura y mejorar firmeza",
    tecnologias: "EMS Sculptor combinado con tecnologías tensaras según el caso",
    sesiones: "6–8 sesiones aprox.",
    precio: "$360.000"
  },
  "Body Tensor": {
    objetivo: "mejorar flacidez y firmeza de la piel en zonas como brazos, abdomen o piernas",
    tecnologias: "radiofrecuencia, HIFU 12D y tecnologías tensaras",
    sesiones: "6–8 sesiones aprox.",
    precio: "$232.000"
  }
};

const ZONAS = [
  "abdomen",
  "barriga",
  "guata",
  "cintura",
  "espalda",
  "pierna",
  "piernas",
  "muslo",
  "muslos",
  "brazo",
  "brazos",
  "gluteo",
  "glúteo",
  "gluteos",
  "glúteos",
  "trasero",
  "poto",
  "nalgas",
  "papada",
  "rostro",
  "cara"
];

function detectarOrigen(texto) {
  for (const p of ORIGEN_MENSAJES.anuncio) {
    if (texto.includes(p)) return "anuncio";
  }
  for (const p of ORIGEN_MENSAJES.contenido_organico) {
    if (texto.includes(p)) return "contenido_organico";
  }
  return "dm_normal";
}

function detectarPlan(texto) {
  for (const kw in PLANES_KEYWORDS) {
    if (texto.includes(kw)) {
      return PLANES_KEYWORDS[kw];
    }
  }
  return null;
}

function detectarZona(texto) {
  for (const z of ZONAS) {
    if (texto.includes(z)) return z;
  }
  return null;
}

function esPreguntaPrecio(texto) {
  return (
    texto.includes("precio") ||
    texto.includes("valor") ||
    texto.includes("vale") ||
    texto.includes("cuanto sale") ||
    texto.includes("cuánto sale") ||
    texto.includes("cuanto cuesta") ||
    texto.includes("cuánto cuesta")
  );
}

function esPreguntaSesiones(texto) {
  return (
    texto.includes("sesion") ||
    texto.includes("sesión") ||
    texto.includes("sesiones") ||
    texto.includes("cuantas sesiones") ||
    texto.includes("cuántas sesiones")
  );
}

function plantillaDirectoPlan(plan, zona) {
  const info = PLAN_DETALLE[plan];
  if (!info) {
    return plantillaEstandar();
  }

  const zonaTexto = zona
    ? `para trabajar específicamente ${zona} `
    : "";

  return (
    `¡Qué bueno tenerte por aquí! Este mensaje está enfocado en nuestro plan ${plan}. ` +
    `Es un plan pensado ${zonaTexto}para ${info.objetivo}. ` +
    `Usamos ${info.tecnologias} y normalmente hablamos de ${info.sesiones}. ` +
    `El valor del plan es ${info.precio}. ` +
    `Si quieres, te dejo de inmediato tu diagnóstico gratuito para ajustar el plan a tu caso:\n` +
    `${RESERVO_LINK}`
  );
}

function plantillaDescubrimiento() {
  return (
    "¡Qué bueno que nos visitas! Veo que llegaste desde nuestro contenido. " +
    "Cuéntame, ¿qué parte del cuerpo o qué objetivo te gustaría mejorar (grasa localizada, flacidez, volumen, depilación láser)? " +
    "Así te orientamos al plan ideal y, si quieres, te dejamos tu diagnóstico totalmente gratuito:\n" +
    RESERVO_LINK
  );
}

function plantillaEstandar() {
  return (
    "Hola, soy Zara de Body Elite. Puedo ayudarte a elegir el plan ideal según tu objetivo. " +
    "Cuéntame, ¿qué zona quieres trabajar primero (rostro, abdomen, piernas, glúteos o depilación láser)? " +
    "Si quieres avanzar de inmediato, aquí puedes agendar tu diagnóstico gratuito sin costo ni compromiso:\n" +
    RESERVO_LINK
  );
}

function respuestaPrecio(plan) {
  const info = plan ? PLAN_DETALLE[plan] : null;
  if (!info) {
    return (
      "Te cuento encantada los valores, pero primero necesito saber qué zona y qué objetivo quieres trabajar (grasa, flacidez, volumen o depilación). " +
      "Según eso se define el plan y el valor final. Si quieres avanzar más rápido, en el diagnóstico gratuito te dejamos todo detallado:\n" +
      RESERVO_LINK
    );
  }
  return (
    `En ${plan}, el valor de referencia es ${info.precio}. ` +
    `Lo ajustamos según tu punto de partida y la zona a trabajar. ` +
    `En el diagnóstico gratuito vemos medidas, zona y objetivo, y te dejamos el valor exacto y número de sesiones recomendado:\n` +
    RESERVO_LINK
  );
}

function respuestaSesiones(plan) {
  const info = plan ? PLAN_DETALLE[plan] : null;
  if (!info) {
    return (
      "La cantidad de sesiones depende de tu punto de partida (medidas, flacidez, grasa o volumen) y del plan que definamos. " +
      "En promedio trabajamos entre 6 a 12 sesiones según el caso. " +
      "En el diagnóstico gratuito evaluamos tu zona y te damos un número de sesiones estimado con resultados reales:\n" +
      RESERVO_LINK
    );
  }
  return (
    `En ${plan}, normalmente trabajamos ${info.sesiones}. ` +
    "La evaluación inicial nos permite ajustar ese número a tu caso y definir frecuencia semanal para que veas cambios reales. " +
    "Te dejo el acceso directo a tu diagnóstico gratuito:\n" +
    RESERVO_LINK
  );
}

export async function procesarMensaje(texto, platform) {
  if (!texto) return "¿Podrías repetirlo?";

  const t = texto.toLowerCase().trim();

  // Saludos simples
  if (["hola", "hola!", "holaa", "buenas", "buenas tardes", "buen dia", "buen día"].includes(t)) {
    return plantillaEstandar();
  }

  const origen = detectarOrigen(t);
  const plan = detectarPlan(t);
  const zona = detectarZona(t);

  if (esPreguntaPrecio(t)) {
    return respuestaPrecio(plan);
  }

  if (esPreguntaSesiones(t)) {
    return respuestaSesiones(plan);
  }

  if (origen === "anuncio" && plan) {
    return plantillaDirectoPlan(plan, zona);
  }

  if (plan) {
    return plantillaDirectoPlan(plan, zona);
  }

  if (origen === "contenido_organico") {
    return plantillaDescubrimiento();
  }

  return plantillaEstandar();
}
