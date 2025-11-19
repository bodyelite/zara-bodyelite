import memoria from "./memoria_usuarios.json" with { type: "json" };

const LINK = "https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";

export function procesarMensaje(texto, numero, plataforma) {
  const t = texto.toLowerCase().trim();

  // ===============================
  // 1. DETECCIÓN DE CAMPAÑAS
  // ===============================

  const campañas = {
    "push up": "push up",
    "lipo express": "lipo express",
    "express": "lipo express",
    "body fitness": "body fitness",
    "fitness": "body fitness",
    "tensor": "body tensor",
    "body tensor": "body tensor",
    "lipo reductiva": "lipo reductiva",
    "reductiva": "lipo reductiva",
    "lipo body elite": "lipo body elite",
    "body elite": "lipo body elite",
    "face elite": "face elite",
    "face antiage": "face antiage",
    "antiage": "face antiage",
    "face papada": "face papada",
    "papada": "face papada",
    "depilación": "depilacion",
    "depilacion": "depilacion"
  };

  for (const key in campañas) {
    if (t.startsWith(key)) {
      memoria[numero] = memoria[numero] || {};
      memoria[numero].ultimoPlan = campañas[key];
      return responderPlan(campañas[key]);
    }
  }

  // ===============================
  // 2. DETECCIÓN POR ZONA
  // ===============================

  const zonas = [
    { palabras: ["guata", "abdomen", "rollos", "cintura"], plan: "lipo express" },
    { palabras: ["arrugas", "frente", "patitas", "líneas", "lineas"], plan: "face antiage" },
    { palabras: ["papada", "papadita"], plan: "face papada" },
    { palabras: ["poto", "gluteo", "glúteo", "gluteos", "glúteos", "nalgas"], plan: "push up" },
    { palabras: ["piernas", "brazos", "flacidos", "flácidos"], plan: "body tensor" },
    { palabras: ["depilar", "depilación", "depilacion", "láser", "laser"], plan: "depilacion" }
  ];

  for (const zona of zonas) {
    for (const palabra of zona.palabras) {
      if (t.includes(palabra)) {
        memoria[numero] = memoria[numero] || {};
        memoria[numero].ultimoPlan = zona.plan;
        return responderPlan(zona.plan);
      }
    }
  }

  // ===============================
  // 3. PRECIO
  // ===============================

  const palabrasPrecio = ["precio", "cuánto vale", "cuanto vale", "valor", "vale", "cuanto sale", "cuánto sale"];
  if (palabrasPrecio.some(p => t.includes(p))) {
    if (memoria[numero] && memoria[numero].ultimoPlan) {
      return responderPrecio(memoria[numero].ultimoPlan);
    }
    return `Los valores dependen del plan y la zona.\nAgenda tu diagnóstico aquí:\n${LINK}`;
  }

  // ===============================
  // 4. EXPLICACIÓN
  // ===============================

  const triggersExplicacion = [
    "que es","qué es","q es",
    "en que consiste","en qué consiste",
    "como funciona","cómo funciona",
    "como es","cómo es",
    "como se hace","cómo se hace",
    "explicame","explícame",
    "detalles","detalle",
    "informacion","información","info",
    "que incluye","qué incluye",
    "cuantas sesiones","cuántas sesiones","sesiones",
    "duele","duele?",
    "sirve","funciona","realmente sirve",
    "como opera","como actua","como trabaja",
    "que onda","es bueno","vale la pena"
  ];

  if (triggersExplicacion.some(p => t.includes(p))) {
    if (memoria[numero] && memoria[numero].ultimoPlan) {
      return responderExplicacion(memoria[numero].ultimoPlan);
    }
    return `Para explicarte bien necesito saber tu objetivo.\n¿Quieres trabajar abdomen, glúteos, rostro o depilación?`;
  }

  // ===============================
  // 5. FALLBACK
  // ===============================

  return `💙 Cuéntame qué deseas mejorar: abdomen, glúteos, rostro o depilación.`;
}



// =====================================================
// RESPUESTAS POR PLAN
// =====================================================

function responderPlan(plan) {
  const respuestas = {
    "lipo express": `✨ El plan más recomendado es **Lipo Express**.\nReduce abdomen, cintura y espalda con HIFU 12D + cavitación + RF.\n\nComo alternativa también puede aplicar **Lipo Reductiva**.\nAgenda aquí:\n${LINK}`,
    "lipo reductiva": `✨ Plan **Lipo Reductiva**.\nMoldeamiento real con HIFU 12D + RF + cavitación.\nAgenda aquí:\n${LINK}`,
    "lipo focalizada reductiva": `✨ **Lipo Focalizada Reductiva**.\nPara rollos pequeños con cavitación + RF.\nAgenda aquí:\n${LINK}`,
    "lipo body elite": `✨ **Lipo Body Elite**.\nReducción + tensado premium con HIFU 12D.\nAgenda aquí:\n${LINK}`,
    "push up": `✨ El plan más recomendado es **Push Up**.\nVolumen + proyección con ProSculpt + HIFU 12D.\n\nComo alternativa también podría aplicar **Body Fitness**.\nAgenda aquí:\n${LINK}`,
    "body fitness": `✨ **Body Fitness**.\nTonificación + definición con ProSculpt + RF.\nAgenda aquí:\n${LINK}`,
    "body tensor": `✨ **Body Tensor**.\nTensado y firmeza con radiofrecuencia profunda.\nAgenda aquí:\n${LINK}`,
    "face antiage": `✨ **Face Antiage**.\nArrugas, líneas y firmeza con HIFU 12D + RF.\nAgenda aquí:\n${LINK}`,
    "face elite": `✨ **Face Elite**.\nLifting completo no quirúrgico.\nAgenda aquí:\n${LINK}`,
    "face papada": `✨ **Face Papada**.\nReducción + tensado del contorno.\nAgenda aquí:\n${LINK}`,
    "lipolítico facial": `✨ **Lipolítico Facial**.\nReduce grasa localizada en papada.\nAgenda aquí:\n${LINK}`,
    "depilacion": `✨ **Depilación Láser DL900**.\nRápido, seguro y eficaz desde la raíz.\nAgenda aquí:\n${LINK}`
  };

  return respuestas[plan] || `Agenda tu diagnóstico aquí:\n${LINK}`;
}


function responderPrecio(plan) {
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
    "depilacion": 259200,
    "face papada": 128800
  };

  if (precios[plan]) {
    return `El plan **${capital(plan)}** parte desde **$${precios[plan].toLocaleString("es-CL")}** 💙\nAgenda aquí tu diagnóstico:\n${LINK}`;
  }

  return `Los valores dependen del plan y la zona.\nAgenda tu evaluación aquí:\n${LINK}`;
}


function responderExplicacion(plan) {
  const explic = {
    "lipo express": `✨ **Lipo Express** trabaja abdomen, cintura y espalda con:\n• HIFU 12D (grasa profunda)\n• Cavitación (adipocitos)\n• RF (compactación)\nResultados 2–3 semanas.\nAgenda aquí:\n${LINK}`,
    "lipo reductiva": `✨ **Lipo Reductiva** moldea abdomen real usando:\n• HIFU 12D\n• RF\n• Cavitación\nAgenda aquí:\n${LINK}`,
    "push up": `✨ **Push Up** da volumen real con:\n• ProSculpt (20.000 contracciones)\n• HIFU 12D para tensado\nResultados desde la 1° semana.\nAgenda aquí:\n${LINK}`, 
    "body tensor": `✨ **Body Tensor** tensa y mejora firmeza con RF profunda.\nAgenda aquí:\n${LINK}`,
    "body fitness": `✨ **Body Fitness** tonifica glúteos, piernas o abdomen con ProSculpt + RF.\nAgenda aquí:\n${LINK}`,
    "face antiage": `✨ **Face Antiage** usa HIFU 12D + RF para arrugas, líneas y firmeza.\nAgenda aquí:\n${LINK}`,
    "face papada": `✨ **Face Papada** reduce grasa + tensa contorno con HIFU 12D.\nAgenda aquí:\n${LINK}`,
    "depilacion": `✨ **Láser DL900** elimina vello desde la raíz.\nAgenda aquí:\n${LINK}`
  };

  return explic[plan] || `Agenda tu diagnóstico aquí:\n${LINK}`;
}


function capital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
