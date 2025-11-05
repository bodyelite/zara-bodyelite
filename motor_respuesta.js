import { datos } from "./base_conocimiento.js";

function limpiar(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ampliarRespuesta(texto, zona, problema) {
  const extra = "🧠 HIFU 12D actúa sobre grasa y fascia. Cavitación rompe adipocitos. Radiofrecuencia tensa colágeno. EMS Sculptor tonifica músculo. Pink Glow regenera piel.";
  return `${texto}\n\n${extra}`;
}

export function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("triste") || t.includes("insegura") || t.includes("mal"))
    return "💬 Entiendo cómo te sientes. Podemos ayudarte con orientación y tecnología adecuada.";
  if (t.includes("gracias"))
    return "💛 Me alegra leerte. Si quieres te explico cómo agendar o qué plan seguir.";
  if (t.includes("no sé"))
    return "✨ Puedo guiarte paso a paso. Dime la zona que quieres mejorar y te propongo un plan.";
  if (t.includes("recomienda"))
    return "💡 Indícame si buscas rostro, abdomen, glúteos, muslos o brazos y te doy la mejor opción con valor.";
  return null;
}

export function responderCurioso(texto) {
  const t = texto.toLowerCase();

  // Sensaciones y funcionamiento
  if (t.includes("duele") || t.includes("dolor") || t.includes("molesta"))
    return "😊 No duele. Son tratamientos cómodos y no invasivos. Puedes sentir un leve calor o contracción suave según la tecnología aplicada (HIFU, RF o EMS Sculptor).";
  if (t.includes("consiste") || t.includes("funciona") || t.includes("qué hacen") || t.includes("como actua") || t.includes("cómo actúa"))
    return "🧬 Combinamos HIFU 12D, Radiofrecuencia, Cavitación y EMS Sculptor para modelar, tensar y tonificar. Se ajusta según diagnóstico corporal.";
  if (t.includes("cuánto dura") || t.includes("duración") || t.includes("tiempo de efecto"))
    return "⏳ Los resultados duran entre 8 y 12 meses según hábitos y mantención.";
  if (t.includes("cuántas sesiones") || t.includes("sesiones") || t.includes("veces"))
    return "📅 Usualmente 6 a 12 sesiones por zona. La evaluación inicial define la cantidad exacta.";
  if (t.includes("resultados") || t.includes("cuándo se notan") || t.includes("efecto"))
    return "✨ Cambios desde la primera sesión. Se consolidan hacia la tercera o cuarta. Progresivos y naturales.";
  if (t.includes("seguro") || t.includes("riesgo") || t.includes("contraindicacion") || t.includes("contraindicación"))
    return "⚕️ Es seguro y no invasivo. No se aplica en embarazo, lactancia ni enfermedades agudas.";

  // Certificación y respaldo médico
  if (t.includes("certificado") || t.includes("certificados") || t.includes("autorizado") || t.includes("autorización"))
    return "📋 Sí, todos los equipos están certificados y cuentan con registro sanitario vigente. Body Elite trabaja bajo estándares clínicos de uso profesional.";
  if (t.includes("medico") || t.includes("doctor") || t.includes("doctora") || t.includes("profesional a cargo"))
    return "⚕️ Cada evaluación es supervisada por profesionales de salud con formación en estética avanzada y respaldo médico.";
  if (t.includes("botox") || t.includes("toxina") || t.includes("relleno") || t.includes("acido") || t.includes("ácido hialurónico"))
    return "💉 Aplicamos toxina botulínica y ácido hialurónico según protocolos médicos. Los productos son originales y aprobados por ISP y ANMAT.";
  if (t.includes("aprobado") || t.includes("regulado") || t.includes("isp") || t.includes("anmat"))
    return "✅ Todos los productos y tecnologías de Body Elite están aprobados por ISP Chile y ANMAT Argentina para uso clínico profesional.";

  // Biológicos y regeneradores
  if (t.includes("exosoma") || t.includes("exosomas"))
    return "🧬 Los exosomas son vesículas con factores de crecimiento que estimulan la regeneración celular y mejoran la textura de la piel. Se aplican en tratamientos de rejuvenecimiento y reparación tisular avanzada.";
  if (t.includes("plasma") || t.includes("plaquetas") || t.includes("prp"))
    return "💉 El Plasma Rico en Plaquetas (PRP) utiliza tus propios factores de crecimiento para regenerar la piel, mejorar cicatrices y estimular colágeno natural. Procedimiento seguro y avalado médicamente.";
  if (t.includes("pink glow") || t.includes("pinkglow") || t.includes("vitaminas") || t.includes("bioestimulante"))
    return "🌸 Pink Glow es un biorevitalizante con péptidos, antioxidantes y ácido hialurónico. Mejora el tono, la hidratación y la luminosidad facial con efecto inmediato.";

  // Precios
  if (t.includes("precio") || t.includes("valor") || t.includes("costo"))
    return "💰 Planes desde $120.000 (faciales) y $348.800 (corporales). Incluye diagnóstico gratuito.";

  return null;
}

function responderObjecion(texto) {
  const t = texto.toLowerCase();
  if (t.includes("caro") || t.includes("mas barato") || t.includes("más barato") || t.includes("carisimo") || t.includes("carísima"))
    return "💎 Entiendo tu punto. Usamos equipos clínicos de alta tecnología (HIFU 12D, RF, EMS Sculptor) con resultados visibles y seguimiento profesional. La evaluación inicial es gratuita para que confirmes el valor por ti misma.";
  if (t.includes("vale la pena") || t.includes("por que ese precio") || t.includes("por qué ese precio") || t.includes("cuesta tanto"))
    return "🌟 Los valores reflejan tecnología, seguridad y resultados sin cirugía. Incluye diagnóstico con IA y control profesional. Muchas pacientes nos eligen por eso.";
  return null;
}

export function responder(texto) {
  const t = limpiar(texto);
  const palabras = t.split(" ");
  const f = datos.frases;
  const info = datos.info;
  const alias = datos.alias;
  const probs = datos.problemas;
  const planes = datos.planes;

  if (f.bienvenida.some(x => t.includes(x)))
    return "🌸 Hola, soy Zara IA de Body Elite. Cuéntame qué zona te gustaría mejorar.";
  if (f.precio.some(x => t.includes(x)))
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluye diagnóstico gratuito con IA.";
  if (f.ubicacion.some(x => t.includes(x)))
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  if (f.horarios.some(x => t.includes(x)))
    return `🕒 Horarios: ${info.horarios}`;
  if (f.humano.some(x => t.includes(x)))
    return `📞 Habla con un especialista al ${info.telefono}`;
  if (f.intencion.some(x => t.includes(x)))
    return `📅 Agenda tu evaluación gratuita aquí 👉 ${info.agendar}`;
  if (f.emocional.some(x => t.includes(x)))
    return "💬 Entiendo lo que sientes. Podemos ayudarte con un plan personalizado.";

  let zonaDetectada = null;
  for (const [zona, lista] of Object.entries(alias)) {
    if (lista.some(a => palabras.includes(a) || t.includes(a))) {
      zonaDetectada = zona;
      break;
    }
  }

  let problemaDetectado = null;
  for (const [zona, grupo] of Object.entries(probs)) {
    for (const clave of Object.keys(grupo)) {
      const tokens = clave.split(" ");
      if (tokens.some(tok => t.includes(tok))) {
        problemaDetectado = clave;
        if (!zonaDetectada) zonaDetectada = zona;
        break;
      }
    }
    if (problemaDetectado) break;
  }

  if (zonaDetectada && problemaDetectado) {
    const arr = probs[zonaDetectada][problemaDetectado];
    if (arr && arr.length) {
      const [p1, p2] = arr;
      const d1 = planes[p1] || "";
      const d2 = p2 ? (planes[p2] || "") : "";
      let r = `✨ Para ${zonaDetectada} con ${problemaDetectado}, te recomiendo **${p1}**.\n${d1}`;
      if (p2) r += `\nTambién puedes considerar **${p2}**.\n${d2}`;
      r += `\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
      return r;
    }
  }

  if (zonaDetectada) {
    const grupo = probs[zonaDetectada];
    const p1 = Object.values(grupo)[0]?.[0];
    if (p1) {
      const d1 = datos.planes[p1] || "";
      return `💡 Para ${zonaDetectada}, te recomiendo **${p1}**.\n${d1}\n📅 Agenda tu evaluación gratuita 👉 ${datos.info.agendar}`;
    }
  }

  return "✨ Soy Zara IA de Body Elite. Dime la zona a mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indico el plan ideal.";
}

export function responderExtendido(textoUsuario) {
  const t = textoUsuario.toLowerCase();

  // 1. Módulos especializados
  const emp = responderEmpatico(textoUsuario);
  if (emp) return emp + "\n📅 ¿Quieres que te agende una evaluación gratuita para orientarte mejor? " + datos.info.agendar;

  const obj = responderObjecion(textoUsuario);
  if (obj) return obj + "\n💬 Puedo ofrecerte una evaluación sin costo para mostrarte resultados reales. Agenda aquí 👉 " + datos.info.agendar;

  const cur = responderCurioso(textoUsuario);
  if (cur) {
    // Respuesta con seguimiento natural
    if (t.includes("botox") || t.includes("toxina") || t.includes("relleno"))
      return cur + "\n💉 Podemos evaluar rostro o cuello según tu objetivo. ¿Te gustaría agendar una valoración gratuita para ver dosis y zonas? 👉 " + datos.info.agendar;
    if (t.includes("exosoma") || t.includes("plasma") || t.includes("pink"))
      return cur + "\n✨ Son procedimientos regenerativos que se aplican en consulta. Puedo reservarte una evaluación sin costo. 👉 " + datos.info.agendar;
    if (t.includes("certificado") || t.includes("médico") || t.includes("doctor"))
      return cur + "\n⚕️ Si deseas, puedo agendarte una evaluación con nuestro equipo clínico. 👉 " + datos.info.agendar;
    return cur + "\n📅 ¿Te gustaría que te ayude a agendar tu evaluación gratuita para personalizar tu tratamiento? 👉 " + datos.info.agendar;
  }

  // 2. Si no hubo coincidencia directa, revisa la intención general
  if (t.includes("grasa") || t.includes("abdomen") || t.includes("gluteo") || t.includes("pierna"))
    return "💪 Puedo ayudarte con planes reductivos y tonificantes como Lipo Reductiva o Body Fitness. Incluyen HIFU 12D, RF y EMS Sculptor.\n📅 Agenda tu evaluación gratuita aquí 👉 " + datos.info.agendar;

  if (t.includes("rostro") || t.includes("arruga") || t.includes("flacidez") || t.includes("papada"))
    return "🌸 Para rejuvenecimiento facial tenemos Face Elite y Face Antiage, con HIFU + Toxina + Pink Glow. Resultados visibles sin cirugía.\n📅 Agenda tu diagnóstico gratuito aquí 👉 " + datos.info.agendar;

  // 3. Respuesta base
  const base = responder(textoUsuario);
  if (!base.includes("Soy Zara IA de Body Elite")) {
    // refuerzo conversacional
    return base + "\n💬 Si deseas, puedo coordinar una evaluación sin costo para definir tu plan ideal. 👉 " + datos.info.agendar;
  }

  // 4. Fallback amable
  return "🤔 No logré entender del todo tu pregunta, pero puedo ayudarte a definirlo en tu evaluación gratuita.\n📅 Agenda aquí 👉 " + datos.info.agendar;
}