// ============ Zara Body Elite - motor_respuesta_v3.js ============
// Versión FULL + Frases Coloquiales + Lógica Clínica + IG Style
// Bloque 1/8

export function procesarMensaje(texto, numero, plataforma) {
  if (mensajeRepetido(texto, memoria[numero])) {
    return "💙 Te leo, ¿quieres que revisemos tu diagnóstico gratuito?";
  }
  // ANTI-REPETICION
  if (mensajeRepetido(texto, memoria[numero])) {
    return "💙 Te leo, ¿quieres que revisemos tu diagnóstico gratuito?";
  }

  // Normalizamos texto
  texto = (texto || "").toLowerCase().trim();

  // Registro de memoria persistente (para llamada + links + plan activado)
  const fs = require("fs");
  const memoriaPath = "./memoria_usuarios.json";

  let memoria = {};
  try {
    memoria = JSON.parse(fs.readFileSync(memoriaPath, "utf8"));
  } catch (e) {
    memoria = {};
  }

  if (!memoria[numero]) {
    memoria[numero] = {
      links_enviados: 0,
      plan_detectado: null,
      ultima_interaccion: 0,
      modo_explicacion: false
    };
  }

  // ----------- Listas de zonas, expresiones y frases coloquiales --------------
  const expresionesAbdomen = [
    "abdomen", "guata", "guatita", "rollos", "rollitos", "pancita", "panza",
    "estómago", "flotadores", "llantitas", "barriga", "vientre", "poto del frente"
  ];

  const expresionesGluteos = [
    "gluteos", "glúteos", "poto", "potito", "cola", "booty", "pompas",
    "gluteo", "trasero", "glut", "levantar el poto", "subir el poto"
  ];

  const expresionesPapada = [
    "papada", "papadita", "doble mentón", "doble menton", "barbilla",
    "mentón", "menton", "cuello caído", "cuello caido"
  ];

  const expresionesArrugas = [
    "arrugas", "arruguitas", "líneas", "lineas", "patitas de gallo",
    "frente marcada", "arrugas ojos", "arrugas frente", "codigo de barras",
    "surco", "lineas de expresion", "líneas de expresión", "piel cansada"
  ];

  const expresionesPiernas = [
    "piernas", "muslos", "celulitis", "piel de naranja", "pozos", "cartucheras"
  ];

  const expresionesBrazos = [
    "brazos", "alas de murciélago", "alas de murcielago", "alas", "banderas"
  ];

  // ----------------- Detección temprana de intenciones -----------------

  const intencionesExplicacion = [
    "como funciona", "cómo funciona", "en qué consiste", "en que consiste",
    "como es", "cómo es", "como es el tratamiento", "qué hacen", "que hacen",
    "que me hacen", "qué me hacen", "como lo hacen", "cómo lo hacen",
    "explicame", "explícame", "quiero entender", "detallame", "detállame"
  ];

  const intencionesPrecio = [
    "precio", "valor", "cuanto vale", "cuánto vale", "vale", "cuánto cuesta",
    "cuanto cuesta", "tarifa", "costo", "cobran", "$"
  ];

  const intencionesSesiones = [
    "cuantas sesiones", "cuántas sesiones", "cuantas veces", "cuánto dura",
    "duración", "duracion", "cuantas semanas", "cuántas semanas"
  ];

  const intencionesDolor = [
    "duele", "dolor", "dueele", "me va a doler", "es doloroso"
  ];

  const intencionesBotox = [
    "botox", "toxina", "toxina botulinica", "toxina botulínica"
  ];

  // Palabras clave para DETECCIÓN DE PLANES
  const expresionesDepilacion = [
    "depilacion", "depilación", "depilar", "laser", "láser",
    "depilación definitiva", "depilación laser", "depilacion laser"
  ];

  // ---------------- PRECIOS “DESDE” POR PLAN ----------------

  const precios = {
    "lipo focalizada reductiva": 348800,
    "lipo express": 432000,
    "lipo reductiva": 480000,
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
    "face h12": 128000,
    "face one": 152000,
    "face papada": 128800,

    "depilacion": 259200
  };

  // ---------------- SESIONES POR PLAN ----------------

  const sesiones = {
    "lipo express": "6–8 sesiones",
    "lipo reductiva": "8 sesiones",
    "lipo focalizada reductiva": "6 sesiones",
    "lipo body elite": "8–10 sesiones",
    "push up": "6–8 sesiones",
    "body fitness": "6 sesiones",
    "body tensor": "6 sesiones",

    "face h12": "3 sesiones",
    "face one": "5 sesiones",
    "face light": "3 sesiones",
    "face smart": "6 sesiones",
    "face inicia": "6 sesiones",
    "face antiage": "6 sesiones",
    "face elite": "6 sesiones",
    "full face": "6 sesiones",
    "face papada": "6 sesiones",

    "depilacion": "6 sesiones"
  };

  // ---------------- EXPLICACIÓN POR PLAN ----------------

  const explicacion = {
    "lipo express":
      "✨ **Lipo Express** reduce abdomen, cintura y espalda con HIFU 12D (grasa profunda) + cavitación (rompe adipocitos) + radiofrecuencia (compactación).",
    "lipo reductiva":
      "✨ **Lipo Reductiva** moldea abdomen completo usando HIFU 12D + RF + cavitación.",
    "lipo focalizada reductiva":
      "✨ **Lipo Focalizada** reduce rollos pequeños con cavitación + RF localizada.",
    "lipo body elite":
      "✨ **Lipo Body Elite** combina reducción profunda + tensado premium con HIFU 12D.",
    "body tensor":
      "✨ **Body Tensor** tensa piernas/brazos con radiofrecuencia profunda.",
    "body fitness":
      "✨ **Body Fitness** tonifica y define piernas/glúteos con ProSculpt + RF.",
    "push up":
      "✨ **Push Up** da volumen real con ProSculpt (20.000 contracciones) + HIFU 12D para proyección.",

    "limpieza facial full":
      "✨ **Limpieza Facial Full** limpia y renueva la piel a profundidad.",
    "rf facial":
      "✨ **RF Facial** mejora firmeza, textura y definición.",
    "face light":
      "✨ **Face Light** trabaja brillo, textura y líneas finas.",
    "face smart":
      "✨ **Face Smart** combina LFP + Pink Glow + RF + HIFU 12D suave.",
    "face inicia":
      "✨ **Face Inicia** trabaja arrugas suaves, brillo y compactación.",
    "face antiage":
      "✨ **Face Antiage** suaviza arrugas y líneas con HIFU 12D + RF.",
    "face elite":
      "✨ **Face Elite** es un lifting no invasivo completo con HIFU 12D + RF + Pink Glow.",
    "full face":
      "✨ **Full Face** combina RF + Pink Glow + Toxina + HIFU 12D en un protocolo integral.",
    "face h12":
      "✨ **Face H12** es un lifting suave con HIFU 12D focal.",
    "face one":
      "✨ **Face One** combina RF + HIFU 12D + Exosomas.",
    "face papada":
      "✨ **Face Papada** reduce grasa + define contorno con HIFU 12D + lipolítico facial.",

    "depilacion":
      "✨ **Depilación Láser DL900** elimina el vello desde la raíz con tecnología diodo original."
  };

  // ========= DETECCIÓN DE PLAN INTEGRADA =========

  function detectarPlan(texto) {
    const t = texto.toLowerCase();

    if (expresionesAbdomen.some(x => t.includes(x))) return "lipo express";
    if (expresionesGluteos.some(x => t.includes(x))) return "push up";
    if (expresionesPapada.some(x => t.includes(x))) return "face papada";
    if (expresionesArrugas.some(x => t.includes(x))) return "face antiage";
    if (expresionesPiernas.some(x => t.includes(x))) return "body tensor";
    if (expresionesBrazos.some(x => t.includes(x))) return "body tensor";
    if (expresionesDepilacion.some(x => t.includes(x))) return "depilacion";

    return null;
  }


  // ========= DETECCIÓN DE INTENCIONES =========

  function detectarIntencion(texto) {
    const t = texto.toLowerCase();

    if (intencionesExplicacion.some(x => t.includes(x))) return "explicacion";
    if (intencionesPrecio.some(x => t.includes(x))) return "precio";
    if (intencionesSesiones.some(x => t.includes(x))) return "sesiones";
    if (intencionesDolor.some(x => t.includes(x))) return "dolor";
    if (intencionesBotox.some(x => t.includes(x))) return "botox";

    return null;
  }


  // ========= RESPUESTAS =========

  function responderPrecio(plan) {
    if (!precios[plan]) return "Los valores dependen del plan 💙 Agenda: " + LINK;
    return `El plan *${plan}* parte desde *$${precios[plan].toLocaleString("es-CL")}* 💙\\nAgenda aquí:\\n${LINK}`;
  }

  function responderSesiones(plan) {
    if (!sesiones[plan]) return "En la evaluación vemos cuántas sesiones necesitas 💙\\nAgenda: " + LINK;
    return `El plan *${plan}* suele necesitar *${sesiones[plan]}*.\\nAgenda aquí:\\n${LINK}`;
  }

  function responderExplicacion(plan) {
    if (!explicacion[plan]) return "Te explico con gusto 💙 pero necesito saber la zona exacta.";
    return `${explicacion[plan]}\\n\\nAgenda:\\n${LINK}`;
  }

  function responderDolor() {
    return "No duele 💙\\nPuedes sentir calor o contracciones según el plan, pero nada doloroso.\\nAgenda:\\n" + LINK;
  }

  function responderBotox() {
    return "💙 Sí, aplicamos toxina facial para arrugas dinámicas.\\nLa dosis exacta se define en la evaluación.\\nAgenda:\\n" + LINK;
  }


  // ========= CONTROL DE LINKS Y LLAMADA =========

  function controlLinks(mem) {
    mem.links_enviados++;

    if (mem.links_enviados === 1) {
      return { msg: "¿Quieres que te deje el link de agenda? 💙", preguntar: true };
    }

    if (mem.links_enviados >= 2 && mem.links_enviados <= 3) {
      return { msg: LINK, preguntar: false };
    }

    if (mem.links_enviados === 4) {
      return {
        msg: LINK + "\\n💙 Si quieres, una profesional puede llamarte (solo horario laboral). ¿Te gustaría?",
        preguntar: false
      };
    }

    return { msg: LINK, preguntar: false };
  }


  // ========= MÉTODO PRINCIPAL (CIERRE DEL ARCHIVO) =========

  // Reemplaza TODO lo que estaba cortado ANTES
  if (true) {
    const mem = memoria[numero];
    const intencion = detectarIntencion(texto);
    const plan = detectarPlan(texto) || mem.plan_detectado;

    if (plan) mem.plan_detectado = plan;


    // PRIORIDAD DE INTENCIÓN
    if (intencion === "explicacion" && plan) return responderExplicacion(plan);
    if (intencion === "precio" && plan) return responderPrecio(plan);
    if (intencion === "sesiones" && plan) return responderSesiones(plan);
    if (intencion === "dolor") return responderDolor();
    if (intencion === "botox") return responderBotox();

    // SI HAY PLAN → ENVIAR LINK Y OFRECER LLAMADA
    if (plan) {
      const ctl = controlLinks(mem);
      fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
      return responderExplicacion(plan);
    }

    // FALLBACK
    return "💙 Cuéntame qué deseas mejorar: abdomen, glúteos, rostro o depilación.";
  }

}

// ========== LINK AGENDA GLOBAL (NECESARIO) ==========
const LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15wM0NrxU8d7W64x5t2S6L4h9";


// ========== GUARDAR MEMORIA GLOBAL ==========
function guardarMem() {
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
}


// ========== PARCHE DE MEMORIA EN MÉTODO PRINCIPAL ==========

// Sobrescribir retornos para guardar memoria antes de responder
const oldResponderExplicacion = responderExplicacion;
responderExplicacion = function(plan) {
  guardarMem();
  return oldResponderExplicacion(plan);
};

const oldResponderPrecio = responderPrecio;
responderPrecio = function(plan) {
  guardarMem();
  return oldResponderPrecio(plan);
};

const oldResponderSesiones = responderSesiones;
responderSesiones = function(plan) {
  guardarMem();
  return oldResponderSesiones(plan);
};

const oldResponderDolor = responderDolor;
responderDolor = function() {
  guardarMem();
  return oldResponderDolor();
};

const oldResponderBotox = responderBotox;
responderBotox = function() {
  guardarMem();
  return oldResponderBotox();
};


// ========== ANTI-REPETICIÓN ==========



// ===== FUNCIÓN ANTI-REPETICIÓN CORREGIDA =====
function mensajeRepetido(texto, mem) {
  if (!mem) return false;
  if (mem.ultima_interaccion === texto) return true;
  mem.ultima_interaccion = texto;
  fs.writeFileSync(memoriaPath, JSON.stringify(memoria, null, 2));
  return false;
}
