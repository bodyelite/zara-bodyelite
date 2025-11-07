// ============================================================
//  Zara Conversacional Empática v1
//  Motor de respuesta final - Body Elite Estética Avanzada
// ============================================================

import datos from "./base_conocimiento.js";
import memoria from "./memoria.js";
const { conocimientos } = datos;

export async function procesarMensaje(usuario, mensaje) {
  const texto = mensaje.toLowerCase().trim();
  const contexto = memoria.obtenerContexto(usuario);
  const afirmativos = ["sí","si","dale","quiero","me interesa","claro","por supuesto"];

  // --- SALUDO ------------------------------------------------
  if (texto === "hola" || texto.startsWith("buen")) {
    memoria.guardarContexto(usuario,"inicio");
    return "✨ Soy *Zara de Body Elite*. Qué gusto saludarte.\nCuéntame qué zona o tratamiento te gustaría mejorar para orientarte con total honestidad clínica.";
  }

  // --- FACIAL ------------------------------------------------
  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro") || texto.includes("papada")) {
    memoria.guardarContexto(usuario,"facial");
    return "💆‍♀️ Entiendo, muchas personas buscan mejorar firmeza o luminosidad del rostro.\nTrabajamos con *HIFU 12D, Radiofrecuencia y Pink Glow*, que estimulan colágeno y suavizan arrugas sin cirugía.\n¿Tu objetivo es luminosidad, lifting o rejuvenecimiento?";
  }

  if (contexto === "facial") {
    if (texto.includes("arruga") || texto.includes("rejuvenecer") || texto.includes("antiage") || texto.includes("suavizar")) {
      memoria.guardarContexto(usuario,"faceantiage");
      return "🌸 Perfecto. Para suavizar arrugas sin rigidez usamos *Face Antiage* o *Face Elite* (*HIFU 12D + RF + Pink Glow*).\nResultados visibles desde la primera sesión, sin reposo.\n✨ Si te parece, puedo ayudarte a agendar ahora mismo tu diagnóstico gratuito, es sin costo ni compromiso. ¿Quieres que te ayude a coordinarlo?";
    }
    if (texto.includes("lifting") || texto.includes("tensar")) {
      memoria.guardarContexto(usuario,"faceelite");
      return "🌟 El *Face Elite* combina *HIFU 12D + Toxina + Pink Glow* para lifting y definición facial completa.\nValor desde $358.400.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan ideal. ¿Quieres que te ayude a reservar?";
    }
  }

  // --- TOXINA ------------------------------------------------
  if (texto.includes("botox") || texto.includes("toxina") || texto.includes("relleno")) {
    memoria.guardarContexto(usuario,"toxina");
    return "💉 Sí, aplicamos *Toxina Botulínica Facial* en frente, entrecejo o patas de gallo.\nRelaja los músculos responsables de las arrugas de expresión sin alterar tu naturalidad.\n¿Te gustaría saber el valor o cómo es el procedimiento?";
  }

  if (contexto === "toxina") {
    if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) {
      return "💰 La *Toxina Botulínica Facial* parte desde $95.000 por zona (frente, entrecejo o patas de gallo).\nIncluye evaluación y diseño personalizado.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu valor exacto. ¿Quieres que te ayude a reservar?";
    }
    if (texto.includes("frente") || texto.includes("entrecejo") || texto.includes("patas")) {
      return "💉 Perfecto. En esas zonas aplicamos microdosis precisas para suavizar líneas sin rigidez.\nResultados visibles en 3 a 5 días.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para que una profesional confirme tu plan.";
    }
  }

  // --- CORPORAL ----------------------------------------------
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("muslos") ||
      texto.includes("piernas") || texto.includes("brazos") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario,"corporal");
    return "💛 Entiendo, muchas personas también notan esa acumulación en esas zonas.\nUsamos *HIFU 12D, Cavitación y Radiofrecuencia* para reducir grasa y tensar piel sin dolor.\n¿Tu objetivo es reducir, tonificar o definir?";
  }

  if (contexto === "corporal") {
    if (texto.includes("reducir")) {
      memoria.guardarContexto(usuario,"lipo");
      return "🔥 Para reducción trabajamos con *Lipo Body Elite* o *Lipo Express* (*HIFU 12D + Cavitación + RF*).\nDesde $432.000 según zona.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
    }
    if (texto.includes("reafirmar") || texto.includes("tonificar")) {
      memoria.guardarContexto(usuario,"tensor");
      return "💪 Para reafirmar y tonificar usamos *Body Tensor* o *Body Fitness* (*HIFU 12D + RF + EMS Sculptor*).\nIdeales postparto o tras pérdida de peso.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito y definir el programa ideal. ¿Quieres que te ayude a coordinarlo?";
    }
  }

  // --- GLÚTEOS ------------------------------------------------
  if (texto.includes("glúteo") || texto.includes("gluteos") || texto.includes("poto") ||
      texto.includes("trasero") || texto.includes("colita") || texto.includes("levantar")) {
    memoria.guardarContexto(usuario,"gluteos");
    return "🍑 Para levantar y dar forma al glúteo trabajamos con el *Push Up Glúteos* (*EMS Sculptor + RF + HIFU tensor*).\nGenera más de 20.000 contracciones en 30 min y mejora la firmeza desde la primera sesión.\nValor desde $376.000.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a reservar?";
  }

  // --- DEPILACIÓN --------------------------------------------
  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila") ||
      texto.includes("bikini") || texto.includes("piernas") || texto.includes("glúteo")) {
    memoria.guardarContexto(usuario,"depilacion");
    return "💫 La *Depilación Láser Diodo Alexandrita Triple Onda* elimina el vello desde la raíz sin dolor, incluso en pieles sensibles.\nLos planes parten desde $35.000 por zona y $180.000 por 6 sesiones (bikini completo).\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
  }

  // --- PREGUNTAS DE PRECIOS GENERALES ------------------------
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) {
    switch (contexto) {
      case "lipo": return "💰 *Lipo Express* desde $432.000 y *Lipo Body Elite* desde $664.000 (HIFU 12D + Cavitación + RF).";
      case "tensor": return "💰 *Body Tensor* desde $232.000 y *Body Fitness* desde $360.000, según zona y objetivo.";
      case "gluteos": return "🍑 *Push Up Glúteos* desde $376.000 (EMS Sculptor + RF + HIFU tensor).";
      case "facial": return "💆‍♀️ Tratamientos faciales desde $128.800 (*Face Light*) hasta $358.400 (*Face Elite*).";
      case "toxina": return "💉 *Toxina Botulínica* desde $95.000 por zona.";
      default:
        return "💰 Los planes corporales parten desde $232.000 y los faciales desde $128.800.\nLa evaluación es gratuita para definir tu presupuesto exacto.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito. ¿Quieres que te ayude a coordinarlo?";
    }
  }

  // --- UBICACIÓN ---------------------------------------------
  if (texto.includes("dónde") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return "📍 *Body Elite Estética Avanzada* — Av. Las Perdices Nº2990, Local 23, Peñalolén (a pasos de Av. Tobalaba).\n🕓 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.\n💛 Puedes agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\n✨ Si te parece, puedo ayudarte a coordinar tu hora ahora mismo, es sin costo ni compromiso. ¿Quieres que te ayude a reservar?";
  }

  // --- OBJECIONES --------------------------------------------
  if (texto.includes("caro") || texto.includes("precio alto")) {
    memoria.guardarContexto(usuario,"objecion_precio");
    return "💬 Entiendo completamente, es normal compararlo.\nNuestros valores reflejan *HIFU 12D original, Cavitación clínica y Pink Glow europeo*, con seguimiento profesional.\nLa evaluación es gratuita y se adapta a tu presupuesto.\n✨ Si te parece, puedo ayudarte a agendarla ahora mismo para que revises las opciones. ¿Quieres que te ayude a coordinarla?";
  }

  if (texto.includes("lejos") || texto.includes("peñalolén") || texto.includes("soy de")) {
    return "🚗 Estamos en *Av. Las Perdices Nº2990 – Peñalolén*, con fácil acceso desde Tobalaba y Vespucio Sur.\nAtendemos también con horario extendido para facilitarte la visita.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito en el horario que te acomode. ¿Quieres que te ayude a coordinarlo?";
  }

  // --- RESPUESTAS CORTAS / CIERRE -----------------------------
  if (afirmativos.some(p => texto.startsWith(p))) {
    return "✨ Perfecto. Te dejo el enlace directo para agendar tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\nSolo selecciona el día y hora que te acomode mejor. 💛";
  }

  if (["gracias","ok","vale","perfecto","genial","super"].some(p => texto.includes(p))) {
    return "💛 Me alegra poder ayudarte.\nRecuerda que la evaluación es gratuita y sin compromiso.\nPuedes reservar tu hora aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
  }

  // --- FALLBACK ----------------------------------------------
  return "💛 Disculpa, no logré entender tu mensaje.\nNuestras profesionales podrán resolver todas tus dudas durante la evaluación gratuita.\nAgenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
}
