// ============================================================
// Zara Conversacional Empática v2
// Flujo final con seguimiento completo y cierres naturales
// ============================================================

import datos from "./base_conocimiento.js";
import memoria from "./memoria.js";
const { conocimientos } = datos;

export async function procesarMensaje(usuario, mensaje) {
  const texto = mensaje.toLowerCase().trim();
  const contexto = memoria.obtenerContexto(usuario);
  if (!contexto && memoria.obtenerUltimoTema(usuario)) {n    memoria.guardarContexto(usuario, memoria.obtenerUltimoTema(usuario));n  }n  if (!contexto && memoria.obtenerUltimoTema(usuario)) {n    memoria.guardarContexto(usuario, memoria.obtenerUltimoTema(usuario));n  }n  const afirmativos = ["sí","si","dale","quiero","me interesa","claro","por supuesto"];

  // --- SALUDO ------------------------------------------------
  if (texto === "hola" || texto.startsWith("buen")) {
    memoria.guardarContexto(usuario,"inicio");
    return "✨ Soy *Zara de Body Elite*. Qué gusto saludarte.\nCuéntame qué zona o tratamiento te gustaría mejorar para orientarte con total honestidad clínica.";
  }

  // --- DETECCIÓN FACIAL --------------------------------------
  if (texto.includes("cara") || texto.includes("facial") || texto.includes("rostro") || texto.includes("papada")) {
    memoria.guardarContexto(usuario,"facial");
    return "💆‍♀️ Entiendo, muchas personas buscan mejorar firmeza o luminosidad del rostro.\nUsamos *HIFU 12D, Radiofrecuencia y Pink Glow* para estimular colágeno y suavizar arrugas sin cirugía.\n¿Tu objetivo es luminosidad, lifting o rejuvenecimiento?";
  }

  // --- FLUJO FACIAL ------------------------------------------
  if (contexto === "facial") {
    if (texto.includes("arruga") || texto.includes("rejuvenecer") || texto.includes("antiage") || texto.includes("suavizar")) {
      memoria.guardarContexto(usuario,"faceantiage");
      return "🌸 Perfecto. Para suavizar arrugas sin rigidez usamos *Face Antiage* o *Face Elite* (*HIFU 12D + RF + Pink Glow*).\nResultados visibles desde la primera sesión, sin reposo.\n✨ Si te parece, puedo ayudarte a agendar ahora mismo tu diagnóstico gratuito, es sin costo ni compromiso. ¿Quieres que te ayude a coordinarlo?";
    }
    if (texto.includes("lifting") || texto.includes("tensar")) {
      memoria.guardarContexto(usuario,"faceelite");
      return "🌟 El *Face Elite* combina *HIFU 12D + Toxina + Pink Glow* para lifting completo.\nValor desde $358 400.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan ideal. ¿Quieres que te ayude a reservar?";
    }
    if (texto.includes("cómo") || texto.includes("funciona") || texto.includes("duele") || texto.includes("sesion") || texto.includes("resulta")) {
      return "✨ Durante el tratamiento facial aplicamos *HIFU 12D* para estimular colágeno profundo, seguido de *Radiofrecuencia* y *Pink Glow* para textura y brillo.\nNo duele, solo se percibe calor leve. Cada sesión dura 40 min y se recomiendan 4–6 según tu piel.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
    }
  }

  // --- DETECCIÓN CORPORAL ------------------------------------
  if (texto.includes("grasa") || texto.includes("abdomen") || texto.includes("muslos") || texto.includes("piernas") || texto.includes("brazos") || texto.includes("flacidez")) {
    memoria.guardarContexto(usuario,"corporal");
    return "💛 Entiendo, muchas personas también notan esa acumulación en esas zonas.\nUsamos *HIFU 12D, Cavitación y Radiofrecuencia* para reducir grasa y tensar piel sin dolor.\n¿Tu objetivo es reducir, tonificar o definir?";
  }

  if (contexto === "corporal") {
    if (texto.includes("reducir")) {
      memoria.guardarContexto(usuario,"lipo");
      return "🔥 Para reducción trabajamos con *Lipo Body Elite* o *Lipo Express* (*HIFU 12D + Cavitación + RF*).\nDesde $432 000 según zona.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
    }
    if (texto.includes("reafirmar") || texto.includes("tonificar")) {
      memoria.guardarContexto(usuario,"tensor");
      return "💪 Para reafirmar y tonificar usamos *Body Tensor* o *Body Fitness* (*HIFU 12D + RF + EMS Sculptor*).\nIdeales postparto o tras pérdida de peso.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito y definir el programa ideal. ¿Quieres que te ayude a coordinarlo?";
    }
    if (texto.includes("cómo") || texto.includes("funciona") || texto.includes("duele") || texto.includes("sesion") || texto.includes("resulta")) {
      return "✨ El tratamiento corporal combina *HIFU 12D* para romper grasa, *Cavitación* para drenaje y *RF* para tensar piel.\nNo duele, solo un calor leve; cada sesión 45–60 min y se recomiendan 6–8 según objetivo.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar sesiones. ¿Quieres que te ayude a coordinarlo?";
    }
  }

  // --- GLÚTEOS -----------------------------------------------
  if (texto.includes("glúteo") || texto.includes("gluteos") || texto.includes("poto") || texto.includes("trasero") || texto.includes("colita") || texto.includes("levantar")) {
    memoria.guardarContexto(usuario,"gluteos");
    return "🍑 Para levantar y dar forma al glúteo usamos *Push Up Glúteos* (*EMS Sculptor + RF + HIFU tensor*).\nGenera 20 000 contracciones en 30 min y mejora firmeza desde la primera sesión.\nValor desde $376 000.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a reservar?";
  }

  if (contexto === "gluteos" && (texto.includes("cómo") || texto.includes("funciona") || texto.includes("duele") || texto.includes("sesion") || texto.includes("resulta"))) {
    return "🍑 Claro. El *Push Up Glúteos* combina *EMS Sculptor + RF + HIFU tensor*. En 30 min produce 20 000 contracciones musculares y activa colágeno. No duele, solo se siente un trabajo intenso y calor agradable. Resultados desde la primera sesión (4–6 recomendadas).\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
  }

  // --- DEPILACIÓN --------------------------------------------
  if (texto.includes("depil") || texto.includes("pelos") || texto.includes("axila") || texto.includes("bikini") || texto.includes("pierna") || texto.includes("glúteo")) {
    memoria.guardarContexto(usuario,"depilacion");
    return "💫 La *Depilación Láser Diodo Alexandrita Triple Onda* elimina el vello desde la raíz sin dolor.\nPlanes desde $35 000 por zona y $180 000 por 6 sesiones (bikini completo).\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
  }

  if (contexto === "depilacion" && (texto.includes("cómo") || texto.includes("funciona") || texto.includes("duele") || texto.includes("sesion") || texto.includes("resulta"))) {
    return "✨ Durante la depilación láser se aplica luz de tres longitudes de onda que destruyen el folículo sin afectar la piel. No duele, solo un calor leve. Se recomiendan 6–8 sesiones para una eliminación del 90 %. ✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu plan. ¿Quieres que te ayude a coordinarlo?";
  }

  // --- TOXINA (seguimiento) ---------------------------------
  if (contexto === "toxina" && (texto.includes("cómo") || texto.includes("funciona") || texto.includes("duele") || texto.includes("resulta"))) {
    return "💉 La toxina botulínica se aplica con microdosis en músculos específicos para relajar líneas de expresión. El procedimiento dura 20 min y no requiere reposo. Resultados desde el día 3 y efecto 3–5 meses.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito para confirmar tu dosis. ¿Quieres que te ayude a coordinarlo?";
  }

  // --- PRECIOS Y OBJECIONES ---------------------------------
  if (texto.includes("precio") || texto.includes("vale") || texto.includes("cuánto")) {
    switch (contexto) {
      case "lipo": return "💰 *Lipo Express* desde $432 000 y *Lipo Body Elite* desde $664 000 (*HIFU 12D + Cavitación + RF*).";
      case "tensor": return "💰 *Body Tensor* desde $232 000 y *Body Fitness* desde $360 000.";
      case "gluteos": return "🍑 *Push Up Glúteos* desde $376 000 (*EMS Sculptor + RF + HIFU tensor*).";
      case "facial": return "💆‍♀️ Tratamientos faciales desde $128 800 (*Face Light*) hasta $358 400 (*Face Elite*).";
      case "toxina": return "💉 *Toxina Botulínica* desde $95 000 por zona.";
      default:
        return "💰 Los planes corporales parten desde $232 000 y los faciales desde $128 800.\nLa evaluación es gratuita para definir tu presupuesto exacto.\n✨ Si te parece, puedo ayudarte a agendar tu diagnóstico gratuito. ¿Quieres que te ayude a coordinarlo?";
    }
  }

  if (texto.includes("caro") || texto.includes("precio alto")) {
    memoria.guardarContexto(usuario,"objecion_precio");
    return "💬 Entiendo totalmente, es normal comparar.\nUsamos *HIFU 12D original, Cavitación clínica y Pink Glow europeo*, con seguimiento profesional. Podemos ajustar zonas o sesiones a tu presupuesto.\n✨ Si te parece, puedo ayudarte a agendar tu evaluación gratuita y ver alternativas. ¿Quieres que te ayude a coordinarla?";
  }

  // --- UBICACIÓN ---------------------------------------------
  if (texto.includes("dónde") || texto.includes("ubicación") || texto.includes("dirección") || texto.includes("cómo llegar")) {
    return "📍 *Body Elite Estética Avanzada* — Av. Las Perdices Nº2990, Local 23, Peñalolén (a pasos de Av. Tobalaba).\n🕓 Horario: Lun–Vie 9:30–20:00 / Sáb 9:30–13:00.\n💛 Puedes agendar tu diagnóstico gratuito aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\n✨ Si te parece, puedo ayudarte a coordinar tu hora ahora mismo, es sin costo ni compromiso. ¿Quieres que te ayude a reservar?";
  }

  // --- RESPUESTAS CORTAS / CIERRE -----------------------------
  if (afirmativos.some(p => texto.startsWith(p))) {
    return "✨ Perfecto. Te dejo el enlace directo para agendar tu diagnóstico gratuito 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9\nSolo elige día y hora que te acomoden 💛";
  }

  if (["gracias","ok","vale","perfecto","genial","super"].some(p => texto.includes(p))) {
    return "💛 Me alegra poder ayudarte.\nRecuerda que la evaluación es gratuita y sin compromiso.\nReserva tu hora aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
  }

  // --- FALLBACK ----------------------------------------------
  return "💛 Disculpa, no logré entender tu mensaje.\nNuestras profesionales podrán resolver todas tus dudas en la evaluación gratuita.\nAgenda aquí 👉 https://agendamiento.reservo.cl/makereserva/agenda/f0Hq15w0M0NrxU8d7W64x5t2S6L4h9";
}
