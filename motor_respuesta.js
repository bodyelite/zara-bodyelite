import { datos } from "./base_conocimiento.js";

function limpiar(t) {
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    return "💰 Nuestros planes parten desde $120.000 (faciales) y $348.800 (corporales). Incluyen diagnóstico gratuito con IA.";
  if (f.ubicacion.some(x => t.includes(x))) 
    return `📍 ${info.direccion}\n🕒 ${info.horarios}`;
  if (f.horarios.some(x => t.includes(x))) 
    return `🕒 Horarios de atención: ${info.horarios}`;
  if (f.humano.some(x => t.includes(x))) 
    return `📞 Puedes hablar con un especialista al ${info.telefono}`;
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
    for (const [clave] of Object.entries(grupo)) {
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
    if (arr) {
      const [p1, p2] = arr;
      const d1 = planes[p1] || "", d2 = planes[p2] || "";
      let r = `✨ Para ${zonaDetectada} con ${problemaDetectado}, te recomiendo **${p1}**.\n${d1}`;
      if (p2) r += `\nTambién puedes considerar **${p2}**.\n${d2}`;
      r += `\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
      return r;
    }
  }

  if (zonaDetectada) {
    const grupo = probs[zonaDetectada];
    const p1 = Object.values(grupo)[0][0];
    const d1 = planes[p1];
    return `💡 Para ${zonaDetectada}, te recomiendo **${p1}**.\n${d1}\n📅 Agenda tu evaluación gratuita 👉 ${info.agendar}`;
  }

  return "✨ Soy Zara IA de Body Elite. Cuéntame qué zona deseas mejorar (rostro, abdomen, glúteos, muslos, brazos, etc.) y te indicaré el tratamiento ideal.";
}

function ampliarRespuesta(texto, zona, problema) {
  const info = "🧠 HIFU 12D actúa sobre grasa y fascia. Cavitación rompe adipocitos. Radiofrecuencia tensa colágeno. EMS Sculptor tonifica músculo. Pink Glow regenera piel.";
  return `${texto}\n\n${info}`;
}

export function responderEmpatico(texto) {
  const t = texto.toLowerCase();
  if (t.includes("triste") || t.includes("insegura") || t.includes("mal"))
    return "💬 Entiendo cómo te sientes. Podemos ayudarte con orientación y tecnología adecuada.";
  if (t.includes("gracias"))
    return "💛 Me alegra leerte. Si deseas puedo explicarte cómo agendar o qué plan seguir.";
  if (t.includes("no sé"))
    return "✨ No te preocupes, puedo guiarte paso a paso según la zona o lo que quieras mejorar.";
  if (t.includes("recomienda"))
    return "💡 Cuéntame si buscas trabajar rostro, abdomen, glúteos o brazos, y te diré la mejor opción con valor.";
  return null;
}

export function responderCurioso(texto) {
  const t = texto.toLowerCase();
  if (t.includes("duele") || t.includes("dolor") || t.includes("molesta"))
    return "😊 No duele. Son tratamientos cómodos y no invasivos. Puedes sentir un leve calor o contracción suave según la tecnología aplicada (HIFU, RF o EMS Sculptor).";
  if (t.includes("consiste") || t.includes("funciona") || t.includes("qué hacen") || t.includes("cómo actúa"))
    return "🧬 Combinamos tecnologías como HIFU 12D, RF y Prosculpt para modelar, tensar y regenerar tejido. Todo guiado por diagnóstico corporal.";
  if (t.includes("cuánto dura") || t.includes("duración"))
    return "⏳ Los resultados duran entre 8 y 12 meses según tus hábitos y alimentación.";
  if (t.includes("cuántas sesiones") || t.includes("sesiones"))
    return "📅 Generalmente se recomiendan entre 6 y 12 sesiones por zona, según evaluación.";
  if (t.includes("resultados") || t.includes("efecto"))
    return "✨ Notarás cambios desde la primera sesión; se consolidan en la tercera o cuarta.";
  if (t.includes("precio") || t.includes("valor"))
    return "💰 Nuestros planes comienzan desde $120.000 (faciales) y $348.800 (corporales).";
  if (t.includes("seguro") || t.includes("riesgo"))
    return "⚕️ Es seguro, no invasivo y aprobado clínicamente. No se aplica en embarazo o enfermedades agudas.";
  return null;
}

export function responderExtendido(textoUsuario) {
  // Prioridad 1: empatía
  const empatica = responderEmpatico(textoUsuario);
  if (empatica) return empatica;

  // Prioridad 2: curiosidad clínica
  const curioso = responderCurioso(textoUsuario);
  if (curioso) return curioso;

  // Prioridad 3: recomendación clínica
  const base = responder(textoUsuario);
  if (!base.includes("Soy Zara IA de Body Elite")) return base;

  // Prioridad 4: fallback genérico
  return "🤔 No logré entender tu pregunta, pero nuestras profesionales podrán orientarte durante tu evaluación gratuita. 📅 Agenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0nrxU8d7W64x5t2S6L4h9";
}
