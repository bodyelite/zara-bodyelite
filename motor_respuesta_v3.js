import { leerMemoria, guardarMemoria } from "./memoria.js";

export async function procesarMensaje(usuario, textoEntrada) {
  const memoria = leerMemoria(usuario) || {
    ultimo_plan: null,
    intentosAgenda: 0
  };

  const respuesta = generarRespuesta(usuario, textoEntrada, memoria);

  guardarMemoria(usuario, memoria);
  return respuesta;
}

const palabras = {
  arrugas: ["arruga","arrugas","patas de gallo","pata de gallo","líneas","lineas","lineas de expresión","expresión","ceño","entrecejo","frente marcada"],
  flacidez_facial: ["flacidez","flacida","piel suelta","rostro caído","rostro caido","contorno caído","contorno caido","descolgado"],
  papada: ["papada","doble mentón","doble menton","mentón","menton"],
  manchas: ["manchas","manchitas","melasma","opaca","opacidad","luminosidad"],
  textura: ["textura","poros","poros abiertos","piel áspera","piel aspera"],
  face_h12: ["face h12","h12","h 12"],
  face_one: ["face one","one"],
  grasa_abdomen: ["abdomen","guata","guatita","panza","pansa","rollito","rollitos","flotador","cintura","estomago","estómago"],
  grasa_cuerpo: ["piernas","pierna","muslo","muslos","cartuchera","cartucheras","celulitis","retención","retencion"],
  brazos: ["brazo","brazos","ala de murcielago","murcielago"],
  gluteos: ["glúteo","gluteo","glúteos","gluteos","poto","colita","nalgas","levantar","gluteo caido","glúteo caído"],
  tono: ["marcación","marcacion","marcar","tonificar","tono","ems","músculo","musculo"],
  depilacion: ["depilar","depilación","depilacion","pelo","pelos","vello","vellos","rebaje","axila","pierna completa","laser","láser"],
  funcionamiento: ["como funciona","cómo funciona","en qué consiste","que máquinas usan","qué maquinas usan","maquina","máquina"],
  sesiones: ["sesiones","cuantas sesiones","número de sesiones","numero de sesiones"],
  resultados: ["resultados","cuando se ven","cuándo veo","cuanto demora","demora","sirve","vale la pena"],
  dolor: ["duele","dolor","molesta","ardor","incomodo"],
  ubicacion: ["donde están","ubicación","como llegar","dirección","donde quedan"],
  agendar: ["agendar","reservar","quiero ir","quiero agendar","link","pasame el link","quiero hora","agenda","agendo"]
};

const match = (texto, lista) => lista.some((w) => texto.includes(w));

function CTA_ofrecer() {
  return "¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito?";
}

function CTA_enviar() {
  return "Aquí tienes tu acceso directo para agendar tu diagnóstico gratuito:\nhttps://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}

function CTA_llamada() {
  return "Si prefieres, puedo pedir que una profesional te llame en horario laboral para ayudarte con tu hora. ¿Quieres que lo coordinemos?";
}

function recomendarPlanCorporal(texto) {
  if (match(texto, palabras.grasa_abdomen)) {
    return {
      plan: "Lipo Express",
      precio: 432000,
      descripcion: "Lipo Express reduce abdomen y cintura. • HIFU 12D • Cavitación • Radiofrecuencia profunda. Resultados rápidos."
    };
  }

  if (match(texto, palabras.grasa_cuerpo)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: "Lipo Focalizada para piernas o cartucheras. • Cavitación • Radiofrecuencia • Drenaje. Mejora volumen y celulitis."
    };
  }

  if (match(texto, palabras.brazos)) {
    return {
      plan: "Lipo Focalizada Reductiva",
      precio: 348800,
      descripcion: "Tratamiento para brazos. • Cavitación • Radiofrecuencia. Afina y define."
    };
  }

  if (texto.includes("flacidez")) {
    return {
      plan: "Body Tensor",
      precio: 232000,
      descripcion: "Body Tensor para firmeza corporal. • Radiofrecuencia médica • EMS Sculptor. Mejora caída del tejido."
    };
  }

  if (match(texto, palabras.tono)) {
    return {
      plan: "Body Fitness",
      precio: 360000,
      descripcion: "Body Fitness para tono y marcación. • EMS Sculptor 20.000 contracciones."
    };
  }

  if (match(texto, palabras.gluteos)) {
    return {
      plan: "Push Up Glúteos",
      precio: 376000,
      descripcion: "Push Up levanta y da forma al glúteo. • EMS Pro Sculpt • Radiofrecuencia."
    };
  }

  return null;
}

function recomendarPlanFacial(texto) {
  if (match(texto, palabras.arrugas)) {
    return {
      plan: "Face Antiage",
      precio: 281600,
      descripcion: "Face Antiage suaviza arrugas y líneas. • Toxina • Radiofrecuencia • Pink Glow."
    };
  }

  if (match(texto, palabras.flacidez_facial)) {
    return {
      plan: "Face Elite",
      precio: 358400,
      descripcion: "Face Elite lifting y firmeza. • HIFU 12D • Radiofrecuencia • Pink Glow."
    };
  }

  if (match(texto, palabras.papada)) {
    return {
      plan: "Face Papada",
      precio: 198400,
      descripcion: "Face Papada reduce doble mentón. • HIFU 12D • Lipolítico • Radiofrecuencia."
    };
  }

  if (match(texto, palabras.manchas)) {
    return {
      plan: "Face Smart",
      precio: 198400,
      descripcion: "Face Smart mejora manchas y tono. • Pink Glow • Limpieza profunda • RF suave."
    };
  }

  if (match(texto, palabras.textura)) {
    return {
      plan: "Face Light",
      precio: 128800,
      descripcion: "Face Light mejora textura y poros. • Limpieza profunda • RF suave • Pink Glow."
    };
  }

  if (match(texto, palabras.face_h12)) {
    return {
      plan: "Face H12",
      precio: 270400,
      descripcion: "Face H12 lifting profundo. • HIFU 12D facial • Radiofrecuencia • Pink Glow."
    };
  }

  if (match(texto, palabras.face_one)) {
    return {
      plan: "Face One",
      precio: 128800,
      descripcion: "Face One efecto inmediato. • RF médica • Pink Glow. Ideal para eventos."
    };
  }

  if (texto.includes("full face")) {
    return {
      plan: "Full Face",
      precio: 584000,
      descripcion: "Full Face rejuvenecimiento completo. • HIFU 12D • Radiofrecuencia • Pink Glow."
    };
  }

  return null;
}

function recomendarDepilacion(texto) {
  if (match(texto, palabras.depilacion)) {
    return {
      plan: "Depilación Láser DL900",
      precio: 153600,
      descripcion: "Láser DL900. • Sesiones cada 15 días • Sensación cálida • Resultados progresivos."
    };
  }
  return null;
}

function detectarCampaña(texto) {
  const t = texto.toLowerCase();
  const planes = [
    "push up","lipo express","lipo focalizada","lipo reductiva",
    "body tensor","body fitness","face elite","face antiage",
    "face smart","face light","face papada","face h12",
    "face one","full face","depilación","depilacion"
  ];

  for (const p of planes) {
    if (t.includes(`plan ${p}`) || t.includes(p)) return p;
  }
  return null;
}

function generarRespuesta(usuario, texto, memoria) {
  const t = texto.toLowerCase().trim();
  const quiereAgendar =
    match(t, palabras.agendar) ||
    ["si","sí","ok","dale","agenda","quiero","hagamos","agendo","perfecto"].includes(t);

  if (quiereAgendar) {
    memoria.intentosAgenda++;
    if (memoria.intentosAgenda === 4) return CTA_llamada();
    if (memoria.intentosAgenda > 1) return CTA_enviar();
    return CTA_ofrecer();
  }

  const camp = detectarCampaña(t);
  if (camp) {
    memoria.ultimo_plan = camp;
    return describirPlanDirecto(camp) +
      "\n\n¿Quieres que te deje el acceso para tu diagnóstico gratuito?";
  }

  const facial = recomendarPlanFacial(t);
  if (facial) {
    memoria.ultimo_plan = facial.plan;
    return `${facial.descripcion}\n\nValor desde: $${facial.precio.toLocaleString("es-CL")}\n¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito?`;
  }

  const corp = recomendarPlanCorporal(t);
  if (corp) {
    memoria.ultimo_plan = corp.plan;
    return `${corp.descripcion}\n\nValor desde: $${corp.precio.toLocaleString("es-CL")}\n¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito?`;
  }

  const dep = recomendarDepilacion(t);
  if (dep) {
    memoria.ultimo_plan = dep.plan;
    return `${dep.descripcion}\n\nValor desde: $${dep.precio.toLocaleString("es-CL")}\n¿Quieres que te deje el acceso para agendar tu diagnóstico gratuito?`;
  }

  if (memoria.ultimo_plan) {
    return `Puedo contarte más sobre ${memoria.ultimo_plan}. ¿Quieres que te deje el acceso a tu diagnóstico gratuito?`;
  }

  return "No logré entenderte bien. ¿Quieres trabajar volumen, flacidez, arrugas, papada o depilación?";
}

function describirPlanDirecto(plan) {
  const t = plan.toLowerCase();
  if (t.includes("push up")) return recomendarPlanCorporal("gluteos").descripcion;
  if (t.includes("lipo express")) return recomendarPlanCorporal("abdomen").descripcion;
  if (t.includes("lipo focalizada")) return recomendarPlanCorporal("piernas").descripcion;
  if (t.includes("lipo reductiva")) return recomendarPlanCorporal("piernas celulitis retencion").descripcion;
  if (t.includes("body tensor")) return recomendarPlanCorporal("flacidez").descripcion;
  if (t.includes("body fitness")) return recomendarPlanCorporal("marcación").descripcion;
  if (t.includes("face elite")) return recomendarPlanFacial("rostro caído").descripcion;
  if (t.includes("face antiage")) return recomendarPlanFacial("arrugas").descripcion;
  if (t.includes("face smart")) return recomendarPlanFacial("manchas").descripcion;
  if (t.includes("face light")) return recomendarPlanFacial("textura").descripcion;
  if (t.includes("face papada")) return recomendarPlanFacial("papada").descripcion;
  if (t.includes("face h12")) return recomendarPlanFacial("h12").descripcion;
  if (t.includes("face one")) return recomendarPlanFacial("one").descripcion;
  if (t.includes("full face")) return recomendarPlanFacial("full face").descripcion;
  if (t.includes("depilacion") || t.includes("depilación")) return recomendarDepilacion("depilar").descripcion;
  return "";
}
