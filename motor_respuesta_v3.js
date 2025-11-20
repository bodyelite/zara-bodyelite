import { sendMessage } from "./sendMessage.js";
// motor_respuesta_v3.js — Versión limpia y estable Zara 2.1 (WSP + IG)
// ESM module (import/export) compatible con server.js

import fs from "fs";
import path from "path";

// =============== CONFIG MEMORIA ===============
const memoriaPath = path.resolve("./memoria_usuarios.json");

let memoria = {};
try {
  const data = fs.readFileSync(memoriaPath, "utf8");
  memoria = JSON.parse(data);
} catch (e) {
  memoria = {};
}

// =============== LINK AGENDA ===============
const LINK =
  "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";

// =============== PLANES, PRECIOS Y SESIONES ===============
const PRECIOS = {
  "lipo express": 432000,
  "lipo reductiva": 480000,
  "lipo focalizada reductiva": 348800,
  "lipo body elite": 664000,
  "body tensor": 232000,
  "body fitness": 360000,
  "push up": 376000,
  "limpieza facial full": 120000,
  "rf facial": 60000,
  "face light": 128800,
  "face smart": 198400,
  "face inicia": 270400,
  "face antiage": 281600,
  "face elite": 358400,
  "full face": 584000,
  "face papada": 313600,
  depilacion: 259200
};

const SESIONES = {
  "lipo express": "6–8 sesiones",
  "lipo reductiva": "8 sesiones",
  "lipo focalizada reductiva": "6 sesiones",
  "lipo body elite": "8–10 sesiones",
  "body tensor": "6 sesiones",
  "body fitness": "6 sesiones",
  "push up": "6–8 sesiones",
  "face antiage": "6 sesiones",
  "face elite": "6 sesiones",
  "face light": "3 sesiones",
  "face smart": "6 sesiones",
  "face inicia": "6 sesiones",
  "face papada": "6 sesiones",
  "full face": "6 sesiones",
  depilacion: "6 sesiones"
};

const EXPLICACION_PLAN = {
  // Corporal
  "lipo express":
    "✨ *Lipo Express* reduce abdomen, cintura y espalda con HIFU 12D + cavitación + radiofrecuencia compactante. Ideal cuando hay \"guatita\" o rollos en el cinturón.",
  "lipo reductiva":
    "✨ *Lipo Reductiva* moldea abdomen completo con HIFU 12D + cavitación + radiofrecuencia, especial cuando hay más volumen general.",
  "lipo focalizada reductiva":
    "✨ *Lipo Focalizada Reductiva* trabaja rollitos localizados (flancos, bajo ombligo, espalda baja) con cavitación + RF puntual.",
  "lipo body elite":
    "✨ *Lipo Body Elite* es un plan premium para reducción y tensado corporal completo usando HIFU 12D de alta potencia.",
  "body tensor":
    "✨ *Body Tensor* tensa y mejora la firmeza de piernas y brazos con radiofrecuencia profunda.",
  "body fitness":
    "✨ *Body Fitness* combina ProSculpt + RF para tonificar y definir glúteos y piernas, más deportivo.",
  "push up":
    "🍑 *Push Up* levanta y da volumen real al glúteo con ProSculpt (20.000 contracciones por sesión) + HIFU 12D para tensar y proyectar.",

  // Facial
  "limpieza facial full":
    "✨ *Limpieza Facial Full* limpia en profundidad, desincrusta, exfolia y deja la piel lista para tratamientos más avanzados.",
  "rf facial":
    "✨ *RF Facial* mejora firmeza, textura y compactación de la piel trabajando colágeno de forma no invasiva.",
  "face light":
    "✨ *Face Light* es un plan facial suave para brillo, textura y primeras líneas finas.",
  "face smart":
    "✨ *Face Smart* combina luz pulsada, Pink Glow y RF para mejorar tono, manchas suaves y textura.",
  "face inicia":
    "✨ *Face Inicia* es un plan facial base para arrugas suaves, brillo y compactación general.",
  "face antiage":
    "✨ *Face Antiage* suaviza arrugas y líneas con HIFU 12D + radiofrecuencia, ideal para tercio medio y superior.",
  "face elite":
    "✨ *Face Elite* es un lifting no invasivo completo con HIFU 12D + RF + biorevitalización, para rejuvenecimiento global.",
  "full face":
    "✨ *Full Face* integra RF, Pink Glow, toxina ligera y HIFU 12D según cada zona, para un resultado integral.",
  "face papada":
    "✨ *Face Papada* reduce grasa submentoniana y define el contorno mandibular con HIFU 12D + lipolítico facial.",

  // Depilación
  depilacion:
    "✨ *Depilación Láser DL900* elimina el vello desde la raíz con láser diodo original, seguro y rápido."
};

// =============== EXPRESIONES COLOQUIALES ===============
const FRASES_ZONA = {
  abdomen: [
    "guata",
    "panza",
    "rollos",
    "rollitos",
    "abdomen",
    "barriga",
    "cintura",
    "espalda baja",
    "espalda completa",
    "flancos"
  ],
  gluteos: [
    "poto",
    "gluteo",
    "glúteo",
    "gluteos",
    "glúteos",
    "trasero",
    "nalgas",
    "levantar el poto",
    "levantar gluteos",
    "push up"
  ],
  papada: ["papada", "doble menton", "doble mentón", "papadita"],
  arrugas: [
    "arrugas",
    "lineas",
    "líneas",
    "patas de gallo",
    "frente",
    "entrecejo",
    "codigo de barras",
    "código de barras"
  ],
  piernas: ["piernas", "muslos", "cartucheras", "celulitis piernas"],
  brazos: ["brazos", "brazo gordo", "alas de murcielago", "alas de murciélago"],
  depilacion: [
    "depilacion",
    "depilación",
    "depilar",
    "pelos",
    "vello",
    "laser"
  ]
};

const INTENCIONES = {
  explicacion: [
    "como funciona",
    "cómo funciona",
    "en que consiste",
    "en qué consiste",
    "como es",
    "cómo es",
    "que es",
    "qué es",
    "de que se trata",
    "de qué se trata",
    "como es el tratamiento",
    "explícame",
    "explicame",
    "me explicas"
  ],
  precio: [
    "precio",
    "valor",
    "cuanto vale",
    "cuánto vale",
    "cuanto sale",
    "cuánto sale",
    "cuanto cuesta",
    "cuánto cuesta",
    "costo",
    "caro",
    "porque tan caro",
    "por qué tan caro"
  ],
  sesiones: [
    "cuantas sesiones",
    "cuántas sesiones",
    "cuantas veces",
    "cuánto dura",
    "cuanto dura",
    "duracion",
    "duración",
    "cuanto demora",
    "cuánto demora"
  ],
  dolor: ["duele", "dolor", "es doloroso", "me va a doler", "da miedo", "doloroso"],
  botox: ["botox", "toxina", "toxina botulinica", "toxina botulínica"]
};

// =============== UTILIDADES ===============
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function guardarMemoria() {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}

// =============== DETECCIÓN DE ZONA / PLAN ===============
function detectarPlanPorZona(texto) {
  const t = normalizar(texto);

  if (FRASES_ZONA.abdomen.some((x) => t.includes(x))) return "lipo express";
  if (FRASES_ZONA.gluteos.some((x) => t.includes(x))) return "push up";
  if (FRASES_ZONA.papada.some((x) => t.includes(x))) return "face papada";
  if (FRASES_ZONA.arrugas.some((x) => t.includes(x))) return "face antiage";
  if (FRASES_ZONA.piernas.some((x) => t.includes(x))) return "body tensor";
  if (FRASES_ZONA.brazos.some((x) => t.includes(x))) return "body tensor";
  if (FRASES_ZONA.depilacion.some((x) => t.includes(x))) return "depilacion";

  return null;
}

// Detección por campañas: si el mensaje trae el nombre del plan
function detectarPlanPorCampania(texto) {
  const t = normalizar(texto);

  if (t.includes("push up")) return "push up";
  if (t.includes("lipo express")) return "lipo express";
  if (t.includes("body fitness")) return "body fitness";
  if (t.includes("body tensor")) return "body tensor";
  if (t.includes("full face")) return "full face";
  if (t.includes("face elite")) return "face elite";
  if (t.includes("face antiage")) return "face antiage";
  if (t.includes("face papada")) return "face papada";
  if (t.includes("depilacion")) return "depilacion";

  return null;
}

// =============== DETECCIÓN DE INTENCIÓN ===============
function detectarIntencion(texto) {
  const t = normalizar(texto);

  if (INTENCIONES.explicacion.some((x) => t.includes(x))) return "explicacion";
  if (INTENCIONES.precio.some((x) => t.includes(x))) return "precio";
  if (INTENCIONES.sesiones.some((x) => t.includes(x))) return "sesiones";
  if (INTENCIONES.dolor.some((x) => t.includes(x))) return "dolor";
  if (INTENCIONES.botox.some((x) => t.includes(x))) return "botox";

  return null;
}

// =============== RESPUESTAS ===============
function responderExplicacion(plan) {
  if (EXPLICACION_PLAN[plan]) {
    return `${EXPLICACION_PLAN[plan]}

En tu diagnóstico vemos si este es el mejor plan para ti o combinamos con otro 💙
Agenda aquí:
${LINK}`;
  }

  return `Te explico feliz 💙, pero primero necesito saber mejor la zona que quieres trabajar. 
¿Es abdomen, glúteos, rostro, papada, piernas, brazos o depilación?`;
}

function formatearPrecio(plan) {
  const raw = PRECIOS[plan];
  if (!raw) return null;
  return raw.toLocaleString("es-CL");
}

function responderPrecio(plan) {
  const precio = formatearPrecio(plan);

  if (precio) {
    return `El plan *${capital(plan)}* parte desde *$${precio}* 💙

En la evaluación definimos si necesitas algo más simple o más completo según tu caso real.
Agenda aquí:
${LINK}`;
  }

  return `Los valores dependen del plan y de lo que realmente necesites 💙

En el diagnóstico te damos valores reales para tu caso.
Agenda aquí:
${LINK}`;
}

function responderSesiones(plan) {
  const sesiones = SESIONES[plan];

  if (sesiones) {
    return `El plan *${capital(plan)}* suele requerir *${sesiones}*.

En tu diagnóstico ajustamos el número exacto según tu punto de partida y objetivo 💙
Agenda aquí:
${LINK}`;
  }

  return `La cantidad de sesiones se define en el diagnóstico, según punto de partida, objetivo y respuesta de tu cuerpo 💙
Agenda aquí:
${LINK}`;
}

function responderDolor() {
  return `No duele 💙

Según el plan puedes sentir calor, vacío o contracciones musculares intensas, pero no es algo insoportable.
Todo se ajusta a tu tolerancia.

Si quieres, lo revisamos en tu diagnóstico y te explicamos tranquila en qué consiste cada sesión.
Agenda aquí:
${LINK}`;
}

function responderBotox() {
  return `💙 Sí, trabajamos toxina en planes faciales cuando corresponde (frente, entrecejo, patas de gallo, etc.).

La indicación y dosis exacta siempre se ve en evaluación médica, para que sea seguro y natural.
Agenda tu evaluación aquí:
${LINK}`;
}

function capital(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============== CONTROL DE LINKS Y LLAMADA ===============
function armarRespuestaConLink(mem, base) {
  // Control de envíos del link
  mem.links_enviados = mem.links_enviados || 0;
  mem.links_enviados += 1;

  let texto = base;

  // Siempre incluimos link en el cuerpo del mensaje clínico.
  // Llamada después del 3er envío de link.
  if (mem.links_enviados >= 3 && !mem.llamada_ofrecida) {
    texto += `

📞 Si prefieres, una de nuestras profesionales puede llamarte para explicarte todo con calma 
(en horario laboral). ¿Te gustaría que te llamaran?`;
    mem.llamada_ofrecida = true;
  }

  return texto;
}

// =============== ANTI-REPETICIÓN ===============
function mensajeRepetido(texto, mem) {
  const t = normalizar(texto);
  if (!mem) return false;
  if (mem.ultima_interaccion === t) return true;
  mem.ultima_interaccion = t;
  return false;
}

// =============== SALUDO INICIAL ===============
function esSaludoInicial(texto) {
  const t = normalizar(texto);
  return (
    t === "hola" ||
    t === "hola!" ||
    t === "buenas" ||
    t === "buenas tardes" ||
    t === "buenas noches" ||
    t === "buen dia" ||
    t === "buen día"
  );
}

function respuestaSaludo() {
  return `💙 Soy Zara de Body Elite.

Cuéntame, ¿qué zona te gustaría trabajar? abdomen, glúteos, rostro, papada, piernas, brazos o depilación.`;
}

// =============== FUNCIÓN PRINCIPAL ===============
export function procesarMensaje(texto, numero, plataforma = "wsp") {
  if (!memoria[numero]) {
    memoria[numero] = {
      links_enviados: 0,
      llamada_ofrecida: false,
      plan_detectado: null,
      ultima_interaccion: null
    };
  }

  const mem = memoria[numero];

  // Anti-repetición básica
  if (mensajeRepetido(texto, mem)) {
    guardarMemoria();
    return `💙 Te entiendo, si quieres podemos verlo directo en tu diagnóstico gratuito.

¿Te dejo nuevamente el link para que revisemos tu caso con calma?`;
  }

  const tNorm = normalizar(texto);

  // Saludo inicial
  if (!mem.plan_detectado && esSaludoInicial(texto)) {
    guardarMemoria();
    return respuestaSaludo();
  }

  // Detectar plan por campaña o zona
  let plan =
    detectarPlanPorCampania(texto) ||
    detectarPlanPorZona(texto) ||
    mem.plan_detectado ||
    null;

  if (plan) {
    mem.plan_detectado = plan;
  }

  // Detectar intención
  const intencion = detectarIntencion(texto);
  const llamada = manejarFlujoLlamada(texto, mem);
  if (llamada) { guardarMemoria(); return llamada; }

  let respuestaBase = "";

  // PRIORIZAMOS INTENCIÓN SI HAY PLAN
  if (intencion === "explicacion" && plan) {
    respuestaBase = responderExplicacion(plan);
  } else if (intencion === "precio" && plan) {
    respuestaBase = responderPrecio(plan);
  } else if (intencion === "sesiones" && plan) {
    respuestaBase = responderSesiones(plan);
  } else if (intencion === "dolor") {
    respuestaBase = responderDolor();
  } else if (intencion === "botox") {
    respuestaBase = responderBotox();
  } else if (plan) {
    // Si solo nos contaron la zona o plan, sin intención específica → explicación por defecto
    respuestaBase = responderExplicacion(plan);
  } else {
    // SIN PLAN DETECTADO
    respuestaBase = `💙 Para ayudarte bien necesito saber un poquito más.

Cuéntame qué deseas mejorar: abdomen, glúteos, rostro, papada, piernas, brazos o depilación.`;
    guardarMemoria();
    return respuestaBase;
  }

  const final = armarRespuestaConLink(mem, respuestaBase);
  guardarMemoria();
  return final;
}
// ====================== FLUJO COMPLETO DE LLAMADA (OPCIÓN 2) ======================

function manejarFlujoLlamada(texto, mem) {
  const t = normalizar(texto);

  const confirmaciones = [
    "si", "sí", "ok", "dale", "de acuerdo",
    "llamame", "llámame", "quiero llamada",
    "si quiero", "sí quiero", "hagamos la llamada",
    "por favor llamen", "llamado"
  ];

  // Si Zara ya ofreció la llamada → confirmación
  if (mem.llamada_ofrecida && !mem.numero_pendiente) {
    if (confirmaciones.some(x => t.includes(x))) {
      mem.numero_pendiente = true;
      guardarMemoria();
      return "Perfecto 💙 ¿Me compartes tu número para que te llamemos?";
    }
  }

  // Si ya está pendiente el número → detectar número
  if (mem.numero_pendiente) {
    const numeroDetectado =
      texto.match(/(\+?56\s?9\s?\d{4}\s?\d{4})/g) ||
      texto.match(/(9\d{7,8})/g);

    if (numeroDetectado) {
      const numeroCliente = numeroDetectado[0].replace(/\s+/g, "");

      sendMessage(
        "+56983300262",
        `📞 Nueva solicitud de llamada:\nCliente: ${numeroCliente}\nMotivo: asistencia en tratamiento.`
      );

      sendMessage(
        "+56937648536",
        `📞 Nueva solicitud de llamada:\nCliente: ${numeroCliente}\nMotivo: asistencia en tratamiento.`
      );

      mem.numero_pendiente = false;
      guardarMemoria();

      return "Perfecto 💙 Una de nuestras profesionales te llamará en horario laboral.";
    }
  }

  return null;
}

